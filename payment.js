// payment.js - Payment functionality

document.addEventListener('DOMContentLoaded', function() {
    loadBookingSummary();
    updateTotalAmount();
});

function loadBookingSummary() {
    const bookingData = JSON.parse(localStorage.getItem('currentBooking'));
    const summaryContent = document.getElementById('booking-summary-content');

    if (bookingData) {
        // Calculate estimated price based on service and duration
        const basePrice = getServiceBasePrice(bookingData.serviceType);
        const durationMultiplier = parseInt(bookingData.duration);
        const serviceFee = basePrice * durationMultiplier;
        const platformFee = 5.00;
        const total = serviceFee + platformFee;

        summaryContent.innerHTML = `
            <p><strong>Service:</strong> ${bookingData.serviceType.charAt(0).toUpperCase() + bookingData.serviceType.slice(1)}</p>
            <p><strong>Description:</strong> ${bookingData.serviceDescription}</p>
            <p><strong>Date:</strong> ${formatDate(bookingData.preferredDate)}</p>
            <p><strong>Time:</strong> ${bookingData.preferredTime.charAt(0).toUpperCase() + bookingData.preferredTime.slice(1)}</p>
            <p><strong>Duration:</strong> ${bookingData.duration} hour(s)</p>
            <p><strong>Location:</strong> ${bookingData.address}, ${bookingData.city}</p>
            <p><strong>Contact:</strong> ${bookingData.contactName}</p>
        `;

        document.getElementById('service-fee').textContent = `$${serviceFee.toFixed(2)}`;
        document.getElementById('total-amount').textContent = `$${total.toFixed(2)}`;
    } else {
        summaryContent.innerHTML = '<p>No booking data found. Please go back and complete the booking form.</p>';
    }
}

function getServiceBasePrice(serviceType) {
    const prices = {
        electrician: 50,
        plumber: 60,
        carpenter: 55,
        mechanic: 45,
        painter: 40,
        barber: 30,
        chef: 75,
        other: 50
    };
    return prices[serviceType] || 50;
}

function updateTotalAmount() {
    // This function is called when the page loads, but in a real app
    // you might recalculate based on dynamic changes
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

document.getElementById('paymentForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Collect payment data
    const paymentData = {
        cardNumber: document.getElementById('card-number').value.replace(/\s/g, ''),
        expiryMonth: document.getElementById('expiry-month').value,
        expiryYear: document.getElementById('expiry-year').value,
        cvv: document.getElementById('cvv').value,
        billingName: document.getElementById('billing-name').value,
        billingAddress: document.getElementById('billing-address').value,
        billingCity: document.getElementById('billing-city').value,
        billingZip: document.getElementById('billing-zip').value
    };

    // Validate payment form
    if (!validatePaymentForm(paymentData)) {
        return;
    }

    // Simulate payment processing
    showMessage('Processing payment...', 'info');
    
    setTimeout(() => {
        // Simulate successful payment
        showMessage('Payment successful! Booking confirmed.', 'success');
        
        // Clear stored booking data
        localStorage.removeItem('currentBooking');
        
        // Redirect to booking history
        setTimeout(() => {
            window.location.href = 'history.html';
        }, 2000);
    }, 3000);
});

function validatePaymentForm(data) {
    // Basic card number validation (16 digits)
    if (!/^\d{16}$/.test(data.cardNumber)) {
        showMessage('Please enter a valid 16-digit card number.', 'error');
        return false;
    }

    if (!data.expiryMonth || !data.expiryYear) {
        showMessage('Please select card expiry date.', 'error');
        return false;
    }

    // Check if card is expired
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const expiryYear = parseInt(data.expiryYear);
    const expiryMonth = parseInt(data.expiryMonth);

    if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
        showMessage('Card has expired.', 'error');
        return false;
    }

    if (!/^\d{3,4}$/.test(data.cvv)) {
        showMessage('Please enter a valid CVV.', 'error');
        return false;
    }

    if (!data.billingName.trim()) {
        showMessage('Please enter the name on the card.', 'error');
        return false;
    }

    if (!data.billingAddress.trim()) {
        showMessage('Please enter billing address.', 'error');
        return false;
    }

    if (!data.billingCity.trim()) {
        showMessage('Please enter billing city.', 'error');
        return false;
    }

    if (!data.billingZip.trim()) {
        showMessage('Please enter billing ZIP code.', 'error');
        return false;
    }

    return true;
}

// Format card number input
document.getElementById('card-number').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\s/g, '');
    value = value.replace(/\D/g, '');
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    e.target.value = value;
});