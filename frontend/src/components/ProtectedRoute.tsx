import { useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import { WelcomeScreen } from './WelcomeScreen';

export function ProtectedRoute() {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  const [showWelcome, setShowWelcome] = useState(() => {
    return sessionStorage.getItem('dokuy_show_welcome') === 'true';
  });

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          fontFamily: 'system-ui, sans-serif',
          color: '#6f7280',
          fontSize: '0.9rem',
        }}
      >
        Memeriksa sesi…
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  function handleWelcomeFinish() {
    sessionStorage.removeItem('dokuy_show_welcome');
    setShowWelcome(false);
  }

  return (
    <>
      <Outlet />

      {showWelcome && (
        <WelcomeScreen onFinish={handleWelcomeFinish} />
      )}
    </>
  );
}
