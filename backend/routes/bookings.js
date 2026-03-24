const express = require('express');
const { body } = require('express-validator');
const bookingController = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private (Customer)
router.post('/', protect, authorize('customer'), [
    body('serviceType', 'Service type is required').notEmpty(),
    body('description', 'Description is required').notEmpty(),
    body('scheduledDate', 'Scheduled date is required').notEmpty(),
    body('scheduledTime', 'Scheduled time is required').notEmpty(),
    body('duration', 'Duration is required').notEmpty(),
    body('location', 'Location is required').notEmpty()
], bookingController.createBooking);

// @route   GET /api/bookings/customer/list
// @desc    Get all bookings for customer
// @access  Private (Customer)
router.get('/customer/list', protect, authorize('customer'), bookingController.getCustomerBookings);

// @route   GET /api/bookings/provider/list
// @desc    Get all bookings for provider
// @access  Private (Provider)
router.get('/provider/list', protect, authorize('provider'), bookingController.getProviderBookings);

// @route   GET /api/bookings/available
// @desc    Get pending bookings for providers
// @access  Private (Provider)
router.get('/available', protect, authorize('provider'), bookingController.getAvailableBookings);

// @route   GET /api/bookings/:id
// @desc    Get single booking
// @access  Private
router.get('/:id', protect, bookingController.getBooking);

// @route   PUT /api/bookings/:id/accept
// @desc    Accept booking
// @access  Private (Provider)
router.put('/:id/accept', protect, authorize('provider'), bookingController.acceptBooking);

// @route   PUT /api/bookings/:id/reject
// @desc    Reject booking
// @access  Private (Provider)
router.put('/:id/reject', protect, authorize('provider'), [
    body('reason', 'Reason is required').notEmpty()
], bookingController.rejectBooking);

// @route   PUT /api/bookings/:id/start
// @desc    Start booking
// @access  Private (Provider)
router.put('/:id/start', protect, authorize('provider'), bookingController.startBooking);

// @route   PUT /api/bookings/:id/progress
// @desc    Update booking progress
// @access  Private (Provider)
router.put('/:id/progress', protect, authorize('provider'), [
    body('progress', 'Progress percentage is required').notEmpty()
], bookingController.updateProgress);

// @route   PUT /api/bookings/:id/complete
// @desc    Complete booking
// @access  Private (Provider)
router.put('/:id/complete', protect, authorize('provider'), bookingController.completeBooking);

// @route   PUT /api/bookings/:id/cancel
// @desc    Cancel booking
// @access  Private (Customer)
router.put('/:id/cancel', protect, authorize('customer'), [
    body('reason', 'Reason is required').notEmpty()
], bookingController.cancelBooking);

module.exports = router;
