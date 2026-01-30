import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { bookingsAPI } from '../services/api';

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadBooking();
  }, [id]);

  const loadBooking = async () => {
    try {
      const response = await bookingsAPI.getBookingById(id);
      if (response.data.success) {
        setBooking(response.data.booking);
      }
    } catch (err) {
      setError('Ошибка загрузки бронирования');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Вы уверены, что хотите отменить это бронирование?')) {
      return;
    }

    try {
      const response = await bookingsAPI.cancelBooking(id);
      if (response.data.success) {
        navigate('/bookings');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Ошибка отмены бронирования');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Бронирование не найдено'}
          </h2>
          <Link
            to="/bookings"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Вернуться к бронированиям
          </Link>
        </div>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            to="/bookings"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Вернуться к бронированиям
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Детали бронирования</h1>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
              {getStatusText(booking.status)}
            </span>
          </div>

          <div className="border-b pb-4 mb-4">
            <div className="text-sm text-gray-600">PNR</div>
            <div className="text-2xl font-mono font-bold text-gray-900">{booking.pnr}</div>
          </div>

          {booking.flight && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Информация о рейсе</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Маршрут</div>
                  <div className="text-lg font-semibold">
                    {booking.flight.fromAirport} → {booking.flight.toAirport}
                  </div>
                  <div className="text-sm text-gray-500">
                    {booking.flight.from} → {booking.flight.to}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Рейс</div>
                  <div className="text-lg font-semibold">
                    {booking.flight.operatedBy} {booking.flight.flightNumber}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Вылет</div>
                  <div className="text-lg">{booking.flight.departureTime}</div>
                  <div className="text-sm text-gray-500">{booking.flight.fromAirport}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Прилет</div>
                  <div className="text-lg">{booking.flight.arrivalTime}</div>
                  <div className="text-sm text-gray-500">{booking.flight.toAirport}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Длительность</div>
                  <div className="text-lg">{booking.flight.flightDuration}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Пересадки</div>
                  <div className="text-lg">
                    {booking.flight.numberOfTransfers === '0' ? 'Прямой рейс' : `${booking.flight.numberOfTransfers} пересадок`}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Тип самолета</div>
                  <div className="text-lg">{booking.flight.airplaneType}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Класс обслуживания</div>
                  <div className="text-lg">
                    {booking.cabinClass === 'economy' ? 'Эконом' : 'Бизнес'}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Пассажиры</h2>
            <div className="space-y-2">
              {booking.passengers.map((passenger, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded">
                  <div className="font-semibold">{index + 1}.</div>
                  <div>
                    <div className="font-medium">
                      {passenger.firstName} {passenger.lastName}
                    </div>
                    <div className="text-sm text-gray-600">
                      {passenger.gender === 'male' ? 'Мужской' : 'Женский'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="text-sm text-gray-600">Цена за пассажира</div>
                <div className="text-lg font-semibold">{booking.pricePerPassenger} ₸</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Итого</div>
                <div className="text-3xl font-bold text-blue-600">{booking.totalPrice} ₸</div>
              </div>
            </div>
          </div>

          {booking.payment && (
            <div className="border-t pt-4 mt-4">
              <h3 className="font-semibold mb-2">Информация об оплате</h3>
              <div className="text-sm text-gray-600">
                Оплата подтверждена. E-ticket отправлен на {booking.email}
              </div>
            </div>
          )}
        </div>

        <div className="flex space-x-4">
          {booking.status === 'pending' && (
            <>
              <Link
                to={`/payment/${booking._id}`}
                className="flex-1 bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 text-center font-semibold"
              >
                Оплатить
              </Link>
              <button
                onClick={handleCancel}
                className="flex-1 bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 font-semibold"
              >
                Отменить бронирование
              </button>
            </>
          )}
          {booking.status === 'confirmed' && (
            <div className="w-full bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              Бронирование подтверждено. E-ticket отправлен на вашу почту.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
