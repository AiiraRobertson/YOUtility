// provider-dashboard.js - Provider dashboard functionality

// Bookings will be loaded from API
let providerBookings = [];

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadProviderBookings();

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

// Load provider bookings from API
async function loadProviderBookings() {
    try {
        const result = await bookingAPI.getProviderBookings();
        if (result && result.bookings && Array.isArray(result.bookings)) {
            // Map API data to frontend format
            providerBookings = result.bookings.map(booking => ({
                id: booking._id || booking.id,
                customerName: booking.customer?.firstName + ' ' + booking.customer?.lastName || 'Unknown',
                customerPhone: booking.customer?.phone || '',
                customerEmail: booking.customer?.email || '',
                service: booking.service?.name || booking.service || 'Service',
                description: booking.description || '',
                date: booking.scheduledDate || new Date(),
                time: booking.scheduledTime || '',
                duration: booking.duration || 0,
                address: booking.location?.street + ', ' + booking.location?.city || 'Address not provided',
                price: booking.price?.totalPrice || 0,
                status: booking.status || 'pending',
                progress: booking.progress || 0,
                createdAt: booking.createdAt,
                acceptedAt: booking.acceptedAt,
                startedAt: booking.startedAt,
                completedAt: booking.completedAt,
                rating: booking.rating,
                review: booking.review,
                notes: booking.notes || ''
            }));
        } else {
            console.warn('Unexpected API response format:', result);
            providerBookings = [];
        }
    } catch (error) {
        console.error('Error loading bookings from API:', error);
        // Fallback to empty array if API fails
        providerBookings = [];
    }
    
    // Initialize dashboard UI
    loadDashboardStats();
    showDashboardTab('incoming');
}

// Simple message display function for this page
function showMessage(message, type = 'info') {
    console.log(`[${type.toUpperCase()}] ${message}`);
}

function getProviderRelevantBookings() {
    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser.isProvider || !currentUser.serviceType) {
        return providerBookings;
    }

    const normalizedService = currentUser.serviceType.trim().toLowerCase();
    return providerBookings.filter(booking => booking.service.trim().toLowerCase() === normalizedService);
}

function loadDashboardStats() {
    const relevantBookings = getProviderRelevantBookings();

    const stats = {
        pending: relevantBookings.filter(b => b.status === 'pending').length,
        active: relevantBookings.filter(b => b.status === 'accepted' || b.status === 'in_progress').length,
        completed: relevantBookings.filter(b => b.status === 'completed').length,
        earnings: relevantBookings
            .filter(b => b.status === 'completed')
            .reduce((total, booking) => total + booking.price, 0)
    };

    document.getElementById('pending-count').textContent = stats.pending;
    document.getElementById('active-count').textContent = stats.active;
    document.getElementById('completed-count').textContent = stats.completed;
    document.getElementById('earnings-total').textContent = `$${stats.earnings}`;
}

function showDashboardTab(tabName, event) {
    // Update tab buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    if (event && event.target) {
        event.target.classList.add('active');
    }

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
        case 'profile':
            contentContainer.innerHTML = generateProviderProfileHTML();
            setupProfileForm();
            break;
        default:
            contentContainer.innerHTML = '<p>Unknown tab.</p>';
            break;
    }
}

function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem('youutilityCurrentUser')) || null;
    } catch (err) {
        return null;
    }
}

function saveCurrentUser(user) {
    if (!user || !user.email) return;

    const existingUsers = JSON.parse(localStorage.getItem('youutilityUsers') || '[]');
    const updatedUsers = existingUsers.map(u => (u.email === user.email ? { ...u, ...user } : u));
    localStorage.setItem('youutilityUsers', JSON.stringify(updatedUsers));
    localStorage.setItem('youutilityCurrentUser', JSON.stringify(user));
}

