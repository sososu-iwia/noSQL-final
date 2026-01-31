import React, { useState, useEffect } from "react";
import { analyticsAPI } from "../services/api";

const Analytics = () => {
  const [topRoutes, setTopRoutes] = useState([]);
  const [routesLimit, setRoutesLimit] = useState(10);
  const [routesLoading, setRoutesLoading] = useState(true);
  const [routesError, setRoutesError] = useState("");

  const [airlinesData, setAirlinesData] = useState([]);
  const [minFlights, setMinFlights] = useState(3);
  const [airlinesLoading, setAirlinesLoading] = useState(true);
  const [airlinesError, setAirlinesError] = useState("");

  useEffect(() => {
    loadTopRoutes();
  }, [routesLimit]);

  useEffect(() => {
    loadAirlinesPricing();
  }, [minFlights]);

  const loadTopRoutes = async () => {
    setRoutesLoading(true);
    setRoutesError("");
    try {
      const response = await analyticsAPI.getTopRoutes(routesLimit);
      if (response.data.success) {
        setTopRoutes(response.data.data);
      }
    } catch (err) {
      setRoutesError("Ошибка загрузки данных о маршрутах");
      console.error("Error loading top routes:", err);
    } finally {
      setRoutesLoading(false);
    }
  };

  const loadAirlinesPricing = async () => {
    setAirlinesLoading(true);
    setAirlinesError("");
    try {
      const response = await analyticsAPI.getAirlinesPricing(minFlights);
      if (response.data.success) {
        setAirlinesData(response.data.data);
      }
    } catch (err) {
      setAirlinesError("Ошибка загрузки данных об авиакомпаниях");
      console.error("Error loading airlines pricing:", err);
    } finally {
      setAirlinesLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("ru-RU").format(Math.round(price));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Аналитика рейсов
          </h1>
          <p className="text-gray-600">
            Статистика популярных маршрутов и ценообразование авиакомпаний
          </p>
        </div>

        <div className="mb-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Топ популярных маршрутов
              </h2>
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">
                  Количество:
                </label>
                <select
                  value={routesLimit}
                  onChange={(e) => setRoutesLimit(Number(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            {routesError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {routesError}
              </div>
            )}

            {routesLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : topRoutes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Нет данных о маршрутах</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        #
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Маршрут
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Рейсов
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Средняя цена (Эконом)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Средняя цена (Бизнес)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Диапазон цен (Эконом)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {topRoutes.map((route, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">
                            {route.from} → {route.to}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            {route.flightsCount}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatPrice(route.avgEconomy)} ₸
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatPrice(route.avgBusiness)} ₸
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatPrice(route.minEconomy)} -{" "}
                          {formatPrice(route.maxEconomy)} ₸
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="mb-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Статистика авиакомпаний
              </h2>
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">
                  Минимум рейсов:
                </label>
                <select
                  value={minFlights}
                  onChange={(e) => setMinFlights(Number(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                  <option value={1}>1+</option>
                  <option value={3}>3+</option>
                  <option value={5}>5+</option>
                  <option value={10}>10+</option>
                  <option value={15}>15+</option>
                  <option value={20}>20+</option>
                </select>
              </div>
            </div>

            {airlinesError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {airlinesError}
              </div>
            )}

            {airlinesLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : airlinesData.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  Нет данных об авиакомпаниях с минимум {minFlights} рейсов
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {airlinesData.map((airline, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {airline.operatedBy}
                      </h3>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-600 mr-2">
                          Рейсов:
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {airline.flightsCount}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="bg-green-50 rounded-lg p-3">
                        <div className="text-xs text-gray-600 mb-1">
                          Эконом класс
                        </div>
                        <div className="text-lg font-bold text-green-700">
                          {formatPrice(airline.avgEconomy)} ₸
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {formatPrice(airline.minEconomy)} -{" "}
                          {formatPrice(airline.maxEconomy)} ₸
                        </div>
                      </div>

                      {/* Business Price */}
                      <div className="bg-purple-50 rounded-lg p-3">
                        <div className="text-xs text-gray-600 mb-1">
                          Бизнес класс
                        </div>
                        <div className="text-lg font-bold text-purple-700">
                          {formatPrice(airline.avgBusiness)} ₸
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {formatPrice(airline.minBusiness)} -{" "}
                          {formatPrice(airline.maxBusiness)} ₸
                        </div>
                      </div>

                      {/* Premium Gap */}
                      <div className="bg-yellow-50 rounded-lg p-3">
                        <div className="text-xs text-gray-600 mb-1">
                          Разница (Бизнес - Эконом)
                        </div>
                        <div className="text-lg font-bold text-yellow-700">
                          +{formatPrice(airline.premiumGap)} ₸
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {Math.round(
                            (airline.premiumGap / airline.avgEconomy) * 100,
                          )}
                          % наценка
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start">
            <div className="text-blue-600 text-2xl mr-4">ℹ️</div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                О статистике
              </h3>
              <div className="text-sm text-blue-800 space-y-2">
                <p>
                  <strong>Топ маршрутов:</strong> Показывает самые популярные
                  направления по количеству доступных рейсов. Данные включают
                  среднюю стоимость билетов для обоих классов обслуживания.
                </p>
                <p>
                  <strong>Статистика авиакомпаний:</strong> Анализ ценовой
                  политики различных авиаперевозчиков. "Разница" показывает
                  наценку бизнес-класса относительно экономкласса.
                </p>
                <p className="text-xs text-blue-600 mt-3">
                  * Все цены указаны в тенге (₸). Данные обновляются в реальном
                  времени на основе доступных рейсов.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
