// review.js - Review functionality

document.addEventListener('DOMContentLoaded', function() {
    loadBookingInfo();
});

function loadBookingInfo() {
    // In a real app, this would get the booking ID from URL params
    // and fetch booking details from the server
    const bookingInfo = document.getElementById('booking-info');
    
    // Sample booking info (would be fetched based on booking ID)
    bookingInfo.innerHTML = `
        <h2>Service: Electrician</h2>
        <p><strong>Provider:</strong> John Smith</p>
        <p><strong>Date:</strong> December 20, 2023</p>
        <p><strong>Location:</strong> 123 Main St, New York</p>
    `;
}

document.getElementById('reviewForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Collect review data
    const reviewData = {
        rating: document.querySelector('input[name="rating"]:checked')?.value,
        title: document.getElementById('review-title').value,
        comment: document.getElementById('review-comment').value,
        recommend: document.querySelector('input[name="recommend"]:checked')?.value
    };

    // Validate review form
    if (!validateReviewForm(reviewData)) {
        return;
    }

    // Simulate submitting review
    showMessage('Submitting review...', 'info');
    
    setTimeout(() => {
        showMessage('Review submitted successfully! Thank you for your feedback.', 'success');
        
        // Redirect to booking history
        setTimeout(() => {
            window.location.href = 'history.html';
        }, 2000);
    }, 2000);
});

function validateReviewForm(data) {
    if (!data.rating) {
        showMessage('Please select a rating.', 'error');
        return false;
    }

    if (!data.title.trim()) {
        showMessage('Please provide a review title.', 'error');
        return false;
    }

    if (!data.comment.trim()) {
        showMessage('Please write a review comment.', 'error');
        return false;
    }

    if (data.comment.trim().length < 10) {
        showMessage('Please write a more detailed review (at least 10 characters).', 'error');
        return false;
    }

    if (!data.recommend) {
        showMessage('Please indicate if you would recommend this service.', 'error');
        return false;
    }

    return true;
}

// Star rating functionality
document.querySelectorAll('.rating-stars label').forEach((label, index) => {
    label.addEventListener('click', function() {
        // Remove active class from all stars
        document.querySelectorAll('.rating-stars label').forEach(l => l.classList.remove('active'));
        
        // Add active class to clicked star and previous stars
        for (let i = 0; i <= index; i++) {
            document.querySelectorAll('.rating-stars label')[i].classList.add('active');
        }
    });
});