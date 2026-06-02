// src/components/admin/AdminSidebar.jsx
import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiGrid, FiPackage, FiShoppingBag, FiTag, FiLogOut, FiMenu, FiX, FiExternalLink } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import './AdminSidebar.css';

// Fix 5: Removed Users from nav items
const navItems = [
  { icon: FiGrid,        label: 'Dashboard',  to: '/admin' },
  { icon: FiPackage,     label: 'Products',   to: '/admin/products' },
  { icon: FiShoppingBag, label: 'Orders',     to: '/admin/orders' },
  { icon: FiTag,         label: 'Categories', to: '/admin/categories' },
];

const AdminSidebar = () => {
  const { logout, user } = useAuth();
  const navigate          = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const SidebarContent = () => (
    <div className="admin-sidebar__inner">
      {/* Fix 2: Logo → /admin (dashboard), not public site */}
      <div className="admin-sidebar__logo-wrap">
        <Link
          to="/admin"
          className="admin-sidebar__logo"
          onClick={() => setMobileOpen(false)}
        >
          <span>✦</span> SuitingStudio
        </Link>
        <span className="admin-sidebar__panel-label">Admin Panel</span>
      </div>

      <nav className="admin-sidebar__nav">
        {navItems.map(({ icon: Icon, label, to }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/admin'}
            className={({ isActive }) => `admin-sidebar__link${isActive ? ' active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="admin-sidebar__footer">
        <div className="admin-sidebar__user">
          <div className="admin-sidebar__avatar">
            {user?.name?.[0]?.toUpperCase() || 'A'}
          </div>
          <div>
            <p className="admin-sidebar__user-name">{user?.name}</p>
            <small>Administrator</small>
          </div>
        </div>
        {/* View public site opens in new tab */}
        <a href="/" target="_blank" rel="noreferrer" className="admin-sidebar__view-site">
          <FiExternalLink size={13} /> View Public Site
        </a>
        <button className="admin-sidebar__logout" onClick={handleLogout}>
          <FiLogOut size={15} /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="admin-sidebar admin-sidebar--desktop"><SidebarContent /></aside>

      {/* Mobile toggle */}
      <button className="admin-sidebar__mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
        {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
      </button>

      {mobileOpen && (
        <>
          <aside className="admin-sidebar admin-sidebar--mobile"><SidebarContent /></aside>
          <div className="admin-sidebar__backdrop" onClick={() => setMobileOpen(false)} />
        </>
      )}
    </>
  );
};

export default AdminSidebar;