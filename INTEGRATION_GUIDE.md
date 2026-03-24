# YOUtility Frontend-Backend Integration Guide

This guide explains how to connect the frontend HTML/CSS/JS files with the backend Node.js/Express API.

## Overview

The frontend communicates with the backend through HTTP requests. The `api-client.js` file provides a convenient JavaScript wrapper for all API endpoints.

```
Frontend (HTML/CSS/JS)
         ↓ HTTP Requests
Backend API (Express.js)
         ↓
MongoDB Database
```

---

## Setup Steps

### 1. Start the Backend Server

```bash
cd backend
npm install          # If not already done
npm start           # Starts on http://localhost:5000
```

Verify server is running by visiting: `http://localhost:5000`  
You should see: `{"status": "healthy", "message": "YOUtility API is running"}`

### 2. Load API Client in Frontend

Every HTML page that needs API access must include the API client:

```html
<!-- At the end of your HTML body, before page-specific scripts -->
<script src="api-client.js"></script>
<script src="page-specific-script.js"></script>
```

### 3. Update Environment (if needed)

The API client automatically points to `http://localhost:5000`. For production:

```javascript
// At the top of api-client.js, change:
const API_BASE_URL = 'http://localhost:5000/api';
// To:
const API_BASE_URL = 'https://yourdomain.com/api';
```

---

## Common Integration Patterns

### Pattern 1: Form Submission

**HTML:**
```html
<form id="loginForm">
  <input type="email" id="email" name="email" placeholder="Email" required>
  <input type="password" id="password" name="password" placeholder="Password" required>
  <button type="submit">Login</button>
</form>
```

**JavaScript:**
```javascript
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  try {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Call API using provided wrapper
    const response = await API.auth.login(email, password);
    
    // Store token and user data
    API.setToken(response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    
    // Redirect to next page
    window.location.href = 'index.html';
    
  } catch (error) {
    // Show error to user
    alert('Login failed: ' + error.message);
    console.error('Login error:', error);
  }
});
```

### Pattern 2: Loading Data on Page Load

**HTML:**
```html
<div id="providersList" class="providers-container">
  <!-- Populated by JavaScript -->
</div>
```

**JavaScript:**
```javascript
async function loadProviders() {
  try {
    // Get all providers from API
    const providers = await API.user.getProviders();
    
    // Render providers on page
    const container = document.getElementById('providersList');
    container.innerHTML = providers.map(provider => `
      <div class="provider-card">
        <h3>${provider.firstName} ${provider.lastName}</h3>
        <p>Rating: ${provider.rating.averageRating}/5 (${provider.rating.totalReviews} reviews)</p>
        <button onclick="viewProvider('${provider._id}')">View Profile</button>
      </div>
    `).join('');
    
  } catch (error) {
    console.error('Failed to load providers:', error);
    document.getElementById('providersList').innerHTML = 
      '<p>Error loading providers. Please try again later.</p>';
  }
}

// Load providers when page loads
document.addEventListener('DOMContentLoaded', loadProviders);
```

### Pattern 3: Authenticated Requests

**JavaScript:**
```javascript
async function createBooking(bookingData) {
  try {
    // Token is automatically included by API.booking.createBooking()
    const booking = await API.booking.createBooking({
      serviceType: 'Electrician',
      description: 'Fix broken outlet',
      scheduledDate: '2024-02-15',
      scheduledTime: '14:00',
      duration: 2,
      location: {
        street: '123 Main St',
        city: 'Springfield',
        state: 'IL'
      }
    });
    
    // Show success message
    alert(`Booking created! ID: ${booking.bookingId}`);
    window.location.href = 'history.html';
    
  } catch (error) {
    alert('Booking failed: ' + error.message);
  }
}
```

### Pattern 4: Authorization Check

**JavaScript:**
```javascript
// Check if user is logged in before showing content
function initializePage() {
  const token = API.getToken();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!token) {
    // Redirect to login if not authenticated
    window.location.href = 'login.html';
    return;
  }
  
  // Check user role
  if (user.userType === 'provider') {
    // Show provider-specific content
    loadProviderDashboard();
  } else {
    // Show customer-specific content
    loadCustomerDashboard();
  }
}

// Run on page load
document.addEventListener('DOMContentLoaded', initializePage);
```

