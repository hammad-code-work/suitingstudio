// src/pages/ProductDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiHeart, FiShoppingBag, FiShare2, FiTruck, FiRefreshCw, FiShield } from 'react-icons/fi';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Rating from '../components/common/Rating';
import Loader from '../components/common/Loader';
import ProductCard from '../components/product/ProductCard';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState([]);
  const [selectedImg, setSelectedImg] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);

  // Close zoom on Escape key
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setZoomOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [wishlist, setWishlist] = useState(false);
  const imgRef = React.useRef(null);

  // Track cursor position for zoom origin
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty('--zoom-x', x + '%');
    e.currentTarget.style.setProperty('--zoom-y', y + '%');
  };
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await productService.getById(id);
        setProduct(data.product);
        setSelectedColor(data.product.colors?.[0] || '');
        // Fetch related
        const rel = await productService.getAll({ category: data.product.category, limit: 4 });
        setRelated(rel.data.products?.filter((p) => p._id !== id).slice(0, 4) || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    if (product.stock === 0) {
      toast.error('Sorry, this product is out of stock!', {
        icon: '🚫',
        duration: 3000,
      });
      return;
    }
    if (!selectedSize) { toast.error('Please select a size'); return; }
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to leave a review'); return; }
    setReviewLoading(true);
    try {
      await productService.addReview(product._id, { rating: reviewRating, comment: reviewText });
      toast.success('Review submitted!');
      const { data } = await productService.getById(id);
      setProduct(data.product);
      setReviewText('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) return <><Navbar /><Loader /><Footer /></>;
  if (!product) return <><Navbar /><div className="container" style={{padding:'80px 24px',textAlign:'center'}}>Product not found</div><Footer /></>;

  const price = product.discountPrice || product.originalPrice;
  const hasDiscount = product.discountPrice && product.discountPrice < product.originalPrice;
  const discountPct = hasDiscount ? Math.round(((product.originalPrice - product.discountPrice) / product.originalPrice) * 100) : 0;

  return (
    <>
      <Helmet>
        <title>{product.title} — SuitingStudio</title>
        <meta name="description" content={product.description?.slice(0, 160)} />
      </Helmet>

      <Navbar />

      <div className="product-detail">
        <div className="container">
          {/* Breadcrumb */}
          <div className="product-detail__breadcrumb">
            <Link to="/">Home</Link> / <Link to="/shop">Shop</Link> /
            <Link to={`/shop/${product.category}`}>{product.category}</Link> / {product.title}
          </div>

          <div className="product-detail__main">
            {/* Gallery */}
            <div className="product-detail__gallery">
              <div className="product-detail__thumbs">
                {product.images?.map((img, i) => (
                  <button
                    key={i}
                    className={`product-detail__thumb ${i === selectedImg ? 'active' : ''}`}
                    onClick={() => setSelectedImg(i)}
                  >
                    <img src={img.url} alt={`${product.title} ${i + 1}`} onError={(e) => { e.target.src = 'https://via.placeholder.com/80x100'; }} />
                  </button>
                ))}
              </div>
              <div className="product-detail__main-img" onClick={() => setZoomOpen(true)} title="Click to zoom" onMouseMove={handleMouseMove}>
                <img
                  src={product.images?.[selectedImg]?.url || 'https://via.placeholder.com/500x600'}
                  alt={product.title}
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/500x600?text=No+Image'; }}
                />
                {product.isOnSale && hasDiscount && (
                  <span className="badge badge-sale product-detail__badge">-{discountPct}%</span>
                )}
                <button
                  className={`product-detail__wishlist ${wishlist ? 'active' : ''}`}
                  onClick={() => setWishlist(!wishlist)}
                >
                  <FiHeart size={18} />
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="product-detail__info">
              <span className="product-detail__category">{product.category}</span>
              <h1 className="product-detail__title">{product.title}</h1>

              <div className="product-detail__meta">
                <Rating value={product.rating} />
                <span className="product-detail__review-count">({product.numReviews} reviews)</span>
                <span className="product-detail__sku">SKU: {product.sku}</span>
              </div>

              {/* Price */}
              <div className="product-detail__price">
                <span className="product-detail__price-current">${price}</span>
                {hasDiscount && (
                  <>
                    <span className="product-detail__price-original">${product.originalPrice}</span>
                    <span className="badge badge-sale">Save {discountPct}%</span>
                  </>
                )}
              </div>

              {/* Colors */}
              {product.colors?.length > 0 && (
                <div className="product-detail__option">
                  <label>Color: <strong>{selectedColor}</strong></label>
                  <div className="product-detail__colors">
                    {product.colors.map((c) => (
                      <button
                        key={c}
                        className={`product-detail__color-btn ${selectedColor === c ? 'active' : ''}`}
                        onClick={() => setSelectedColor(c)}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {product.sizes?.length > 0 && (
                <div className="product-detail__option">
                  <label>Size: <strong>{selectedSize || 'Select a size'}</strong></label>
                  <div className="product-detail__sizes">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        className={`product-detail__size-btn ${selectedSize === s ? 'active' : ''}`}
                        onClick={() => setSelectedSize(s)}
                        disabled={product.stock === 0}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="product-detail__option">
                <label>Quantity</label>
                <div className="product-detail__qty">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</button>
                </div>
                <span className="product-detail__stock">
                  {product.stock > 0 ? `${product.stock} in stock` : '⚠ Out of stock'}
                </span>
              </div>

              {/* Add to cart */}
              <div className="product-detail__actions">
                <button
                  className={`btn btn-lg product-detail__add-btn ${product.stock === 0 ? 'btn-oos' : 'btn-primary'}`}
                  onClick={handleAddToCart}
                >
                  {product.stock === 0 ? 'Out of Stock' : <><FiShoppingBag size={18} /> Add to Cart</>}
                </button>
                <button
                  className="btn btn-secondary product-detail__share"
                  onClick={() => { navigator.share?.({ title: product.title, url: window.location.href }); }}
                >
                  <FiShare2 size={16} />
                </button>
              </div>

              {/* Perks */}
              <div className="product-detail__perks">
                <div className="product-detail__perk"><FiTruck size={14} /> Free shipping on orders over $100</div>
                <div className="product-detail__perk"><FiRefreshCw size={14} /> 30-day free returns</div>
                <div className="product-detail__perk"><FiShield size={14} /> Secure payment</div>
              </div>
            </div>
          </div>

          {/* Tabs — Description / Reviews */}
          <div className="product-detail__tabs">
            <div className="product-detail__tab-nav">
              {['description', 'reviews'].map((t) => (
                <button
                  key={t}
                  className={`product-detail__tab-btn ${activeTab === t ? 'active' : ''}`}
                  onClick={() => setActiveTab(t)}
                >
                  {t === 'description' ? 'Description' : `Reviews (${product.numReviews})`}
                </button>
              ))}
            </div>

            {activeTab === 'description' && (
              <div className="product-detail__tab-content">
                <p>{product.description}</p>
                {product.tags?.length > 0 && (
                  <div className="product-detail__tags">
                    {product.tags.map((t) => <span key={t} className="product-detail__tag">#{t}</span>)}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="product-detail__tab-content">
                {product.reviews?.length === 0 ? (
                  <p style={{ color: 'var(--color-text-muted)' }}>No reviews yet. Be the first!</p>
                ) : (
                  <div className="product-detail__reviews">
                    {product.reviews.map((r) => (
                      <div key={r._id} className="product-detail__review">
                        <div className="review-header">
                          <strong>{r.name}</strong>
                          <Rating value={r.rating} small />
                          <span className="review-date">{new Date(r.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p>{r.comment}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Submit review */}
                {user && (
                  <form className="product-detail__review-form" onSubmit={handleSubmitReview}>
                    <h4>Write a Review</h4>
                    <div className="form-group">
                      <label className="form-label">Rating</label>
                      <select className="form-input" value={reviewRating} onChange={(e) => setReviewRating(Number(e.target.value))}>
                        {[5,4,3,2,1].map((n) => <option key={n} value={n}>{n} ★</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Comment</label>
                      <textarea
                        className="form-input"
                        rows={4}
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Share your experience..."
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={reviewLoading}>
                      {reviewLoading ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Related Products */}
          {related.length > 0 && (
            <section className="product-detail__related">
              <h2 className="section-title">You May Also Like</h2>
              <div className="section-divider" />
              <div className="products-grid">
                {related.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>
            </section>
          )}
        </div>
      </div>

      <Footer />

      {/* ── Image Zoom Lightbox ── */}
      {zoomOpen && (
        <div className="img-zoom-overlay" onClick={() => setZoomOpen(false)}>
          <button className="img-zoom-close" onClick={() => setZoomOpen(false)}>✕</button>
          <div className="img-zoom-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={product.images?.[selectedImg]?.url || ''}
              alt={product.title}
              className="img-zoom-image"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/800x1000?text=No+Image'; }}
            />
            {/* Thumbnail strip inside lightbox */}
            {product.images?.length > 1 && (
              <div className="img-zoom-thumbs">
                {product.images.map((img, i) => (
                  <img
                    key={i}
                    src={img.url}
                    alt={i}
                    className={`img-zoom-thumb ${i === selectedImg ? 'active' : ''}`}
                    onClick={() => setSelectedImg(i)}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetailPage;