import React, { useState, useEffect } from 'react';
import Manifest from '@mnfst/sdk';
import LandingPage from './screens/LandingPage';
import DashboardPage from './screens/DashboardPage';
import config from './constants.js';
import './index.css';

const manifest = new Manifest(config.BACKEND_URL);

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState(false);

  useEffect(() => {
    // Health Check
    fetch('/api/health')
      .then(res => setBackendStatus(res.ok))
      .catch(() => setBackendStatus(false));

    // Check for active session
    manifest.from('User').me()
      .then(userData => {
        if (userData) {
          setUser(userData);
        }
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleLogin = async (email, password) => {
    try {
      await manifest.auth('User').login(email, password);
    } catch (error) {
      // Fallback for older SDK versions
      await manifest.from('User').login(email, password);
    }
    const currentUser = await manifest.from('User').me();
    setUser(currentUser);
  };

  const handleSignup = async (email, password, name) => {
    await manifest.from('User').signup({ email, password, name });
    // Auto-login after signup for a smooth user experience
    await handleLogin(email, password);
  };

  const handleLogout = async () => {
    await manifest.logout();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Connecting to backend...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {user ? (
        <DashboardPage user={user} onLogout={handleLogout} manifest={manifest} backendStatus={backendStatus} />
      ) : (
        <LandingPage onLogin={handleLogin} onSignup={handleSignup} backendStatus={backendStatus} />
      )}
    </div>
  );
}

export default App;