---

## Page-by-Page Integration Examples

### login.html

```html
<!DOCTYPE html>
<html>
<head>
  <title>YOUtility - Login</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="login-container">
    <h1>Login to YOUtility</h1>
    
    <!-- Registration Toggle -->
    <div id="loginTab">
      <h2>Sign In</h2>
      <form id="loginForm">
        <input type="email" id="loginEmail" placeholder="Email" required>
        <input type="password" id="loginPassword" placeholder="Password" required>
        <button type="submit">Login</button>
      </form>
    </div>
    
    <div id="registerTab" style="display: none;">
      <h2>Create Account</h2>
      <form id="registerForm">
        <input type="text" id="firstName" placeholder="First Name" required>
        <input type="text" id="lastName" placeholder="Last Name" required>
        <input type="email" id="email" placeholder="Email" required>
        <input type="password" id="password" placeholder="Password" required>
        <input type="tel" id="phone" placeholder="Phone" required>
        <select id="userType" required>
          <option value="">Select Account Type</option>
          <option value="customer">Customer</option>
          <option value="provider">Service Provider</option>
        </select>
        <button type="submit">Register</button>
      </form>
    </div>
  </div>

  <script src="api-client.js"></script>
  <script>
    // Login Handler
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      try {
        const response = await API.auth.login(
          document.getElementById('loginEmail').value,
          document.getElementById('loginPassword').value
        );
        
        API.setToken(response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        window.location.href = response.user.userType === 'provider' 
          ? 'provider-dashboard.html' 
          : 'index.html';
          
      } catch (error) {
        alert(error.message);
      }
    });
    
    // Registration Handler
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      try {
        const response = await API.auth.register({
          firstName: document.getElementById('firstName').value,
          lastName: document.getElementById('lastName').value,
          email: document.getElementById('email').value,
          password: document.getElementById('password').value,
          phone: document.getElementById('phone').value,
          userType: document.getElementById('userType').value
        });
        
        API.setToken(response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        window.location.href = response.user.userType === 'provider' 
          ? 'provider-dashboard.html' 
          : 'index.html';
          
      } catch (error) {
        alert(error.message);
      }
    });
  </script>
</body>
</html>
```

### booking.html

