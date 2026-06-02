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
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [wishlist, setWishlist] = useState(false);

  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  // Close zoom on Escape key
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setZoomOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Track cursor position for zoom origin
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty('--zoom-x', x + '%');
    e.currentTarget.style.setProperty('--zoom-y', y + '%');
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await productService.getById(id);
        setProduct(data.product);
        setSelectedColor(data.product.colors?.[0] || '');

        const rel = await productService.getAll({
          category: data.product.category,
          limit: 4
        });

        setRelated(
          rel.data.products?.filter((p) => p._id !== id).slice(0, 4) || []
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    if (product.stock === 0) {
      toast.error('Sorry, this product is out of stock!');
      return;
    }
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to leave a review');
      return;
    }

    setReviewLoading(true);
    try {
      await productService.addReview(product._id, {
        rating: reviewRating,
        comment: reviewText
      });

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

  if (!product)
    return (
      <>
        <Navbar />
        <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
          Product not found
        </div>
        <Footer />
      </>
    );

  const price = product.discountPrice || product.originalPrice;
  const hasDiscount =
    product.discountPrice && product.discountPrice < product.originalPrice;

  const discountPct = hasDiscount
    ? Math.round(
        ((product.originalPrice - product.discountPrice) /
          product.originalPrice) *
          100
      )
    : 0;

  return (
    <>
      <Helmet>
        <title>{product.title} — SuitingStudio</title>
        <meta name="description" content={product.description?.slice(0, 160)} />
      </Helmet>

      <Navbar />

      <div className="product-detail">
        <div className="container">
          <div className="product-detail__breadcrumb">
            <Link to="/">Home</Link> / <Link to="/shop">Shop</Link> /
            <Link to={`/shop/${product.category}`}>{product.category}</Link> / {product.title}
          </div>

          <div className="product-detail__main">
            <div className="product-detail__gallery">
              <div className="product-detail__thumbs">
                {product.images?.map((img, i) => (
                  <button
                    key={i}
                    className={`product-detail__thumb ${i === selectedImg ? 'active' : ''}`}
                    onClick={() => setSelectedImg(i)}
                  >
                    <img src={img.url} alt="" />
                  </button>
                ))}
              </div>

              <div
                className="product-detail__main-img"
                onClick={() => setZoomOpen(true)}
                onMouseMove={handleMouseMove}
              >
                <img
                  src={product.images?.[selectedImg]?.url}
                  alt={product.title}
                />
              </div>
            </div>

            <div className="product-detail__info">
              <h1>{product.title}</h1>

              <div className="product-detail__price">
                <span>${price}</span>
              </div>

              <button className="btn btn-primary" onClick={handleAddToCart}>
                <FiShoppingBag /> Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ProductDetailPage;