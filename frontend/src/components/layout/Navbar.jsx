// src/components/layout/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { FiShoppingBag, FiUser, FiSearch, FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import SearchBar from '../common/SearchBar';
import './Navbar.css';

const Navbar = () => {
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [scrolled,     setScrolled]     = useState(false);
  const [searchOpen,   setSearchOpen]   = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout }  = useAuth();
  const { cartCount }     = useCart();
  const location          = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  useEffect(() => {
    const close = (e) => { if (!e.target.closest('.navbar__user-wrap')) setUserMenuOpen(false); };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  const navLinks = [
    { label: 'Home',  to: '/' },
    { label: 'Shop',  to: '/shop' },
    { label: 'Women', to: '/shop/Women' },
    { label: 'Kids',  to: '/shop/Kids' },
    { label: 'Sale',  to: '/shop?sale=true' },
  ];

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
        <div className="container navbar__inner">

          {/* Logo */}
          <Link
            to="/"
            className="navbar__logo"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <span className="navbar__logo-icon">✦</span>
            Suiting<span>Studio</span>
          </Link>

          {/* Desktop links */}
          <ul className="navbar__links">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`navbar__link ${location.pathname === link.to ? 'navbar__link--active' : ''}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="navbar__icons">
            {/* Search */}
            <button className="navbar__icon-btn" onClick={() => setSearchOpen(!searchOpen)} aria-label="Search">
              <FiSearch size={20} />
            </button>

            {/* User — only for logged-in non-admin customers */}
            {user && !user.isAdmin && (
              <div className="navbar__user-wrap">
                <button className="navbar__icon-btn"
                  onClick={(e) => { e.stopPropagation(); setUserMenuOpen(!userMenuOpen); }}>
                  <FiUser size={20} />
                </button>
                {userMenuOpen && (
                  <div className="navbar__user-dropdown">
                    <span className="navbar__user-name">Hi, {user.name?.split(' ')[0]}</span>
                    <Link to="/orders" onClick={() => setUserMenuOpen(false)}>My Orders</Link>
                    <button onClick={() => { logout(); setUserMenuOpen(false); }}>
                      <FiLogOut size={14} /> Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Login icon — guests only */}
            {!user && (
              <Link to="/login" className="navbar__icon-btn" aria-label="Login">
                <FiUser size={20} />
              </Link>
            )}

            {/* Cart */}
            <Link to="/cart" className="navbar__icon-btn navbar__cart-btn" aria-label="Cart">
              <FiShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="navbar__cart-count">{cartCount > 99 ? '99+' : cartCount}</span>
              )}
            </Link>

            {/* Hamburger */}
            <button className="navbar__icon-btn navbar__hamburger"
              onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="navbar__search-bar">
            <SearchBar onClose={() => setSearchOpen(false)} />
          </div>
        )}
      </nav>

      {/* Mobile Menu — NO logout at all, NO admin options */}
      <div className={`mobile-menu ${mobileOpen ? 'mobile-menu--open' : ''}`}>
        <ul>
          {navLinks.map((link) => (
            <li key={link.to}><Link to={link.to}>{link.label}</Link></li>
          ))}
          {/* Only for guests */}
          {!user && (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          )}
          {/* Customer only — no logout */}
          {user && !user.isAdmin && (
            <li><Link to="/orders">My Orders</Link></li>
          )}
        </ul>
      </div>

      {mobileOpen && <div className="mobile-menu-backdrop" onClick={() => setMobileOpen(false)} />}
    </>
  );
};

export default Navbar;