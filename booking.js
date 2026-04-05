// booking.js - Booking form functionality

// Provider data (same as in profile.js)
const providerData = {
    1: {
        name: 'John Smith',
        service: 'Electrician',
        location: 'New York, NY',
        rating: 4.8,
        reviews: 45,
        experience: 10,
        description: 'Certified electrician with 10+ years of experience in residential and commercial electrical work. Specializing in wiring, lighting installations, and electrical repairs.',
        price: '$50/hour',
        image: '👨‍🔧',
        phone: '(555) 123-4567',
        email: 'john.smith@email.com',
        availability: 'Mon-Fri 8AM-6PM',
        certifications: ['Licensed Electrician', 'OSHA Certified', 'First Aid Certified'],
        services: ['Wiring Installation', 'Lighting Repair', 'Outlet Installation', 'Electrical Safety Inspection', 'Generator Installation']
    },
    2: {
        name: 'Maria Garcia',
        service: 'Plumber',
        location: 'Los Angeles, CA',
        rating: 4.9,
        reviews: 62,
        experience: 8,
        description: 'Licensed plumber specializing in leak repairs, installations, and emergency plumbing services. Available 24/7 for emergencies.',
        price: '$60/hour',
        image: '👩‍🔧',
        phone: '(555) 987-6543',
        email: 'maria.garcia@email.com',
        availability: 'Mon-Sat 7AM-8PM',
        certifications: ['Licensed Plumber', 'EPA Lead Certified', 'Backflow Certified'],
        services: ['Leak Repair', 'Pipe Installation', 'Drain Cleaning', 'Water Heater Repair', 'Emergency Services']
    },
    3: {
        name: 'David Johnson',
        service: 'Carpenter',
        location: 'Chicago, IL',
        rating: 4.7,
        reviews: 38,
        experience: 12,
        description: 'Skilled carpenter offering custom furniture, renovations, and repair services.',
        price: '$55/hour',
        image: '👨‍🏭',
        phone: '(555) 456-7890',
        email: 'david.johnson@email.com',
        availability: 'Mon-Sat 8AM-5PM',
        certifications: ['Licensed Carpenter', 'Certified Woodworker'],
        services: ['Custom Furniture', 'Renovations', 'Repairs', 'Installations']
    },
    4: {
        name: 'Sarah Wilson',
        service: 'Car Mechanic',
        location: 'Houston, TX',
        rating: 4.6,
        reviews: 29,
        experience: 7,
        description: 'Certified auto mechanic with expertise in engine repair and maintenance.',
        price: '$45/hour',
        image: '👩‍🔧',
        phone: '(555) 321-0987',
        email: 'sarah.wilson@email.com',
        availability: 'Tue-Sat 9AM-6PM',
        certifications: ['ASE Certified', 'Auto Repair License'],
        services: ['Engine Repair', 'Maintenance', 'Diagnostics', 'Brake Service']
    },
    5: {
        name: 'Mike Brown',
        service: 'Painter',
        location: 'Phoenix, AZ',
        rating: 4.8,
        reviews: 51,
        experience: 7,
        description: 'Professional painter providing interior and exterior painting services.',
        price: '$40/hour',
        image: '👨‍🎨',
        phone: '(555) 654-3210',
        email: 'mike.brown@email.com',
        availability: 'Mon-Fri 7AM-4PM',
        certifications: ['Licensed Painter', 'EPA Lead-Safe Certified'],
        services: ['Interior Painting', 'Exterior Painting', 'Wallpaper Installation']
    },
    6: {
        name: 'Lisa Davis',
        service: 'Barber',
        location: 'Philadelphia, PA',
        rating: 4.9,
        reviews: 78,
        experience: 5,
        description: 'Experienced barber offering modern cuts, traditional shaves, and styling.',
        price: '$30/hour',
        image: '👩‍💼',
        phone: '(555) 789-0123',
        email: 'lisa.davis@email.com',
        availability: 'Wed-Sun 10AM-7PM',
        certifications: ['Licensed Barber', 'Cosmetology License'],
        services: ['Haircuts', 'Shaves', 'Styling', 'Coloring']
    },
    7: {
        name: 'Chef Antonio',
        service: 'Chef',
        location: 'Miami, FL',
        rating: 4.7,
        reviews: 34,
        experience: 15,
        description: 'Professional chef specializing in Italian cuisine for events and private dinners.',
        price: '$75/hour',
        image: '👨‍🍳',
        phone: '(555) 012-3456',
        email: 'chef.antonio@email.com',
        availability: 'Fri-Sun 5PM-11PM',
        certifications: ['Culinary Arts Degree', 'Food Safety Certified'],
        services: ['Event Catering', 'Private Dinners', 'Cooking Classes']
    },
    8: {
        name: 'Emma Taylor',
        service: 'Hair Stylist',
        location: 'Seattle, WA',
        rating: 4.8,
        reviews: 67,
        experience: 6,
        description: 'Creative hair stylist offering cuts, colors, and special occasion styling.',
        price: '$50/hour',
        image: '👩‍💇‍♀️',
        phone: '(555) 345-6789',
        email: 'emma.taylor@email.com',
        availability: 'Tue-Sat 9AM-6PM',
        certifications: ['Licensed Cosmetologist', 'Color Specialist'],
        services: ['Haircuts', 'Coloring', 'Styling', 'Special Occasions']
    }
};

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

    // Get provider ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const providerId = urlParams.get('provider');

    // Store booking data (in a real app, this would be sent to a server)
    const bookingData = {
        ...formData,
        providerId: providerId,
        timestamp: new Date().toISOString()
    };
    localStorage.setItem('currentBooking', JSON.stringify(bookingData));

    // Show success message
    showMessage('Booking request submitted successfully!', 'success');

    // Show provider information if provider is selected
    if (providerId && providerData[providerId]) {
        displayProviderInfo(providerId);
    }

    // Redirect to payment page after showing provider info
    setTimeout(() => {
        window.location.href = 'payment.html';
    }, 3000); // 3 seconds delay to show provider info
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

