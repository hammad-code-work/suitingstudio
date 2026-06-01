// src/pages/CheckoutPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import toast from 'react-hot-toast';
import './CheckoutPage.css';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || 'pk_test_placeholder');

// Inner form component (needs Stripe context)
const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { cartItems, subtotal, shipping, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('stripe');

  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    country: user?.address?.country || '',
    postalCode: user?.address?.postalCode || '',
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) { toast.error('Your cart is empty'); return; }
    setLoading(true);

    try {
      let stripePaymentIntentId = '';

      if (paymentMethod === 'stripe') {
        // Create payment intent
        const { data: piData } = await orderService.createPaymentIntent(total);
        const { error, paymentIntent } = await stripe.confirmCardPayment(piData.clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: `${formData.firstName} ${formData.lastName}`,
              email: formData.email,
            },
          },
        });

        if (error) { toast.error(error.message); setLoading(false); return; }
        stripePaymentIntentId = paymentIntent.id;
      }

      // Create order
      const orderPayload = {
        customerName: `${formData.firstName} ${formData.lastName}`,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          postalCode: formData.postalCode,
        },
        orderItems: cartItems.map((item) => ({
          product: item.product,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
        })),
        paymentMethod,
        stripePaymentIntentId,
      };

      const { data } = await orderService.create(orderPayload);
      clearCart();
      toast.success('Order placed successfully! 🎉');
      navigate(`/order-success/${data.order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="checkout-form" onSubmit={handleSubmit}>
      <div className="checkout-layout">
        {/* Left: Shipping + Payment */}
        <div className="checkout-left">
          {/* Shipping */}
          <div className="checkout-section">
            <h3>Shipping Information</h3>
            <div className="checkout-grid-2">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input className="form-input" name="firstName" value={formData.firstName} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input className="form-input" name="lastName" value={formData.lastName} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-input" type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input className="form-input" type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Street Address</label>
              <input className="form-input" name="street" value={formData.street} onChange={handleChange} required />
            </div>
            <div className="checkout-grid-2">
              <div className="form-group">
                <label className="form-label">City</label>
                <input className="form-input" name="city" value={formData.city} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">State / Province</label>
                <input className="form-input" name="state" value={formData.state} onChange={handleChange} required />
              </div>
            </div>
            <div className="checkout-grid-2">
              <div className="form-group">
                <label className="form-label">Country</label>
                <input className="form-input" name="country" value={formData.country} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Postal Code</label>
                <input className="form-input" name="postalCode" value={formData.postalCode} onChange={handleChange} required />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="checkout-section">
            <h3>Payment Method</h3>
            <div className="checkout-payment-methods">
              <label className={`checkout-payment-option ${paymentMethod === 'stripe' ? 'active' : ''}`}>
                <input type="radio" value="stripe" checked={paymentMethod === 'stripe'} onChange={(e) => setPaymentMethod(e.target.value)} />
                <span>💳 Credit / Debit Card (Stripe)</span>
              </label>
              <label className={`checkout-payment-option ${paymentMethod === 'cod' ? 'active' : ''}`}>
                <input type="radio" value="cod" checked={paymentMethod === 'cod'} onChange={(e) => setPaymentMethod(e.target.value)} />
                <span>💵 Cash on Delivery</span>
              </label>
            </div>

            {paymentMethod === 'stripe' && (
              <div className="checkout-card-element">
                <label className="form-label">Card Details</label>
                <div className="checkout-stripe-card">
                  <CardElement options={{ style: { base: { fontSize: '15px', color: '#1a1a2e', fontFamily: 'DM Sans, sans-serif', '::placeholder': { color: '#9999aa' } } } }} />
                </div>
                <p className="checkout-stripe-note">🔒 Secured by Stripe. We never store your card details.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Order summary */}
        <div className="checkout-right">
          <div className="checkout-summary">
            <h3>Order Summary</h3>
            <div className="checkout-summary__items">
              {cartItems.map((item) => (
                <div key={`${item.product}-${item.size}`} className="checkout-summary__item">
                  <div className="checkout-summary__img">
                    <img src={item.image || 'https://via.placeholder.com/60'} alt={item.title} onError={(e) => { e.target.src = 'https://via.placeholder.com/60'; }} />
                    <span className="checkout-summary__qty">{item.quantity}</span>
                  </div>
                  <div className="checkout-summary__name">
                    <span>{item.title}</span>
                    <small>{item.size} {item.color && `/ ${item.color}`}</small>
                  </div>
                  <span className="checkout-summary__price">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="checkout-summary__rows">
              <div className="checkout-summary__row">
                <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="checkout-summary__row">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span style={{ color: 'var(--color-success)' }}>Free</span> : `$${shipping}`}</span>
              </div>
              <div className="checkout-summary__total">
                <span>Total</span><span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg checkout-submit" disabled={loading || !stripe}>
              {loading ? 'Processing...' : paymentMethod === 'cod' ? '📦 Place Order (COD)' : `💳 Pay $${total.toFixed(2)}`}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

const CheckoutPage = () => (
  <>
    <Helmet><title>Checkout — SuitingStudio</title></Helmet>
    <Navbar />
    <div className="checkout-page">
      <div className="container">
        <h1 className="checkout-page__title">Checkout</h1>
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      </div>
    </div>
    <Footer />
  </>
);

export default CheckoutPage;
