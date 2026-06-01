// src/components/layout/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiTwitter, FiYoutube, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  const [email, setEmail] = React.useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert(`Thank you! ${email} subscribed.`);
    setEmail('');
  };

  return (
    <footer className="footer">
      <div className="container footer__inner">
        {/* Brand */}
        <div className="footer__brand">
          <Link to="/" className="footer__logo">
            <span>✦</span> SuitingStudio
          </Link>
          <p>Premium garments crafted for women and children. Elegance in every stitch since 2015.</p>
          <div className="footer__contact">
            <span><FiMail size={14} /> info@suitingstudio.com</span>
            <span><FiPhone size={14} /> +92 300 1234567</span>
            <span><FiMapPin size={14} /> Sialkot, Punjab, Pakistan</span>
          </div>
          <div className="footer__socials">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><FiFacebook /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><FiInstagram /></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter"><FiTwitter /></a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube"><FiYoutube /></a>
          </div>
        </div>

        {/* Company */}
        <div className="footer__col">
          <h4>Company</h4>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/careers">Careers</Link></li>
            <li><Link to="/affiliates">Affiliates</Link></li>
            <li><a href="/blog">Blog</a></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>

        {/* Shop */}
        <div className="footer__col">
          <h4>Shop</h4>
          <ul>
            <li><Link to="/shop">New Arrivals</Link></li>
            <li><Link to="/shop/Women">Women</Link></li>
            <li><Link to="/shop/Kids">Kids</Link></li>
            <li><Link to="/shop?sale=true">Sale</Link></li>
            <li><Link to="/shop">Shop All</Link></li>
          </ul>
        </div>

        {/* Help */}
        <div className="footer__col">
          <h4>Help</h4>
          <ul>
            <li><Link to="/customer-service">Customer Service</Link></li>
            <li><Link to="/account">My Account</Link></li>
            <li><Link to="/store">Find a Store</Link></li>
            <li><Link to="/privacy">Legal & Privacy</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="footer__newsletter">
          <h4>Subscribe</h4>
          <p>Get exclusive deals and style tips delivered to your inbox.</p>
          <form className="footer__newsletter-form" onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="Your Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Join</button>
          </form>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container">
          <p>© {new Date().getFullYear()} SuitingStudio. All rights reserved.</p>
          <div className="footer__payment-icons">
            <span>💳 Visa</span>
            <span>💳 Mastercard</span>
            <span>💳 PayPal</span>
            <span>💳 Stripe</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