// Show message function
function showMessage(message, type = 'info') {
    // Remove any existing message
    const existingMsg = document.querySelector('.booking-message');
    if (existingMsg) {
        existingMsg.remove();
    }

    // Create message element
    const msgEl = document.createElement('div');
    msgEl.className = 'booking-message';
    msgEl.textContent = message;
    msgEl.style.position = 'fixed';
    msgEl.style.top = '20px';
    msgEl.style.right = '20px';
    msgEl.style.padding = '15px 20px';
    msgEl.style.borderRadius = '8px';
    msgEl.style.zIndex = '9999';
    msgEl.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    msgEl.style.fontWeight = '500';
    msgEl.style.maxWidth = '400px';
    msgEl.style.wordWrap = 'break-word';

    if (type === 'success') {
        msgEl.style.backgroundColor = '#d4edda';
        msgEl.style.color = '#155724';
        msgEl.style.border = '1px solid #c3e6cb';
    } else if (type === 'error') {
        msgEl.style.backgroundColor = '#f8d7da';
        msgEl.style.color = '#721c24';
        msgEl.style.border = '1px solid #f5c6cb';
    } else {
        msgEl.style.backgroundColor = '#d1ecf1';
        msgEl.style.color = '#0c5460';
        msgEl.style.border = '1px solid #bee5eb';
    }

    document.body.appendChild(msgEl);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (msgEl.parentNode) {
            msgEl.remove();
        }
    }, 5000);
}

function displayProviderInfo(providerId) {
    const provider = providerData[providerId];
    if (!provider) return;

    const providerInfoSection = document.getElementById('provider-info-section');
    const providerDetails = document.getElementById('provider-details');

    providerDetails.innerHTML = `
        <div class="provider-header">
            <div class="provider-image">${provider.image}</div>
            <div class="provider-summary">
                <h3>${provider.name}</h3>
                <p class="service-type">${provider.service}</p>
                <p class="location">📍 ${provider.location}</p>
                <div class="rating">
                    <span class="stars">${'★'.repeat(Math.floor(provider.rating))}${'☆'.repeat(5 - Math.floor(provider.rating))}</span>
                    <span class="rating-score">${provider.rating}</span>
                    <span class="reviews">(${provider.reviews} reviews)</span>
                </div>
                <p class="price">${provider.price}</p>
            </div>
        </div>
        <div class="provider-contact">
            <h4>Contact Information</h4>
            <p><strong>Phone:</strong> ${provider.phone}</p>
            <p><strong>Email:</strong> ${provider.email}</p>
            <p><strong>Availability:</strong> ${provider.availability}</p>
        </div>
        <div class="provider-about">
            <h4>About</h4>
            <p>${provider.description}</p>
            <p><strong>Experience:</strong> ${provider.experience} years</p>
        </div>
        <div class="provider-services">
            <h4>Services Offered</h4>
            <ul>
                ${provider.services.map(service => `<li>${service}</li>`).join('')}
            </ul>
        </div>
        <div class="provider-certifications">
            <h4>Certifications</h4>
            <ul>
                ${provider.certifications.map(cert => `<li>${cert}</li>`).join('')}
            </ul>
        </div>
    `;

    // Show the provider info section
    providerInfoSection.style.display = 'block';

    // Scroll to the provider info section
    providerInfoSection.scrollIntoView({ behavior: 'smooth' });
}

// Validation functions
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;
    return re.test(String(email).toLowerCase());
}

function validatePhone(phone) {
    const re = /^\+?[0-9\s\-().]{7,20}$/;
    return re.test(String(phone).trim());
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