// providers.js - Providers page functionality

const providers = [
    {
        id: 1,
        name: 'John Smith',
        service: 'electrician',
        location: 'New York',
        rating: 4.8,
        reviews: 45,
        experience: 10,
        description: 'Certified electrician with 10+ years of experience in residential and commercial electrical work.',
        price: '$50/hour',
        image: '👨‍🔧'
    },
    {
        id: 2,
        name: 'Maria Garcia',
        service: 'plumber',
        location: 'Los Angeles',
        rating: 4.9,
        reviews: 62,
        experience: 8,
        description: 'Licensed plumber specializing in leak repairs, installations, and emergency plumbing services.',
        price: '$60/hour',
        image: '👩‍🔧'
    },
    {
        id: 3,
        name: 'David Johnson',
        service: 'carpenter',
        location: 'Chicago',
        rating: 4.7,
        reviews: 38,
        experience: 12,
        description: 'Skilled carpenter offering custom furniture, renovations, and repair services.',
        price: '$55/hour',
        image: '👨‍🏭'
    },
    {
        id: 4,
        name: 'Sarah Wilson',
        service: 'mechanic',
        location: 'Houston',
        rating: 4.6,
        reviews: 29,
        description: 'Certified auto mechanic with expertise in engine repair and maintenance.',
        price: '$45/hour',
        image: '👩‍🔧'
    },
    {
        id: 5,
        name: 'Mike Brown',
        service: 'painter',
        location: 'Phoenix',
        rating: 4.8,
        reviews: 51,
        experience: 7,
        description: 'Professional painter providing interior and exterior painting services.',
        price: '$40/hour',
        image: '👨‍🎨'
    },
    {
        id: 6,
        name: 'Lisa Davis',
        service: 'barber',
        location: 'Philadelphia',
        rating: 4.9,
        reviews: 78,
        experience: 5,
        description: 'Experienced barber offering modern cuts, traditional shaves, and styling.',
        price: '$30/hour',
        image: '👩‍💼'
    },
    {
        id: 7,
        name: 'Chef Antonio',
        service: 'chef',
        location: 'Miami',
        rating: 4.7,
        reviews: 34,
        experience: 15,
        description: 'Professional chef specializing in Italian cuisine for events and private dinners.',
        price: '$75/hour',
        image: '👨‍🍳'
    },
    {
        id: 8,
        name: 'Emma Taylor',
        service: 'hair stylist',
        location: 'Seattle',
        rating: 4.8,
        reviews: 67,
        experience: 6,
        description: 'Creative hair stylist offering cuts, colors, and special occasion styling.',
        price: '$50/hour',
        image: '👩‍💇‍♀️'
    }
];

function displayProviders(providersToShow) {
    const container = document.getElementById('providers-container');
    container.innerHTML = '';

    if (providersToShow.length === 0) {
        container.innerHTML = '<p class="no-results">No providers found matching your criteria.</p>';
        return;
    }

    providersToShow.forEach(provider => {
        const providerCard = document.createElement('div');
        providerCard.className = 'provider-card';
        providerCard.innerHTML = `
            <div class="provider-image">${provider.image}</div>
            <div class="provider-info">
                <h3>${provider.name}</h3>
                <p class="service-type">${provider.service.charAt(0).toUpperCase() + provider.service.slice(1)}</p>
                <p class="location">📍 ${provider.location}</p>
                <div class="rating">
                    <span class="stars">${'★'.repeat(Math.floor(provider.rating))}${'☆'.repeat(5 - Math.floor(provider.rating))}</span>
                    <span class="rating-score">${provider.rating}</span>
                    <span class="reviews">(${provider.reviews} reviews)</span>
                </div>
                <p class="experience">${provider.experience} years experience</p>
                <p class="price">${provider.price}</p>
                <a href="profile.html?id=${provider.id}" class="view-profile-btn">View Profile</a>
            </div>
        `;
        container.appendChild(providerCard);
    });
}

// Get all unique services from providers array
function getUniqueServices() {
    const services = [...new Set(providers.map(provider => provider.service))];
    return services.sort();
}

// Populate service filter dropdown with all available services
function populateServiceFilter() {
    const serviceFilter = document.getElementById('service-filter');
    const uniqueServices = getUniqueServices();
    
    // Clear existing options except "All Services"
    serviceFilter.innerHTML = '<option value="">All Services</option>';
    
    // Add all unique services
    uniqueServices.forEach(service => {
        const option = document.createElement('option');
        option.value = service;
        option.textContent = service.charAt(0).toUpperCase() + service.slice(1);
        serviceFilter.appendChild(option);
    });
}

function filterProviders() {
    const serviceFilter = document.getElementById('service-filter').value.toLowerCase();
    const locationFilter = document.getElementById('location-filter').value.toLowerCase();
    const searchInput = document.getElementById('search-input') ? document.getElementById('search-input').value.toLowerCase() : '';

    const filteredProviders = providers.filter(provider => {
        const matchesService = !serviceFilter || provider.service.toLowerCase() === serviceFilter;
        const matchesLocation = !locationFilter || provider.location.toLowerCase().includes(locationFilter);
        const matchesSearch = !searchInput || 
            provider.name.toLowerCase().includes(searchInput) || 
            provider.service.toLowerCase().includes(searchInput) || 
            provider.description.toLowerCase().includes(searchInput) ||
            provider.location.toLowerCase().includes(searchInput);
        
        return matchesService && matchesLocation && matchesSearch;
    });

    displayProviders(filteredProviders);
}

// Get service from URL parameters
function getServiceFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('service');
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Populate service filter with all unique services
    populateServiceFilter();
    
    const serviceFromURL = getServiceFromURL();
    if (serviceFromURL) {
        document.getElementById('service-filter').value = serviceFromURL.toLowerCase();
    }

    displayProviders(providers);

    // Add event listeners
    document.getElementById('service-filter').addEventListener('change', filterProviders);
    document.getElementById('location-filter').addEventListener('input', filterProviders);
    
    // Add search input listener if it exists
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', filterProviders);
    }
    
    document.getElementById('search-btn').addEventListener('click', filterProviders);
});