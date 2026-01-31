# Vizier Airways - Backend Documentation

## Overview

Vizier Airways backend is a Node.js/Express RESTful API for an airline ticket booking system. It provides comprehensive functionality for user authentication, flight search, booking management, and payment processing.

## Technology Stack

- **Runtime**: Node.js 20+
- **Framework**: Express.js 5.2.1
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with HTTP-only cookies
- **Validation**: Joi
- **Email**: Nodemailer
- **Package Manager**: pnpm

---

## Database Documentation

### MongoDB Schemas & Collections

#### 1. **User Collection** (`users`)

Stores user account information and authentication data.

**Schema:**
```javascript
{
  username: String (required, unique, 6-12 alphanumeric characters),
  email: String (required, unique),
  password: String (required, bcrypt hashed),
  firstName: String (required, letters only),
  lastName: String (required, letters only),
  phoneNumber: String (required, 10-15 digits),
  role: String (enum: ["user", "admin"], default: "user"),
  
  // Email verification
  verifyOtp: String (default: ""),
  verifyOtpExpireAt: Number (default: 0, timestamp),
  isAccountVerified: Boolean (default: false),
  
  // Password reset
  resetOtp: String (default: ""),
  resetOtpExpireAt: Number (default: 0, timestamp),
  
  createdAt: Date (default: Date.now)
}
```

**Indexes:**
- `username` (unique)
- `email` (unique)

**Example Document:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "username": "john_doe",
  "email": "john@example.com",
  "password": "$2a$10$...", 
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+77001234567",
  "role": "user",
  "isAccountVerified": true,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

---

#### 2. **Flight Collection** (`flights`)

Stores flight route and schedule information.

**Schema:**
```javascript
{
  from: String (required, city code),
  fromAirport: String (required, airport name),
  to: String (required, city code),
  toAirport: String (required, airport name),
  operatedBy: String (required, airline name),
  flightNumber: String (required),
  airplaneType: String (required),
  departureTime: String (required, time format),
  arrivalTime: String (required, time format),
  flightDuration: String (required),
  numberOfTransfers: String (required, "0" for direct),
  EconomPrice: Number (required, price in KZT),
  businessPrice: Number (required, price in KZT),
  createdAt: Date
}
```

**Example Document:**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "from": "ALA",
  "fromAirport": "Almaty International Airport",
  "to": "TSE",
  "toAirport": "Nursultan Nazarbayev International Airport",
  "operatedBy": "Air Astana",
  "flightNumber": "KC101",
  "airplaneType": "Boeing 767",
  "departureTime": "08:00",
  "arrivalTime": "10:30",
  "flightDuration": "2h 30m",
  "numberOfTransfers": "0",
  "EconomPrice": 45000,
  "businessPrice": 95000
}
```

---

#### 3. **Booking Collection** (`bookings`)

Stores flight booking information and passenger details.

**Schema:**
```javascript
{
  user: ObjectId (required, ref: "user"),
  flight: ObjectId (required, ref: "flight"),
  
  passengers: [{
    firstName: String (required),
    lastName: String (required),
    gender: String (required, enum: ["male", "female"])
  }],
  
  cabinClass: String (required, enum: ["economy", "business"]),
  pricePerPassenger: Number (required),
  totalPrice: Number (required),
  status: String (enum: ["pending", "confirmed", "cancelled"], default: "pending"),
  
  payment: ObjectId (ref: "payment", default: null),
  pnr: String (required, unique, 6-character alphanumeric),
  email: String (required, for sending tickets),
  
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

**Indexes:**
- `pnr` (unique)
- `user` (for efficient user booking queries)

**Example Document:**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "user": "507f1f77bcf86cd799439011",
  "flight": "507f1f77bcf86cd799439012",
  "passengers": [
    {
      "firstName": "John",
      "lastName": "Doe",
      "gender": "male"
    }
  ],
  "cabinClass": "economy",
  "pricePerPassenger": 45000,
  "totalPrice": 45000,
  "status": "confirmed",
  "payment": "507f1f77bcf86cd799439014",
  "pnr": "A3B5X9",
  "email": "john@example.com",
  "createdAt": "2024-01-20T14:00:00.000Z",
  "updatedAt": "2024-01-20T14:15:00.000Z"
}
```

---

#### 4. **Payment Collection** (`payments`)

Stores payment transaction information.

**Schema:**
```javascript
{
  booking: ObjectId (required, unique, ref: "booking"),
  user: ObjectId (required, ref: "user"),
  
  amount: Number (required, payment amount),
  currency: String (default: "KZT"),
  
  cardLast4: String (required, last 4 digits of card),
  expMonth: Number (required, 1-12),
  expYear: Number (required, 2025-2100),
  
  status: Boolean (default: false, true = paid),
  
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

**Indexes:**
- `booking` (unique - one payment per booking)

**Example Document:**
```json
{
  "_id": "507f1f77bcf86cd799439014",
  "booking": "507f1f77bcf86cd799439013",
  "user": "507f1f77bcf86cd799439011",
  "amount": 45000,
  "currency": "KZT",
  "cardLast4": "4242",
  "expMonth": 12,
  "expYear": 2025,
  "status": true,
  "createdAt": "2024-01-20T14:15:00.000Z"
}
```

---

### Database Relations

```
┌─────────┐         ┌──────────┐         ┌─────────┐
│  User   │────────>│ Booking  │────────>│ Flight  │
└─────────┘  1:N    └──────────┘   N:1   └─────────┘
     │                    │
     │                    │ 1:1
     │                    v
     │              ┌─────────┐
     └─────────────>│ Payment │
          1:N       └─────────┘
```

**Relationships:**
1. **User → Bookings**: One-to-Many (user can have multiple bookings)
2. **Flight → Bookings**: One-to-Many (flight can have multiple bookings)
3. **Booking → Payment**: One-to-One (booking has one payment)
4. **User → Payments**: One-to-Many (user can have multiple payments)

---

## API Documentation

### Base URL
```
http://localhost:4000/api
```

### Authentication
All protected endpoints require a valid JWT token stored in HTTP-only cookies.

---

### Authentication Endpoints

#### 1. Register User
**POST** `/api/auth/register`

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "MyPassword123!",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+77001234567"
}
```

**Validation Rules:**
- `username`: 6-12 alphanumeric characters
- `email`: valid email format
- `password`: 8-128 characters, must contain uppercase, lowercase, digit, and special character
- `firstName`/`lastName`: letters only (Latin or Cyrillic)
- `phoneNumber`: 10-15 digits with optional +

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully"
}
```

