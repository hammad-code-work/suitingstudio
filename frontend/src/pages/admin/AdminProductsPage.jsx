// src/pages/admin/AdminProductsPage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiEdit2, FiTrash2, FiPlus, FiSearch } from 'react-icons/fi';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Loader from '../../components/common/Loader';
import { productService } from '../../services/productService';
import toast from 'react-hot-toast';
import './AdminPages.css';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (search) params.search = search;
      if (categoryFilter) params.category = categoryFilter;
      const { data } = await productService.getAll(params);
      setProducts(data.products || []);
      setPages(data.pages || 1);
      setTotal(data.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, [page, categoryFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return;
    try {
      await productService.delete(id);
      toast.success('Product deleted');
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <Helmet><title>Products — SuitingStudio Admin</title></Helmet>
        <div className="admin-page">
          <div className="admin-page__header">
            <div>
              <h1 className="admin-page__title">Products</h1>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginTop: '4px' }}>
                {total} total products
              </p>
            </div>
            <Link to="/admin/products/add" className="btn btn-primary">
              <FiPlus size={15} /> Add Product
            </Link>
          </div>

          {/* Search + Filter bar */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', flex: 1, minWidth: '240px' }}>
              <input
                className="form-input"
                style={{ maxWidth: '320px' }}
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button type="submit" className="btn btn-secondary btn-sm">
                <FiSearch size={14} />
              </button>
            </form>
            <select
              className="form-input"
              style={{ maxWidth: '160px' }}
              value={categoryFilter}
              onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
            >
              <option value="">All Categories</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>
          </div>

          {loading ? (
            <Loader />
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Discount</th>
                    <th>Stock</th>
                    <th>Sale</th>
                    <th>Featured</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={9} style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>
                        No products found.{' '}
                        <Link to="/admin/products/add" style={{ color: 'var(--color-secondary)' }}>Add one?</Link>
                      </td>
                    </tr>
                  ) : (
                    products.map((p) => (
                      <tr key={p._id}>
                        <td>
                          <img
                            className="admin-table__img"
                            src={p.images?.[0]?.url || 'https://via.placeholder.com/48x56'}
                            alt={p.title}
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/48x56'; }}
                          />
                        </td>
                        <td>
                          <strong style={{ fontSize: '14px', display: 'block', marginBottom: '2px' }}>{p.title}</strong>
                          <small style={{ color: 'var(--color-text-muted)', fontSize: '11px' }}>SKU: {p.sku}</small>
                        </td>
                        <td>
                          <span className={`status-badge status-${p.category === 'Women' ? 'shipped' : 'accepted'}`}>
                            {p.category}
                          </span>
                        </td>
                        <td>${p.originalPrice}</td>
                        <td>{p.discountPrice ? <span style={{ color: 'var(--color-success)' }}>${p.discountPrice}</span> : <span style={{ color: 'var(--color-text-muted)' }}>—</span>}</td>
                        <td>
                          <span style={{ color: p.stock > 0 ? 'var(--color-success)' : 'var(--color-error)', fontWeight: 600 }}>
                            {p.stock}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize: '18px' }}>{p.isOnSale ? '✅' : '—'}</span>
                        </td>
                        <td>
                          <span style={{ fontSize: '18px' }}>{p.isFeatured ? '⭐' : '—'}</span>
                        </td>
                        <td>
                          <div className="admin-table__actions">
                            <Link
                              to={`/admin/products/edit/${p._id}`}
                              className="btn btn-secondary btn-sm"
                              title="Edit"
                            >
                              <FiEdit2 size={13} />
                            </Link>
                            <button
                              className="btn btn-danger btn-sm"
                              title="Delete"
                              onClick={() => handleDelete(p._id)}
                            >
                              <FiTrash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className={`btn btn-sm ${page === p ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminProductsPage;
