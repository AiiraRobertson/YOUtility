const express = require('express');
const { body } = require('express-validator');
const earningsController = require('../controllers/earningsController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/earnings
// @desc    Get provider earnings
// @access  Private (Provider)
router.get('/', protect, authorize('provider'), earningsController.getEarnings);

// @route   GET /api/earnings/monthly
// @desc    Get earnings breakdown by month
// @access  Private (Provider)
router.get('/monthly', protect, authorize('provider'), earningsController.getMonthlyEarnings);

// @route   GET /api/earnings/services
// @desc    Get earnings by service type
// @access  Private (Provider)
router.get('/services', protect, authorize('provider'), earningsController.getEarningsByService);

// @route   GET /api/earnings/stats
// @desc    Get provider stats
// @access  Private (Provider)
router.get('/stats', protect, authorize('provider'), earningsController.getEarningsStats);

// @route   POST /api/earnings/withdrawal
// @desc    Request withdrawal
// @access  Private (Provider)
router.post('/withdrawal', protect, authorize('provider'), [
    body('amount', 'Amount must be a positive number').isFloat({ min: 1 }),
    body('method', 'Withdrawal method is required').notEmpty()
], earningsController.requestWithdrawal);

// @route   GET /api/earnings/withdrawals
// @desc    Get withdrawal history
// @access  Private (Provider)
router.get('/withdrawals', protect, authorize('provider'), earningsController.getWithdrawalHistory);

module.exports = router;
