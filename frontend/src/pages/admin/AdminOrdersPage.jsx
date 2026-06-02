// src/pages/admin/AdminOrdersPage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiEye, FiFilter, FiTrash2 } from 'react-icons/fi';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Loader from '../../components/common/Loader';
import { orderService } from '../../services/orderService';
import toast from 'react-hot-toast';
import './AdminPages.css';

const ORDER_STATUSES   = ['', 'placed', 'accepted', 'rejected', 'shipped', 'delivered', 'cancelled'];
const PAYMENT_STATUSES = ['', 'pending', 'paid', 'failed', 'refunded'];

const AdminOrdersPage = () => {
  const [orders,        setOrders]        = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [statusFilter,  setStatusFilter]  = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [page,          setPage]          = useState(1);
  const [pages,         setPages]         = useState(1);
  const [total,         setTotal]         = useState(0);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (statusFilter)  params.status        = statusFilter;
      if (paymentFilter) params.paymentStatus = paymentFilter;
      const { data } = await orderService.getAll(params);
      setOrders(data.orders || []);
      setPages(data.pages   || 1);
      setTotal(data.total   || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [page, statusFilter, paymentFilter]);

  // ── Exact same pattern as AdminProductsPage ───────────────
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this order? This cannot be undone.')) return;
    try {
      await orderService.delete(id);
      toast.success('Order deleted');
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <Helmet><title>Orders — SuitingStudio Admin</title></Helmet>
        <div className="admin-page">

          <div className="admin-page__header">
            <div>
              <h1 className="admin-page__title">Orders</h1>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginTop: '4px' }}>
                {total} total orders
              </p>
            </div>
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
            <FiFilter size={16} style={{ color: 'var(--color-text-muted)' }} />
            <select className="form-input" style={{ maxWidth: '180px' }}
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>{s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All Statuses'}</option>
              ))}
            </select>
            <select className="form-input" style={{ maxWidth: '180px' }}
              value={paymentFilter}
              onChange={(e) => { setPaymentFilter(e.target.value); setPage(1); }}>
              {PAYMENT_STATUSES.map((s) => (
                <option key={s} value={s}>{s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All Payments'}</option>
              ))}
            </select>
          </div>

          {loading ? <Loader /> : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Phone</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={9} style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>
                        No orders found.
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order._id}>
                        <td>
                          <span style={{ fontFamily: 'monospace', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                            #{order._id.slice(-8).toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <strong style={{ display: 'block', fontSize: '14px' }}>{order.customerName}</strong>
                          <small style={{ color: 'var(--color-text-muted)', fontSize: '12px' }}>{order.customerEmail}</small>
                        </td>
                        <td style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{order.customerPhone}</td>
                        <td>
                          <span style={{ background: 'var(--color-surface-alt)', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: '12px', fontWeight: '600' }}>
                            {order.orderItems?.length} item{order.orderItems?.length !== 1 ? 's' : ''}
                          </span>
                        </td>
                        <td><strong>${order.totalAmount}</strong></td>
                        <td><span className={`status-badge status-${order.paymentStatus}`}>{order.paymentStatus}</span></td>
                        <td><span className={`status-badge status-${order.orderStatus}`}>{order.orderStatus}</span></td>
                        <td style={{ fontSize: '13px', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                          {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td>
                          <div className="admin-table__actions">
                            <Link to={`/admin/orders/${order._id}`} className="btn btn-secondary btn-sm" title="View">
                              <FiEye size={13} />
                            </Link>
                            <button
                              className="btn btn-danger btn-sm"
                              title="Delete"
                              onClick={() => handleDelete(order._id)}
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

          {pages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <button key={p}
                  className={`btn btn-sm ${page === p ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setPage(p)}>{p}</button>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminOrdersPage;