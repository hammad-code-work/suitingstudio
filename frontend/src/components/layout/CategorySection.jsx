// src/components/layout/CategorySection.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './CategorySection.css';

const categories = [
  {
    name: 'Women Collection',
    slug: 'Women',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80',
    size: 'large',
    bg: '#f5efe6',
  },
  {
    name: 'Men Collection',
    slug: 'Men',
    image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=500&q=80',
    size: 'small',
    bg: '#e8f0f5',
  },
  {
    name: 'Kids Collection',
    slug: 'Kids',
    image: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=500&q=80',
    size: 'small',
    bg: '#f0f5e8',
  },
  {
    name: 'Gift Cards',
    slug: null,
    image: null,
    size: 'small',
    bg: '#fdf0f0',
    isGift: true,
  },
];

const CategorySection = () => (
  <section className="category-section">
    <div className="container">
      <div className="category-grid">
        {/* Large card — Women */}
        <div className="category-card category-card--large" style={{ background: categories[0].bg }}>
          <img
            src={categories[0].image}
            alt={categories[0].name}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div className="category-card__content">
            <h3>{categories[0].name}</h3>
            <Link to={`/shop/${categories[0].slug}`} className="category-card__link">Shop Now</Link>
          </div>
        </div>

        {/* Right column */}
        <div className="category-right">
          {/* Men */}
          <div className="category-card category-card--small" style={{ background: categories[1].bg }}>
            <img
              src={categories[1].image}
              alt={categories[1].name}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="category-card__content category-card__content--top">
              <h3>{categories[1].name}</h3>
              <Link to="/shop" className="category-card__link">Shop Now</Link>
            </div>
          </div>

          {/* Bottom row: Kids + Gift Cards */}
          <div className="category-bottom-row">
            {/* Kids */}
            <div className="category-card category-card--small" style={{ background: categories[2].bg }}>
              <img
                src={categories[2].image}
                alt={categories[2].name}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div className="category-card__content">
                <h3>{categories[2].name}</h3>
                <Link to="/shop/Kids" className="category-card__link">Shop Now</Link>
              </div>
            </div>

            {/* Gift Cards */}
            <div className="category-card category-card--gift" style={{ background: categories[3].bg }}>
              <div className="gift-icon">🎁</div>
              <div className="category-card__content">
                <h3>{categories[3].name}</h3>
                <p>Lorem ipsum dolor sit amet, nulla adipiscing elit.</p>
                <Link to="/shop" className="category-card__link">Shop Now</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default CategorySection;
