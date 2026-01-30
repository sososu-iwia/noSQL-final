import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  isAuthenticated: () => api.post('/auth/is-auth'),
  sendVerifyOtp: () => api.post('/auth/send-verify-otp'),
  verifyEmail: (otp) => api.post('/auth/verify-account', { otp }),
  sendResetOtp: (email) => api.post('/auth/send-reset-otp', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};
export const flightsAPI = {
  getAllRoutes: () => api.post('/flights/getAllRoutes'),
  getFlightByRoute: (from, to) => api.post('/flights/getFlightByRoute', { from, to }),
};
export const bookingsAPI = {
  createBooking: (data) => api.post('/bookings', data),
  getMyBookings: () => api.get('/bookings/me'),
  getBookingById: (id) => api.get(`/bookings/${id}`),
  cancelBooking: (id) => api.patch(`/bookings/${id}/cancel`),
};
export const paymentsAPI = {
  payBooking: (data) => api.post('/payments/pay', data),
};

export default api;
