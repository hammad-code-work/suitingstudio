// src/components/admin/AdminSidebar.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiGrid, FiPackage, FiShoppingBag, FiTag, FiLogOut, FiMenu, FiX, FiUsers } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import './AdminSidebar.css';

const navItems = [
  { icon: FiGrid, label: 'Dashboard', to: '/admin' },
  { icon: FiPackage, label: 'Products', to: '/admin/products' },
  { icon: FiShoppingBag, label: 'Orders', to: '/admin/orders' },
  { icon: FiTag, label: 'Categories', to: '/admin/categories' },
  { icon: FiUsers, label: 'Users', to: '/admin/users' },
];

const AdminSidebar = () => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebar = (
    <div className="admin-sidebar__inner">
      <div className="admin-sidebar__logo">
        <Link to="/">✦ SuitingStudio</Link>
        <span>Admin</span>
      </div>

      <nav className="admin-sidebar__nav">
        {navItems.map(({ icon: Icon, label, to }) => (
          <Link
            key={to}
            to={to}
            className={`admin-sidebar__link ${location.pathname === to ? 'active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            <Icon size={18} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      <div className="admin-sidebar__footer">
        <div className="admin-sidebar__user">
          <div className="admin-sidebar__avatar">{user?.name?.[0] || 'A'}</div>
          <div>
            <p>{user?.name}</p>
            <small>Administrator</small>
          </div>
        </div>
        <button className="admin-sidebar__logout" onClick={logout}>
          <FiLogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="admin-sidebar admin-sidebar--desktop">{sidebar}</aside>

      {/* Mobile toggle */}
      <button className="admin-sidebar__mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
        {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <aside className="admin-sidebar admin-sidebar--mobile">{sidebar}</aside>
          <div className="admin-sidebar__backdrop" onClick={() => setMobileOpen(false)} />
        </>
      )}
    </>
  );
};

export default AdminSidebar;
