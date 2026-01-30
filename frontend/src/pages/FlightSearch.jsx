import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { flightsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const FlightSearch = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [allFlights, setAllFlights] = useState([]);
  const [uniqueCities, setUniqueCities] = useState({ from: [], to: [] });
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadAllFlights();
  }, []);

  const loadAllFlights = async () => {
    try {
      const response = await flightsAPI.getAllRoutes();
      if (response.data.success) {
        setAllFlights(response.data.data);
        const fromCities = [...new Set(response.data.data.map(f => f.from))];
        const toCities = [...new Set(response.data.data.map(f => f.to))];
        setUniqueCities({ from: fromCities, to: toCities });
      }
    } catch (err) {
      console.error('Error loading flights:', err);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!from || !to) {
      setError('Пожалуйста, выберите пункты отправления и назначения');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await flightsAPI.getFlightByRoute(from, to);
      if (response.data.success) {
        setFlights(response.data.data);
        if (response.data.data.length === 0) {
          setError('Рейсы по данному маршруту не найдены');
        }
      }
    } catch (err) {
      setError('Ошибка при поиске рейсов');
    } finally {
      setLoading(false);
    }
  };

  const handleBook = (flightId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/book-flight/${flightId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Поиск рейсов</h1>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSearch} className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Откуда
              </label>
              <select
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Выберите город</option>
                {uniqueCities.from.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Куда
              </label>
              <select
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Выберите город</option>
                {uniqueCities.to.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Поиск...' : 'Найти рейсы'}
              </button>
            </div>
          </form>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Flight Results */}
        {flights.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Найденные рейсы ({flights.length})
            </h2>
            {flights.map((flight) => (
              <div key={flight._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          {flight.departureTime}
                        </div>
                        <div className="text-sm text-gray-600">{flight.fromAirport}</div>
                        <div className="text-sm text-gray-500">{flight.from}</div>
                      </div>
                      <div className="flex-1 text-center">
                        <div className="text-sm text-gray-500">{flight.flightDuration}</div>
                        <div className="border-t-2 border-gray-300 my-2"></div>
                        <div className="text-xs text-gray-500">
                          {flight.numberOfTransfers === '0' ? 'Прямой рейс' : `${flight.numberOfTransfers} пересадок`}
                        </div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          {flight.arrivalTime}
                        </div>
                        <div className="text-sm text-gray-600">{flight.toAirport}</div>
                        <div className="text-sm text-gray-500">{flight.to}</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Рейс:</span> {flight.operatedBy} {flight.flightNumber} | 
                      <span className="font-medium ml-2">Самолет:</span> {flight.airplaneType}
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 md:ml-6">
                    <div className="text-right mb-4">
                      <div className="text-2xl font-bold text-blue-600">
                        {flight.EconomPrice} ₸
                      </div>
                      <div className="text-sm text-gray-600">Эконом класс</div>
                      <div className="text-lg font-semibold text-gray-800 mt-2">
                        {flight.businessPrice} ₸
                      </div>
                      <div className="text-sm text-gray-600">Бизнес класс</div>
                    </div>
                    <button
                      onClick={() => handleBook(flight._id)}
                      className="w-full bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Забронировать
                    </button>
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

export default FlightSearch;
