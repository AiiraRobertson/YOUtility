// history.js - Booking history functionality

const sampleBookings = [
    {
        id: 1,
        service: 'Electrician',
        provider: 'John Smith',
        date: '2024-01-15',
        time: 'Morning',
        status: 'upcoming',
        price: '$150',
        location: '123 Main St, New York'
    },
    {
        id: 2,
        service: 'Plumber',
        provider: 'Maria Garcia',
        date: '2023-12-20',
        time: 'Afternoon',
        status: 'completed',
        price: '$120',
        location: '456 Oak Ave, Los Angeles',
        review: {
            rating: 5,
            comment: 'Excellent service! Fixed the leak quickly and professionally.'
        }
    },
    {
        id: 3,
        service: 'Carpenter',
        provider: 'David Johnson',
        date: '2023-12-10',
        time: 'Evening',
        status: 'completed',
        price: '$200',
        location: '789 Pine St, Chicago',
        review: {
            rating: 4,
            comment: 'Good work, but took longer than expected.'
        }
    },
    {
        id: 4,
        service: 'Car Mechanic',
        provider: 'Sarah Wilson',
        date: '2023-11-30',
        time: 'Morning',
        status: 'cancelled',
        price: '$80',
        location: '321 Elm St, Houston'
    }
];

function displayBookings(bookings) {
    const container = document.getElementById('bookings-container');
    container.innerHTML = '';

    if (bookings.length === 0) {
        container.innerHTML = '<p class="no-bookings">No bookings found in this category.</p>';
        return;
    }

    bookings.forEach(booking => {
        const bookingCard = document.createElement('div');
        bookingCard.className = `booking-card ${booking.status}`;
        bookingCard.innerHTML = `
            <div class="booking-header">
                <h3>${booking.service} - ${booking.provider}</h3>
                <span class="status ${booking.status}">${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span>
            </div>
            <div class="booking-details">
                <p><strong>Date:</strong> ${formatDate(booking.date)}</p>
                <p><strong>Time:</strong> ${booking.time}</p>
                <p><strong>Location:</strong> ${booking.location}</p>
                <p><strong>Price:</strong> ${booking.price}</p>
            </div>
            <div class="booking-actions">
                ${getBookingActions(booking)}
            </div>
        `;
        container.appendChild(bookingCard);
    });
}

function getBookingActions(booking) {
    switch (booking.status) {
        case 'upcoming':
            return `
                <button class="action-btn edit" onclick="editBooking(${booking.id})">Edit</button>
                <button class="action-btn cancel" onclick="cancelBooking(${booking.id})">Cancel</button>
                <button class="action-btn contact" onclick="contactProvider(${booking.id})">Contact Provider</button>
            `;
        case 'completed':
            if (booking.review) {
                return `
                    <button class="action-btn review" onclick="viewReview(${booking.id})">View Review</button>
                    <button class="action-btn book-again" onclick="bookAgain(${booking.id})">Book Again</button>
                `;
            } else {
                return `
                    <button class="action-btn review" onclick="writeReview(${booking.id})">Write Review</button>
                    <button class="action-btn book-again" onclick="bookAgain(${booking.id})">Book Again</button>
                `;
            }
        case 'cancelled':
            return `
                <button class="action-btn book-again" onclick="bookAgain(${booking.id})">Book Again</button>
            `;
        default:
            return '';
    }
}

function showBookings(status) {
    // Update tab buttons
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Filter and display bookings
    const filteredBookings = sampleBookings.filter(booking => booking.status === status);
    displayBookings(filteredBookings);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

function editBooking(id) {
    showMessage('Edit booking functionality would open here.', 'info');
}

function cancelBooking(id) {
    if (confirm('Are you sure you want to cancel this booking?')) {
        showMessage('Booking cancelled successfully.', 'success');
        // In a real app, this would update the booking status
    }
}

function contactProvider(id) {
    showMessage('Contact provider functionality would open here.', 'info');
}

function writeReview(id) {
    window.location.href = `review.html?booking=${id}`;
}

function viewReview(id) {
    showMessage('View review functionality would open here.', 'info');
}

function bookAgain(id) {
    const booking = sampleBookings.find(b => b.id === id);
    if (booking) {
        // Pre-fill booking form with previous details
        localStorage.setItem('bookAgain', JSON.stringify(booking));
        window.location.href = 'booking.html';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    showBookings('upcoming');
});