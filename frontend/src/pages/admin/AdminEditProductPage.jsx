// src/pages/admin/AdminEditProductPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiArrowLeft, FiUpload, FiX } from 'react-icons/fi';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Loader from '../../components/common/Loader';
import { productService } from '../../services/productService';
import toast from 'react-hot-toast';
import './AdminPages.css';

const WOMEN_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const KIDS_SIZES = ['1-2 Years', '3-4 Years', '5-6 Years', '7-8 Years', '9-10 Years', '11-12 Years'];
const COLORS = ['Black', 'White', 'Red', 'Blue', 'Navy', 'Pink', 'Yellow', 'Green', 'Beige', 'Maroon', 'Grey', 'Cream', 'Purple', 'Orange'];

const AdminEditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);

  const [form, setForm] = useState({
    title: '', description: '', category: 'Women',
    sizes: [], colors: [], stock: 0,
    originalPrice: '', discountPrice: '',
    isOnSale: false, isFeatured: false, sku: '', tags: '',
    existingImages: [], // already saved images
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await productService.getById(id);
        const p = data.product;
        setForm({
          title: p.title || '',
          description: p.description || '',
          category: p.category || 'Women',
          sizes: p.sizes || [],
          colors: p.colors || [],
          stock: p.stock || 0,
          originalPrice: p.originalPrice || '',
          discountPrice: p.discountPrice || '',
          isOnSale: p.isOnSale || false,
          isFeatured: p.isFeatured || false,
          sku: p.sku || '',
          tags: (p.tags || []).join(', '),
          existingImages: p.images || [],
        });
      } catch (err) {
        toast.error('Failed to load product');
      } finally {
        setFetching(false);
      }
    };
    fetch();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const toggleSize = (size) => {
    setForm((f) => ({
      ...f,
      sizes: f.sizes.includes(size) ? f.sizes.filter((s) => s !== size) : [...f.sizes, size],
    }));
  };

  const toggleColor = (color) => {
    setForm((f) => ({
      ...f,
      colors: f.colors.includes(color) ? f.colors.filter((c) => c !== color) : [...f.colors, color],
    }));
  };

  const handleNewImages = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = form.existingImages.length + newImageFiles.length + files.length;
    if (totalImages > 5) { toast.error('Maximum 5 images total'); return; }
    setNewImageFiles((prev) => [...prev, ...files]);
    setNewImagePreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const removeExistingImage = (index) => {
    setForm((f) => ({
      ...f,
      existingImages: f.existingImages.filter((_, i) => i !== index),
    }));
  };

  const removeNewImage = (index) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.sizes.length === 0) { toast.error('Select at least one size'); return; }
    if (form.colors.length === 0) { toast.error('Select at least one color'); return; }

    setLoading(true);
    try {
      const formData = new FormData();
      const fields = ['title', 'description', 'category', 'stock', 'originalPrice', 'discountPrice', 'isOnSale', 'isFeatured', 'sku'];
      fields.forEach((key) => formData.append(key, form[key]));
      formData.append('sizes', JSON.stringify(form.sizes));
      formData.append('colors', JSON.stringify(form.colors));
      const tagsArr = form.tags.split(',').map((t) => t.trim()).filter(Boolean);
      formData.append('tags', JSON.stringify(tagsArr));
      // Send existing image URLs to keep
      formData.append('existingImages', JSON.stringify(form.existingImages));
      // Append new files
      newImageFiles.forEach((file) => formData.append('images', file));

      await productService.update(id, formData);
      toast.success('Product updated successfully!');
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="admin-layout"><AdminSidebar /><main className="admin-main"><Loader /></main></div>;

  const sizeOptions = form.category === 'Kids' ? KIDS_SIZES : WOMEN_SIZES;
  const totalImages = form.existingImages.length + newImagePreviews.length;

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <Helmet><title>Edit Product — SuitingStudio Admin</title></Helmet>
        <div className="admin-page">
          <div className="admin-page__header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link to="/admin/products" className="btn btn-secondary btn-sm"><FiArrowLeft size={14} /></Link>
              <h1 className="admin-page__title">Edit Product</h1>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'flex-start' }}>
              {/* Left */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {/* Basic Info */}
                <div className="admin-form-card">
                  <h3>Basic Information</h3>
                  <div className="form-group">
                    <label className="form-label">Product Title *</label>
                    <input className="form-input" name="title" value={form.title} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description *</label>
                    <textarea className="form-input" name="description" rows={5} value={form.description} onChange={handleChange} required />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Category *</label>
                      <select className="form-input" name="category" value={form.category} onChange={handleChange}>
                        <option value="Women">Women</option>
                        <option value="Kids">Kids</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">SKU *</label>
                      <input className="form-input" name="sku" value={form.sku} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tags (comma-separated)</label>
                    <input className="form-input" name="tags" value={form.tags} onChange={handleChange} placeholder="dress, floral, summer" />
                  </div>
                </div>

                {/* Pricing */}
                <div className="admin-form-card">
                  <h3>Pricing & Stock</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Original Price ($) *</label>
                      <input className="form-input" type="number" name="originalPrice" value={form.originalPrice} onChange={handleChange} required min="0" step="0.01" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Discount Price ($)</label>
                      <input className="form-input" type="number" name="discountPrice" value={form.discountPrice} onChange={handleChange} min="0" step="0.01" placeholder="Leave empty for no discount" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Stock Quantity *</label>
                      <input className="form-input" type="number" name="stock" value={form.stock} onChange={handleChange} required min="0" />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '24px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                      <input type="checkbox" name="isOnSale" checked={form.isOnSale} onChange={handleChange} style={{ accentColor: 'var(--color-primary)', width: '16px', height: '16px' }} />
                      Mark as On Sale
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                      <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} style={{ accentColor: 'var(--color-primary)', width: '16px', height: '16px' }} />
                      Featured Product
                    </label>
                  </div>
                </div>

                {/* Sizes */}
                <div className="admin-form-card">
                  <h3>Sizes</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {sizeOptions.map((s) => (
                      <button key={s} type="button"
                        className={`btn btn-sm ${form.sizes.includes(s) ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => toggleSize(s)}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Colors */}
                <div className="admin-form-card">
                  <h3>Colors</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {COLORS.map((c) => (
                      <button key={c} type="button"
                        className={`btn btn-sm ${form.colors.includes(c) ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => toggleColor(c)}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Images */}
              <div>
                <div className="admin-form-card">
                  <h3>Product Images</h3>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                    {totalImages}/5 images. Remove old ones or add new.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '16px' }}>
                    {/* Existing images */}
                    {form.existingImages.map((img, i) => (
                      <div key={`existing-${i}`} style={{ position: 'relative', aspectRatio: '3/4', background: 'var(--color-surface-alt)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '2px solid var(--color-secondary)' }}>
                        <img src={img.url} alt={`Existing ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/120x160'; }} />
                        <button type="button" onClick={() => removeExistingImage(i)}
                          style={{ position: 'absolute', top: '6px', right: '6px', width: '24px', height: '24px', background: 'rgba(230,57,70,0.9)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FiX size={12} />
                        </button>
                        {i === 0 && <span style={{ position: 'absolute', bottom: '6px', left: '6px', background: 'rgba(0,0,0,0.6)', color: 'white', fontSize: '10px', padding: '2px 6px', borderRadius: '2px' }}>Main</span>}
                      </div>
                    ))}

                    {/* New image previews */}
                    {newImagePreviews.map((src, i) => (
                      <div key={`new-${i}`} style={{ position: 'relative', aspectRatio: '3/4', background: 'var(--color-surface-alt)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                        <img src={src} alt={`New ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button type="button" onClick={() => removeNewImage(i)}
                          style={{ position: 'absolute', top: '6px', right: '6px', width: '24px', height: '24px', background: 'rgba(230,57,70,0.9)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FiX size={12} />
                        </button>
                        <span style={{ position: 'absolute', bottom: '6px', left: '6px', background: 'rgba(200,134,10,0.8)', color: 'white', fontSize: '10px', padding: '2px 6px', borderRadius: '2px' }}>New</span>
                      </div>
                    ))}

                    {/* Upload button if under limit */}
                    {totalImages < 5 && (
                      <label style={{ aspectRatio: '3/4', background: 'var(--color-surface-alt)', border: '2px dashed var(--color-border)', borderRadius: 'var(--radius-sm)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: '8px' }}>
                        <FiUpload size={24} style={{ color: 'var(--color-text-muted)' }} />
                        <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Add more</span>
                        <input type="file" multiple accept="image/*" onChange={handleNewImages} style={{ display: 'none' }} />
                      </label>
                    )}
                  </div>
                </div>

                <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%' }}>
                    {loading ? 'Updating...' : '✓ Update Product'}
                  </button>
                  <Link to="/admin/products" className="btn btn-secondary" style={{ textAlign: 'center' }}>Cancel</Link>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AdminEditProductPage;
