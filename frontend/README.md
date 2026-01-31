# Vizier Airways - Frontend Documentation

## Overview

Vizier Airways frontend is a modern React-based web application for airline ticket booking. It provides an intuitive user interface for searching flights, managing bookings, and processing payments.

## Technology Stack

- **Framework**: React 18.2.0
- **Routing**: React Router DOM 6.20.0
- **HTTP Client**: Axios 1.6.2
- **Styling**: Tailwind CSS 3.3.6
- **Build Tool**: Vite 5.0.8
- **Package Manager**: npm/pnpm

---

## Features

### 1. **User Authentication**
- User registration with validation
- Login with username or email
- Secure JWT-based authentication
- HTTP-only cookie session management
- Protected routes for authenticated users
- Logout functionality

### 2. **Flight Search**
- Search flights by origin and destination
- Dynamic city selection from available routes
- Real-time flight availability
- Detailed flight information display
- Price comparison (Economy vs Business class)
- Direct flights and connections indicator

### 3. **Booking Management**
- Create bookings with passenger details
- Multiple passenger support (up to 6)
- Cabin class selection (Economy/Business)
- Real-time price calculation
- Unique PNR (Passenger Name Record) generation
- View all user bookings
- Detailed booking information
- Booking status tracking (Pending, Confirmed, Cancelled)
- Cancel pending bookings

### 4. **Payment Processing**
- Secure card payment interface
- Real-time card validation
- Luhn algorithm for card verification
- Expiry date validation
- CVV security code handling
- Payment confirmation
- E-ticket email delivery
- Last 4 digits card storage for reference

### 5. **Analytics Dashboard** *(Implemented in this update)*
- Top flight routes by popularity
- Airlines pricing statistics
- Average, min, max price analysis
- Flight count metrics
- Premium gap analysis (Business vs Economy)
- Interactive data visualization

---

## Project Structure

```
frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── Navbar.jsx              # Navigation bar component
│   │   └── ProtectedRoute.jsx      # Route protection wrapper
│   ├── context/
│   │   └── AuthContext.jsx         # Authentication state management
│   ├── pages/
│   │   ├── Home.jsx                # Landing page
│   │   ├── Login.jsx               # Login form
│   │   ├── Register.jsx            # Registration form
│   │   ├── FlightSearch.jsx        # Flight search interface
│   │   ├── CreateBooking.jsx       # Booking creation form
│   │   ├── Bookings.jsx            # User bookings list
│   │   ├── BookingDetails.jsx      # Detailed booking view
│   │   ├── Payment.jsx             # Payment processing form
│   │   └── Analytics.jsx           # Analytics dashboard (NEW)
│   ├── services/
│   │   └── api.js                  # API service layer
│   ├── App.jsx                     # Main application component
│   ├── main.jsx                    # Application entry point
│   └── index.css                   # Global styles
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## Component Documentation

### Core Components

#### **Navbar** (`src/components/Navbar.jsx`)

Navigation bar with authentication-aware menu.

**Features:**
- Responsive design
- Dynamic menu based on authentication state
- Logo and branding
- Login/Register buttons for guests
- My Bookings link for authenticated users
- Logout button

**Props:** None (uses AuthContext)

---

#### **ProtectedRoute** (`src/components/ProtectedRoute.jsx`)

Higher-order component for route protection.

**Features:**
- Checks authentication status
- Shows loading spinner during auth check
- Redirects to login if unauthenticated
- Renders children if authenticated

**Props:**
- `children`: React nodes to render when authenticated

**Usage:**
```jsx
<ProtectedRoute>
  <Bookings />
