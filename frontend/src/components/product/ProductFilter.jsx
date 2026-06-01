// src/components/product/ProductFilter.jsx
import React from 'react';
import './ProductFilter.css';

const WOMEN_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const KIDS_SIZES = ['1-2 Years', '3-4 Years', '5-6 Years', '7-8 Years', '9-10 Years', '11-12 Years'];

const ProductFilter = ({ filters, onChange, onClear }) => {
  const sizes = filters.category === 'Kids' ? KIDS_SIZES
    : filters.category === 'Women' ? WOMEN_SIZES
    : [...WOMEN_SIZES, ...KIDS_SIZES];

  const update = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <aside className="product-filter">
      <div className="product-filter__header">
        <h3>Filters</h3>
        <button className="product-filter__clear" onClick={onClear}>Clear All</button>
      </div>

      {/* Category */}
      <div className="product-filter__section">
        <h4>Category</h4>
        {['', 'Women', 'Kids'].map((cat) => (
          <label key={cat || 'all'} className="product-filter__radio">
            <input
              type="radio"
              name="category"
              value={cat}
              checked={filters.category === cat}
              onChange={() => update('category', cat)}
            />
            <span>{cat || 'All'}</span>
          </label>
        ))}
      </div>

      {/* Price Range */}
      <div className="product-filter__section">
        <h4>Price Range</h4>
        <div className="product-filter__price-row">
          <input
            type="number"
            placeholder="Min $"
            className="form-input"
            style={{ fontSize: '13px', padding: '8px 10px' }}
            value={filters.minPrice || ''}
            onChange={(e) => update('minPrice', e.target.value)}
          />
          <span>—</span>
          <input
            type="number"
            placeholder="Max $"
            className="form-input"
            style={{ fontSize: '13px', padding: '8px 10px' }}
            value={filters.maxPrice || ''}
            onChange={(e) => update('maxPrice', e.target.value)}
          />
        </div>
      </div>

      {/* Sizes */}
      <div className="product-filter__section">
        <h4>Size</h4>
        <div className="product-filter__sizes">
          {sizes.map((s) => (
            <button
              key={s}
              className={`product-filter__size-btn ${filters.size === s ? 'active' : ''}`}
              onClick={() => update('size', filters.size === s ? '' : s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div className="product-filter__section">
        <h4>Sort By</h4>
        <select
          className="form-input"
          style={{ fontSize: '14px' }}
          value={filters.sort || ''}
          onChange={(e) => update('sort', e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {/* On Sale */}
      <div className="product-filter__section">
        <label className="product-filter__checkbox">
          <input
            type="checkbox"
            checked={filters.isOnSale === 'true'}
            onChange={(e) => update('isOnSale', e.target.checked ? 'true' : '')}
          />
          <span>On Sale Only</span>
        </label>
      </div>
    </aside>
  );
};

export default ProductFilter;
