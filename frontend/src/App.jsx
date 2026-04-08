import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Login       from './pages/Login';
import Home        from './pages/Home';
import Learn       from './pages/Learn';
import Game        from './pages/Game';
import Leaderboard from './pages/Leaderboard';
import Profile     from './pages/Profile';
  
// ── Guard: redirects to /login if not authenticated ─────────────────────────
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', background: '#08081a',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: '16px',
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <div style={{
          width: '40px', height: '40px', border: '3px solid rgba(233,69,96,0.15)',
          borderTop: '3px solid #e94560', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}/>
        <span style={{ color: '#555', fontSize: '14px' }}>불러오는 중... Loading</span>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
}

// ── Root app ─────────────────────────────────────────────────────────────────
function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public route */}
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <Login />}
      />

      {/* Protected routes */}
      <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
      <Route path="/learn" element={<PrivateRoute><Learn /></PrivateRoute>} />
      <Route path="/game" element={<PrivateRoute><Game /></PrivateRoute>} />
      <Route path="/leaderboard" element={<PrivateRoute><Leaderboard /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
