import React, { useState } from 'react';
import axios from 'axios';

export function Login() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', credentials);
      localStorage.setItem('tms_user', JSON.stringify(res.data.user));
      localStorage.setItem('tms_token', res.data.token);
      window.location.href = '/';
    } catch (err) {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">T</div>
          <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
          <p className="text-slate-500">Enter your credentials to access TMS</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
            <input 
              type="text" 
              required
              className="w-full p-2 border border-border rounded-md outline-none focus:ring-2 focus:ring-primary/20"
              value={credentials.username}
              onChange={e => setCredentials({...credentials, username: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input 
              type="password" 
              required
              className="w-full p-2 border border-border rounded-md outline-none focus:ring-2 focus:ring-primary/20"
              value={credentials.password}
              onChange={e => setCredentials({...credentials, password: e.target.value})}
            />
          </div>
          
          {error && <p className="text-danger text-sm text-center">{error}</p>}

          <button 
            disabled={loading}
            className="w-full py-2 px-4 bg-primary text-white font-semibold rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
