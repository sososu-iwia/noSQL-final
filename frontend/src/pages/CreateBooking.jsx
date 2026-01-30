import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { flightsAPI, bookingsAPI } from '../services/api';

const CreateBooking = () => {
  const { flightId } = useParams();
  const navigate = useNavigate();
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [cabinClass, setCabinClass] = useState('economy');
  const [passengerCount, setPassengerCount] = useState(1);
  const [passengers, setPassengers] = useState([
    { firstName: '', lastName: '', gender: 'male' }
  ]);

  useEffect(() => {
    loadFlight();
  }, [flightId]);

  const loadFlight = async () => {
    try {
      const response = await flightsAPI.getAllRoutes();
      if (response.data.success) {
        const foundFlight = response.data.data.find(f => f._id === flightId);
        if (foundFlight) {
          setFlight(foundFlight);
        } else {
          setError('Рейс не найден');
        }
      }
    } catch (err) {
      setError('Ошибка загрузки рейса');
    } finally {
      setLoading(false);
    }
  };

  const handlePassengerCountChange = (count) => {
    const newCount = parseInt(count);
    setPassengerCount(newCount);
    const newPassengers = [];
    for (let i = 0; i < newCount; i++) {
      newPassengers.push(passengers[i] || { firstName: '', lastName: '', gender: 'male' });
    }
    setPassengers(newPassengers);
  };

  const handlePassengerChange = (index, field, value) => {
    const newPassengers = [...passengers];
    newPassengers[index][field] = value;
    setPassengers(newPassengers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    for (let i = 0; i < passengers.length; i++) {
      if (!passengers[i].firstName || !passengers[i].lastName) {
        setError('Заполните данные всех пассажиров');
        return;
      }
    }

    setSubmitting(true);
    try {
      const response = await bookingsAPI.createBooking({
        flightId,
        cabinClass,
        passengers,
      });

      if (response.data.success) {
        navigate(`/payment/${response.data.booking._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка создания бронирования');
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

  if (!flight) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Рейс не найден</h2>
          <button
            onClick={() => navigate('/search')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Вернуться к поиску
          </button>
        </div>
      </div>
    );
  }

  const totalPrice = (cabinClass === 'business' ? flight.businessPrice : flight.EconomPrice) * passengerCount;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Бронирование рейса</h1>

        {/* Flight Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Информация о рейсе</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600">Маршрут</div>
              <div className="text-lg font-semibold">
                {flight.fromAirport} → {flight.toAirport}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Рейс</div>
              <div className="text-lg font-semibold">
                {flight.operatedBy} {flight.flightNumber}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Вылет</div>
              <div className="text-lg">{flight.departureTime}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Прилет</div>
              <div className="text-lg">{flight.arrivalTime}</div>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Класс обслуживания
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="economy"
                  checked={cabinClass === 'economy'}
                  onChange={(e) => setCabinClass(e.target.value)}
                  className="mr-2"
                />
                <span>Эконом ({flight.EconomPrice} ₸)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="business"
                  checked={cabinClass === 'business'}
                  onChange={(e) => setCabinClass(e.target.value)}
                  className="mr-2"
                />
                <span>Бизнес ({flight.businessPrice} ₸)</span>
              </label>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Количество пассажиров
            </label>
            <select
              value={passengerCount}
              onChange={(e) => handlePassengerCountChange(e.target.value)}
              className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {[1, 2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'пассажир' : 'пассажиров'}</option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Данные пассажиров</h3>
            <div className="space-y-4">
              {passengers.map((passenger, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium mb-3">Пассажир {index + 1}</h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Имя *
                      </label>
                      <input
                        type="text"
                        required
                        value={passenger.firstName}
                        onChange={(e) => handlePassengerChange(index, 'firstName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Фамилия *
                      </label>
                      <input
                        type="text"
                        required
                        value={passenger.lastName}
                        onChange={(e) => handlePassengerChange(index, 'lastName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Пол *
                      </label>
                      <select
                        value={passenger.gender}
                        onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="male">Мужской</option>
                        <option value="female">Женский</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Итого:</span>
              <span className="text-2xl font-bold text-blue-600">{totalPrice} ₸</span>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 font-semibold"
            >
              {submitting ? 'Создание бронирования...' : 'Продолжить к оплате'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBooking;