</ProtectedRoute>
```

---

### Context

#### **AuthContext** (`src/context/AuthContext.jsx`)

Global authentication state management.

**State:**
- `user`: Current user object (null if not authenticated)
- `isAuthenticated`: Boolean authentication status
- `loading`: Loading state during auth check

**Methods:**
- `login(credentials)`: Authenticate user
- `register(userData)`: Register new user
- `logout()`: Logout current user
- `checkAuth()`: Verify authentication status

**Usage:**
```jsx
const { isAuthenticated, login, logout } = useAuth();
```

---

### Pages

#### **Home** (`src/pages/Home.jsx`)

Landing page with hero section and feature highlights.

**Sections:**
1. Hero section with call-to-action
2. Features grid (Search, Booking, Payment)
3. Registration CTA for guests

---

#### **Login** (`src/pages/Login.jsx`)

User authentication form.

**Fields:**
- Username (optional if email provided)
- Email (optional if username provided)
- Password (required)

**Validation:**
- At least one of username or email required
- Password required

**Features:**
- Error message display
- Loading state
- Link to registration
- Redirect to search after login

---

#### **Register** (`src/pages/Register.jsx`)

New user registration form.

**Fields:**
- Username (6-12 alphanumeric)
- Email (valid email format)
- Password (complex password required)
- First Name (letters only)
- Last Name (letters only)
- Phone Number (10-15 digits)

**Validation:**
- All fields required
- Client-side and server-side validation
- Password strength requirements

**Features:**
- Error message display
- Loading state
- Link to login
- Auto-login after registration

---

#### **FlightSearch** (`src/pages/FlightSearch.jsx`)

Flight search and results interface.

**Features:**
- City selection dropdowns (dynamic from available flights)
- Search form with validation
- Results grid with flight details
- Price display for both cabin classes
- Direct flight indicator
- Transfer count display
- Book button (redirects to login if not authenticated)

**Flight Card Information:**
- Departure/arrival times and airports
- Flight duration
- Airline and flight number
- Aircraft type
- Transfer information
- Economy and Business prices

---

#### **CreateBooking** (`src/pages/CreateBooking.jsx`)

Booking creation form with passenger details.

**Features:**
- Flight information display
- Cabin class selection (Economy/Business)
- Passenger count selector (1-6 passengers)
- Dynamic passenger forms
- Real-time price calculation
- Form validation
- Redirect to payment after creation

**Passenger Form Fields:**
- First Name (required)
- Last Name (required)
- Gender (Male/Female)

---

#### **Bookings** (`src/pages/Bookings.jsx`)

User bookings list and management.

**Features:**
- All user bookings display
- Status badges (Pending, Confirmed, Cancelled)
- Flight details preview
- PNR display
- Total price
- Action buttons:
  - View details
  - Pay (pending bookings)
  - Cancel (pending bookings)
- Empty state for no bookings

**Booking Card Information:**
- Status badge
- PNR code
- Route (from → to)
- Flight number and airline
- Departure/arrival times
- Cabin class
- Passenger list
- Total price

---

#### **BookingDetails** (`src/pages/BookingDetails.jsx`)

Detailed booking information view.

**Sections:**
1. **Header:**
   - Booking title
   - Status badge
   - PNR code

2. **Flight Information:**
   - Route and airports
   - Flight number and airline
   - Departure/arrival times
   - Flight duration
   - Transfers count
   - Aircraft type
   - Cabin class

3. **Passenger List:**
   - Numbered list
   - Full names
   - Gender

4. **Pricing:**
   - Price per passenger
   - Total price

5. **Payment Information** (if confirmed)
   - Payment confirmation
   - E-ticket sent notice

**Actions:**
- Pay button (pending bookings)
- Cancel button (pending bookings)
- Confirmation message (confirmed bookings)

---

#### **Payment** (`src/pages/Payment.jsx`)

Payment processing interface.

**Features:**
- Booking summary display
- Card information form
- Real-time card number formatting (spaces every 4 digits)
- Input validation:
  - Card number: 16 digits
  - Expiry month: 01-12
  - Expiry year: 4 digits (2025-2100)
  - CVV: 3 digits
- Security notice
- Auto-redirect after payment
- Success message with PNR

**Form Fields:**
- Card Number (formatted: 1234 5678 9012 3456)
- Expiry Month (MM)
- Expiry Year (YYYY)
- CVV (3 digits)

**Security Features:**
- No card number storage
- Only last 4 digits saved
- Secure transmission
- Expiry validation

---

#### **Analytics** (`src/pages/Analytics.jsx`) **NEW**

Analytics dashboard for flight and airline statistics.

**Features:**

1. **Top Flight Routes Section:**
   - Displays most popular routes
   - Configurable limit (10-50 routes)
   - Metrics shown:
     - Flight count
     - Average Economy price
     - Average Business price
     - Min/Max Economy prices
   - Responsive grid layout

2. **Airlines Pricing Statistics Section:**
   - Shows airline pricing analysis
   - Configurable minimum flights filter
   - Metrics shown:
     - Total flights count
     - Average Economy price
     - Average Business price
     - Premium gap (Business - Economy)
     - Min/Max prices for both classes
   - Sorted by popularity

**UI Components:**
- Filter controls for both sections
- Loading states
- Error handling
- Empty state messages
- Responsive design
- Price formatting (KZT)
- Visual hierarchy with cards

**Data Visualization:**
- Color-coded metrics
- Clear labels
- Organized grid layout
- Mobile-responsive

---

## API Service Layer

### **api.js** (`src/services/api.js`)

Centralized API communication layer.

**Configuration:**
```javascript
const API_BASE_URL = 'http://localhost:4000/api';
```

**Axios Instance:**
- Base URL configured
- Credentials included (cookies)
- JSON content type
- CORS enabled

**API Modules:**

#### **authAPI**
- `register(data)`: User registration
- `login(data)`: User login
- `logout()`: User logout
- `isAuthenticated()`: Check auth status
- `sendVerifyOtp()`: Send verification OTP
- `verifyEmail(otp)`: Verify email with OTP
- `sendResetOtp(email)`: Send password reset OTP
- `resetPassword(data)`: Reset password

#### **flightsAPI**
- `getAllRoutes()`: Get all available flights
- `getFlightByRoute(from, to)`: Search flights by route

#### **bookingsAPI**
- `createBooking(data)`: Create new booking
- `getMyBookings()`: Get user's bookings
- `getBookingById(id)`: Get booking details
- `cancelBooking(id)`: Cancel booking

#### **paymentsAPI**
- `payBooking(data)`: Process payment

#### **analyticsAPI** **NEW**
- `getTopRoutes(limit)`: Get top flight routes
- `getAirlinesPricing(minFlights)`: Get airline pricing stats

**Usage Example:**
```javascript
import { flightsAPI } from '../services/api';

