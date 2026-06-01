// src/pages/admin/AdminAddProductPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiArrowLeft, FiUpload, FiX } from 'react-icons/fi';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { productService } from '../../services/productService';
import toast from 'react-hot-toast';
import './AdminPages.css';

const WOMEN_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const KIDS_SIZES = ['1-2 Years', '3-4 Years', '5-6 Years', '7-8 Years', '9-10 Years', '11-12 Years'];
const COLORS = ['Black', 'White', 'Red', 'Blue', 'Navy', 'Pink', 'Yellow', 'Green', 'Beige', 'Maroon', 'Grey', 'Cream', 'Purple', 'Orange'];

const AdminAddProductPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Women',
    sizes: [],
    colors: [],
    stock: 0,
    originalPrice: '',
    discountPrice: '',
    isOnSale: false,
    isFeatured: false,
    sku: '',
    tags: '',
  });

  const sizeOptions = form.category === 'Kids' ? KIDS_SIZES : WOMEN_SIZES;

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

  // Handle image file selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imageFiles.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }
    const newFiles = [...imageFiles, ...files];
    setImageFiles(newFiles);
    const newPreviews = newFiles.map((f) => URL.createObjectURL(f));
    setImagePreviews(newPreviews);
  };

  const removeImage = (index) => {
    const newFiles = imageFiles.filter((_, i) => i !== index);
    setImageFiles(newFiles);
    setImagePreviews(newFiles.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.sizes.length === 0) { toast.error('Select at least one size'); return; }
    if (form.colors.length === 0) { toast.error('Select at least one color'); return; }
    if (imageFiles.length === 0) { toast.error('Upload at least one image'); return; }

    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        if (key === 'sizes' || key === 'colors') {
          formData.append(key, JSON.stringify(val));
        } else if (key === 'tags') {
          const tagsArr = val.split(',').map((t) => t.trim()).filter(Boolean);
          formData.append(key, JSON.stringify(tagsArr));
        } else {
          formData.append(key, val);
        }
      });
      imageFiles.forEach((file) => formData.append('images', file));

      await productService.create(formData);
      toast.success('Product created successfully! 🎉');
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <Helmet><title>Add Product — SuitingStudio Admin</title></Helmet>
        <div className="admin-page">
          <div className="admin-page__header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link to="/admin/products" className="btn btn-secondary btn-sm"><FiArrowLeft size={14} /></Link>
              <h1 className="admin-page__title">Add Product</h1>
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
                    <input className="form-input" name="title" value={form.title} onChange={handleChange} required placeholder="e.g. Elegant Floral Dress" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description *</label>
                    <textarea className="form-input" name="description" rows={5} value={form.description} onChange={handleChange} required placeholder="Describe the product in detail..." />
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
                      <input className="form-input" name="sku" value={form.sku} onChange={handleChange} required placeholder="e.g. WD-001" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tags (comma-separated)</label>
                    <input className="form-input" name="tags" value={form.tags} onChange={handleChange} placeholder="dress, floral, summer, women" />
                  </div>
                </div>

                {/* Pricing */}
                <div className="admin-form-card">
                  <h3>Pricing & Stock</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Original Price ($) *</label>
                      <input className="form-input" type="number" name="originalPrice" value={form.originalPrice} onChange={handleChange} required min="0" step="0.01" placeholder="89.00" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Discount Price ($)</label>
                      <input className="form-input" type="number" name="discountPrice" value={form.discountPrice} onChange={handleChange} min="0" step="0.01" placeholder="65.00" />
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
                  <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
                    {form.category === 'Kids' ? 'Kids sizes (age groups)' : 'Women sizes (XS–XXL)'}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {sizeOptions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        className={`btn btn-sm ${form.sizes.includes(s) ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => toggleSize(s)}
                      >
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
                      <button
                        key={c}
                        type="button"
                        className={`btn btn-sm ${form.colors.includes(c) ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => toggleColor(c)}
                      >
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
                    Upload up to 5 images. First image is the main image.
                  </p>

                  {/* Preview grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '16px' }}>
                    {imagePreviews.map((src, i) => (
                      <div key={i} style={{ position: 'relative', aspectRatio: '3/4', background: 'var(--color-surface-alt)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                        <img src={src} alt={`Preview ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          style={{ position: 'absolute', top: '6px', right: '6px', width: '24px', height: '24px', background: 'rgba(230,57,70,0.9)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <FiX size={12} />
                        </button>
                        {i === 0 && (
                          <span style={{ position: 'absolute', bottom: '6px', left: '6px', background: 'rgba(0,0,0,0.6)', color: 'white', fontSize: '10px', padding: '2px 6px', borderRadius: '2px' }}>Main</span>
                        )}
                      </div>
                    ))}

                    {imagePreviews.length < 5 && (
                      <label style={{ aspectRatio: '3/4', background: 'var(--color-surface-alt)', border: '2px dashed var(--color-border)', borderRadius: 'var(--radius-sm)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: '8px' }}>
                        <FiUpload size={24} style={{ color: 'var(--color-text-muted)' }} />
                        <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', textAlign: 'center' }}>Click to upload</span>
                        <input type="file" multiple accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                      </label>
                    )}
                  </div>

                  <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                    Supported: JPG, PNG, WEBP • Max 5MB each
                  </p>
                </div>

                {/* Submit */}
                <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%' }}>
                    {loading ? 'Creating Product...' : '✓ Create Product'}
                  </button>
                  <Link to="/admin/products" className="btn btn-secondary" style={{ textAlign: 'center' }}>
                    Cancel
                  </Link>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AdminAddProductPage;
