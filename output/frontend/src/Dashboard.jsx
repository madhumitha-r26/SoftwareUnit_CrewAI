import React from 'react';
import { useAuth } from './AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-surface-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-20 h-20 bg-success-500 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6">
          {user?.email?.[0].toUpperCase() || 'U'}
        </div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Secure Dashboard</h1>
        <p className="text-neutral-500 mb-8">Logged in as: <span className="font-medium">{user?.email}</span></p>
        <button 
          onClick={logout}
          className="w-full py-3 px-4 bg-neutral-900 text-white rounded-lg font-semibold hover:bg-neutral-800 transition-all"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
