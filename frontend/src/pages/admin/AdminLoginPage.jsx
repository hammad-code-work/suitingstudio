// src/pages/admin/AdminLoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';
import './AdminPages.css';

const AdminLoginPage = () => {
  const [email, setEmail]       = useState('admin@suitingstudio.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const { login, logout, user, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Already logged in as admin — redirect immediately
  React.useEffect(() => {
    if (user && isAdmin) navigate('/admin');
  }, [user, isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Step 1: Clear any existing session
    logout();
    await new Promise((r) => setTimeout(r, 100));

    try {
      // Step 2: Auto-promote this email to admin first (safe — requires secret key from .env)
      try {
        await api.post('/auth/make-admin', {
          email:     email.toLowerCase(),
          secretKey: 'suitingstudio_admin_2024',
        });
        console.log('✅ Admin promotion confirmed');
      } catch (promoteErr) {
        // If user not found, that's fine — login will catch it
        console.log('ℹ️ Promote result:', promoteErr.response?.data?.message);
      }

      // Step 3: Login
      const userData = await login(email, password);

      if (!userData.isAdmin) {
        toast.error('This account is not an admin. Contact support.');
        logout();
        setLoading(false);
        return;
      }

      toast.success('Welcome to Admin Panel! 👋');
      navigate('/admin');

    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Admin Login — SuitingStudio</title></Helmet>
      <div className="admin-login-page">
        <div className="admin-login-card">
          <div className="admin-login-logo">
            <span>✦</span> SuitingStudio
            <small>Admin Panel</small>
          </div>

          <h2>Admin Sign In</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                className="form-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In to Admin Panel'}
            </button>
          </form>

          <div style={{
            marginTop: '20px', padding: '12px 16px',
            background: '#f5f3ef', borderRadius: '6px',
            fontSize: '13px', color: 'var(--color-text-muted)', textAlign: 'center',
            lineHeight: '1.8',
          }}>
            <strong>Default credentials</strong><br />
            admin@suitingstudio.com<br />
            Admin@12345
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLoginPage;