// src/pages/ShopPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiFilter, FiX } from 'react-icons/fi';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ProductCard from '../components/product/ProductCard';
import ProductFilter from '../components/product/ProductFilter';
import Pagination from '../components/common/Pagination';
import Loader from '../components/common/Loader';
import { productService } from '../services/productService';
import './ShopPage.css';

const ShopPage = () => {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [showFilterMobile, setShowFilterMobile] = useState(false);

  const [filters, setFilters] = useState({
    category: category || '',
    minPrice: '',
    maxPrice: '',
    size: '',
    sort: 'newest',
    isOnSale: searchParams.get('sale') === 'true' ? 'true' : '',
    search: searchParams.get('search') || '',
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (filters.category) params.category = filters.category;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.size) params.size = filters.size;
      if (filters.sort) params.sort = filters.sort;
      if (filters.isOnSale) params.isOnSale = filters.isOnSale;
      if (filters.search) params.search = filters.search;

      const { data } = await productService.getAll(params);
      setProducts(data.products || []);
      setTotalProducts(data.total || 0);
      setPages(data.pages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // Sync category param
  useEffect(() => {
    if (category) setFilters((f) => ({ ...f, category }));
  }, [category]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilters({ category: '', minPrice: '', maxPrice: '', size: '', sort: 'newest', isOnSale: '', search: '' });
    setPage(1);
  };

  const pageTitle = filters.category
    ? `${filters.category} Collection — SuitingStudio`
    : 'Shop All Products — SuitingStudio';

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content="Shop premium women and kids garments at SuitingStudio." />
      </Helmet>

      <Navbar />

      <div className="shop-page">
        <div className="container">
          {/* Breadcrumb */}
          <div className="shop-page__breadcrumb">
            <span>Home</span> / <span>Shop</span>
            {filters.category && <> / <span>{filters.category}</span></>}
          </div>

          {/* Header */}
          <div className="shop-page__header">
            <div>
              <h1 className="shop-page__title">
                {filters.category ? `${filters.category} Collection` : 'All Products'}
              </h1>
              {!loading && (
                <p className="shop-page__count">{totalProducts} products found</p>
              )}
            </div>
            <button
              className="btn btn-secondary btn-sm shop-page__filter-toggle"
              onClick={() => setShowFilterMobile(!showFilterMobile)}
            >
              <FiFilter size={14} /> Filters
            </button>
          </div>

          {/* Search query display */}
          {filters.search && (
            <div className="shop-page__search-tag">
              Showing results for: <strong>"{filters.search}"</strong>
              <button onClick={() => handleFilterChange({ ...filters, search: '' })}>
                <FiX size={14} />
              </button>
            </div>
          )}

          {/* Main layout */}
          <div className="shop-page__layout">
            {/* Filter sidebar */}
            <div className={`shop-page__sidebar ${showFilterMobile ? 'shop-page__sidebar--open' : ''}`}>
              <ProductFilter
                filters={filters}
                onChange={handleFilterChange}
                onClear={handleClearFilters}
              />
            </div>

            {/* Products */}
            <div className="shop-page__products">
              {loading ? (
                <Loader />
              ) : products.length === 0 ? (
                <div className="shop-page__empty">
                  <div className="shop-page__empty-icon">🔍</div>
                  <h3>No products found</h3>
                  <p>Try adjusting your filters or search query.</p>
                  <button className="btn btn-primary" onClick={handleClearFilters}>
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <>
                  <div className="products-grid">
                    {products.map((p) => (
                      <ProductCard key={p._id} product={p} />
                    ))}
                  </div>
                  <Pagination page={page} pages={pages} onPageChange={setPage} />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ShopPage;
