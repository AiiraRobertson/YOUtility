// booking.js - Booking form functionality

document.getElementById('bookingForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Collect form data
    const formData = {
        serviceType: document.getElementById('service-type').value,
        serviceDescription: document.getElementById('service-description').value,
        preferredDate: document.getElementById('preferred-date').value,
        preferredTime: document.getElementById('preferred-time').value,
        duration: document.getElementById('duration').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        zipcode: document.getElementById('zipcode').value,
        contactName: document.getElementById('contact-name').value,
        contactPhone: document.getElementById('contact-phone').value,
        contactEmail: document.getElementById('contact-email').value,
        specialRequests: document.getElementById('special-requests').value,
        termsAgreed: document.getElementById('terms-agree').checked
    };

    // Validate form
    if (!validateBookingForm(formData)) {
        return;
    }

    // Store booking data (in a real app, this would be sent to a server)
    localStorage.setItem('currentBooking', JSON.stringify(formData));

    // Redirect to payment page
    showMessage('Booking details saved! Redirecting to payment...', 'success');
    setTimeout(() => {
        window.location.href = 'payment.html';
    }, 1500);
});

function validateBookingForm(data) {
    if (!data.serviceType) {
        showMessage('Please select a service type.', 'error');
        return false;
    }

    if (!data.serviceDescription.trim()) {
        showMessage('Please provide a service description.', 'error');
        return false;
    }

    if (!data.preferredDate) {
        showMessage('Please select a preferred date.', 'error');
        return false;
    }

    // Check if selected date is in the future
    const selectedDate = new Date(data.preferredDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
        showMessage('Please select a future date.', 'error');
        return false;
    }

    if (!data.preferredTime) {
        showMessage('Please select a preferred time.', 'error');
        return false;
    }

    if (!data.duration) {
        showMessage('Please select an estimated duration.', 'error');
        return false;
    }

    if (!data.address.trim()) {
        showMessage('Please provide an address.', 'error');
        return false;
    }

    if (!data.city.trim()) {
        showMessage('Please provide a city.', 'error');
        return false;
    }

    if (!data.zipcode.trim()) {
        showMessage('Please provide a ZIP code.', 'error');
        return false;
    }

    if (!data.contactName.trim()) {
        showMessage('Please provide your full name.', 'error');
        return false;
    }

    if (!validatePhone(data.contactPhone)) {
        showMessage('Please provide a valid phone number.', 'error');
        return false;
    }

    if (!validateEmail(data.contactEmail)) {
        showMessage('Please provide a valid email address.', 'error');
        return false;
    }

    if (!data.termsAgreed) {
        showMessage('Please agree to the Terms of Service and Privacy Policy.', 'error');
        return false;
    }

    return true;
}

// Set minimum date for date picker
document.addEventListener('DOMContentLoaded', function() {
    const dateInput = document.getElementById('preferred-date');
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const minDate = tomorrow.toISOString().split('T')[0];
    dateInput.min = minDate;
});