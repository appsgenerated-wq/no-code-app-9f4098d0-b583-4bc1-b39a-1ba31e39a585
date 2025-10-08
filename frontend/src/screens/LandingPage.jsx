import React, { useState } from 'react';
import config from '../constants.js';
import { FireIcon, UserPlusIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/solid';

const LandingPage = ({ onLogin, onSignup, backendStatus }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isLogin) {
        await onLogin(formData.email, formData.password);
      } else {
        await onSignup(formData.email, formData.password, formData.name);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <FireIcon className="mx-auto h-12 w-12 text-blue-600" />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Welcome to FoodApp
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Discover and share amazing recipes.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`w-full py-2.5 text-sm font-semibold rounded-md transition-all ${isLogin ? 'bg-blue-600 text-white shadow' : 'text-gray-500 hover:text-gray-800'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`w-full py-2.5 text-sm font-semibold rounded-md transition-all ${!isLogin ? 'bg-blue-600 text-white shadow' : 'text-gray-500 hover:text-gray-800'}`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Your Name"
                  required={!isLogin}
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            {error && <p className="text-sm text-red-600 text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white py-2.5 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
              {isLogin ? <ArrowRightOnRectangleIcon className="h-5 w-5" /> : <UserPlusIcon className="h-5 w-5" />}
              <span>{loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}</span>
            </button>
          </form>
        </div>
      </div>
      <footer className="text-center py-8 text-gray-500">
        <div className="flex justify-center items-center gap-2 mb-2">
           Backend Status: <span className={`h-3 w-3 rounded-full ${backendStatus ? 'bg-green-500' : 'bg-red-500'}`}></span>
        </div>
        <a href={`${config.BACKEND_URL}/admin`} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline">
          Admin Panel
        </a>
      </footer>
    </div>
  );
};

export default LandingPage;