**Response (409):**
```json
{
  "success": false,
  "message": "User already exists"
}
```

---

#### 2. Login
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "MyPassword123!"
}
```
OR
```json
{
  "email": "john@example.com",
  "password": "MyPassword123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful"
}
```

**Sets HTTP-only cookie:**
- Name: `token`
- Max-Age: 24 hours
- HttpOnly: true
- Secure: true (in production)
- SameSite: "none" (in production) / "strict" (in development)

---

#### 3. Logout
**POST** `/api/auth/logout`

**Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

#### 4. Check Authentication
**POST** `/api/auth/is-auth`

**Headers:**
```
Cookie: token=<jwt_token>
```

**Response (200):**
```json
{
  "success": true
}
```

**Response (401):**
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

---

#### 5. Send Verification OTP
**POST** `/api/auth/send-verify-otp`

**Headers:** Requires authentication

**Response (200):**
```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

**Email sent with 6-digit OTP, valid for 10 minutes**

---

#### 6. Verify Email
**POST** `/api/auth/verify-account`

**Headers:** Requires authentication

**Request Body:**
```json
{
  "otp": "123456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

---

#### 7. Send Password Reset OTP
**POST** `/api/auth/send-reset-otp`

**Request Body:**
```json
{
  "otp": "123456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "OTP sent to your email"
}
```

---

#### 8. Reset Password
**POST** `/api/auth/reset-password`

**Request Body:**
```json
{
  "email": "john@example.com",
  "otp": "123456",
  "newPassword": "NewPassword123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password has been changed successfully"
}
```

---

### Flight Endpoints

#### 1. Get All Flights
**POST** `/api/flights/getAllRoutes`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "from": "ALA",
      "fromAirport": "Almaty International Airport",
      "to": "TSE",
      "toAirport": "Nursultan Nazarbayev International Airport",
      "operatedBy": "Air Astana",
      "flightNumber": "KC101",
      "airplaneType": "Boeing 767",
      "departureTime": "08:00",
      "arrivalTime": "10:30",
      "flightDuration": "2h 30m",
      "numberOfTransfers": "0",
      "EconomPrice": 45000,
      "businessPrice": 95000
    }
  ]
}
```

---

#### 2. Search Flights by Route
**POST** `/api/flights/getFlightByRoute`

**Request Body:**
```json
{
  "from": "ALA",
  "to": "TSE"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "from": "ALA",
      "to": "TSE",
      ...
    }
  ]
}
```

