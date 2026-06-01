// src/pages/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

const NotFoundPage = () => (
  <>
    <Navbar />
    <div style={{ minHeight: 'calc(100vh - 68px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px 24px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(80px, 15vw, 160px)', color: 'var(--color-border)', lineHeight: 1, marginBottom: '16px' }}>404</h1>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', marginBottom: '12px' }}>Page Not Found</h2>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '32px', maxWidth: '400px' }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary btn-lg">Back to Home</Link>
    </div>
  </>
);

export default NotFoundPage;
