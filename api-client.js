// API Configuration and utilities for frontend integration

const API_BASE_URL = 'http://localhost:5000/api';

// Store token in localStorage
const setToken = (token) => {
    localStorage.setItem('authToken', token);
};

// Get token from localStorage
const getToken = () => {
    return localStorage.getItem('authToken');
};

// Clear token from localStorage
const clearToken = () => {
    localStorage.removeItem('authToken');
};

// Make API request with authentication
const apiCall = async (endpoint, method = 'GET', data = null) => {
    const headers = {
        'Content-Type': 'application/json'
    };

    const token = getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        method,
        headers
    };

    if (data) {
        config.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const result = await response.json();

        if (!response.ok) {
            if (response.status === 401) {
                clearToken();
                window.location.href = 'login.html';
            }
            throw new Error(result.message || 'API request failed');
        }

        return result;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

// Authentication APIs
const authAPI = {
    register: async (data) => {
        const result = await apiCall('/auth/register', 'POST', data);
        if (result.token) {
            setToken(result.token);
        }
        return result;
    },

    login: async (email, password) => {
        const result = await apiCall('/auth/login', 'POST', { email, password });
        if (result.token) {
            setToken(result.token);
        }
        return result;
    },

    logout: async () => {
        await apiCall('/auth/logout', 'POST');
        clearToken();
    },

    getMe: async () => {
        return await apiCall('/auth/me', 'GET');
    }
};

// Booking APIs
const bookingAPI = {
    createBooking: async (data) => {
        return await apiCall('/bookings', 'POST', data);
    },

    getCustomerBookings: async () => {
        return await apiCall('/bookings/customer/list', 'GET');
    },

    getProviderBookings: async (status = null) => {
        const endpoint = status ? `/bookings/provider/list?status=${status}` : '/bookings/provider/list';
        return await apiCall(endpoint, 'GET');
    },

    getAvailableBookings: async () => {
        return await apiCall('/bookings/available', 'GET');
    },

    getBooking: async (id) => {
        return await apiCall(`/bookings/${id}`, 'GET');
    },

    acceptBooking: async (id) => {
        return await apiCall(`/bookings/${id}/accept`, 'PUT');
    },

    rejectBooking: async (id, reason) => {
        return await apiCall(`/bookings/${id}/reject`, 'PUT', { reason });
    },

    startBooking: async (id) => {
        return await apiCall(`/bookings/${id}/start`, 'PUT');
    },

    updateProgress: async (id, progress, notes = '') => {
        return await apiCall(`/bookings/${id}/progress`, 'PUT', { progress, notes });
    },

    completeBooking: async (id) => {
        return await apiCall(`/bookings/${id}/complete`, 'PUT');
    },

    cancelBooking: async (id, reason) => {
        return await apiCall(`/bookings/${id}/cancel`, 'PUT', { reason });
    }
};

// Payment APIs
const paymentAPI = {
    processPayment: async (bookingId, paymentMethod) => {
        return await apiCall('/payments', 'POST', { bookingId, paymentMethod });
    },

    getCustomerPaymentHistory: async () => {
        return await apiCall('/payments/customer/history', 'GET');
    },

    getProviderPaymentHistory: async () => {
        return await apiCall('/payments/provider/history', 'GET');
    },

    getPayment: async (id) => {
        return await apiCall(`/payments/${id}`, 'GET');
    },

    refundPayment: async (id, refundReason) => {
        return await apiCall(`/payments/${id}/refund`, 'POST', { refundReason });
    }
};

// Review APIs
const reviewAPI = {
    createReview: async (data) => {
        return await apiCall('/reviews', 'POST', data);
    },

    getProviderReviews: async (providerId) => {
        return await apiCall(`/reviews/provider/${providerId}`, 'GET');
    },

    getCustomerReviews: async () => {
        return await apiCall('/reviews/customer/list', 'GET');
    },

    getReview: async (id) => {
        return await apiCall(`/reviews/${id}`, 'GET');
    },

    updateReview: async (id, data) => {
        return await apiCall(`/reviews/${id}`, 'PUT', data);
    },

    deleteReview: async (id) => {
        return await apiCall(`/reviews/${id}`, 'DELETE');
    },

    respondToReview: async (id, responseText) => {
        return await apiCall(`/reviews/${id}/respond`, 'POST', { responseText });
    }
};

// Earnings APIs
const earningsAPI = {
    getEarnings: async () => {
        return await apiCall('/earnings', 'GET');
    },

    getMonthlyEarnings: async () => {
        return await apiCall('/earnings/monthly', 'GET');
    },

    getEarningsByService: async () => {
        return await apiCall('/earnings/services', 'GET');
    },

    getStats: async () => {
        return await apiCall('/earnings/stats', 'GET');
    },

    requestWithdrawal: async (amount, method) => {
        return await apiCall('/earnings/withdrawal', 'POST', { amount, method });
    },

    getWithdrawalHistory: async () => {
        return await apiCall('/earnings/withdrawals', 'GET');
    }
};

// User APIs
const userAPI = {
    getProviders: async (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.service) params.append('service', filters.service);
        if (filters.city) params.append('city', filters.city);
        if (filters.rating) params.append('rating', filters.rating);
        
        const endpoint = `/users/providers${params.toString() ? '?' + params : ''}`;
        return await apiCall(endpoint, 'GET');
    },

    getProvider: async (id) => {
        return await apiCall(`/users/providers/${id}`, 'GET');
    },

    getProfile: async () => {
        return await apiCall('/users/profile', 'GET');
    },

    updateProfile: async (data) => {
        const user = await userAPI.getProfile();
        return await apiCall(`/users/${user.user._id}`, 'PUT', data);
    },

    searchUsers: async (query, userType = null) => {
        let endpoint = `/users/search?q=${encodeURIComponent(query)}`;
        if (userType) endpoint += `&userType=${userType}`;
        return await apiCall(endpoint, 'GET');
    }
};

// Export all APIs
window.API = {
    auth: authAPI,
    booking: bookingAPI,
    payment: paymentAPI,
    review: reviewAPI,
    earnings: earningsAPI,
    user: userAPI,
    setToken,
    getToken,
    clearToken
};
