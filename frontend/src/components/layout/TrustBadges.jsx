// src/components/layout/TrustBadges.jsx
import React from 'react';
import { FiTruck, FiHeadphones, FiShield } from 'react-icons/fi';
import './TrustBadges.css';

const badges = [
  { icon: FiTruck, title: 'Fast and Free Delivery', desc: 'Free shipping on orders over $100. Express delivery available.' },
  { icon: FiHeadphones, title: '24/7 Customer Support', desc: 'We\'re here to help anytime. Reach us via email, phone, or WhatsApp.' },
  { icon: FiShield, title: 'Money Back Guarantee', desc: '30-day hassle-free returns. Shop with complete confidence.' },
];

const TrustBadges = () => (
  <section className="trust-badges">
    <div className="container trust-badges__inner">
      {badges.map((b) => (
        <div key={b.title} className="trust-badge">
          <div className="trust-badge__icon">
            <b.icon size={28} />
          </div>
          <div>
            <h4>{b.title}</h4>
            <p>{b.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default TrustBadges;