```html
<!DOCTYPE html>
<html>
<head>
  <title>Book a Service - YOUtility</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="booking-container">
    <h1>Book a Service</h1>
    
    <form id="bookingForm">
      <div class="form-group">
        <label for="service">Service Type</label>
        <select id="service" required>
          <option value="">-- Select Service --</option>
          <option value="Electrician">Electrician</option>
          <option value="Plumber">Plumber</option>
          <option value="Carpenter">Carpenter</option>
          <option value="Car Mechanic">Car Mechanic</option>
          <option value="Painter">Painter</option>
          <option value="Barber">Barber</option>
          <option value="Chef">Chef</option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="description">Description</label>
        <textarea id="description" placeholder="Describe what you need..." required></textarea>
      </div>
      
      <div class="form-group">
        <label for="date">Date</label>
        <input type="date" id="date" required>
      </div>
      
      <div class="form-group">
        <label for="time">Time</label>
        <input type="time" id="time" required>
      </div>
      
      <div class="form-group">
        <label for="duration">Duration (hours)</label>
        <input type="number" id="duration" min="0.5" step="0.5" required>
      </div>
      
      <div class="form-group">
        <label for="street">Street Address</label>
        <input type="text" id="street" required>
      </div>
      
      <div class="form-group">
        <label for="city">City</label>
        <input type="text" id="city" required>
      </div>
      
      <div class="form-group">
        <label for="state">State</label>
        <input type="text" id="state" required>
      </div>
      
      <button type="submit" class="btn-primary">Create Booking</button>
    </form>
    
    <!-- Estimated Price Preview -->
    <div id="pricePreview" class="price-preview" style="display: none;">
      <h3>Price Breakdown</h3>
      <p>Base Price: $<span id="basePrice">0</span></p>
      <p>Tax (10%): $<span id="taxAmount">0</span></p>
      <p>Total: $<span id="totalPrice">0</span></p>
    </div>
  </div>

  <script src="api-client.js"></script>
  <script>
    // Load service prices when page loads
    let services = [];
    
    async function loadServices() {
      try {
        // You may need to add a getServices() endpoint to your API
        // For now, use hardcoded service prices
        services = {
          'Electrician': 50,
          'Plumber': 60,
          'Carpenter': 55,
          'Car Mechanic': 70,
          'Painter': 40,
          'Barber': 25,
          'Chef': 100
        };
      } catch (error) {
        console.error('Failed to load services:', error);
      }
    }
    
    // Update price preview when service/duration changes
    document.getElementById('service').addEventListener('change', updatePrice);
    document.getElementById('duration').addEventListener('change', updatePrice);
    
    function updatePrice() {
      const service = document.getElementById('service').value;
      const duration = parseFloat(document.getElementById('duration').value) || 0;
      
      if (service && duration > 0) {
        const basePrice = services[service] * duration;
        const tax = basePrice * 0.10;
        const total = basePrice + tax;
        
        document.getElementById('basePrice').textContent = basePrice.toFixed(2);
        document.getElementById('taxAmount').textContent = tax.toFixed(2);
        document.getElementById('totalPrice').textContent = total.toFixed(2);
        document.getElementById('pricePreview').style.display = 'block';
      }
    }
    
    // Handle form submission
    document.getElementById('bookingForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Check authentication
      const token = API.getToken();
      if (!token) {
        alert('Please login first');
        window.location.href = 'login.html';
        return;
      }
      
      try {
        const booking = await API.booking.createBooking({
          serviceType: document.getElementById('service').value,
          description: document.getElementById('description').value,
          scheduledDate: document.getElementById('date').value,
          scheduledTime: document.getElementById('time').value,
          duration: parseFloat(document.getElementById('duration').value),
          location: {
            street: document.getElementById('street').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
            country: 'USA'
          }
        });
        
        alert(`Booking created successfully! Booking ID: ${booking.bookingId}`);
        window.location.href = 'history.html';
        
      } catch (error) {
        alert('Booking failed: ' + error.message);
      }
    });
    
    // Load services on page load
    document.addEventListener('DOMContentLoaded', loadServices);
  </script>
</body>
</html>
```

### provider-dashboard.html