**Response (404):**
```json
{
  "success": false,
  "message": "Flights aren't available"
}
```

---

### Booking Endpoints

All booking endpoints require authentication.

#### 1. Create Booking
**POST** `/api/bookings`

**Headers:** Requires authentication

**Request Body:**
```json
{
  "flightId": "507f1f77bcf86cd799439012",
  "cabinClass": "economy",
  "passengers": [
    {
      "firstName": "John",
      "lastName": "Doe",
      "gender": "male"
    },
    {
      "firstName": "Jane",
      "lastName": "Doe",
      "gender": "female"
    }
  ]
}
```

**Validation:**
- `cabinClass`: "economy" or "business"
- `passengers`: array with min 1 passenger
- Each passenger must have firstName, lastName, and gender

**Response (201):**
```json
{
  "success": true,
  "message": "Booking created",
  "booking": {
    "_id": "507f1f77bcf86cd799439013",
    "user": "507f1f77bcf86cd799439011",
    "flight": "507f1f77bcf86cd799439012",
    "passengers": [...],
    "cabinClass": "economy",
    "pricePerPassenger": 45000,
    "totalPrice": 90000,
    "status": "pending",
    "pnr": "A3B5X9",
    "email": "john@example.com",
    "createdAt": "2024-01-20T14:00:00.000Z"
  }
}
```

---

#### 2. Get My Bookings
**GET** `/api/bookings/me`

**Headers:** Requires authentication

**Response (200):**
```json
{
  "success": true,
  "bookings": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "flight": {
        "_id": "507f1f77bcf86cd799439012",
        "from": "ALA",
        "to": "TSE",
        ...
      },
      "passengers": [...],
      "status": "confirmed",
      "pnr": "A3B5X9",
      "totalPrice": 90000,
      ...
    }
  ]
}
```

---

#### 3. Get Booking by ID
**GET** `/api/bookings/:id`

**Headers:** Requires authentication

**Response (200):**
```json
{
  "success": true,
  "booking": {
    "_id": "507f1f77bcf86cd799439013",
    "flight": {...},
    "payment": {...},
    "passengers": [...],
    ...
  }
}
```

**Response (404):**
```json
{
  "success": false,
  "message": "Booking not found"
}
```

---

#### 4. Cancel Booking
**PATCH** `/api/bookings/:id/cancel`

**Headers:** Requires authentication

**Response (200):**
```json
{
  "success": true,
  "message": "Booking cancelled"
}
```

**Response (400):**
```json
{
  "success": false,
  "message": "Confirmed bookings cannot be cancelled here"
}
```

---

### Payment Endpoints

#### Pay for Booking
**POST** `/api/payments/pay`

**Headers:** Requires authentication

**Request Body:**
```json
{
  "bookingId": "507f1f77bcf86cd799439013",
  "cardNumber": "4242424242424242",
  "expMonth": 12,
  "expYear": 2025,
  "cvv": "123"
}
```

**Validation:**
- `cardNumber`: 13-19 digits, validated with Luhn algorithm
- `expMonth`: 1-12
- `expYear`: 2025-2100, card must not be expired
- `cvv`: 3-4 digits

**Response (200):**
```json
{
  "success": true,
  "message": "Payment successful. Ticket sent to email.",
  "bookingId": "507f1f77bcf86cd799439013",
  "paymentId": "507f1f77bcf86cd799439014",
  "pnr": "A3B5X9"
}
```

**After successful payment:**
- Booking status updated to "confirmed"
- E-ticket email sent to user with flight details and PNR
- Payment record created

**Response (400):**
```json
{
  "success": false,
  "message": "Invalid card number"
}
```

---

### Analytics Endpoints

#### 1. Top Flight Routes
**GET** `/api/analytics/flights/top-routes?limit=10`

**Query Parameters:**
- `limit` (optional): Number of routes to return (default: 10, max: 50)

**Response (200):**
```json
{
  "success": true,
  "limit": 10,
  "data": [
    {
      "from": "ALA",
      "to": "TSE",
      "flightsCount": 15,
      "avgEconomy": 45000.50,
      "avgBusiness": 95000.00,
      "minEconomy": 40000,
      "maxEconomy": 50000
    }
  ]
}
```

**Business Logic:**
- Groups flights by route (from → to)
- Counts number of flights per route
- Calculates average, min, max prices for each class
- Sorts by flight count (descending)

---

#### 2. Airlines Pricing Statistics
**GET** `/api/analytics/flights/airlines/pricing?minFlights=3`

