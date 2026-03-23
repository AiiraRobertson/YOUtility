// profile.js - Provider profile functionality

// Sample provider data (in a real app, this would come from an API)
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
    }
    // Add more providers as needed
};

const reviews = [
    { name: 'Alice Johnson', rating: 5, comment: 'Excellent work! Fixed my electrical issue quickly and professionally.', date: '2023-12-01' },
    { name: 'Bob Wilson', rating: 4, comment: 'Good service, arrived on time and did a thorough job.', date: '2023-11-28' },
    { name: 'Carol Brown', rating: 5, comment: 'Highly recommend! Very knowledgeable and trustworthy.', date: '2023-11-25' }
];

function displayProfile(provider) {
    const header = document.getElementById('profile-header');
    const details = document.getElementById('profile-details');

    header.innerHTML = `
        <div class="profile-image">${provider.image}</div>
        <div class="profile-summary">
            <h1>${provider.name}</h1>
            <p class="service-type">${provider.service}</p>
            <p class="location">📍 ${provider.location}</p>
            <div class="rating">
                <span class="stars">${'★'.repeat(Math.floor(provider.rating))}${'☆'.repeat(5 - Math.floor(provider.rating))}</span>
                <span class="rating-score">${provider.rating}</span>
                <span class="reviews">(${provider.reviews} reviews)</span>
            </div>
            <p class="price">${provider.price}</p>
        </div>
    `;

    details.innerHTML = `
        <h2>About ${provider.name}</h2>
        <p>${provider.description}</p>
        
        <h3>Contact Information</h3>
        <p><strong>Phone:</strong> ${provider.phone}</p>
        <p><strong>Email:</strong> ${provider.email}</p>
        
        <h3>Availability</h3>
        <p>${provider.availability}</p>
        
        <h3>Experience</h3>
        <p>${provider.experience} years in the field</p>
        
        <h3>Certifications</h3>
        <ul>
            ${provider.certifications.map(cert => `<li>${cert}</li>`).join('')}
        </ul>
        
        <h3>Services Offered</h3>
        <ul>
            ${provider.services.map(service => `<li>${service}</li>`).join('')}
        </ul>
    `;
}

function displayReviews() {
    const container = document.getElementById('reviews-container');
    
    reviews.forEach(review => {
        const reviewElement = document.createElement('div');
        reviewElement.className = 'review';
        reviewElement.innerHTML = `
            <div class="review-header">
                <strong>${review.name}</strong>
                <span class="review-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</span>
                <span class="review-date">${review.date}</span>
            </div>
            <p class="review-comment">${review.comment}</p>
        `;
        container.appendChild(reviewElement);
    });
}

function getProviderIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    const providerId = getProviderIdFromURL();
    const provider = providerData[providerId];

    if (provider) {
        displayProfile(provider);
        displayReviews();
    } else {
        document.querySelector('.profile-section').innerHTML = '<p>Provider not found.</p>';
    }

    // Update booking link with provider ID
    const bookBtn = document.querySelector('.book-now-btn');
    if (bookBtn && providerId) {
        bookBtn.href = `booking.html?provider=${providerId}`;
    }
});