// src/pages/admin/AdminCategoriesPage.jsx
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiTrash2, FiPlus } from 'react-icons/fi';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Loader from '../../components/common/Loader';
import api from '../../services/api';
import toast from 'react-hot-toast';
import './AdminPages.css';

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data.categories || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      await api.post('/categories', form);
      toast.success('Category added!');
      setForm({ name: '', description: '' });
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add category');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success('Category deleted');
      fetchCategories();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <Helmet><title>Categories — SuitingStudio Admin</title></Helmet>
        <div className="admin-page">
          <div className="admin-page__header">
            <h1 className="admin-page__title">Categories</h1>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px', alignItems: 'flex-start' }}>
            {/* Category List */}
            <div>
              {loading ? (
                <Loader />
              ) : (
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Slug</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.length === 0 ? (
                        <tr>
                          <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>
                            No categories yet. Add one →
                          </td>
                        </tr>
                      ) : (
                        categories.map((cat) => (
                          <tr key={cat._id}>
                            <td><strong>{cat.name}</strong></td>
                            <td style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>{cat.slug}</td>
                            <td style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>{cat.description || '—'}</td>
                            <td>
                              <span className={`status-badge ${cat.isActive ? 'status-accepted' : 'status-rejected'}`}>
                                {cat.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDelete(cat._id)}
                                title="Delete"
                              >
                                <FiTrash2 size={13} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Add Category Form */}
            <div className="admin-form-card">
              <h3>Add New Category</h3>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '20px' }}>
                Note: SuitingStudio supports <strong>Women</strong> and <strong>Kids</strong> categories. Avoid adding others.
              </p>
              <form onSubmit={handleAdd}>
                <div className="form-group">
                  <label className="form-label">Category Name *</label>
                  <input
                    className="form-input"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    placeholder="e.g. Women"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-input"
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Short description..."
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={adding}>
                  <FiPlus size={15} /> {adding ? 'Adding...' : 'Add Category'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminCategoriesPage;
