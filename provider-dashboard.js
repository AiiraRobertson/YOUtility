// provider-dashboard.js - Provider dashboard functionality

// Sample provider bookings data (in a real app, this would come from a server)
const providerBookings = [
    {
        id: 1,
        customerName: 'Alice Johnson',
        customerPhone: '+1 (555) 123-4567',
        customerEmail: 'alice.johnson@email.com',
        service: 'Electrician',
        description: 'Fix outlet in kitchen and install new light fixture',
        date: '2024-01-20',
        time: 'Morning (9:00 AM - 12:00 PM)',
        duration: '3 hours',
        address: '123 Main St, New York, NY 10001',
        price: 180,
        status: 'pending', // pending, accepted, in_progress, completed, rejected
        createdAt: '2024-01-15T10:30:00Z',
        notes: ''
    },
    {
        id: 2,
        customerName: 'Bob Smith',
        customerPhone: '+1 (555) 234-5678',
        customerEmail: 'bob.smith@email.com',
        service: 'Plumber',
        description: 'Unclog bathroom sink and check for leaks',
        date: '2024-01-18',
        time: 'Afternoon (1:00 PM - 4:00 PM)',
        duration: '3 hours',
        address: '456 Oak Ave, Los Angeles, CA 90210',
        price: 150,
        status: 'accepted',
        createdAt: '2024-01-14T14:20:00Z',
        acceptedAt: '2024-01-14T16:45:00Z',
        notes: 'Customer mentioned slow draining'
    },
    {
        id: 3,
        customerName: 'Carol Davis',
        customerPhone: '+1 (555) 345-6789',
        customerEmail: 'carol.davis@email.com',
        service: 'Carpenter',
        description: 'Build custom shelves in home office',
        date: '2024-01-16',
        time: 'Morning (10:00 AM - 2:00 PM)',
        duration: '4 hours',
        address: '789 Pine St, Chicago, IL 60601',
        price: 250,
        status: 'in_progress',
        createdAt: '2024-01-12T09:15:00Z',
        acceptedAt: '2024-01-12T11:30:00Z',
        startedAt: '2024-01-16T10:15:00Z',
        progress: 60,
        notes: 'Materials: oak wood, brackets, screws'
    },
    {
        id: 4,
        customerName: 'David Wilson',
        customerPhone: '+1 (555) 456-7890',
        customerEmail: 'david.wilson@email.com',
        service: 'Car Mechanic',
        description: 'Oil change and brake inspection',
        date: '2024-01-10',
        time: 'Afternoon (2:00 PM - 5:00 PM)',
        duration: '3 hours',
        address: '321 Elm St, Houston, TX 77001',
        price: 120,
        status: 'completed',
        createdAt: '2024-01-08T13:45:00Z',
        acceptedAt: '2024-01-08T15:20:00Z',
        startedAt: '2024-01-10T14:00:00Z',
        completedAt: '2024-01-10T16:30:00Z',
        rating: 5,
        review: 'Excellent service! Very professional and thorough.',
        notes: 'Replaced brake pads, oil change completed'
    },
    {
        id: 5,
        customerName: 'Emma Brown',
        customerPhone: '+1 (555) 567-8901',
        customerEmail: 'emma.brown@email.com',
        service: 'Painter',
        description: 'Paint living room walls - 12x15 room',
        date: '2024-01-22',
        time: 'Morning (8:00 AM - 12:00 PM)',
        duration: '4 hours',
        address: '654 Maple Dr, Miami, FL 33101',
        price: 200,
        status: 'pending',
        createdAt: '2024-01-17T08:00:00Z',
        notes: ''
    },
    {
        id: 6,
        customerName: 'Frank Miller',
        customerPhone: '+1 (555) 678-9012',
        customerEmail: 'frank.miller@email.com',
        service: 'Electrician',
        description: 'Install ceiling fan in bedroom',
        date: '2024-01-12',
        time: 'Afternoon (1:00 PM - 3:00 PM)',
        duration: '2 hours',
        address: '987 Cedar Ln, Seattle, WA 98101',
        price: 140,
        status: 'completed',
        createdAt: '2024-01-10T10:30:00Z',
        acceptedAt: '2024-01-10T12:15:00Z',
        startedAt: '2024-01-12T13:00:00Z',
        completedAt: '2024-01-12T15:00:00Z',
        rating: 4,
        review: 'Good work, fan works perfectly.',
        notes: 'Used existing wiring, no issues'
    }
];

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadDashboardStats();
    showDashboardTab('incoming');

    // Modal close functionality
    document.querySelectorAll('.close-modal').forEach(closeBtn => {
        closeBtn.addEventListener('click', closeModal);
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                closeModal();
            }
        });
    });
});

