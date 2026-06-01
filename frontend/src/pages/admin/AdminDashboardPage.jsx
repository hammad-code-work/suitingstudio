// src/pages/admin/AdminDashboardPage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiShoppingBag, FiPackage, FiUsers, FiDollarSign } from 'react-icons/fi';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Loader from '../../components/common/Loader';
import { orderService } from '../../services/orderService';
import './AdminPages.css';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await orderService.getStats();
        setStats(data.stats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const statCards = stats
    ? [
        { label: 'Total Orders', value: stats.totalOrders, icon: '🛍️', color: '#1a1a2e' },
        { label: 'Total Products', value: stats.totalProducts, icon: '📦', color: '#c8860a' },
        { label: 'Total Customers', value: stats.totalUsers, icon: '👥', color: '#2563eb' },
        {
          label: 'Total Revenue',
          value: `$${stats.totalRevenue?.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
          icon: '💰',
          color: '#16a34a',
        },
      ]
    : [];

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <Helmet><title>Dashboard — SuitingStudio Admin</title></Helmet>
        <div className="admin-page">
          <div className="admin-page__header">
            <h1 className="admin-page__title">Dashboard</h1>
            <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>

          {loading ? (
            <Loader />
          ) : (
            <>
              {/* Stat Cards */}
              <div className="admin-stats">
                {statCards.map((s) => (
                  <div className="admin-stat-card" key={s.label}>
                    <div className="admin-stat-card__icon">{s.icon}</div>
                    <div className="admin-stat-card__label">{s.label}</div>
                    <div className="admin-stat-card__value" style={{ color: s.color }}>
                      {s.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Orders by Status */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
                {/* Order Status Breakdown */}
                <div style={{ background: 'white', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '24px' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', marginBottom: '20px' }}>
                    Orders by Status
                  </h3>
                  {stats.ordersByStatus?.map((s) => (
                    <div key={s._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--color-border)' }}>
                      <span className={`status-badge status-${s._id}`}>{s._id}</span>
                      <strong>{s.count}</strong>
                    </div>
                  ))}
                </div>

                {/* Monthly Revenue */}
                <div style={{ background: 'white', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '24px' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', marginBottom: '20px' }}>
                    Monthly Revenue
                  </h3>
                  {stats.monthlyRevenue?.length === 0 && (
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>No revenue data yet.</p>
                  )}
                  {stats.monthlyRevenue?.map((m) => (
                    <div key={`${m._id.year}-${m._id.month}`} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--color-border)', fontSize: '14px' }}>
                      <span style={{ color: 'var(--color-text-muted)' }}>
                        {new Date(m._id.year, m._id.month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
                      </span>
                      <div style={{ textAlign: 'right' }}>
                        <strong>${m.revenue.toFixed(2)}</strong>
                        <span style={{ marginLeft: '12px', color: 'var(--color-text-muted)', fontSize: '12px' }}>{m.orders} orders</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Orders */}
              <div style={{ background: 'white', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px' }}>Recent Orders</h3>
                  <Link to="/admin/orders" className="btn btn-secondary btn-sm">View All</Link>
                </div>
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Customer</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentOrders?.map((order) => (
                        <tr key={order._id}>
                          <td>{order.customerName}</td>
                          <td><strong>${order.totalAmount}</strong></td>
                          <td><span className={`status-badge status-${order.orderStatus}`}>{order.orderStatus}</span></td>
                          <td style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td>
                            <Link to={`/admin/orders/${order._id}`} className="btn btn-secondary btn-sm">View</Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;
