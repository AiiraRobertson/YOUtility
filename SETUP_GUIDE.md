# YOUtility Backend - Setup & Installation Guide

## Quick Start Guide

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas cloud)
- npm or yarn package manager

### Step 1: Install Dependencies

Navigate to the backend directory and install all required packages:

```bash
cd backend
npm install
```

This will install:
- **express** - Web framework
- **mongoose** - MongoDB ODM
- **jsonwebtoken** - JWT authentication
- **bcryptjs** - Password hashing
- **cors** - Cross-origin handling
- **dotenv** - Environment variables
- **express-validator** - Input validation
- **swagger-jsdoc** - Swagger documentation
- **swagger-ui-express** - Swagger UI
- **multer** - File uploads
- **axios** - HTTP client

### Step 2: Configure Environment Variables

Create a `.env` file in the `backend` directory with these values:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/youtil
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/youtil

# Authentication
JWT_SECRET=your_very_secure_secret_key_change_this_in_production_12345
JWT_EXPIRE=7d

# Password Hashing
BCRYPT_ROUNDS=10

# Swagger
SWAGGER_ENABLED=true
```

### Step 3: Set Up MongoDB

#### Option A: Local MongoDB Installation
```bash
# Windows - Install MongoDB Community Edition
# Then run MongoDB service:
mongod

# Mac
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Linux
sudo apt-get install mongodb
sudo systemctl start mongodb
```

#### Option B: MongoDB Atlas (Cloud)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Replace `MONGODB_URI` in `.env` with your Atlas connection string:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/youtil?retryWrites=true&w=majority
```

### Step 4: Start the Server

From the `backend` directory, run:

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB connected successfully
Backend API running at http://localhost:5000
Swagger UI available at http://localhost:5000/api-docs
```

### Step 5: Verify Installation

#### Check Server Health
Open in browser: `http://localhost:5000`
Expected response: 
```json
{"status": "healthy", "message": "YOUtility API is running"}
```

#### Access Swagger Documentation
Open in browser: `http://localhost:5000/api-docs`

You should see the interactive Swagger UI with all API endpoints documented.

## Initial Data Setup (Seeding Services)

The application requires service types to be created. You can do this through the API or by creating a seed script.

### Option A: Seed Services via Script

Create `backend/scripts/seedServices.js`:

```javascript
const mongoose = require('mongoose');
require('dotenv').config();
const Service = require('../models/Service');

const services = [
  {
    name: 'Electrician',
    description: 'Professional electrical repairs and installations',
    icon: '⚡',
    category: 'Home Services',
    basePrice: 50,
    estimatedDuration: 2
  },
  {
    name: 'Plumber',
    description: 'Plumbing repairs and installations',
    icon: '🔧',
    category: 'Home Services',
    basePrice: 60,
    estimatedDuration: 2
  },
  {
    name: 'Carpenter',
    description: 'Carpentry and woodwork services',
    icon: '🪵',
    category: 'Home Services',
    basePrice: 55,
    estimatedDuration: 3
  },
  {
    name: 'Car Mechanic',
    description: 'Vehicle repair and maintenance',
    icon: '🚗',
    category: 'Automotive',
    basePrice: 70,
    estimatedDuration: 2
  },
  {
    name: 'Painter',
    description: 'Interior and exterior painting',
    icon: '🎨',
    category: 'Home Services',
    basePrice: 40,
    estimatedDuration: 4
  },
  {
    name: 'Barber',
    description: 'Professional haircut and grooming',
    icon: '✂️',
    category: 'Personal Care',
    basePrice: 25,
    estimatedDuration: 1
  },
  {
    name: 'Chef',
    description: 'Personal chef and catering services',
    icon: '👨‍🍳',
    category: 'Food Services',
    basePrice: 100,
    estimatedDuration: 3
  },
  {
    name: 'Other',
    description: 'Other services not listed above',
    icon: '⭐',
    category: 'Miscellaneous',
    basePrice: 50,
    estimatedDuration: 2
  }
];

async function seedServices() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Service.deleteMany({});
    console.log('Cleared existing services');

    await Service.insertMany(services);
    console.log('Services created successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding services:', error);
    process.exit(1);
  }
}

seedServices();
```

