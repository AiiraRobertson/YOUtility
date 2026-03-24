const Booking = require('../models/Booking');
const User = require('../models/User');
const Service = require('../models/Service');
const { validationResult } = require('express-validator');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (Customer)
exports.createBooking = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { serviceId, serviceType, description, scheduledDate, scheduledTime, duration, location, specialRequests } = req.body;

        // Get service
        const service = await Service.findOne({ name: serviceType });
        if (!service) {
            return res.status(404).json({ success: false, message: 'Service not found' });
        }

        const booking = new Booking({
            customer: req.user.id,
            service: service._id,
            description,
            scheduledDate,
            scheduledTime,
            duration,
            location,
            specialRequests,
            price: {
                basePrice: service.basePrice,
                taxAmount: service.basePrice * 0.1,
                discountAmount: 0,
                totalPrice: service.basePrice * 1.1
            }
        });

        await booking.save();
        await booking.populate('service');

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            booking
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all bookings for customer
// @route   GET /api/bookings/customer/list
// @access  Private (Customer)
exports.getCustomerBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ customer: req.user.id })
            .populate('service')
            .populate('provider', 'firstName lastName rating')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            bookings
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all bookings for provider
// @route   GET /api/bookings/provider/list
// @access  Private (Provider)
exports.getProviderBookings = async (req, res) => {
    try {
        const { status } = req.query;
        
        let query = { provider: req.user.id };
        if (status) {
            query.status = status;
        }

        const bookings = await Booking.find(query)
            .populate('service')
            .populate('customer', 'firstName lastName phone email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            bookings
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get pending bookings for providers
// @route   GET /api/bookings/available
// @access  Private (Provider)
exports.getAvailableBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ status: 'pending' })
            .populate('service')
            .populate('customer', 'firstName lastName phone')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            bookings
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('service')
            .populate('customer', 'firstName lastName phone email')
            .populate('provider', 'firstName lastName rating phone');

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        // Check authorization
        if (booking.customer.toString() !== req.user.id && booking.provider?.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to access this booking' });
        }

        res.status(200).json({
            success: true,
            booking
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Accept booking
// @route   PUT /api/bookings/:id/accept
// @access  Private (Provider)
exports.acceptBooking = async (req, res) => {
    try {
        let booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        booking.provider = req.user.id;
        booking.status = 'accepted';
        booking.acceptedAt = Date.now();

        await booking.save();
        await booking.populate('service');
        await booking.populate('customer');
        await booking.populate('provider');

        res.status(200).json({
            success: true,
            message: 'Booking accepted successfully',
            booking
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Reject booking
// @route   PUT /api/bookings/:id/reject
// @access  Private (Provider)
exports.rejectBooking = async (req, res) => {
    try {
        const { reason } = req.body;
        let booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        booking.status = 'rejected';
        booking.rejectReason = reason;
        await booking.save();

        res.status(200).json({
            success: true,
            message: 'Booking rejected successfully',
            booking
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Start booking
// @route   PUT /api/bookings/:id/start
// @access  Private (Provider)
exports.startBooking = async (req, res) => {
    try {
        let booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        booking.status = 'in_progress';
        booking.startedAt = Date.now();
        booking.progress = 10;
        await booking.save();

        res.status(200).json({
            success: true,
            message: 'Booking started successfully',
            booking
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update booking progress
// @route   PUT /api/bookings/:id/progress
// @access  Private (Provider)
exports.updateProgress = async (req, res) => {
    try {
        const { progress, notes } = req.body;
        let booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        booking.progress = progress;
        if (notes) booking.notes = notes;
        await booking.save();

        res.status(200).json({
            success: true,
            message: 'Progress updated successfully',
            booking
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Complete booking
// @route   PUT /api/bookings/:id/complete
// @access  Private (Provider)
exports.completeBooking = async (req, res) => {
    try {
        let booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        booking.status = 'completed';
        booking.completedAt = Date.now();
        booking.progress = 100;
        await booking.save();

        res.status(200).json({
            success: true,
            message: 'Booking completed successfully',
            booking
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private (Customer)
exports.cancelBooking = async (req, res) => {
    try {
        const { reason } = req.body;
        let booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        booking.status = 'cancelled';
        booking.cancellationReason = reason;
        await booking.save();

        res.status(200).json({
            success: true,
            message: 'Booking cancelled successfully',
            booking
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
