// src/context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext(null);
const CART_KEY = 'suitingstudio_cart';

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    } catch { return []; }
  });

  // Persist to localStorage on every change
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item to cart
  const addToCart = useCallback((product, size, color, quantity = 1) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.product === product._id && item.size === size && item.color === color
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        toast.success('Cart updated!');
        return updated;
      }

      toast.success('Added to cart!');
      return [
        ...prev,
        {
          product: product._id,
          title: product.title,
          image: product.images?.[0]?.url || '',
          size,
          color,
          quantity,
          price: product.discountPrice || product.originalPrice,
          stock: product.stock,
        },
      ];
    });
  }, []);

  // Remove item
  const removeFromCart = useCallback((productId, size, color) => {
    setCartItems((prev) =>
      prev.filter((i) => !(i.product === productId && i.size === size && i.color === color))
    );
    toast.success('Removed from cart');
  }, []);

  // Update quantity
  const updateQuantity = useCallback((productId, size, color, quantity) => {
    setCartItems((prev) =>
      prev.map((i) =>
        i.product === productId && i.size === size && i.color === color
          ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock)) }
          : i
      )
    );
  }, []);

  // Clear cart
  const clearCart = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem(CART_KEY);
  }, []);

  const cartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);
  const subtotal = cartItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const shipping = subtotal > 100 ? 0 : subtotal > 0 ? 10 : 0;
  const total = subtotal + shipping;

  return (
    <CartContext.Provider value={{
      cartItems, addToCart, removeFromCart, updateQuantity, clearCart,
      cartCount, subtotal, shipping, total,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
};
