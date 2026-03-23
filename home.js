// home.js - Home page functionality

const services = [
    { name: 'Electricians', category: 'home', description: 'Expert electrical services for your home and business.', icon: '⚡', color: '#FFD700' },
    { name: 'Plumbers', category: 'home', description: 'Reliable plumbing solutions for all your needs.', icon: '🔧', color: '#4169E1' },
    { name: 'Carpenters', category: 'home', description: 'Skilled carpentry work for construction and repairs.', icon: '🔨', color: '#8B4513' },
    { name: 'Solar Engineers', category: 'home', description: 'Renewable energy solutions with solar expertise.', icon: '☀️', color: '#FFA500' },
    { name: 'Vulcanizers', category: 'auto', description: 'Tire repair and maintenance services.', icon: '🛞', color: '#000000' },
    { name: 'Car Mechanics', category: 'auto', description: 'Professional auto repair and maintenance.', icon: '🚗', color: '#DC143C' },
    { name: 'Generator Mechanics', category: 'home', description: 'Generator repair and maintenance services.', icon: '⚙️', color: '#708090' },
    { name: 'Painters', category: 'home', description: 'Quality painting services for interiors and exteriors.', icon: '🎨', color: '#FF6347' },
    { name: 'Tilers', category: 'home', description: 'Professional tiling services for floors and walls.', icon: '🟦', color: '#00CED1' },
    { name: 'Barbers', category: 'beauty', description: 'Professional haircuts and grooming services.', icon: '✂️', color: '#2F4F4F' },
    { name: 'Hair Stylists', category: 'beauty', description: 'Expert hair styling and treatments.', icon: '💇‍♀️', color: '#FF69B4' },
    { name: 'Nail Technicians', category: 'beauty', description: 'Manicure and pedicure services.', icon: '💅', color: '#FFB6C1' },
    { name: 'Makeup Artists', category: 'beauty', description: 'Professional makeup services for events.', icon: '💄', color: '#8A2BE2' },
    { name: 'Photographers', category: 'other', description: 'Professional photography services.', icon: '📸', color: '#DDA0DD' },
    { name: 'Chefs/Cooks', category: 'food', description: 'Culinary experts for events and home cooking.', icon: '👨‍🍳', color: '#F4A460' },
    { name: 'Cleaners/Gardeners', category: 'home', description: 'Cleaning and gardening services.', icon: '🧹', color: '#32CD32' },
    { name: 'Tutors', category: 'other', description: 'Educational tutoring services.', icon: '📚', color: '#9370DB' },
    { name: 'Personal Trainers', category: 'other', description: 'Fitness and personal training services.', icon: '💪', color: '#FF4500' },
    { name: 'Event Planners', category: 'other', description: 'Professional event planning services.', icon: '🎉', color: '#FFDAB9' },
    { name: 'IT Support', category: 'other', description: 'Computer and technology support.', icon: '💻', color: '#4682B4' }
];

function displayServices(servicesToShow) {
    const container = document.getElementById('services-container');
    container.innerHTML = '';

    servicesToShow.forEach((service, index) => {
        const serviceCard = document.createElement('div');
        serviceCard.className = 'service-card';
        serviceCard.style.animationDelay = `${index * 0.1}s`;
        serviceCard.innerHTML = `
            <div class="service-icon" style="color: ${service.color}; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));">
                ${service.icon}
            </div>
            <h3>${service.name}</h3>
            <p>${service.description}</p>
            <a href="providers.html?service=${encodeURIComponent(service.name.toLowerCase())}" class="service-link">
                Find Providers
                <span class="arrow">→</span>
            </a>
        `;
        container.appendChild(serviceCard);
    });
}

function filterServices() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const categoryFilter = document.getElementById('category-filter').value;

    const filteredServices = services.filter(service => {
        const matchesSearch = service.name.toLowerCase().includes(searchTerm) ||
                             service.description.toLowerCase().includes(searchTerm);
        const matchesCategory = !categoryFilter || service.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    displayServices(filteredServices);
    
    // Add animation class to filtered results
    setTimeout(() => {
        document.querySelectorAll('.service-card').forEach(card => {
            card.classList.add('fade-in');
        });
    }, 100);
}

// Add search input animation
document.getElementById('search-input').addEventListener('focus', function() {
    this.parentElement.style.transform = 'scale(1.02)';
    this.parentElement.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.15)';
});

document.getElementById('search-input').addEventListener('blur', function() {
    this.parentElement.style.transform = 'scale(1)';
    this.parentElement.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
});

// Add hover effects to service cards
document.addEventListener('mouseover', function(e) {
    if (e.target.classList.contains('service-card') || e.target.closest('.service-card')) {
        const card = e.target.classList.contains('service-card') ? e.target : e.target.closest('.service-card');
        card.style.transform = 'translateY(-10px) rotate(1deg)';
    }
});

document.addEventListener('mouseout', function(e) {
    if (e.target.classList.contains('service-card') || e.target.closest('.service-card')) {
        const card = e.target.classList.contains('service-card') ? e.target : e.target.closest('.service-card');
        card.style.transform = 'translateY(0) rotate(0deg)';
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    displayServices(services);

    // Add event listeners for search and filter
    document.getElementById('search-input').addEventListener('input', filterServices);
    document.getElementById('category-filter').addEventListener('change', filterServices);
});