```html
<!DOCTYPE html>
<html>
<head>
  <title>Provider Dashboard - YOUtility</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="dashboard-container">
    <h1>Provider Dashboard</h1>
    
    <!-- Tab Navigation -->
    <div class="dashboard-tabs">
      <button class="tab-btn active" onclick="switchTab('bookings')">Incoming Bookings</button>
      <button class="tab-btn" onclick="switchTab('progress')">Job Progress</button>
      <button class="tab-btn" onclick="switchTab('earnings')">Earnings</button>
      <button class="tab-btn" onclick="switchTab('reviews')">Reviews</button>
    </div>
    
    <!-- Incoming Bookings Tab -->
    <div id="bookings-tab" class="tab-content">
      <h2>Incoming Bookings</h2>
      <div id="bookingsList" class="bookings-list"></div>
    </div>
    
    <!-- Job Progress Tab -->
    <div id="progress-tab" class="tab-content" style="display: none;">
      <h2>Job Progress</h2>
      <div id="progressList" class="progress-list"></div>
    </div>
    
    <!-- Earnings Tab -->
    <div id="earnings-tab" class="tab-content" style="display: none;">
      <h2>My Earnings</h2>
      <div id="earningsInfo" class="earnings-info"></div>
    </div>
    
    <!-- Reviews Tab -->
    <div id="reviews-tab" class="tab-content" style="display: none;">
      <h2>My Reviews</h2>
      <div id="reviewsList" class="reviews-list"></div>
    </div>
  </div>

  <script src="api-client.js"></script>
  <script>
    // Check authentication
    function initDashboard() {
      const token = API.getToken();
      if (!token) {
        window.location.href = 'login.html';
        return;
      }
      
      loadIncomingBookings();
      loadEarnings();
    }
    
    // Tab switching
    function switchTab(tabName) {
      // Hide all tabs
      document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
      });
      document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      
      // Show selected tab
      document.getElementById(tabName + '-tab').style.display = 'block';
      event.target.classList.add('active');
      
      // Load tab data
      if (tabName === 'bookings') loadIncomingBookings();
      if (tabName === 'progress') loadActiveBookings();
      if (tabName === 'earnings') loadEarnings();
      if (tabName === 'reviews') loadReviews();
    }
    
    // Load incoming bookings
    async function loadIncomingBookings() {
      try {
        const bookings = await API.booking.getProviderBookings('pending');
        
        if (bookings.length === 0) {
          document.getElementById('bookingsList').innerHTML = 
            '<p>No pending bookings at the moment.</p>';
          return;
        }
        
        document.getElementById('bookingsList').innerHTML = 
          bookings.map(booking => `
            <div class="booking-card">
              <h3>Booking #${booking.bookingId}</h3>
              <p>Service: ${booking.service}</p>
              <p>Customer: ${booking.customerName}</p>
              <p>Scheduled: ${new Date(booking.scheduledDate).toLocaleDateString()} at ${booking.scheduledTime}</p>
              <p>Location: ${booking.location.city}, ${booking.location.state}</p>
              <p>Price: $${booking.price.totalPrice}</p>
              <button onclick="acceptBooking('${booking._id}')">Accept</button>
              <button onclick="rejectBooking('${booking._id}')">Reject</button>
            </div>
          `).join('');
          
      } catch (error) {
        console.error('Failed to load bookings:', error);
        document.getElementById('bookingsList').innerHTML = 
          '<p>Error loading bookings.</p>';
      }
    }
    
    // Accept booking
    async function acceptBooking(bookingId) {
      try {
        await API.booking.acceptBooking(bookingId);
        alert('Booking accepted!');
        loadIncomingBookings();
      } catch (error) {
        alert('Failed to accept booking: ' + error.message);
      }
    }
    
    // Reject booking
    async function rejectBooking(bookingId) {
      const reason = prompt('Enter rejection reason:');
      if (!reason) return;
      
      try {
        await API.booking.rejectBooking(bookingId, reason);
        alert('Booking rejected');
        loadIncomingBookings();
      } catch (error) {
        alert('Failed to reject booking: ' + error.message);
      }
    }
    
    // Load active bookings (in progress)
    async function loadActiveBookings() {
      try {
        const bookings = await API.booking.getProviderBookings('in_progress');
        
        document.getElementById('progressList').innerHTML = 
          bookings.map(booking => `
            <div class="progress-card">
              <h3>Booking #${booking.bookingId}</h3>
              <p>Service: ${booking.service}</p>
              <p>Progress: ${booking.progress}%</p>
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${booking.progress}%"></div>
              </div>
              <input type="range" min="0" max="100" value="${booking.progress}" 
                     onchange="updateProgress('${booking._id}', this.value)">
              <button onclick="completeBooking('${booking._id}')">Mark Complete</button>
            </div>
          `).join('');
          
      } catch (error) {
        console.error('Failed to load active bookings:', error);
      }
    }
    
    // Update progress
    async function updateProgress(bookingId, progress) {
      try {
        await API.booking.updateProgress(bookingId, parseInt(progress), 'Progress updated');
        alert('Progress updated!');
      } catch (error) {
        alert('Failed to update progress: ' + error.message);
      }
    }
    
    // Complete booking
    async function completeBooking(bookingId) {
      try {
        await API.booking.completeBooking(bookingId);
        alert('Booking marked as complete!');
        loadActiveBookings();
      } catch (error) {
        alert('Failed to complete booking: ' + error.message);
      }
    }
    
    // Load earnings
    async function loadEarnings() {
      try {
        const earnings = await API.earnings.getEarnings();
        
        document.getElementById('earningsInfo').innerHTML = `
          <div class="earnings-summary">
            <p>Total Earnings: $${earnings.totalEarnings}</p>
            <p>Total Jobs: ${earnings.totalJobs}</p>
            <p>Available Balance: $${earnings.availableBalance}</p>
            <p>Pending Balance: $${earnings.pendingBalance}</p>
            <button onclick="requestWithdrawal()">Request Withdrawal</button>
          </div>
        `;
        
      } catch (error) {
        console.error('Failed to load earnings:', error);
      }
    }
    
    // Request withdrawal
    async function requestWithdrawal() {
      const amount = prompt('Enter withdrawal amount:');
      if (!amount) return;
      
      try {
        await API.earnings.requestWithdrawal(parseFloat(amount), 'bank_transfer');
        alert('Withdrawal request submitted!');
        loadEarnings();
      } catch (error) {
        alert('Withdrawal failed: ' + error.message);
      }
    }
    
    // Load reviews
    async function loadReviews() {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const reviews = await API.review.getProviderReviews(user._id);
        
        document.getElementById('reviewsList').innerHTML = 
          reviews.map(review => `
            <div class="review-card">
              <p>Rating: ${review.rating}/5 stars</p>
              <p>"${review.comment}"</p>
              <p>- ${review.customerName}</p>
            </div>
          `).join('');
          
      } catch (error) {
        console.error('Failed to load reviews:', error);
      }
    }
    
    // Initialize on page load
    document.addEventListener('DOMContentLoaded', initDashboard);
  </script>
</body>
</html>
```