**Query Parameters:**
- `minFlights` (optional): Minimum number of flights (default: 1)

**Response (200):**
```json
{
  "success": true,
  "minFlights": 3,
  "data": [
    {
      "operatedBy": "Air Astana",
      "flightsCount": 25,
      "avgEconomy": 48000.00,
      "avgBusiness": 98000.00,
      "premiumGap": 50000.00,
      "minEconomy": 40000,
      "maxEconomy": 60000,
      "minBusiness": 85000,
      "maxBusiness": 110000
    }
  ]
}
```

**Business Logic:**
- Groups flights by airline
- Filters airlines with at least `minFlights` flights
- Calculates pricing statistics
- `premiumGap`: difference between business and economy average prices
- Sorts by flight count (descending) and economy price (ascending)

---

### User Endpoints

#### 1. Get Current User Profile
**GET** `/api/user/profile`

**Headers:** Requires authentication

**Response (200):**
```json
{
  "success": true,
  "user": {
    "username": "john_doe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+77001234567",
    "role": "user",
    "isAccountVerified": true,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

#### 2. Update Current User
**PUT** `/api/user/update`

**Headers:** Requires authentication

**Request Body:**
```json
{
  "firstName": "Johnny",
  "phoneNumber": "+77009876543"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "User updated successfully"
}
```

---

## Architecture & System Design

### System Architecture

```
┌─────────────┐
│   Client    │ (React Frontend)
│  (Browser)  │
└──────┬──────┘
       │ HTTP/REST
       │ (JSON)
       ↓
┌─────────────┐
│   Express   │
│   Server    │
├─────────────┤
│ Middlewares │ ← Cookie Parser, CORS, JSON Parser
├─────────────┤
│   Routes    │ ← /auth, /flights, /bookings, /payments, /analytics
├─────────────┤
│ Controllers │ ← Business Logic Layer
├─────────────┤
│   Models    │ ← Mongoose Schemas
└──────┬──────┘
       │ MongoDB Driver
       ↓
┌─────────────┐
│   MongoDB   │
│  Database   │
└─────────────┘
       ↑
┌──────┴──────┐
│  Nodemailer │ (Email Service)
└─────────────┘
```

### Data Flow

#### 1. **User Registration Flow**

```
Client → POST /api/auth/register
   ↓
Validation Middleware (Joi)
   ↓
Auth Controller
   ↓
├─ Check if user exists
├─ Hash password (bcrypt)
├─ Create user in DB
├─ Generate JWT token
├─ Set HTTP-only cookie
└─ Send welcome email
   ↓
Response to Client
```

#### 2. **Booking Creation Flow**

```
Client → POST /api/bookings
   ↓
Auth Middleware (verify JWT)
   ↓
Validation Middleware
   ↓
Booking Controller
   ↓
├─ Find flight by ID
├─ Get user email
├─ Calculate prices
├─ Generate unique PNR
├─ Create booking in DB
└─ Return booking details
   ↓
Response to Client
```

#### 3. **Payment Processing Flow**

```
Client → POST /api/payments/pay
   ↓
Auth Middleware
   ↓
Validation Middleware
   ↓
Payment Controller
   ↓
├─ Validate card (Luhn algorithm)
├─ Check card expiry
├─ Find booking
├─ Create payment record
├─ Update booking status to "confirmed"
├─ Send e-ticket email
└─ Return payment confirmation
   ↓
Response to Client
```

### Middleware Stack

1. **express.json()** - Parse JSON request bodies
2. **cookieParser()** - Parse cookies from requests
3. **cors()** - Enable CORS with credentials
4. **Error Handler** - Catch JSON syntax errors
5. **authMiddleware** - Verify JWT tokens (protected routes)
6. **validateMiddleware** - Joi schema validation
7. **adminMiddleware** - Check admin role (admin routes)

### Security Features

1. **Authentication:**
   - JWT tokens stored in HTTP-only cookies
   - 24-hour token expiration
   - Secure flag in production
   - SameSite protection

2. **Password Security:**
   - bcrypt hashing with salt rounds (10)
   - Strong password requirements (uppercase, lowercase, digit, special char)
   - Password reset with OTP verification

3. **Input Validation:**
   - Joi schema validation on all inputs
   - SQL injection prevention (Mongoose)
   - XSS protection (sanitized inputs)

4. **Payment Security:**
   - Luhn algorithm for card validation
   - Store only last 4 digits
   - Expiry date validation
   - No CVV storage

5. **Email Verification:**
   - 6-digit OTP
   - 10-minute expiration
   - One-time use tokens

### Email System

**Nodemailer Configuration:**
- SMTP host: smtp.gmail.com
- Port: 587
- Authentication via environment variables

**Email Templates:**
1. Welcome email (on registration)
2. OTP verification email
3. Password reset OTP email
4. E-ticket confirmation (with PNR and flight details)

### Error Handling

**Error Response Format:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error 1", "Detailed error 2"]
}
```

