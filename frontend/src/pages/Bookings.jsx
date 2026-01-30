import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingsAPI } from '../services/api';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const response = await bookingsAPI.getMyBookings();
      if (response.data.success) {
        setBookings(response.data.bookings);
      }
    } catch (err) {
      setError('Ошибка загрузки бронирований');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Вы уверены, что хотите отменить это бронирование?')) {
      return;
    }

    try {
      const response = await bookingsAPI.cancelBooking(bookingId);
      if (response.data.success) {
        loadBookings();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Ошибка отмены бронирования');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Подтверждено';
      case 'pending':
        return 'Ожидает оплаты';
      case 'cancelled':
        return 'Отменено';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Мои бронирования</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">✈️</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              У вас пока нет бронирований
            </h2>
            <p className="text-gray-600 mb-6">
              Найдите и забронируйте рейс, чтобы начать путешествие
            </p>
            <Link
              to="/search"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
            >
              Найти рейсы
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusText(booking.status)}
                      </span>
                      <span className="text-sm text-gray-600">
                        PNR: <span className="font-mono font-semibold">{booking.pnr}</span>
                      </span>
                    </div>
                    
                    {booking.flight && (
                      <div className="mb-4">
                        <div className="text-lg font-semibold text-gray-900 mb-2">
                          {booking.flight.fromAirport} → {booking.flight.toAirport}
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div>
                            <span className="font-medium">Рейс:</span> {booking.flight.operatedBy} {booking.flight.flightNumber}
                          </div>
                          <div>
                            <span className="font-medium">Вылет:</span> {booking.flight.departureTime} | 
                            <span className="font-medium ml-2">Прилет:</span> {booking.flight.arrivalTime}
                          </div>
                          <div>
                            <span className="font-medium">Класс:</span> {booking.cabinClass === 'economy' ? 'Эконом' : 'Бизнес'}
                          </div>
                          <div>
                            <span className="font-medium">Пассажиры:</span> {booking.passengers.map(p => `${p.firstName} ${p.lastName}`).join(', ')}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="text-lg font-bold text-blue-600">
                      {booking.totalPrice} ₸
                    </div>
                  </div>

                  <div className="mt-4 md:mt-0 md:ml-6 flex flex-col space-y-2">
                    <Link
                      to={`/bookings/${booking._id}`}
                      className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 text-center"
                    >
                      Подробнее
                    </Link>
                    {booking.status === 'pending' && (
                      <>
                        <Link
                          to={`/payment/${booking._id}`}
                          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 text-center"
                        >
                          Оплатить
                        </Link>
                        <button
                          onClick={() => handleCancel(booking._id)}
                          className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700"
                        >
                          Отменить
                        </button>
                      </>
                    )}
                    {booking.status === 'cancelled' && (
                      <button
                        disabled
                        className="bg-gray-400 text-white px-6 py-2 rounded-md cursor-not-allowed"
                      >
                        Отменено
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;
