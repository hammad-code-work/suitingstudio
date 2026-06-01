// src/pages/admin/AdminOrderDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiArrowLeft, FiPackage, FiTruck, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Loader from '../../components/common/Loader';
import { orderService } from '../../services/orderService';
import toast from 'react-hot-toast';
import './AdminPages.css';

const STATUS_FLOW = [
  { key: 'accepted',  label: 'Accept Order',   icon: FiCheckCircle, color: '#16a34a' },
  { key: 'rejected',  label: 'Reject Order',   icon: FiXCircle,     color: '#dc2626' },
  { key: 'shipped',   label: 'Mark Shipped',   icon: FiTruck,       color: '#d97706' },
  { key: 'delivered', label: 'Mark Delivered', icon: FiPackage,     color: '#2563eb' },
  { key: 'cancelled', label: 'Cancel Order',   icon: FiXCircle,     color: '#6b7280' },
];

const AdminOrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  const fetchOrder = async () => {
    try {
      const { data } = await orderService.getById(id);
      setOrder(data.order);
      setTrackingNumber(data.order.trackingNumber || '');
      setAdminNotes(data.order.adminNotes || '');
    } catch (err) {
      toast.error('Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrder(); }, [id]);

  const handleStatusUpdate = async (newStatus) => {
    if (!window.confirm(`Change order status to "${newStatus}"?`)) return;
    setUpdating(true);
    try {
      await orderService.updateStatus(id, {
        orderStatus: newStatus,
        trackingNumber,
        adminNotes,
      });
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrder();
    } catch (err) {
      toast.error('Status update failed');
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveNotes = async () => {
    setUpdating(true);
    try {
      await orderService.updateStatus(id, { trackingNumber, adminNotes });
      toast.success('Notes and tracking saved');
    } catch (err) {
      toast.error('Save failed');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="admin-layout"><AdminSidebar /><main className="admin-main"><Loader /></main></div>;
  if (!order) return <div className="admin-layout"><AdminSidebar /><main className="admin-main"><div className="admin-page"><p>Order not found.</p></div></main></div>;

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <Helmet><title>Order Detail — SuitingStudio Admin</title></Helmet>
        <div className="admin-page">
          <div className="admin-page__header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link to="/admin/orders" className="btn btn-secondary btn-sm"><FiArrowLeft size={14} /></Link>
              <div>
                <h1 className="admin-page__title" style={{ fontSize: '22px' }}>
                  Order #{order._id.slice(-10).toUpperCase()}
                </h1>
                <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                  Placed on {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span className={`status-badge status-${order.orderStatus}`} style={{ fontSize: '13px', padding: '5px 14px' }}>
                {order.orderStatus}
              </span>
              <span className={`status-badge status-${order.paymentStatus}`} style={{ fontSize: '13px', padding: '5px 14px' }}>
                {order.paymentStatus}
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px', alignItems: 'flex-start' }}>
            {/* Left column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* Order Items */}
              <div className="admin-form-card">
                <h3>Order Items ({order.orderItems?.length})</h3>
                {order.orderItems?.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--color-border)' }}>
                    <div style={{ width: '60px', height: '75px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: 'var(--color-surface-alt)', flexShrink: 0 }}>
                      <img
                        src={item.image || 'https://via.placeholder.com/60x75'}
                        alt={item.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/60x75'; }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <strong style={{ fontSize: '14px', display: 'block', marginBottom: '4px' }}>{item.title}</strong>
                      <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                        <span>Size: {item.size}</span>
                        {item.color && <span>Color: {item.color}</span>}
                        <span>Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <strong style={{ fontSize: '15px' }}>${(item.price * item.quantity).toFixed(2)}</strong>
                      <small style={{ display: 'block', color: 'var(--color-text-muted)', fontSize: '12px' }}>${item.price} each</small>
                    </div>
                  </div>
                ))}

                {/* Totals */}
                <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--color-text-muted)' }}>
                    <span>Subtotal</span><span>${order.subtotal?.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--color-text-muted)' }}>
                    <span>Shipping</span><span>{order.shippingCost === 0 ? 'Free' : `$${order.shippingCost}`}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '700', borderTop: '1px solid var(--color-border)', paddingTop: '12px', marginTop: '4px' }}>
                    <span>Total</span><span>${order.totalAmount?.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="admin-form-card">
                <h3>Customer Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '14px' }}>
                  <div>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Name</p>
                    <p><strong>{order.customerName}</strong></p>
                  </div>
                  <div>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Email</p>
                    <p><a href={`mailto:${order.customerEmail}`} style={{ color: 'var(--color-secondary)' }}>{order.customerEmail}</a></p>
                  </div>
                  <div>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Phone</p>
                    <p><a href={`tel:${order.customerPhone}`}>{order.customerPhone}</a></p>
                  </div>
                  <div>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Payment Method</p>
                    <p style={{ textTransform: 'uppercase', fontWeight: '600' }}>{order.paymentMethod}</p>
                  </div>
                </div>
                <div style={{ marginTop: '16px', borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Shipping Address</p>
                  <p style={{ fontSize: '14px', lineHeight: '1.7' }}>
                    {order.shippingAddress?.street}<br />
                    {order.shippingAddress?.city}, {order.shippingAddress?.state}<br />
                    {order.shippingAddress?.country} {order.shippingAddress?.postalCode}
                  </p>
                </div>
              </div>

              {/* Tracking & Notes */}
              <div className="admin-form-card">
                <h3>Tracking & Admin Notes</h3>
                <div className="form-group">
                  <label className="form-label">Tracking Number</label>
                  <input className="form-input" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} placeholder="e.g. TCS-12345678" />
                </div>
                <div className="form-group">
                  <label className="form-label">Admin Notes (internal)</label>
                  <textarea className="form-input" rows={3} value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} placeholder="Internal notes about this order..." />
                </div>
                <button className="btn btn-secondary" onClick={handleSaveNotes} disabled={updating}>
                  {updating ? 'Saving...' : 'Save Notes & Tracking'}
                </button>
              </div>
            </div>

            {/* Right: Status Controls */}
            <div>
              <div className="admin-form-card" style={{ position: 'sticky', top: '24px' }}>
                <h3>Order Actions</h3>
                <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '20px' }}>
                  Current status: <span className={`status-badge status-${order.orderStatus}`}>{order.orderStatus}</span>
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {STATUS_FLOW.map(({ key, label, icon: Icon, color }) => (
                    <button
                      key={key}
                      className="btn btn-secondary"
                      style={{
                        justifyContent: 'flex-start',
                        gap: '10px',
                        borderColor: order.orderStatus === key ? color : undefined,
                        background: order.orderStatus === key ? `${color}10` : undefined,
                        opacity: updating ? 0.6 : 1,
                      }}
                      onClick={() => handleStatusUpdate(key)}
                      disabled={updating || order.orderStatus === key}
                    >
                      <Icon size={16} style={{ color }} />
                      {label}
                      {order.orderStatus === key && <span style={{ marginLeft: 'auto', fontSize: '11px', color }}>✓ Current</span>}
                    </button>
                  ))}
                </div>

                {/* WhatsApp quick contact */}
                <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--color-border)' }}>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '10px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Quick Actions</p>
                  <a
                    href={`https://wa.me/${order.customerPhone?.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(order.customerName)}%2C%20your%20SuitingStudio%20order%20%23${order._id.slice(-8).toUpperCase()}%20status%20is%3A%20${order.orderStatus}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary"
                    style={{ width: '100%', marginBottom: '8px', justifyContent: 'center' }}
                  >
                    💬 WhatsApp Customer
                  </a>
                  <a
                    href={`mailto:${order.customerEmail}?subject=Your SuitingStudio Order&body=Dear ${order.customerName},%0A%0AYour order #${order._id.slice(-8).toUpperCase()} status has been updated.`}
                    className="btn btn-secondary"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    📧 Email Customer
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminOrderDetailPage;