**HTTP Status Codes:**
- 200: Success
- 201: Created
- 400: Bad Request / Validation Error
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 409: Conflict (duplicate resource)
- 500: Internal Server Error

---

## Environment Variables

Create a `.env` file in the backend directory:

```env
# Server
PORT=4000
NODE_ENV=development

# Database
MONGO_PUBLIC_URI=mongodb://localhost:27017/vizier-airways

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Email (Gmail)
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-specific-password
SENDER_EMAIL=your-email@gmail.com
```

**Gmail Setup:**
1. Enable 2-factor authentication
2. Generate App Password (Google Account → Security → App Passwords)
3. Use App Password in SMTP_PASSWORD

---

## Installation & Running

### Prerequisites
- Node.js 20+
- MongoDB 6+
- pnpm (recommended) or npm

### Installation

```bash
cd backend
pnpm install
```

### Running

**Development:**
```bash
pnpm dev
```

**Production:**
```bash
pnpm start
```

Server runs on `http://localhost:4000`

---

## Project Structure

```
backend/
├── app/
│   ├── config/
│   │   ├── connectdb.js          # MongoDB connection
│   │   └── nodemailer.js         # Email configuration
│   ├── controllers/
│   │   ├── auth.controller.js    # Authentication logic
│   │   ├── booking.controller.js # Booking management
│   │   ├── flight.controller.js  # Flight operations
│   │   ├── payment.controller.js # Payment processing
│   │   ├── user.controller.js    # User management
│   │   └── aggregation.controller.js # Analytics
│   ├── middlewares/
│   │   ├── auth.middleware.js    # JWT verification
│   │   ├── admin.middleware.js   # Admin role check
│   │   └── validate.middleware.js # Joi validation
│   ├── models/
│   │   ├── user.model.js         # User schema
│   │   ├── flight.model.js       # Flight schema
│   │   ├── booking.model.js      # Booking schema
│   │   └── payment.model.js      # Payment schema
│   ├── routes/
│   │   ├── auth.routes.js        # Auth endpoints
│   │   ├── flight.routes.js      # Flight endpoints
│   │   ├── booking.routes.js     # Booking endpoints
│   │   ├── payment.routes.js     # Payment endpoints
│   │   ├── user.routes.js        # User endpoints
│   │   └── aggregation.routes.js # Analytics endpoints
│   ├── utils/
│   │   └── cardValidation.js     # Card validation utilities
│   └── validations/
│       ├── auth.validation.js    # Auth schemas
│       ├── booking.validation.js # Booking schemas
│       └── payment.validation.js # Payment schemas
├── .gitignore
├── app.js                        # Express app setup
├── package.json
└── README.md
```

---

## Testing

### Manual Testing with cURL

**Register:**
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test123!@#",
    "firstName": "Test",
    "lastName": "User",
    "phoneNumber": "+77001234567"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "username": "testuser",
    "password": "Test123!@#"
  }'
```

**Get Flights:**
```bash
curl -X POST http://localhost:4000/api/flights/getAllRoutes \
  -H "Content-Type: application/json"
```

**Create Booking:**
```bash
curl -X POST http://localhost:4000/api/bookings \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "flightId": "YOUR_FLIGHT_ID",
    "cabinClass": "economy",
    "passengers": [{
      "firstName": "John",
      "lastName": "Doe",
      "gender": "male"
    }]
  }'
```

---

## Future Enhancements

1. **Seat Selection** - Allow users to select specific seats
2. **Multi-city Flights** - Support for complex itineraries
3. **Loyalty Program** - Points and rewards system
4. **Real-time Notifications** - WebSocket for flight updates
5. **Advanced Search** - Filter by price, duration, stops
6. **Admin Dashboard** - Manage flights, users, bookings
7. **Payment Gateway Integration** - Stripe, PayPal, etc.
8. **File Upload** - Passport/ID document upload
9. **Internationalization** - Multi-language support
10. **Rate Limiting** - Prevent API abuse

---

## License

MIT

---

## Support

For issues or questions, please contact: support@vizierairways.com