Run the seed script:
```bash
node scripts/seedServices.js
```

### Option B: Manual Service Creation via API

Use the Swagger UI or curl:

```bash
curl -X POST http://localhost:5000/api/services \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Electrician",
    "description": "Professional electrical repairs",
    "icon": "⚡",
    "basePrice": 50,
    "estimatedDuration": 2
  }'
```

## Frontend Integration

Update your frontend files to use the API:

### 1. Update login.html
```javascript
// In login.html script section
const form = document.getElementById('loginForm');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  try {
    const response = await API.auth.login(email, password);
    API.setToken(response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    window.location.href = 'index.html';
  } catch (error) {
    alert('Login failed: ' + error.message);
  }
});
```

### 2. Update booking.html
```javascript
// In booking.html script section
document.getElementById('bookingForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const bookingData = {
    serviceType: document.getElementById('service').value,
    description: document.getElementById('description').value,
    scheduledDate: document.getElementById('date').value,
    scheduledTime: document.getElementById('time').value,
    duration: parseFloat(document.getElementById('duration').value),
    location: {
      street: document.getElementById('street').value,
      city: document.getElementById('city').value,
      state: document.getElementById('state').value
    }
  };
  
  try {
    const booking = await API.booking.createBooking(bookingData);
    alert('Booking created successfully!');
    window.location.href = 'history.html';
  } catch (error) {
    alert('Booking failed: ' + error.message);
  }
});
```

### 3. Update provider-dashboard.html
```javascript
// In provider-dashboard.js
async function loadIncomingBookings() {
  try {
    const bookings = await API.booking.getProviderBookings('pending');
    displayIncomingBookings(bookings);
  } catch (error) {
    console.error('Failed to load bookings:', error);
  }
}

async function acceptBooking(bookingId) {
  try {
    await API.booking.acceptBooking(bookingId);
    loadIncomingBookings();
  } catch (error) {
    alert('Failed to accept booking: ' + error.message);
  }
}
```

## Testing the API

### Test User Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "+1234567890",
    "userType": "customer"
  }'
```

### Test User Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Test Get Providers
```bash
curl http://localhost:5000/api/users/providers
```

## Production Deployment

### Environment Changes
```env
NODE_ENV=production
JWT_SECRET=your_production_secret_key_12345_change_this
```

### Deploy Options

#### Option 1: Heroku
```bash
heroku create your-youtil-app
heroku config:set MONGODB_URI=your_atlas_url
heroku config:set JWT_SECRET=your_production_secret
git push heroku main
```

#### Option 2: DigitalOcean
1. Create a droplet with Node.js
2. Clone your repository
3. Run `npm install`
4. Use PM2 for process management:
```bash
npm install -g pm2
pm2 start server.js --name "youtil-api"
pm2 startup
pm2 save
```

#### Option 3: AWS EC2
Similar to DigitalOcean, use Node.js AMI and PM2 for process management.

## Troubleshooting

### MongoDB Connection Issues
Check your connection string in `.env`
Ensure MongoDB service is running
Verify IP whitelist on MongoDB Atlas (if using cloud)

### Port Already in Use
Change PORT in `.env` to an available port
Or kill the process: `lsof -i :5000` then `kill -9 <PID>`

### JWT Errors
Ensure JWT_SECRET is set and consistent
Check token expiration with `JWT_EXPIRE`

### Cors Errors
Check CORS is enabled in server.js
Verify frontend URL is allowed

## Monitoring & Logs

Add logging to track application health:

```javascript
// In server.js
const morgan = require('morgan');
app.use(morgan('combined'));
```

Install morgan: `npm install morgan`

## Next Steps

1. ✅ Backend server running
2. ✅ MongoDB connected
3. ✅ Swagger documentation accessible
4. ⏳ Integrate frontend with API
5. ⏳ Test complete user flows
6. ⏳ Deploy to production