function generateProviderProfileHTML() {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        return '<p>No user logged in. Please <a href="login.html">login</a>.</p>';
    }

    return `
        <div class="profile-edit-section">
            <h2>My Provider Profile</h2>
            <form id="provider-profile-form" class="provider-profile-form">
                <label>Full Name</label>
                <input id="profile-name" name="name" type="text" value="${currentUser.name || ''}" required />

                <label>Email (readonly)</label>
                <input id="profile-email" name="email" type="email" value="${currentUser.email || ''}" readonly />

                <label>Phone</label>
                <input id="profile-phone" name="phone" type="text" value="${currentUser.phone || ''}" required />

                <label>Service Type</label>
                <input id="profile-service-type" name="serviceType" type="text" value="${currentUser.serviceType || ''}" required />

                <label>Years of Experience</label>
                <input id="profile-experience" name="experience" type="number" min="0" value="${currentUser.experience || ''}" required />

                <label>Bio</label>
                <textarea id="profile-bio" name="bio" rows="4">${currentUser.bio || ''}</textarea>

                <label>Hourly Rate</label>
                <input id="profile-price" name="price" type="text" value="${currentUser.price || ''}" placeholder="$xx/hour" />

                <button type="submit" class="action-btn save-profile">Save Changes</button>
            </form>
            <div id="profile-save-message" class="auth-message" style="display:none; margin-top:12px;"></div>
        </div>
    `;
}

function setupProfileForm() {
    const profileForm = document.getElementById('provider-profile-form');
    if (!profileForm) return;

    profileForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const user = getCurrentUser();
        if (!user) return;

        const nameValue = document.getElementById('profile-name').value.trim();
        const nameParts = nameValue.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        const updatedData = {
            firstName,
            lastName,
            phone: document.getElementById('profile-phone').value.trim(),
            serviceType: document.getElementById('profile-service-type').value.trim(),
            experience: document.getElementById('profile-experience').value.trim(),
            bio: document.getElementById('profile-bio').value.trim(),
            price: document.getElementById('profile-price').value.trim()
        };

        if (firstName.length < 2) {
            showMessage('Please enter a valid first name.', 'error');
            return;
        }

        try {
            // Call API to update profile
            const result = await window.API.user.updateProfile(updatedData);
            if (result.success) {
                // Update localStorage with the response
                const updatedUser = { ...user, ...updatedData };
                saveCurrentUser(updatedUser);
                
                document.getElementById('profile-save-message').textContent = 'Profile updated successfully!';
                document.getElementById('profile-save-message').style.display = 'block';
                document.getElementById('profile-save-message').style.backgroundColor = '#4CAF50';
                document.getElementById('profile-save-message').style.color = '#fff';

                setTimeout(() => {
                    document.getElementById('profile-save-message').style.display = 'none';
                }, 2500);

                loadDashboardStats();
            } else {
                showMessage('Failed to update profile. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            showMessage('Error updating profile. Please try again.', 'error');
        }
    });
}


