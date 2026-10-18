import React from 'react';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface-100 p-4">
      <div className="mb-8 flex flex-col items-center">
        <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl mb-2 shadow-lg">
          S
        </div>
        <h1 className="text-neutral-900 font-bold text-xl">SecureAuth</h1>
      </div>
      
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 border border-gray-100">
        {title && <h2 className="text-2xl font-semibold text-neutral-900 text-center mb-6">{title}</h2>}
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
