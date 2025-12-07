import axios from 'axios';
import { useAuthStore } from '../store/useStore';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    // Debug: log token status
    console.log('API Request:', config.url, 'Token:', token ? 'Present' : 'Missing');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = useAuthStore.getState().refreshToken;
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
          useAuthStore.getState().setToken(data.accessToken);
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          useAuthStore.getState().logout();
          window.location.href = '/login';
        }
      } else {
        useAuthStore.getState().logout();
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
  health: () => api.get('/auth/health'),
};

// User API
export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
  changePassword: (data) => api.put('/user/password', data),
  updatePreferences: (data) => api.put('/user/preferences', data),
  getDashboard: () => api.get('/user/dashboard'),
  getServices: () => api.get('/user/services'),
  getOrders: () => api.get('/user/orders'),
  getOrder: (orderNumber) => api.get(`/user/orders/${orderNumber}`),
  getInvoices: () => api.get('/user/invoices'),
  getTickets: () => api.get('/user/tickets'),
  getTicket: (ticketNumber) => api.get(`/user/tickets/${ticketNumber}`),
  createTicket: (data) => api.post('/user/tickets', data),
  replyTicket: (ticketNumber, message) => api.post(`/user/tickets/${ticketNumber}/reply`, { message }),
};

// Services API
export const servicesAPI = {
  getHostingPlans: () => api.get('/services/hosting'),
  getHostingPlan: (slug) => api.get(`/services/hosting/${slug}`),
  getVPSPlans: () => api.get('/services/vps'),
  getVPSPlan: (slug) => api.get(`/services/vps/${slug}`),
  getCloudPlans: () => api.get('/services/cloud'),
  getCloudPlan: (slug) => api.get(`/services/cloud/${slug}`),
  getDedicatedPlans: () => api.get('/services/dedicated'),
  getDedicatedPlan: (slug) => api.get(`/services/dedicated/${slug}`),
  getSSLCertificates: () => api.get('/services/ssl'),
  getEmailPlans: () => api.get('/services/email'),
  getBackupPlans: () => api.get('/services/backup'),
  getDatacenters: () => api.get('/services/datacenters'),
  getCategories: () => api.get('/services/categories'),
};

// Domains API
export const domainsAPI = {
  getTLDs: () => api.get('/domains/tlds'),
  getPopularTLDs: () => api.get('/domains/tlds/popular'),
  search: (domain) => api.get('/domains/search', { params: { domain } }),
  check: (domain) => api.get(`/domains/check/${domain}`),
  getSuggestions: (keyword) => api.get('/domains/suggestions', { params: { keyword } }),
  getWhois: (domain) => api.get(`/domains/whois/${domain}`),
};

// Checkout API
export const checkoutAPI = {
  calculate: (data) => api.post('/checkout/calculate', data),
  validateCoupon: (code, cart_total) => api.post('/checkout/validate-coupon', { code, cart_total }),
  createOrder: (data) => api.post('/checkout/order', data),
  getPaymentIntent: (orderNumber) => api.post('/checkout/payment-intent', { order_number: orderNumber }),
  confirmPayment: (orderNumber, paymentId) => api.post('/checkout/confirm-payment', { order_number: orderNumber, payment_id: paymentId }),
};

// Settings API
export const settingsAPI = {
  getPublic: () => api.get('/settings/public'),
  getCurrencies: () => api.get('/settings/currencies'),
  getLanguages: () => api.get('/settings/languages'),
  getAnnouncements: (location) => api.get('/settings/announcements', { params: { location } }),
  getFAQs: (category) => api.get('/settings/faqs', { params: { category } }),
};

// Pages API
export const pagesAPI = {
  getAll: () => api.get('/pages'),
  getBySlug: (slug) => api.get(`/pages/${slug}`),
};

// Admin API
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  
  // Users
  getUsers: (params) => api.get('/admin/users', { params }),
  getUser: (id) => api.get(`/admin/users/${id}`),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  
  // Orders
  getOrders: (params) => api.get('/admin/orders', { params }),
  updateOrder: (id, data) => api.put(`/admin/orders/${id}`, data),
  
  // Hosting Plans
  getHostingPlans: () => api.get('/admin/hosting-plans'),
  createHostingPlan: (data) => api.post('/admin/hosting-plans', data),
  updateHostingPlan: (id, data) => api.put(`/admin/hosting-plans/${id}`, data),
  deleteHostingPlan: (id) => api.delete(`/admin/hosting-plans/${id}`),
  
  // VPS Plans
  getVPSPlans: () => api.get('/admin/vps-plans'),
  createVPSPlan: (data) => api.post('/admin/vps-plans', data),
  updateVPSPlan: (id, data) => api.put(`/admin/vps-plans/${id}`, data),
  
  // Domain TLDs
  getDomainTLDs: () => api.get('/admin/domain-tlds'),
  createDomainTLD: (data) => api.post('/admin/domain-tlds', data),
  updateDomainTLD: (id, data) => api.put(`/admin/domain-tlds/${id}`, data),
  
  // Support Tickets
  getTickets: (params) => api.get('/admin/tickets', { params }),
  getTicket: (id) => api.get(`/admin/tickets/${id}`),
  replyTicket: (id, message) => api.post(`/admin/tickets/${id}/reply`, { message }),
  updateTicket: (id, data) => api.put(`/admin/tickets/${id}`, data),
  
  // Settings
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (settings) => api.put('/admin/settings', { settings }),
  
  // Pages
  getPages: () => api.get('/admin/pages'),
  createPage: (data) => api.post('/admin/pages', data),
  updatePage: (id, data) => api.put(`/admin/pages/${id}`, data),
  deletePage: (id) => api.delete(`/admin/pages/${id}`),
  
  // Coupons
  getCoupons: () => api.get('/admin/coupons'),
  createCoupon: (data) => api.post('/admin/coupons', data),
  updateCoupon: (id, data) => api.put(`/admin/coupons/${id}`, data),
  deleteCoupon: (id) => api.delete(`/admin/coupons/${id}`),
  
  // Activity Logs
  getActivityLogs: (params) => api.get('/admin/activity-logs', { params }),
  
  // Upload
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getMedia: (params) => api.get('/upload/media', { params }),
  deleteMedia: (id) => api.delete(`/upload/media/${id}`),
};

export default api;
