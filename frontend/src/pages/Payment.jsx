import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingsAPI, paymentsAPI } from '../services/api';

const Payment = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    cardNumber: '',
    expMonth: '',
    expYear: '',
  });

  useEffect(() => {
    loadBooking();
  }, [bookingId]);

  const loadBooking = async () => {
    try {
      const response = await bookingsAPI.getBookingById(bookingId);
      if (response.data.success) {
        const bookingData = response.data.booking;
        if (bookingData.status === 'confirmed') {
          navigate(`/bookings/${bookingId}`);
          return;
        }
        setBooking(bookingData);
      }
    } catch (err) {
      setError('Ошибка загрузки бронирования');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    let value = e.target.value;
    
    if (e.target.name === 'cardNumber') {
      // Remove spaces and limit to 16 digits
      value = value.replace(/\s/g, '').replace(/\D/g, '').slice(0, 16);
      // Add spaces every 4 digits
      value = value.replace(/(.{4})/g, '$1 ').trim();
    } else if (e.target.name === 'expMonth') {
      value = value.replace(/\D/g, '').slice(0, 2);
      if (value && parseInt(value) > 12) {
        value = '12';
      }
    } else if (e.target.name === 'expYear') {
      value = value.replace(/\D/g, '').slice(0, 4);
    }

    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    const cardNumber = formData.cardNumber.replace(/\s/g, '');
    if (cardNumber.length !== 16) {
      setError('Номер карты должен содержать 16 цифр');
      return;
    }

    if (!formData.expMonth || formData.expMonth.length !== 2) {
      setError('Введите месяц (MM)');
      return;
    }

    if (!formData.expYear || formData.expYear.length !== 4) {
      setError('Введите год (YYYY)');
      return;
    }

    setSubmitting(true);
    try {
      const response = await paymentsAPI.payBooking({
        bookingId,
        cardNumber: cardNumber,
        expMonth: parseInt(formData.expMonth),
        expYear: parseInt(formData.expYear),
      });

      if (response.data.success) {
        alert(`Оплата успешна! PNR: ${response.data.pnr}\nE-ticket отправлен на вашу почту.`);
        navigate(`/bookings/${bookingId}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка оплаты');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{error}</h2>
          <button
            onClick={() => navigate('/bookings')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Вернуться к бронированиям
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => navigate(`/bookings/${bookingId}`)}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Вернуться к бронированию
          </button>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Оплата бронирования</h1>

        {/* Booking Summary */}
        {booking && booking.flight && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Сводка бронирования</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Маршрут:</span>
                <span className="font-semibold">
                  {booking.flight.fromAirport} → {booking.flight.toAirport}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Рейс:</span>
                <span className="font-semibold">
                  {booking.flight.operatedBy} {booking.flight.flightNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Пассажиры:</span>
                <span className="font-semibold">{booking.passengers.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Класс:</span>
                <span className="font-semibold">
                  {booking.cabinClass === 'economy' ? 'Эконом' : 'Бизнес'}
                </span>
              </div>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">К оплате:</span>
                <span className="text-3xl font-bold text-blue-600">{booking.totalPrice} ₸</span>
              </div>
            </div>
          </div>
        )}

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <h2 className="text-xl font-semibold mb-4">Данные карты</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Номер карты *
              </label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                placeholder="1234 5678 9012 3456"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-mono"
                maxLength={19}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Месяц (MM) *
                </label>
                <input
                  type="text"
                  name="expMonth"
                  value={formData.expMonth}
                  onChange={handleChange}
                  placeholder="12"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  maxLength={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Год (YYYY) *
                </label>
                <input
                  type="text"
                  name="expYear"
                  value={formData.expYear}
                  onChange={handleChange}
                  placeholder="2025"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  maxLength={4}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 border-t pt-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-start">
                <div className="text-blue-600 mr-2">ℹ️</div>
                <div className="text-sm text-blue-800">
                  <strong>Безопасность:</strong> Данные карты обрабатываются безопасно. 
                  Последние 4 цифры карты будут сохранены для подтверждения оплаты.
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 font-semibold text-lg"
            >
              {submitting ? 'Обработка оплаты...' : `Оплатить ${booking?.totalPrice || 0} ₸`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Payment;
