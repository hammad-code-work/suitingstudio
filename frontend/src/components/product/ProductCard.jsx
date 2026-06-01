// src/components/product/ProductCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingBag, FiEye } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import Rating from '../common/Rating';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [wishlist, setWishlist] = useState(false);
  const [currentImg, setCurrentImg] = useState(0);

  const price = product.discountPrice || product.originalPrice;
  const hasDiscount = product.discountPrice && product.discountPrice < product.originalPrice;
  const discountPct = hasDiscount
    ? Math.round(((product.originalPrice - product.discountPrice) / product.originalPrice) * 100)
    : 0;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    // Add with first available size
    const size = product.sizes?.[0] || '';
    const color = product.colors?.[0] || '';
    addToCart(product, size, color, 1);
  };

  const imageUrl = product.images?.[currentImg]?.url || 'https://via.placeholder.com/400x500?text=No+Image';
  const backImageUrl = product.images?.[1]?.url || imageUrl;

  return (
    <div className="product-card">
      {/* Image */}
      <Link to={`/product/${product._id}`} className="product-card__img-wrap">
        <img
          src={imageUrl}
          alt={product.title}
          className="product-card__img product-card__img--front"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/400x500?text=No+Image'; }}
        />
        {product.images?.length > 1 && (
          <img
            src={backImageUrl}
            alt={product.title}
            className="product-card__img product-card__img--back"
            onError={(e) => { e.target.src = imageUrl; }}
          />
        )}

        {/* Badges */}
        <div className="product-card__badges">
          {product.isOnSale && hasDiscount && (
            <span className="badge badge-sale">-{discountPct}%</span>
          )}
          {product.isFeatured && !product.isOnSale && (
            <span className="badge badge-featured">Featured</span>
          )}
          {product.stock === 0 && (
            <span className="badge" style={{background:'#666'}}>Out of Stock</span>
          )}
        </div>

        {/* Wishlist */}
        <button
          className={`product-card__wishlist ${wishlist ? 'product-card__wishlist--active' : ''}`}
          onClick={(e) => { e.preventDefault(); setWishlist(!wishlist); }}
          aria-label="Wishlist"
        >
          <FiHeart size={16} />
        </button>

        {/* Hover actions */}
        <div className="product-card__actions">
          {product.stock > 0 && (
            <button className="product-card__action-btn" onClick={handleQuickAdd}>
              <FiShoppingBag size={15} /> Quick Add
            </button>
          )}
          <Link
            to={`/product/${product._id}`}
            className="product-card__action-btn product-card__action-btn--view"
            onClick={(e) => e.stopPropagation()}
          >
            <FiEye size={15} /> View
          </Link>
        </div>

        {/* Image dots */}
        {product.images?.length > 1 && (
          <div className="product-card__dots">
            {product.images.map((_, i) => (
              <button
                key={i}
                className={`product-card__dot ${i === currentImg ? 'product-card__dot--active' : ''}`}
                onMouseEnter={() => setCurrentImg(i)}
                onClick={(e) => { e.preventDefault(); setCurrentImg(i); }}
              />
            ))}
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="product-card__info">
        <span className="product-card__category">{product.category}</span>
        <Link to={`/product/${product._id}`}>
          <h3 className="product-card__title">{product.title}</h3>
        </Link>
        <div className="product-card__rating">
          <Rating value={product.rating} small />
          <span className="product-card__reviews">({product.numReviews})</span>
        </div>
        <div className="product-card__price">
          <span className="product-card__price--current">${price}</span>
          {hasDiscount && (
            <span className="product-card__price--original">${product.originalPrice}</span>
          )}
        </div>
        {/* Size swatches */}
        {product.sizes?.length > 0 && (
          <div className="product-card__sizes">
            {product.sizes.slice(0, 4).map((s) => (
              <span key={s} className="product-card__size">{s}</span>
            ))}
            {product.sizes.length > 4 && <span className="product-card__size">+{product.sizes.length - 4}</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