function loadDashboardStats() {
    const stats = {
        pending: providerBookings.filter(b => b.status === 'pending').length,
        active: providerBookings.filter(b => b.status === 'accepted' || b.status === 'in_progress').length,
        completed: providerBookings.filter(b => b.status === 'completed').length,
        earnings: providerBookings
            .filter(b => b.status === 'completed')
            .reduce((total, booking) => total + booking.price, 0)
    };

    document.getElementById('pending-count').textContent = stats.pending;
    document.getElementById('active-count').textContent = stats.active;
    document.getElementById('completed-count').textContent = stats.completed;
    document.getElementById('earnings-total').textContent = `$${stats.earnings}`;
}

function showDashboardTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Load content based on tab
    const contentContainer = document.getElementById('dashboard-content');

    switch(tabName) {
        case 'incoming':
            contentContainer.innerHTML = generateIncomingBookingsHTML();
            break;
        case 'active':
            contentContainer.innerHTML = generateActiveJobsHTML();
            break;
        case 'completed':
            contentContainer.innerHTML = generateJobHistoryHTML();
            break;
        case 'earnings':
            contentContainer.innerHTML = generateEarningsHTML();
            break;
    }
}

function generateIncomingBookingsHTML() {
    const pendingBookings = providerBookings.filter(b => b.status === 'pending');

    if (pendingBookings.length === 0) {
        return `
            <div class="no-bookings">
                <h3>No Incoming Bookings</h3>
                <p>You don't have any pending booking requests at the moment.</p>
            </div>
        `;
    }

    return `
        <div class="bookings-section">
            <h2>Incoming Bookings</h2>
            <div class="bookings-grid">
                ${pendingBookings.map(booking => `
                    <div class="booking-card incoming-booking">
                        <div class="booking-header">
                            <h3>${booking.service}</h3>
                            <span class="booking-date">${formatDate(booking.date)}</span>
                        </div>
                        <div class="booking-details">
                            <div class="customer-info">
                                <strong>${booking.customerName}</strong>
                                <p>${booking.customerPhone}</p>
                                <p>${booking.customerEmail}</p>
                            </div>
                            <div class="service-info">
                                <p><strong>Description:</strong> ${booking.description}</p>
                                <p><strong>Time:</strong> ${booking.time}</p>
                                <p><strong>Duration:</strong> ${booking.duration}</p>
                                <p><strong>Location:</strong> ${booking.address}</p>
                                <p><strong>Price:</strong> $${booking.price}</p>
                            </div>
                        </div>
                        <div class="booking-actions">
                            <button class="action-btn accept" onclick="showAcceptModal(${booking.id})">
                                Accept Job
                            </button>
                            <button class="action-btn reject" onclick="showRejectModal(${booking.id})">
                                Reject Job
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function generateActiveJobsHTML() {
    const activeBookings = providerBookings.filter(b => b.status === 'accepted' || b.status === 'in_progress');

    if (activeBookings.length === 0) {
        return `
            <div class="no-bookings">
                <h3>No Active Jobs</h3>
                <p>You don't have any active jobs at the moment.</p>
            </div>
        `;
    }

    return `
        <div class="bookings-section">
            <h2>Active Jobs</h2>
            <div class="bookings-grid">
                ${activeBookings.map(booking => `
                    <div class="booking-card active-job">
                        <div class="booking-header">
                            <h3>${booking.service}</h3>
                            <span class="booking-status ${booking.status}">${formatStatus(booking.status)}</span>
                        </div>
                        <div class="booking-details">
                            <div class="customer-info">
                                <strong>${booking.customerName}</strong>
                                <p>${booking.customerPhone}</p>
                            </div>
                            <div class="service-info">
                                <p><strong>Description:</strong> ${booking.description}</p>
                                <p><strong>Date:</strong> ${formatDate(booking.date)}</p>
                                <p><strong>Time:</strong> ${booking.time}</p>
                                <p><strong>Location:</strong> ${booking.address}</p>
                                <p><strong>Price:</strong> $${booking.price}</p>
                            </div>
                            ${booking.status === 'in_progress' ? `
                                <div class="progress-section">
                                    <div class="progress-bar">
                                        <div class="progress-fill" style="width: ${booking.progress || 0}%"></div>
                                    </div>
                                    <span class="progress-text">${booking.progress || 0}% Complete</span>
                                </div>
                            ` : ''}
                        </div>
                        <div class="booking-actions">
                            ${booking.status === 'accepted' ? `
                                <button class="action-btn start" onclick="startJob(${booking.id})">
                                    Start Job
                                </button>
                            ` : booking.status === 'in_progress' ? `
                                <button class="action-btn update" onclick="showProgressModal(${booking.id})">
                                    Update Progress
                                </button>
                                <button class="action-btn complete" onclick="completeJob(${booking.id})">
                                    Mark Complete
                                </button>
                            ` : ''}
                            <button class="action-btn contact" onclick="contactCustomer(${booking.customerPhone})">
                                Contact Customer
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function generateJobHistoryHTML() {
    const completedBookings = providerBookings.filter(b => b.status === 'completed' || b.status === 'rejected');

    if (completedBookings.length === 0) {
        return `
            <div class="no-bookings">
                <h3>No Job History</h3>
                <p>You haven't completed any jobs yet.</p>
            </div>
        `;
    }

    return `
        <div class="bookings-section">
            <h2>Job History</h2>
            <div class="bookings-grid">
                ${completedBookings.map(booking => `
                    <div class="booking-card job-history ${booking.status === 'rejected' ? 'rejected' : ''}">
                        <div class="booking-header">
                            <h3>${booking.service}</h3>
                            <span class="booking-status ${booking.status}">${formatStatus(booking.status)}</span>
                        </div>
                        <div class="booking-details">
                            <div class="customer-info">
                                <strong>${booking.customerName}</strong>
                                <p>${booking.customerPhone}</p>
                            </div>
                            <div class="service-info">
                                <p><strong>Description:</strong> ${booking.description}</p>
                                <p><strong>Date:</strong> ${formatDate(booking.date)}</p>
                                <p><strong>Price:</strong> $${booking.price}</p>
                                ${booking.completedAt ? `<p><strong>Completed:</strong> ${formatDateTime(booking.completedAt)}</p>` : ''}
                            </div>
                            ${booking.rating ? `
                                <div class="review-section">
                                    <div class="rating">
                                        <span class="stars">${'★'.repeat(booking.rating)}${'☆'.repeat(5-booking.rating)}</span>
                                        <span class="rating-score">${booking.rating}/5</span>
                                    </div>
                                    ${booking.review ? `<p class="review-text">"${booking.review}"</p>` : ''}
                                </div>
                            ` : ''}
                        </div>
                        ${booking.status === 'completed' ? `
                            <div class="booking-actions">
                                <button class="action-btn review" onclick="viewReview(${booking.id})">
                                    View Review
                                </button>
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function generateEarningsHTML() {
    const completedBookings = providerBookings.filter(b => b.status === 'completed');
    const totalEarnings = completedBookings.reduce((total, booking) => total + booking.price, 0);
    const monthlyEarnings = calculateMonthlyEarnings();
    const averageRating = calculateAverageRating();

    return `
        <div class="earnings-section">
            <h2>Earnings Overview</h2>

            <div class="earnings-summary">
                <div class="summary-card total-earnings">
                    <h3>Total Earnings</h3>
                    <div class="amount">$${totalEarnings}</div>
                    <p>From ${completedBookings.length} completed jobs</p>
                </div>

                <div class="summary-card monthly-earnings">
                    <h3>This Month</h3>
                    <div class="amount">$${monthlyEarnings.thisMonth}</div>
                    <p>${monthlyEarnings.jobCount} jobs completed</p>
                </div>

                <div class="summary-card average-rating">
                    <h3>Average Rating</h3>
                    <div class="rating-display">
                        <span class="stars">${'★'.repeat(Math.floor(averageRating))}${'☆'.repeat(5-Math.floor(averageRating))}</span>
                        <span class="rating-score">${averageRating.toFixed(1)}/5</span>
                    </div>
                    <p>Based on ${completedBookings.filter(b => b.rating).length} reviews</p>
                </div>
            </div>

            <div class="earnings-breakdown">
                <h3>Earnings by Service Type</h3>
                <div class="service-breakdown">
                    ${generateServiceBreakdown()}
                </div>
            </div>

            <div class="recent-earnings">
                <h3>Recent Earnings</h3>
                <div class="earnings-list">
                    ${completedBookings.slice(-5).reverse().map(booking => `
                        <div class="earnings-item">
                            <div class="earnings-info">
                                <span class="service-type">${booking.service}</span>
                                <span class="customer-name">${booking.customerName}</span>
                                <span class="job-date">${formatDate(booking.completedAt || booking.date)}</span>
                            </div>
                            <div class="earnings-amount">$${booking.price}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

function calculateMonthlyEarnings() {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyJobs = providerBookings.filter(booking => {
        if (booking.status !== 'completed') return false;
        const completedDate = new Date(booking.completedAt || booking.date);
        return completedDate.getMonth() === currentMonth && completedDate.getFullYear() === currentYear;
    });

    return {
        thisMonth: monthlyJobs.reduce((total, booking) => total + booking.price, 0),
        jobCount: monthlyJobs.length
    };
}

function calculateAverageRating() {
    const ratedBookings = providerBookings.filter(b => b.rating);
    if (ratedBookings.length === 0) return 0;

    const totalRating = ratedBookings.reduce((sum, booking) => sum + booking.rating, 0);
    return totalRating / ratedBookings.length;
}

function generateServiceBreakdown() {
    const serviceEarnings = {};

    providerBookings.filter(b => b.status === 'completed').forEach(booking => {
        if (!serviceEarnings[booking.service]) {
            serviceEarnings[booking.service] = { earnings: 0, jobs: 0 };
        }
        serviceEarnings[booking.service].earnings += booking.price;
        serviceEarnings[booking.service].jobs += 1;
    });

    return Object.entries(serviceEarnings)
        .sort(([,a], [,b]) => b.earnings - a.earnings)
        .map(([service, data]) => `
            <div class="service-item">
                <span class="service-name">${service}</span>
                <span class="service-stats">${data.jobs} jobs • $${data.earnings}</span>
            </div>
        `).join('');
}

// Modal functions
function showAcceptModal(bookingId) {
    const booking = providerBookings.find(b => b.id === bookingId);
    if (!booking) return;

    const modal = document.getElementById('booking-modal');
    const modalBody = document.getElementById('modal-body');

    modalBody.innerHTML = `
        <h2>Accept Job Request</h2>
        <div class="booking-summary">
            <h3>${booking.service} - $${booking.price}</h3>
            <p><strong>Customer:</strong> ${booking.customerName}</p>
            <p><strong>Date:</strong> ${formatDate(booking.date)}</p>
            <p><strong>Time:</strong> ${booking.time}</p>
            <p><strong>Description:</strong> ${booking.description}</p>
        </div>
        <div class="modal-actions">
            <button class="action-btn accept" onclick="acceptBooking(${bookingId})">Accept Job</button>
            <button class="action-btn cancel" onclick="closeModal()">Cancel</button>
        </div>
    `;

    modal.style.display = 'block';
}

function showRejectModal(bookingId) {
    const booking = providerBookings.find(b => b.id === bookingId);
    if (!booking) return;

    const modal = document.getElementById('booking-modal');
    const modalBody = document.getElementById('modal-body');

    modalBody.innerHTML = `
        <h2>Reject Job Request</h2>
        <div class="booking-summary">
            <h3>${booking.service} - $${booking.price}</h3>
            <p><strong>Customer:</strong> ${booking.customerName}</p>
            <p><strong>Description:</strong> ${booking.description}</p>
        </div>
        <div class="form-group">
            <label for="reject-reason">Reason for rejection (optional):</label>
            <textarea id="reject-reason" rows="3" placeholder="Please provide a reason for rejecting this job..."></textarea>
        </div>
        <div class="modal-actions">
            <button class="action-btn reject" onclick="rejectBooking(${bookingId})">Reject Job</button>
            <button class="action-btn cancel" onclick="closeModal()">Cancel</button>
        </div>
    `;

    modal.style.display = 'block';
}

function showProgressModal(bookingId) {
    const booking = providerBookings.find(b => b.id === bookingId);
    if (!booking) return;

    const modal = document.getElementById('progress-modal');
    const modalBody = document.getElementById('progress-modal-body');

    modalBody.innerHTML = `
        <h2>Update Job Progress</h2>
        <div class="booking-summary">
            <h3>${booking.service}</h3>
            <p><strong>Customer:</strong> ${booking.customerName}</p>
            <p><strong>Description:</strong> ${booking.description}</p>
        </div>
        <div class="form-group">
            <label for="progress-percent">Progress Percentage:</label>
            <input type="range" id="progress-percent" min="0" max="100" value="${booking.progress || 0}" step="10">
            <span id="progress-value">${booking.progress || 0}%</span>
        </div>
        <div class="form-group">
            <label for="progress-notes">Progress Notes:</label>
            <textarea id="progress-notes" rows="3" placeholder="Update customer on job progress...">${booking.notes || ''}</textarea>
        </div>
        <div class="modal-actions">
            <button class="action-btn update" onclick="updateProgress(${bookingId})">Update Progress</button>
            <button class="action-btn cancel" onclick="closeModal()">Cancel</button>
        </div>
    `;

    // Update progress value display
    document.getElementById('progress-percent').addEventListener('input', function() {
        document.getElementById('progress-value').textContent = this.value + '%';
    });

    modal.style.display = 'block';
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

// Action functions
function acceptBooking(bookingId) {
    const booking = providerBookings.find(b => b.id === bookingId);
    if (booking) {
        booking.status = 'accepted';
        booking.acceptedAt = new Date().toISOString();
        loadDashboardStats();
        showDashboardTab('incoming');
        closeModal();
        showMessage('Job accepted successfully!', 'success');
    }
}

function rejectBooking(bookingId) {
    const reason = document.getElementById('reject-reason').value;
    const booking = providerBookings.find(b => b.id === bookingId);
    if (booking) {
        booking.status = 'rejected';
        booking.rejectReason = reason;
        loadDashboardStats();
        showDashboardTab('incoming');
        closeModal();
        showMessage('Job rejected.', 'info');
    }
}

function startJob(bookingId) {
    const booking = providerBookings.find(b => b.id === bookingId);
    if (booking) {
        booking.status = 'in_progress';
        booking.startedAt = new Date().toISOString();
        booking.progress = 10;
        loadDashboardStats();
        showDashboardTab('active');
        showMessage('Job started! Keep customers updated on progress.', 'success');
    }
}

function updateProgress(bookingId) {
    const progress = parseInt(document.getElementById('progress-percent').value);
    const notes = document.getElementById('progress-notes').value;

    const booking = providerBookings.find(b => b.id === bookingId);
    if (booking) {
        booking.progress = progress;
        booking.notes = notes;
        showDashboardTab('active');
        closeModal();
        showMessage('Progress updated successfully!', 'success');
    }
}

function completeJob(bookingId) {
    const booking = providerBookings.find(b => b.id === bookingId);
    if (booking) {
        booking.status = 'completed';
        booking.completedAt = new Date().toISOString();
        loadDashboardStats();
        showDashboardTab('active');
        showMessage('Job marked as completed! Customer will be notified.', 'success');
    }
}

function contactCustomer(phoneNumber) {
    window.location.href = `tel:${phoneNumber}`;
}

function viewReview(bookingId) {
    const booking = providerBookings.find(b => b.id === bookingId);
    if (booking && booking.review) {
        showMessage(`Review from ${booking.customerName}: "${booking.review}" (${booking.rating}/5 stars)`, 'info');
    }
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatStatus(status) {
    const statusMap = {
        'pending': 'Pending',
        'accepted': 'Accepted',
        'in_progress': 'In Progress',
        'completed': 'Completed',
        'rejected': 'Rejected'
    };
    return statusMap[status] || status;
}