// src/pages/CartPage.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiTrash2, FiArrowLeft, FiShoppingBag } from 'react-icons/fi';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './CartPage.css';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, subtotal, shipping, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <>
      <Helmet><title>Cart — SuitingStudio</title></Helmet>
      <Navbar />

      <div className="cart-page">
        <div className="container">
          <h1 className="cart-page__title">Shopping Cart ({cartItems.length})</h1>

          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <FiShoppingBag size={64} className="cart-empty__icon" />
              <h2>Your cart is empty</h2>
              <p>Looks like you haven't added anything to your cart yet.</p>
              <Link to="/shop" className="btn btn-primary btn-lg">Start Shopping</Link>
            </div>
          ) : (
            <div className="cart-layout">
              {/* Items */}
              <div className="cart-items">
                <div className="cart-items__header">
                  <span>Product</span>
                  <span>Price</span>
                  <span>Quantity</span>
                  <span>Total</span>
                  <span />
                </div>

                {cartItems.map((item) => (
                  <div key={`${item.product}-${item.size}-${item.color}`} className="cart-item">
                    <div className="cart-item__product">
                      <div className="cart-item__img">
                        <img
                          src={item.image || 'https://via.placeholder.com/80x100'}
                          alt={item.title}
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/80x100'; }}
                        />
                      </div>
                      <div className="cart-item__details">
                        <Link to={`/product/${item.product}`} className="cart-item__name">{item.title}</Link>
                        <div className="cart-item__variants">
                          {item.size && <span>Size: {item.size}</span>}
                          {item.color && <span>Color: {item.color}</span>}
                        </div>
                      </div>
                    </div>

                    <span className="cart-item__price">${item.price}</span>

                    <div className="cart-item__qty">
                      <button onClick={() => updateQuantity(item.product, item.size, item.color, item.quantity - 1)}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product, item.size, item.color, item.quantity + 1)}>+</button>
                    </div>

                    <span className="cart-item__total">${(item.price * item.quantity).toFixed(2)}</span>

                    <button
                      className="cart-item__remove"
                      onClick={() => removeFromCart(item.product, item.size, item.color)}
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                ))}

                <div className="cart-items__footer">
                  <Link to="/shop" className="btn btn-secondary btn-sm">
                    <FiArrowLeft size={14} /> Continue Shopping
                  </Link>
                  <button className="btn btn-secondary btn-sm" onClick={clearCart}>
                    Clear Cart
                  </button>
                </div>
              </div>

              {/* Summary */}
              <div className="cart-summary">
                <h3>Order Summary</h3>
                <div className="cart-summary__row">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="cart-summary__row">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? <span style={{ color: 'var(--color-success)' }}>Free</span> : `$${shipping}`}</span>
                </div>
                {shipping > 0 && (
                  <p className="cart-summary__shipping-note">
                    Add ${(100 - subtotal).toFixed(2)} more for free shipping!
                  </p>
                )}
                <div className="cart-summary__divider" />
                <div className="cart-summary__total">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <button className="btn btn-primary btn-lg cart-summary__btn" onClick={handleCheckout}>
                  Proceed to Checkout
                </button>
                <div className="cart-summary__secure">
                  🔒 Secure, encrypted checkout
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CartPage;
