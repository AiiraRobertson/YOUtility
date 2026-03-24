const express = require('express');
const { body } = require('express-validator');
const reviewController = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/reviews
// @desc    Create a review
// @access  Private (Customer)
router.post('/', protect, authorize('customer'), [
    body('bookingId', 'Booking ID is required').notEmpty(),
    body('rating', 'Rating must be between 1 and 5').isInt({ min: 1, max: 5 }),
    body('comment', 'Comment must be at least 10 characters').isLength({ min: 10 })
], reviewController.createReview);

// @route   GET /api/reviews/provider/:providerId
// @desc    Get reviews for provider
// @access  Public
router.get('/provider/:providerId', reviewController.getProviderReviews);

// @route   GET /api/reviews/customer/list
// @desc    Get all reviews for customer
// @access  Private (Customer)
router.get('/customer/list', protect, authorize('customer'), reviewController.getCustomerReviews);

// @route   GET /api/reviews/:id
// @desc    Get single review
// @access  Public
router.get('/:id', reviewController.getReview);

// @route   PUT /api/reviews/:id
// @desc    Update review
// @access  Private (Customer)
router.put('/:id', protect, authorize('customer'), reviewController.updateReview);

// @route   DELETE /api/reviews/:id
// @desc    Delete review
// @access  Private (Customer)
router.delete('/:id', protect, authorize('customer'), reviewController.deleteReview);

// @route   POST /api/reviews/:id/respond
// @desc    Add response to review
// @access  Private (Provider)
router.post('/:id/respond', protect, authorize('provider'), [
    body('responseText', 'Response text is required').notEmpty()
], reviewController.respondToReview);

module.exports = router;