---

## Error Handling

### Common Error Responses

```javascript
// 400 Bad Request - Missing or invalid fields
{
  "success": false,
  "message": "Validation failed",
  "errors": ["Email is required", "Password must be at least 6 characters"]
}

// 401 Unauthorized - Missing or invalid token
{
  "success": false,
  "message": "Please login first"
}

// 403 Forbidden - User doesn't have permission
{
  "success": false,
  "message": "Only providers can accept bookings"
}

// 404 Not Found - Resource doesn't exist
{
  "success": false,
  "message": "Booking not found"
}

// 500 Server Error - Database or server error
{
  "success": false,
  "message": "Internal server error"
}
```

### Error Handling Pattern

```javascript
async function exampleAPICall() {
  try {
    const result = await API.someFunction();
    // Success handling
    console.log('Success:', result);
    
  } catch (error) {
    // Error is an object with: message, status, data
    console.error('Error status:', error.status);
    console.error('Error message:', error.message);
    console.error('Error data:', error.data);
    
    // Show user-friendly message
    if (error.status === 401) {
      alert('Please login to continue');
      window.location.href = 'login.html';
    } else {
      alert('An error occurred: ' + error.message);
    }
  }
}
```

---

## Testing the Integration

### Step 1: Start Backend
```bash
cd backend
npm start
```

### Step 2: Open Frontend in Browser
- Open `index.html` in your browser (or use Live Server)
- Open browser DevTools (F12) to see console logs

### Step 3: Test Login Flow
1. Go to login page
2. Click "Create Account"
3. Fill in registration form
4. Should redirect to dashboard after registration

### Step 4: Test Booking Creation
1. Login as customer
2. Go to booking page
3. Fill in booking form
4. Should create booking and redirect to history

### Step 5: Test Provider Dashboard
1. Login as provider
2. Review incoming bookings
3. Accept or reject bookings
4. View earnings and reviews

---

## Debugging Tips

### View Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Perform an action (e.g., login)
4. See HTTP requests and responses

### View Console Logs
1. Open DevTools (F12)
2. Go to Console tab
3. See error messages and debug info

### Common Issues

**Token not persisting:**
```javascript
// Make sure token is saved after login
API.setToken(response.token);
localStorage.setItem('token', response.token);
```

**API not responding:**
- Check backend is running: `http://localhost:5000`
- Check correct port in api-client.js
- Check MongoDB is running
- Check network tab for failed requests

**CORS errors:**
- Verify CORS is enabled in server.js
- Check request origin matches allowed domains

---

## Next Steps

1. ✅ Set up frontend and backend communication
2. Test all authentication flows
3. Test booking creation and management
4. Test payment processing
5. Test review submission
6. Deploy to production

---

**For more help, see:**
- SETUP_GUIDE.md - Backend installation
- BACKEND_API_DOCS.md - API reference
- README.md - Project overview
