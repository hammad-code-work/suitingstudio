// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import HeroBanner from '../components/layout/HeroBanner';
import CategorySection from '../components/layout/CategorySection';
import TrustBadges from '../components/layout/TrustBadges';
import ProductCard from '../components/product/ProductCard';
import Loader from '../components/common/Loader';
import { productService } from '../services/productService';
import './HomePage.css';

const TABS = ['All', 'New Arrivals', 'Best Seller', 'Top Rated'];

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = { limit: 8 };
        if (activeTab === 'New Arrivals') params.sort = 'newest';
        if (activeTab === 'Best Seller') params.isFeatured = true;
        if (activeTab === 'Top Rated') params.sort = 'rating';
        const { data } = await productService.getAll(params);
        setProducts(data.products || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [activeTab]);

  return (
    <>
      <Helmet>
        <title>SuitingStudio — Premium Garments for Women & Kids</title>
        <meta name="description" content="Discover premium women's and kids' garments at SuitingStudio. Shop the latest collections with worldwide shipping." />
      </Helmet>

      <Navbar />

      {/* Hero */}
      <HeroBanner />

      {/* Category Grid */}
      <CategorySection />

      {/* Trendy Products */}
      <section className="home-products">
        <div className="container">
          <h2 className="section-title">Our Trendy Products</h2>
          <div className="section-divider" />

          {/* Tabs */}
          <div className="home-products__tabs">
            {TABS.map((tab) => (
              <button
                key={tab}
                className={`home-products__tab ${activeTab === tab ? 'home-products__tab--active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Grid */}
          {loading ? (
            <Loader />
          ) : products.length === 0 ? (
            <div className="home-products__empty">
              <p>No products found. <Link to="/admin/products/add">Add some products</Link>!</p>
            </div>
          ) : (
            <div className="products-grid">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}

          <div className="home-products__cta">
            <Link to="/shop" className="btn btn-secondary btn-lg">Discover More</Link>
          </div>
        </div>
      </section>

      {/* Deal of the Week Banner */}
      <section className="deal-banner">
        <div className="container deal-banner__inner">
          <div className="deal-banner__content">
            <span className="deal-banner__tag">
              <span />
              Deal of the Week
            </span>
            <h2>Spring Collection</h2>
            <p>Refresh your wardrobe with our stunning spring arrivals. Limited time, limited stock.</p>
            <Link to="/shop?sale=true" className="btn btn-primary">Shop Now</Link>
          </div>
          <div className="deal-banner__image">
            <img
              src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&q=80"
              alt="Spring Collection"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <TrustBadges />

      <Footer />
    </>
  );
};

export default HomePage;
