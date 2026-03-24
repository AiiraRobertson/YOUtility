const express = require('express');
const { body } = require('express-validator');
const paymentController = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/payments
// @desc    Process payment
// @access  Private (Customer)
router.post('/', protect, authorize('customer'), [
    body('bookingId', 'Booking ID is required').notEmpty(),
    body('paymentMethod', 'Payment method is required').isIn(['credit_card', 'debit_card', 'paypal', 'bank_transfer'])
], paymentController.processPayment);

// @route   GET /api/payments/customer/history
// @desc    Get payment history for customer
// @access  Private (Customer)
router.get('/customer/history', protect, authorize('customer'), paymentController.getCustomerPaymentHistory);

// @route   GET /api/payments/provider/history
// @desc    Get payment history for provider
// @access  Private (Provider)
router.get('/provider/history', protect, authorize('provider'), paymentController.getProviderPaymentHistory);

// @route   GET /api/payments/:id
// @desc    Get single payment
// @access  Private
router.get('/:id', protect, paymentController.getPayment);

// @route   POST /api/payments/:id/refund
// @desc    Refund payment
// @access  Private (Admin)
router.post('/:id/refund', protect, [
    body('refundReason', 'Refund reason is required').notEmpty()
], paymentController.refundPayment);

module.exports = router;
