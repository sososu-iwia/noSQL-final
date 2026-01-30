import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Добро пожаловать в Vizier Airways
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Найдите и забронируйте лучшие авиабилеты по выгодным ценам
            </p>
            <Link
              to="/search"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 transition"
            >
              Найти рейсы
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">Поиск рейсов</h3>
            <p className="text-gray-600">
              Найдите подходящие рейсы по маршруту, дате и цене
            </p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-4">✈️</div>
            <h3 className="text-xl font-semibold mb-2">Быстрое бронирование</h3>
            <p className="text-gray-600">
              Забронируйте билеты за несколько простых шагов
            </p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-4">💳</div>
            <h3 className="text-xl font-semibold mb-2">Безопасная оплата</h3>
            <p className="text-gray-600">
              Безопасная оплата картой с мгновенным подтверждением
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!isAuthenticated && (
        <div className="bg-gray-100 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Начните путешествовать уже сегодня</h2>
            <p className="text-gray-600 mb-8">
              Зарегистрируйтесь, чтобы управлять своими бронированиями
            </p>
            <Link
              to="/register"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
            >
              Зарегистрироваться
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
