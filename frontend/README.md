# Vizier Airways - Frontend

Современный фронтенд для системы бронирования авиабилетов.

## Технологии

- React 18
- React Router DOM
- Axios
- Tailwind CSS
- Vite

## Установка

```bash
cd frontend
npm install
# или
pnpm install
```

## Запуск

```bash
npm run dev
# или
pnpm dev
```

Приложение будет доступно по адресу: http://localhost:3000

## Структура проекта

```
src/
├── components/      # Переиспользуемые компоненты
│   ├── Navbar.jsx
│   └── ProtectedRoute.jsx
├── context/        # React Context для управления состоянием
│   └── AuthContext.jsx
├── pages/          # Страницы приложения
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── FlightSearch.jsx
│   ├── CreateBooking.jsx
│   ├── Bookings.jsx
│   ├── BookingDetails.jsx
│   └── Payment.jsx
├── services/       # API сервисы
│   └── api.js
├── App.jsx         # Главный компонент приложения
├── main.jsx        # Точка входа
└── index.css       # Глобальные стили
```

## Функциональность

- ✅ Регистрация и авторизация пользователей
- ✅ Поиск рейсов по маршруту
- ✅ Бронирование рейсов с указанием пассажиров
- ✅ Просмотр списка бронирований
- ✅ Детальная информация о бронировании
- ✅ Оплата бронирования банковской картой
- ✅ Отмена бронирований

## API Endpoints

Приложение использует следующие API endpoints:

- `/api/auth/*` - Аутентификация
- `/api/flights/*` - Рейсы
- `/api/bookings/*` - Бронирования
- `/api/payments/*` - Оплата

## Настройка

Убедитесь, что бэкенд запущен на порту 4000. Прокси настроен в `vite.config.js` для автоматической переадресации запросов к `/api` на бэкенд.
