// src/services/orderService.js
import api from './api';

export const orderService = {
  create: (data) => api.post('/orders', data),
  createPaymentIntent: (amount) => api.post('/orders/payment-intent', { amount }),
  getMyOrders: () => api.get('/orders/myorders'),
  getById: (id) => api.get(`/orders/${id}`),
  // Admin
  getAll: (params) => api.get('/admin/orders', { params }),
  updateStatus: (id, data) => api.put(`/admin/orders/${id}/status`, data),
  getStats: () => api.get('/admin/stats'),
};