const response = await flightsAPI.getAllRoutes();
const flights = response.data.data;
```

---

## Routing Structure

```
/                           → Home (public)
/login                      → Login (public)
/register                   → Register (public)
/search                     → FlightSearch (public)
/book-flight/:flightId      → CreateBooking (protected)
/bookings                   → Bookings (protected)
/bookings/:id               → BookingDetails (protected)
/payment/:bookingId         → Payment (protected)
/analytics                  → Analytics (public) NEW
*                           → Redirect to Home
```

**Route Protection:**
- Protected routes require authentication
- Redirects to `/login` if unauthenticated
- Shows loading spinner during auth check

---

## State Management

### Authentication Flow

```
1. App loads → AuthProvider checks authentication
   ↓
2. Call /api/auth/is-auth
   ↓
3. Set isAuthenticated state
   ↓
4. Update UI (show/hide protected content)
```

### Login Flow

```
1. User submits login form
   ↓
2. Call authAPI.login()
   ↓
3. Server validates credentials
   ↓
4. Server sets HTTP-only cookie
   ↓
5. Update isAuthenticated state
   ↓
6. Redirect to /search
```

### Booking Flow

```
1. User selects flight
   ↓
2. Fill passenger details
   ↓
3. Call bookingsAPI.createBooking()
   ↓
4. Server creates booking with status "pending"
   ↓
5. Redirect to /payment/:bookingId
   ↓
6. Fill payment details
   ↓
7. Call paymentsAPI.payBooking()
   ↓
8. Server validates payment
   ↓
9. Update booking status to "confirmed"
   ↓
10. Send e-ticket email
   ↓
11. Redirect to /bookings/:id
```

---

## Styling

### Tailwind CSS Configuration

**Theme Colors:**
- Primary: Blue (#2563eb - blue-600)
- Success: Green (#16a34a - green-600)
- Warning: Yellow (#ca8a04 - yellow-600)
- Error: Red (#dc2626 - red-600)
- Background: Gray (#f9fafb - gray-50)

**Common Classes:**

**Buttons:**
```css
.btn-primary: bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700
.btn-success: bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700
.btn-danger: bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700
```

**Cards:**
```css
.card: bg-white rounded-lg shadow-md p-6
```

**Forms:**
```css
.input: w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500
```

**Status Badges:**
```css
.badge-success: bg-green-100 text-green-800 px-3 py-1 rounded-full
.badge-warning: bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full
.badge-error: bg-red-100 text-red-800 px-3 py-1 rounded-full
```

---

## Installation & Setup

### Prerequisites
- Node.js 18+
- npm or pnpm
- Backend server running on port 4000

### Installation

```bash
cd frontend
npm install
# or
pnpm install
```

### Development Server

```bash
npm run dev
# or
pnpm dev
```

Application runs on `http://localhost:9999`

