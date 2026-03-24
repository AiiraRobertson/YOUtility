# YOUtility Backend API Documentation

## Project Overview
YOUtility is a comprehensive marketplace platform that connects customers with service providers. This backend provides a complete RESTful API with MongoDB database support and Swagger/OpenAPI documentation.

## Tech Stack
- **Node.js & Express.js** - Backend framework
- **MongoDB & Mongoose** - Database
- **JWT** - Authentication
- **Swagger/OpenAPI** - API documentation
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **CORS** - Cross-origin resource sharing

## Database Schema

### User Collection
Stores both customer and provider information with role-based access control.

```
User {
  firstName: String
  lastName: String
  email: String (unique)
  password: String (hashed)
  phone: String
  userType: 'customer' | 'provider'
  profileImage: String
  address: {
    street: String
    city: String
    state: String
    zipCode: String
    country: String
  }
  isVerified: Boolean
  rating: {
    averageRating: Number (0-5)
    totalReviews: Number
  }
  // Provider specific
  services: [Service ID]
  experience: String
  certifications: [String]
  availability: Boolean
  // Customer specific
  paymentMethods: Array
  preferences: Object
  createdAt: Date
  updatedAt: Date
}
```

### Service Collection
Defines available services on the platform.

```
Service {
  name: String (enum: Electrician, Plumber, Carpenter, etc.)
  description: String
  icon: String
  category: String
  basePrice: Number
  estimatedDuration: Number (hours)
  isActive: Boolean
  providers: [User ID]
  createdAt: Date
  updatedAt: Date
}
```

### Booking Collection
Manages all service booking requests and their lifecycle.

```
Booking {
  bookingId: String (unique)
  customer: User ID
  provider: User ID
  service: Service ID
  description: String
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled' | 'rejected'
  scheduledDate: Date
  scheduledTime: String
  duration: Number (hours)
  location: Object
  price: {
    basePrice: Number
    taxAmount: Number
    discountAmount: Number
    totalPrice: Number
  }
  specialRequests: String
  notes: String
  progress: Number (0-100)
  acceptedAt: Date
  startedAt: Date
  completedAt: Date
  cancellationReason: String
  rejectReason: String
  createdAt: Date
  updatedAt: Date
}
```

### Payment Collection
Records all financial transactions.

```
Payment {
  transactionId: String (unique)
  booking: Booking ID
  customer: User ID
  provider: User ID
  amount: Number
  currency: String
  paymentMethod: 'credit_card' | 'debit_card' | 'paypal' | 'bank_transfer'
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  breakdown: {
    baseAmount: Number
    taxAmount: Number
    discountAmount: Number
    platformFee: Number
    providerAmount: Number
  }
  providerPayout: Object
  receiptUrl: String
  failureReason: String
  refundDetails: Object
  createdAt: Date
  updatedAt: Date
}
```

### Review Collection
Stores customer reviews and ratings for providers.

```
Review {
  booking: Booking ID
  customer: User ID
  provider: User ID
  rating: Number (1-5)
  comment: String
  categories: {
    cleanliness: Number
    punctuality: Number
    professionalism: Number
    quality: Number
  }
  wouldRecommend: Boolean
  helpfulCount: Number
  responses: Array
  isPublished: Boolean
  createdAt: Date
  updatedAt: Date
}
```

### Earnings Collection
Tracks provider earnings and payouts.

```
Earnings {
  provider: User ID
  totalEarnings: Number
  totalJobs: Number
  monthlyEarnings: Array
  availableBalance: Number
  pendingBalance: Number
  withdrawals: Array
  paymentHistory: [Payment ID]
  updatedAt: Date
  createdAt: Date
}
```

## API Endpoints

### Authentication (`/api/auth`)

#### Register User
```
POST /api/auth/register
Body: {
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  phone: String,
  userType: 'customer' | 'provider'
}
Response: { success: true, token: String, user: Object }
```

#### Login User
```
POST /api/auth/login
Body: { email: String, password: String }
Response: { success: true, token: String, user: Object }
```

#### Get Current User
```
GET /api/auth/me
Headers: { Authorization: 'Bearer {token}' }
Response: { success: true, user: Object }
```

#### Logout
```
POST /api/auth/logout
Headers: { Authorization: 'Bearer {token}' }
Response: { success: true, message: String }
```

### Bookings (`/api/bookings`)

#### Create Booking (Customer)
```
POST /api/bookings
Headers: { Authorization: 'Bearer {token}' }
Body: {
  serviceType: String,
  description: String,
  scheduledDate: Date,
  scheduledTime: String,
  duration: Number,
  location: Object,
  specialRequests: String
}
```

#### Get Customer Bookings
```
GET /api/bookings/customer/list
Headers: { Authorization: 'Bearer {token}' }
```

#### Get Provider Bookings
```
GET /api/bookings/provider/list?status={status}
Headers: { Authorization: 'Bearer {token}' }
```

#### Accept Booking (Provider)
```
PUT /api/bookings/{id}/accept
Headers: { Authorization: 'Bearer {token}' }
```

#### Reject Booking (Provider)
```
PUT /api/bookings/{id}/reject
Headers: { Authorization: 'Bearer {token}' }
Body: { reason: String }
```

