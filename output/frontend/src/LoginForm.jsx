import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import AuthLayout from './AuthLayout';
import { AlertCircle, Loader2 } from 'lucide-react';

const LoginForm = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(formData.email, formData.password);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome Back">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-900 mb-1">Email Address</label>
          <input
            id="email"
            type="email"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none focus:ring-primary-600 transition-all"
            placeholder="name@example.com"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-neutral-900 mb-1">Password</label>
          <input
            id="password"
            type="password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none focus:ring-primary-600 transition-all"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-error-500 text-error-500 text-sm rounded-lg flex items-center gap-2" aria-live="polite">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:bg-gray-400 transition-all flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="w-5 h-5 animate-spin" />}
          LOGIN
        </button>
      </form>
      <div className="mt-6 text-center text-sm text-neutral-500">
        Don't have an account? <Link to="/register" className="text-primary-600 font-medium hover:underline">Register here</Link>
      </div>
    </AuthLayout>
  );
};

export default LoginForm;
