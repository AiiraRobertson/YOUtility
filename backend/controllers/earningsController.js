const Earnings = require('../models/Earnings');
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');

// @desc    Get provider earnings
// @route   GET /api/earnings
// @access  Private (Provider)
exports.getEarnings = async (req, res) => {
    try {
        let earnings = await Earnings.findOne({ provider: req.user.id })
            .populate('paymentHistory');

        if (!earnings) {
            earnings = new Earnings({ provider: req.user.id });
            await earnings.save();
        }

        res.status(200).json({
            success: true,
            earnings
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get earnings breakdown by month
// @route   GET /api/earnings/monthly
// @access  Private (Provider)
exports.getMonthlyEarnings = async (req, res) => {
    try {
        const payments = await Payment.find({
            provider: req.user.id,
            status: 'completed'
        }).sort({ createdAt: -1 });

        const monthlyData = {};
        payments.forEach(payment => {
            const month = new Date(payment.createdAt).toISOString().slice(0, 7);
            if (!monthlyData[month]) {
                monthlyData[month] = {
                    month,
                    earnings: 0,
                    jobsCompleted: 0,
                    transactions: []
                };
            }
            monthlyData[month].earnings += payment.breakdown.providerAmount;
            monthlyData[month].jobsCompleted += 1;
            monthlyData[month].transactions.push(payment._id);
        });

        const monthlyEarnings = Object.values(monthlyData).sort((a, b) => 
            new Date(b.month) - new Date(a.month)
        );

        res.status(200).json({
            success: true,
            monthlyEarnings
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get earnings by service type
// @route   GET /api/earnings/services
// @access  Private (Provider)
exports.getEarningsByService = async (req, res) => {
    try {
        const bookings = await Booking.find({
            provider: req.user.id,
            status: 'completed'
        }).populate('service');

        const serviceEarnings = {};
        
        for (const booking of bookings) {
            const payment = await Payment.findOne({ booking: booking._id });
            if (payment) {
                const serviceName = booking.service.name;
                if (!serviceEarnings[serviceName]) {
                    serviceEarnings[serviceName] = {
                        service: serviceName,
                        earnings: 0,
                        jobsCompleted: 0
                    };
                }
                serviceEarnings[serviceName].earnings += payment.breakdown.providerAmount;
                serviceEarnings[serviceName].jobsCompleted += 1;
            }
        }

        const serviceData = Object.values(serviceEarnings).sort((a, b) => 
            b.earnings - a.earnings
        );

        res.status(200).json({
            success: true,
            serviceEarnings: serviceData
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Request withdrawal
// @route   POST /api/earnings/withdrawal
// @access  Private (Provider)
exports.requestWithdrawal = async (req, res) => {
    try {
        const { amount, method } = req.body;

        let earnings = await Earnings.findOne({ provider: req.user.id });
        if (!earnings) {
            return res.status(404).json({ success: false, message: 'Earnings not found' });
        }

        if (earnings.availableBalance < amount) {
            return res.status(400).json({ 
                success: false, 
                message: 'Insufficient balance. Available balance: $' + earnings.availableBalance 
            });
        }

        earnings.withdrawals.push({
            amount,
            method,
            status: 'pending',
            requestedAt: Date.now()
        });

        earnings.pendingBalance += amount;
        earnings.availableBalance -= amount;

        await earnings.save();

        res.status(201).json({
            success: true,
            message: 'Withdrawal request submitted successfully',
            earnings
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get withdrawal history
// @route   GET /api/earnings/withdrawals
// @access  Private (Provider)
exports.getWithdrawalHistory = async (req, res) => {
    try {
        const earnings = await Earnings.findOne({ provider: req.user.id });

        if (!earnings) {
            return res.status(404).json({ success: false, message: 'Earnings not found' });
        }

        res.status(200).json({
            success: true,
            withdrawals: earnings.withdrawals
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get provider stats
// @route   GET /api/earnings/stats
// @access  Private (Provider)
exports.getEarningsStats = async (req, res) => {
    try {
        const bookings = await Booking.find({
            provider: req.user.id,
            status: { $in: ['completed', 'in_progress', 'accepted'] }
        });

        const completedJobs = bookings.filter(b => b.status === 'completed').length;
        const activeJobs = bookings.filter(b => b.status === 'in_progress').length;
        const acceptedJobs = bookings.filter(b => b.status === 'accepted').length;

        const earnings = await Earnings.findOne({ provider: req.user.id });

        res.status(200).json({
            success: true,
            stats: {
                completedJobs,
                activeJobs,
                acceptedJobs,
                totalEarnings: earnings?.totalEarnings || 0,
                availableBalance: earnings?.availableBalance || 0,
                pendingBalance: earnings?.pendingBalance || 0
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