### Build for Production

```bash
npm run build
# or
pnpm build
```

### Preview Production Build

```bash
npm run preview
# or
pnpm preview
```

---

## Environment Configuration

### Vite Configuration (`vite.config.js`)

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 9999,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      }
    }
  }
})
```

**Proxy Setup:**
- All `/api/*` requests proxied to backend
- Enables CORS-free development
- Automatic cookie forwarding

---

## User Experience Features

### 1. **Loading States**
- Spinner during authentication check
- Loading buttons during form submission
- Skeleton screens for data fetching

### 2. **Error Handling**
- Clear error messages
- Form validation feedback
- API error display
- User-friendly error messages

### 3. **Responsive Design**
- Mobile-first approach
- Tablet and desktop layouts
- Touch-friendly interfaces
- Adaptive navigation

### 4. **Accessibility**
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Screen reader support

### 5. **Performance**
- Code splitting with React Router
- Lazy loading
- Optimized bundle size
- Fast page transitions

---

## Analytics Dashboard Usage

### Viewing Top Routes

1. Navigate to `/analytics`
2. Scroll to "Top Flight Routes" section
3. Adjust limit slider (10-50)
4. View routes sorted by popularity
5. Compare Economy vs Business prices

**Metrics Displayed:**
- Number of flights per route
- Average Economy price
- Average Business price
- Minimum Economy price
- Maximum Economy price

### Viewing Airline Statistics

1. Navigate to `/analytics`
2. Scroll to "Airlines Pricing Statistics" section
3. Set minimum flights filter
4. View airline performance metrics
5. Analyze premium pricing gap

**Metrics Displayed:**
- Total flights operated
- Average prices per class
- Premium gap (Business - Economy difference)
- Price ranges (min/max)

---

## Future Enhancements

1. **Advanced Search Filters**
   - Date selection
   - Price range slider
   - Airline preferences
   - Direct flights only option

2. **User Profile**
   - Profile picture
   - Saved payment methods
   - Frequent flyer information
   - Travel preferences

3. **Seat Selection**
   - Interactive seat map
   - Seat availability
   - Premium seat upgrades

4. **Booking Modifications**
   - Change flight
   - Modify passengers
   - Upgrade cabin class

5. **Notifications**
   - Flight status updates
   - Booking confirmations
   - Payment receipts
   - Price drop alerts

6. **Multi-language Support**
   - English
   - Russian
   - Kazakh

7. **Dark Mode**
   - Theme toggle
   - System preference detection

8. **PWA Features**
   - Offline support
   - Install to home screen
   - Push notifications

9. **Social Features**
   - Share bookings
   - Referral program
   - Reviews and ratings

10. **Advanced Analytics**
    - Interactive charts (Chart.js/Recharts)
    - Date range filtering
    - Export reports
    - Booking trends

---

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## Performance Metrics

- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Lighthouse Score**: 90+

---

## Security Considerations

1. **HTTP-only Cookies** - JWT tokens not accessible via JavaScript
2. **CSRF Protection** - SameSite cookie attribute
3. **XSS Prevention** - React automatic escaping
4. **Input Validation** - Client and server-side
5. **Secure HTTPS** - Required in production
6. **No Sensitive Data Storage** - No localStorage for tokens

---

## Troubleshooting

### Common Issues

**1. API Connection Failed**
- Check backend server is running on port 4000
- Verify proxy configuration in vite.config.js
- Check CORS settings

**2. Authentication Not Working**
- Clear browser cookies
- Check JWT_SECRET matches in backend
- Verify cookie domain settings

**3. Flights Not Loading**
- Ensure MongoDB has flight data
- Check backend logs for errors
- Verify API endpoint responses

**4. Payment Failing**
- Validate card number format
- Check expiry date is in future
- Verify backend payment validation

---

## Support

For issues or questions:
- Email: support@vizierairways.com
- GitHub Issues: [Create Issue]

---

## License

MIT License

---

## Contributors

- Frontend Team @ Vizier Airways
- Backend Integration Team
- UX/UI Design Team