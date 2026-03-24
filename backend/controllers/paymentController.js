const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const Earnings = require('../models/Earnings');
const { validationResult } = require('express-validator');

// @desc    Process payment
// @route   POST /api/payments
// @access  Private (Customer)
exports.processPayment = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { bookingId, paymentMethod } = req.body;

        // Find booking
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        if (booking.customer.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to pay for this booking' });
        }

        // Create payment
        const payment = new Payment({
            booking: bookingId,
            customer: req.user.id,
            provider: booking.provider,
            amount: booking.price.totalPrice,
            paymentMethod,
            status: 'completed',
            breakdown: {
                baseAmount: booking.price.basePrice,
                taxAmount: booking.price.taxAmount,
                discountAmount: booking.price.discountAmount,
                platformFee: booking.price.basePrice * 0.05,
                providerAmount: booking.price.totalPrice - (booking.price.basePrice * 0.05)
            }
        });

        payment.providerPayout = {
            status: 'processed',
            amount: payment.breakdown.providerAmount,
            processedAt: Date.now()
        };

        await payment.save();

        // Update earnings
        let earnings = await Earnings.findOne({ provider: booking.provider });
        if (!earnings) {
            earnings = new Earnings({ provider: booking.provider });
        }
        
        earnings.totalEarnings += payment.breakdown.providerAmount;
        earnings.availableBalance += payment.breakdown.providerAmount;
        earnings.totalJobs += 1;
        earnings.paymentHistory.push(payment._id);

        await earnings.save();

        res.status(201).json({
            success: true,
            message: 'Payment processed successfully',
            payment
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get payment history for customer
// @route   GET /api/payments/customer/history
// @access  Private (Customer)
exports.getCustomerPaymentHistory = async (req, res) => {
    try {
        const payments = await Payment.find({ customer: req.user.id })
            .populate('booking')
            .populate('provider', 'firstName lastName')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: payments.length,
            payments
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get payment history for provider
// @route   GET /api/payments/provider/history
// @access  Private (Provider)
exports.getProviderPaymentHistory = async (req, res) => {
    try {
        const payments = await Payment.find({ provider: req.user.id })
            .populate('booking')
            .populate('customer', 'firstName lastName')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: payments.length,
            payments
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single payment
// @route   GET /api/payments/:id
// @access  Private
exports.getPayment = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id)
            .populate('booking')
            .populate('customer')
            .populate('provider');

        if (!payment) {
            return res.status(404).json({ success: false, message: 'Payment not found' });
        }

        // Check authorization
        if (payment.customer.toString() !== req.user.id && payment.provider.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to access this payment' });
        }

        res.status(200).json({
            success: true,
            payment
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Refund payment
// @route   POST /api/payments/:id/refund
// @access  Private (Admin)
exports.refundPayment = async (req, res) => {
    try {
        const { refundReason } = req.body;
        let payment = await Payment.findById(req.params.id);

        if (!payment) {
            return res.status(404).json({ success: false, message: 'Payment not found' });
        }

        payment.status = 'refunded';
        payment.refundDetails = {
            refundAmount: payment.amount,
            refundReason,
            refundedAt: Date.now()
        };

        await payment.save();

        // Update earnings
        const earnings = await Earnings.findOne({ provider: payment.provider });
        if (earnings) {
            earnings.availableBalance -= payment.amount;
            earnings.totalEarnings -= payment.amount;
            await earnings.save();
        }

        res.status(200).json({
            success: true,
            message: 'Payment refunded successfully',
            payment
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
