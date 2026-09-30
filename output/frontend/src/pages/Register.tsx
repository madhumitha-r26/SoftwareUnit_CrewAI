import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import api from '../api/client';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    tosAgreed: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pwRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!emailRegex.test(formData.email)) newErrors.email = 'Please enter a valid email address.';
    if (!pwRegex.test(formData.password)) newErrors.password = '8+ chars, 1 Upper, 1 Num, 1 Spec required.';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';
    if (!formData.tosAgreed) newErrors.tos = 'Agreement to Terms is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await api.post('/auth/register', formData);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      if (err.response?.status === 409) {
        setErrors({ email: 'Email is already in use' });
      } else {
        setErrors({ general: 'An error occurred. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md">
          <div className="w-16 h-16 bg-success text-white rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} />
          </div>
          <h2 className="text-2xl font-bold text-textMain mb-2">Account created successfully!</h2>
          <p className="text-textMuted mb-6">Redirecting you to login page...</p>
          <Link to="/login" className="btn-primary block text-center">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-xl mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl">L</div>
          <h1 className="text-2xl font-bold text-textMain tracking-tight">CREATE ACCOUNT</h1>
          <p className="text-textMuted mt-2">Join us to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="label-text">Email Address</label>
            <input 
              id="email"
              type="email" 
              className={`input-field ${errors.email ? 'border-error' : ''}`} 
              placeholder="user@email.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
              aria-invalid={!!errors.email}
              aria-describedby="email-error"
            />
            {errors.email && <p id="email-error" className="error-text">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="label-text">Password</label>
            <input 
              id="password"
              type="password" 
              className={`input-field ${errors.password ? 'border-error' : ''}`} 
              placeholder="••••••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
              aria-invalid={!!errors.password}
              aria-describedby="password-error"
            />
            <p className="helper-text">8+ chars, 1 Upper, 1 Num, 1 Special</p>
            {errors.password && <p id="password-error" className="error-text">{errors.password}</p>}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="label-text">Confirm Password</label>
            <input 
              id="confirmPassword"
              type="password" 
              className={`input-field ${errors.confirmPassword ? 'border-error' : ''}`} 
              placeholder="••••••••••••"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              required
              aria-invalid={!!errors.confirmPassword}
              aria-describedby="confirm-error"
            />
            {errors.confirmPassword && <p id="confirm-error" className="error-text">{errors.confirmPassword}</p>}
          </div>

          <div className="flex items-start gap-3">
            <div className="flex items-center h-5">
              <input 
                id="tos"
                type="checkbox" 
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                checked={formData.tosAgreed}
                onChange={(e) => setFormData({...formData, tosAgreed: e.target.checked})}
                required
              />
            </div>
            <div className="flex-1">
              <label htmlFor="tos" className="text-sm text-textMuted cursor-pointer">
                I agree to the <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>
              </label>
              {errors.tos && <p className="error-text">{errors.tos}</p>}
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="btn-primary">
            {isLoading ? 'CREATING ACCOUNT...' : 'SIGN UP'}
          </button>
        </form>

        <p className="mt-8 text-center text-textMuted text-sm">
          Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;