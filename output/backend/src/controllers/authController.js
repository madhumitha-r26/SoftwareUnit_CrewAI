const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');

exports.register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      password: hashedPassword
    });

    await user.save();
    res.status(201).json({ message: 'Registration successful', userId: user._id });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if account is locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
      return res.status(423).json({ message: 'Account locked. Try again later.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Update login attempts
      user.loginAttempts += 1;
      if (user.loginAttempts >= 5) {
        user.lockUntil = Date.now() + 15 * 60 * 1000; // 15 minutes
      }
      await user.save();
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Reset login attempts on success
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({
      accessToken,
      user: { email: user.email }
    });
  } catch (error) {
    next(error);
  }
};

exports.refresh = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: 'Refresh token required' });

    const { userId } = require('../utils/jwt').verifyRefreshToken(token);
    const user = await User.findById(userId);
    if (!user) return res.status(401).json({ message: 'User not found' });

    const accessToken = generateAccessToken(user._id);
    res.status(200).json({ accessToken });
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
};

exports.logout = async (req, res) => {
  res.cookie('refreshToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 0
  });
  res.status(200).json({ message: 'Logged out successfully' });
};