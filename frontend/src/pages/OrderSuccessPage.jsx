// src/pages/OrderSuccessPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiCheckCircle, FiPackage } from 'react-icons/fi';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Loader from '../components/common/Loader';
import { orderService } from '../services/orderService';

const OrderSuccessPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await orderService.getById(id);
        setOrder(data.order);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) return <><Navbar /><Loader /></>;

  return (
    <>
      <Helmet><title>Order Confirmed — SuitingStudio</title></Helmet>
      <Navbar />
      <div style={{ minHeight: 'calc(100vh - 68px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', background: 'var(--color-surface-alt)' }}>
        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '48px', maxWidth: '560px', width: '100%', textAlign: 'center', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-lg)' }}>
          <FiCheckCircle size={64} color="var(--color-success)" style={{ margin: '0 auto 20px', display: 'block' }} />
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', marginBottom: '8px' }}>Order Confirmed!</h1>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>
            Thank you{order ? `, ${order.customerName}` : ''}! Your order has been placed successfully.
          </p>
          {order && (
            <div style={{ background: 'var(--color-surface-alt)', borderRadius: 'var(--radius-md)', padding: '20px', textAlign: 'left', marginBottom: '28px' }}>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>ORDER ID</p>
              <p style={{ fontFamily: 'monospace', fontWeight: '700', marginBottom: '16px' }}>#{order._id}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '6px' }}>
                <span>Total</span><strong>${order.totalAmount}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '6px' }}>
                <span>Payment</span><strong style={{ textTransform: 'capitalize' }}>{order.paymentMethod}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span>Status</span>
                <strong style={{ color: 'var(--color-success)', textTransform: 'capitalize' }}>{order.orderStatus}</strong>
              </div>
            </div>
          )}
          <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '28px' }}>
            <FiPackage size={14} style={{ marginRight: '6px' }} />
            A confirmation email has been sent to {order?.customerEmail}
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Link to="/" className="btn btn-secondary">Back to Home</Link>
            <Link to="/shop" className="btn btn-primary">Continue Shopping</Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderSuccessPage;
