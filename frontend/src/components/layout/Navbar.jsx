// src/components/layout/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { FiShoppingBag, FiUser, FiSearch, FiMenu, FiX, FiHeart, FiLogOut } from 'react-icons/fi';
import SearchBar from '../common/SearchBar';
import './Navbar.css';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Detect scroll for shadow effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMobileOpen(false), [location]);

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Shop', to: '/shop' },
    { label: 'Women', to: '/shop/Women' },
    { label: 'Kids', to: '/shop/Kids' },
    { label: 'Sale', to: '/shop?sale=true' },
  ];

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
        <div className="container navbar__inner">
          {/* Logo */}
          <Link to="/" className="navbar__logo">
            <span className="navbar__logo-icon">✦</span>
            Suiting<span>Studio</span>
          </Link>

          {/* Desktop Nav */}
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

          {/* Icons */}
          <div className="navbar__icons">
            <button className="navbar__icon-btn" onClick={() => setSearchOpen(!searchOpen)} aria-label="Search">
              <FiSearch size={20} />
            </button>

            {/* User menu */}
            <div className="navbar__user-wrap">
              <button
                className="navbar__icon-btn"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                aria-label="Account"
              >
                <FiUser size={20} />
              </button>
              {userMenuOpen && (
                <div className="navbar__user-dropdown">
                  {user ? (
                    <>
                      <span className="navbar__user-name">Hi, {user.name?.split(' ')[0]}</span>
                      {isAdmin && (
                        <Link to="/admin" onClick={() => setUserMenuOpen(false)}>Admin Panel</Link>
                      )}
                      <Link to="/orders" onClick={() => setUserMenuOpen(false)}>My Orders</Link>
                      <button onClick={() => { logout(); setUserMenuOpen(false); }}>
                        <FiLogOut size={14} /> Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setUserMenuOpen(false)}>Login</Link>
                      <Link to="/register" onClick={() => setUserMenuOpen(false)}>Register</Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Cart */}
            <Link to="/cart" className="navbar__icon-btn navbar__cart-btn" aria-label="Cart">
              <FiShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="navbar__cart-count">{cartCount > 99 ? '99+' : cartCount}</span>
              )}
            </Link>

            {/* Mobile hamburger */}
            <button
              className="navbar__icon-btn navbar__hamburger"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="navbar__search-bar">
            <SearchBar onClose={() => setSearchOpen(false)} />
          </div>
        )}
      </nav>

      {/* Mobile menu overlay */}
      <div className={`mobile-menu ${mobileOpen ? 'mobile-menu--open' : ''}`}>
        <ul>
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link to={link.to}>{link.label}</Link>
            </li>
          ))}
          {!user && (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          )}
          {user && (
            <li>
              <button onClick={logout}>Logout</button>
            </li>
          )}
        </ul>
      </div>

      {/* Overlay backdrop for mobile menu */}
      {mobileOpen && (
        <div className="mobile-menu-backdrop" onClick={() => setMobileOpen(false)} />
      )}
    </>
  );
};

export default Navbar;