function generateIncomingBookingsHTML() {
    const pendingBookings = getProviderRelevantBookings().filter(b => b.status === 'pending');
    const currentUser = getCurrentUser();
    const serviceTypeLabel = currentUser && currentUser.serviceType ? currentUser.serviceType : 'your service';

    if (pendingBookings.length === 0) {
        return `
            <div class="no-bookings">
                <h3>No Incoming ${serviceTypeLabel} Bookings</h3>
                <p>You don't have any pending booking requests for ${serviceTypeLabel.toLowerCase()} at the moment.</p>
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
    const activeBookings = getProviderRelevantBookings().filter(b => b.status === 'accepted' || b.status === 'in_progress');

    if (activeBookings.length === 0) {
        return `
            <div class="no-bookings">
                <h3>No Active ${getCurrentUser()?.serviceType || 'Service'} Jobs</h3>
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
                            <button class="action-btn contact" onclick="contactCustomer(${booking.id})">
                                💬 Message Customer
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function generateJobHistoryHTML() {
    const completedBookings = getProviderRelevantBookings().filter(b => b.status === 'completed' || b.status === 'rejected');

    if (completedBookings.length === 0) {
        return `
            <div class="no-bookings">
                <h3>No ${getCurrentUser()?.serviceType || 'Job'} History</h3>
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
    const completedBookings = getProviderRelevantBookings().filter(b => b.status === 'completed');
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

    const monthlyJobs = getProviderRelevantBookings().filter(booking => {
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
    const ratedBookings = getProviderRelevantBookings().filter(b => b.rating);
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
async function acceptBooking(bookingId) {
    const booking = providerBookings.find(b => b.id === bookingId);
    const currentUser = getCurrentUser();
    if (booking && currentUser) {
        try {
            // Call API to accept booking
            const result = await bookingAPI.acceptBooking(bookingId);
            if (result && result.success) {
                booking.status = 'accepted';
                booking.acceptedAt = new Date().toISOString();
                
                // Create notification for customer
                addNotification(
                    booking.customerEmail,
                    'Job Accepted!',
                    `${currentUser.name} has accepted your ${booking.service} booking for ${formatDate(booking.date)}`,
                    bookingId
                );
                
                loadDashboardStats();
                closeModal();
                showMessage('Job accepted successfully! Opening messaging...', 'success');
                
                // Show messaging modal
                setTimeout(() => {
                    showMessagingModal(bookingId, currentUser);
                }, 500);
            } else {
                showMessage('Failed to accept job. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Error accepting booking:', error);
            showMessage('Error accepting job. Please try again.', 'error');
        }
    }

function showMessagingModal(bookingId, currentUser) {
    const booking = providerBookings.find(b => b.id === bookingId);
    if (!booking) return;

    const modal = document.getElementById('messaging-modal');
    if (!modal) return;

    const messagingBody = document.getElementById('messaging-body');
    messagingBody.innerHTML = generateMessagingUI(booking, currentUser, true);

    modal.style.display = 'block';

    // Auto-focus the message input
    setTimeout(() => {
        const messageInput = document.getElementById('message-input');
        if (messageInput) messageInput.focus();
    }, 100);
}

async function rejectBooking(bookingId) {
    const reason = document.getElementById('reject-reason').value;
    const booking = providerBookings.find(b => b.id === bookingId);
    if (booking) {
        try {
            // Call API to reject booking
            const result = await bookingAPI.rejectBooking(bookingId, reason);
            if (result && result.success) {
                booking.status = 'rejected';
                booking.rejectReason = reason;
                loadDashboardStats();
                showDashboardTab('incoming');
                closeModal();
                showMessage('Job rejected.', 'info');
            } else {
                showMessage('Failed to reject job. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Error rejecting booking:', error);
            showMessage('Error rejecting job. Please try again.', 'error');
        }
    }
}

async function startJob(bookingId) {
    const booking = providerBookings.find(b => b.id === bookingId);
    if (booking) {
        try {
            // Call API to start job
            const result = await bookingAPI.startBooking(bookingId);
            if (result && result.success) {
                booking.status = 'in_progress';
                booking.startedAt = new Date().toISOString();
                booking.progress = 10;
                loadDashboardStats();
                showDashboardTab('active');
                showMessage('Job started! Keep customers updated on progress.', 'success');
            } else {
                showMessage('Failed to start job. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Error starting job:', error);
            showMessage('Error starting job. Please try again.', 'error');
        }
    }
}

async function updateProgress(bookingId) {
    const progress = parseInt(document.getElementById('progress-percent').value);
    const notes = document.getElementById('progress-notes').value;

    const booking = providerBookings.find(b => b.id === bookingId);
    if (booking) {
        try {
            // Call API to update progress
            const result = await bookingAPI.updateProgress(bookingId, progress, notes);
            if (result && result.success) {
                booking.progress = progress;
                booking.notes = notes;
                showDashboardTab('active');
                closeModal();
                showMessage('Progress updated successfully!', 'success');
            } else {
                showMessage('Failed to update progress. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Error updating progress:', error);
            showMessage('Error updating progress. Please try again.', 'error');
        }
    }
}

async function completeJob(bookingId) {
    const booking = providerBookings.find(b => b.id === bookingId);
    if (booking) {
        try {
            // Call API to complete job
            const result = await bookingAPI.completeBooking(bookingId);
            if (result && result.success) {
                booking.status = 'completed';
                booking.completedAt = new Date().toISOString();
                loadDashboardStats();
                showDashboardTab('active');
                showMessage('Job marked as completed! Customer will be notified.', 'success');
            } else {
                showMessage('Failed to complete job. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Error completing job:', error);
            showMessage('Error completing job. Please try again.', 'error');
        }
    }
}

function contactCustomer(bookingId) {
    const booking = providerBookings.find(b => b.id === bookingId);
    const currentUser = getCurrentUser();
    if (booking && currentUser) {
        showMessagingModal(bookingId, currentUser);
    }
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
}