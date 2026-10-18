import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import AuthLayout from './AuthLayout';
import { AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';

const RegistrationForm = () => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;

    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!passwordRegex.test(formData.password)) {
      newErrors.password = '8+ chars, 1 number, 1 special char required';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    return newErrors;
  };

  const getPasswordStrength = (pwd) => {
    if (pwd.length === 0) return 0;
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[!@#$%^&*]/.test(pwd)) strength++;
    return strength;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});
    try {
      await register(formData.email, formData.password, formData.confirmPassword);
      setSuccess(true);
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || 'Registration failed' });
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength(formData.password);

  if (success) {
    return (
      <AuthLayout title="Welcome!">
        <div className="text-center py-4">
          <CheckCircle2 className="w-16 h-16 text-success-500 mx-auto mb-4" />
          <p className="text-lg text-neutral-900 mb-6">Registration Successful! You can now log in.</p>
          <Link to="/login" className="block w-full py-3 px-4 bg-primary-600 text-white text-center rounded-lg font-semibold hover:bg-primary-700 transition-colors">
            Go to Login
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Create Account">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-900 mb-1">Email Address</label>
          <input
            id="email"
            type="email"
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:outline-none transition-all ${errors.email ? 'border-error-500 ring-error-500' : 'border-gray-300 focus:ring-primary-600'}`}
            placeholder="name@example.com"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p className="text-error-500 text-xs mt-1 flex items-center gap-1" aria-live="polite">
              <AlertCircle size={12} /> {errors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-neutral-900 mb-1">Password</label>
          <input
            id="password"
            type="password"
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:outline-none transition-all ${errors.password ? 'border-error-500 ring-error-500' : 'border-gray-300 focus:ring-primary-600'}`}
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            aria-invalid={!!errors.password}
          />
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${strength === 1 ? 'bg-red-500 w-1/3' : strength === 2 ? 'bg-yellow-500 w-2/3' : strength === 3 ? 'bg-success-500 w-full' : 'w-0'}`}
              />
            </div>
            <span className="text-xs text-neutral-500 whitespace-nowrap">8+ chars, 1 num, 1 spec</span>
          </div>
          {errors.password && (
            <p className="text-error-500 text-xs mt-1 flex items-center gap-1" aria-live="polite">
              <AlertCircle size={12} /> {errors.password}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-900 mb-1">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:outline-none transition-all ${errors.confirmPassword ? 'border-error-500 ring-error-500' : 'border-gray-300 focus:ring-primary-600'}`}
            value={formData.confirmPassword}
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            aria-invalid={!!errors.confirmPassword}
          />
          {errors.confirmPassword && (
            <p className="text-error-500 text-xs mt-1 flex items-center gap-1" aria-live="polite">
              <AlertCircle size={12} /> {errors.confirmPassword}
            </p>
          )}
        </div>

        {errors.submit && (
          <div className="p-3 bg-red-50 border border-error-500 text-error-500 text-sm rounded-lg flex items-center gap-2">
            <AlertCircle size={16} /> {errors.submit}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || (formData.password !== formData.confirmPassword && formData.confirmPassword !== '')}
          className="w-full py-3 px-4 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="w-5 h-5 animate-spin" />}
          SIGN UP
        </button>
      </form>
      <div className="mt-6 text-center text-sm text-neutral-500">
        Already have an account? <Link to="/login" className="text-primary-600 font-medium hover:underline">Login here</Link>
      </div>
    </AuthLayout>
  );
};

export default RegistrationForm;