#### Start Booking (Provider)
```
PUT /api/bookings/{id}/start
Headers: { Authorization: 'Bearer {token}' }
```

#### Update Progress (Provider)
```
PUT /api/bookings/{id}/progress
Headers: { Authorization: 'Bearer {token}' }
Body: { progress: Number, notes: String }
```

#### Complete Booking (Provider)
```
PUT /api/bookings/{id}/complete
Headers: { Authorization: 'Bearer {token}' }
```

#### Cancel Booking (Customer)
```
PUT /api/bookings/{id}/cancel
Headers: { Authorization: 'Bearer {token}' }
Body: { reason: String }
```

### Payments (`/api/payments`)

#### Process Payment (Customer)
```
POST /api/payments
Headers: { Authorization: 'Bearer {token}' }
Body: {
  bookingId: String,
  paymentMethod: 'credit_card' | 'debit_card' | 'paypal' | 'bank_transfer'
}
```

#### Get Customer Payment History
```
GET /api/payments/customer/history
Headers: { Authorization: 'Bearer {token}' }
```

#### Get Provider Payment History
```
GET /api/payments/provider/history
Headers: { Authorization: 'Bearer {token}' }
```

#### Get Single Payment
```
GET /api/payments/{id}
Headers: { Authorization: 'Bearer {token}' }
```

#### Refund Payment
```
POST /api/payments/{id}/refund
Headers: { Authorization: 'Bearer {token}' }
Body: { refundReason: String }
```

### Reviews (`/api/reviews`)

#### Create Review (Customer)
```
POST /api/reviews
Headers: { Authorization: 'Bearer {token}' }
Body: {
  bookingId: String,
  rating: Number (1-5),
  comment: String,
  categories: Object,
  wouldRecommend: Boolean
}
```

#### Get Provider Reviews
```
GET /api/reviews/provider/{providerId}
```

#### Get Customer Reviews
```
GET /api/reviews/customer/list
Headers: { Authorization: 'Bearer {token}' }
```

#### Update Review (Customer)
```
PUT /api/reviews/{id}
Headers: { Authorization: 'Bearer {token}' }
Body: { rating: Number, comment: String, ... }
```

#### Delete Review (Customer)
```
DELETE /api/reviews/{id}
Headers: { Authorization: 'Bearer {token}' }
```

#### Respond to Review (Provider)
```
POST /api/reviews/{id}/respond
Headers: { Authorization: 'Bearer {token}' }
Body: { responseText: String }
```

### Earnings (`/api/earnings`)

#### Get Provider Earnings
```
GET /api/earnings
Headers: { Authorization: 'Bearer {token}' }
```

#### Get Monthly Earnings
```
GET /api/earnings/monthly
Headers: { Authorization: 'Bearer {token}' }
```

#### Get Earnings by Service
```
GET /api/earnings/services
Headers: { Authorization: 'Bearer {token}' }
```

#### Request Withdrawal
```
POST /api/earnings/withdrawal
Headers: { Authorization: 'Bearer {token}' }
Body: { amount: Number, method: String }
```

#### Get Withdrawal History
```
GET /api/earnings/withdrawals
Headers: { Authorization: 'Bearer {token}' }
```

### Users (`/api/users`)

#### Get All Providers
```
GET /api/users/providers?service={service}&city={city}&rating={rating}
```

#### Get Single Provider
```
GET /api/users/providers/{id}
```

#### Get Current User Profile
```
GET /api/users/profile
Headers: { Authorization: 'Bearer {token}' }
```

#### Update User Profile
```
PUT /api/users/{id}
Headers: { Authorization: 'Bearer {token}' }
Body: {
  firstName: String,
  lastName: String,
  phone: String,
  address: Object,
  experience: String,
  certifications: Array
}
```

#### Search Users
```
GET /api/users/search?q={query}&userType={userType}
```

## Installation & Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Create a `.env` file with:
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/youtil
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d
BCRYPT_ROUNDS=10
```

### 3. Start MongoDB
```bash
mongod
```

### 4. Run the Server
```bash
npm run dev
```

### 5. View API Documentation
Navigate to: `http://localhost:5000/api-docs`

## Frontend Integration

The frontend can use the provided `api-client.js` utility which includes:
- Authentication handling
- Automatic token management
- Error handling
- All API endpoints as JavaScript functions

### Using the API Client

```javascript
// Load the API client
<script src="api-client.js"></script>

// Example: Login
const result = await API.auth.login('user@example.com', 'password');
API.setToken(result.token);

// Example: Create booking
const booking = await API.booking.createBooking({
  serviceType: 'Electrician',
  description: 'Fix outlet',
  // ... other fields
});

// Example: Get provider bookings
const bookings = await API.booking.getProviderBookings('pending');
```

## Security Features
- JWT-based authentication
- Password hashing with bcryptjs
- Role-based access control (RBAC)
- Input validation with express-validator
- CORS protection
- Bearer token authorization

## Error Handling
All endpoints return consistent error responses:
```json
{
  "success": false,
  "message": "Error description",
  "errors": []
}
```

## Rate Limiting
Recommended: Implement rate limiting in production using express-rate-limit

## Testing API Endpoints
Use Swagger UI at `/api-docs` or tools like Postman
