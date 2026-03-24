const Review = require('../models/Review');
const User = require('../models/User');
const Booking = require('../models/Booking');
const { validationResult } = require('express-validator');

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private (Customer)
exports.createReview = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { bookingId, rating, comment, categories, wouldRecommend } = req.body;

        // Check if booking exists
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        // Check if already reviewed
        let review = await Review.findOne({ booking: bookingId });
        if (review) {
            return res.status(400).json({ success: false, message: 'Booking already reviewed' });
        }

        review = new Review({
            booking: bookingId,
            customer: req.user.id,
            provider: booking.provider,
            rating,
            comment,
            categories,
            wouldRecommend
        });

        await review.save();

        // Update provider rating
        const allReviews = await Review.find({ provider: booking.provider, isPublished: true });
        const totalRating = allReviews.reduce((sum, rev) => sum + rev.rating, 0);
        const averageRating = totalRating / allReviews.length;

        await User.findByIdAndUpdate(booking.provider, {
            'rating.averageRating': averageRating,
            'rating.totalReviews': allReviews.length
        });

        await review.populate('customer');
        await review.populate('provider');

        res.status(201).json({
            success: true,
            message: 'Review created successfully',
            review
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get reviews for provider
// @route   GET /api/reviews/provider/:providerId
// @access  Public
exports.getProviderReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ provider: req.params.providerId, isPublished: true })
            .populate('customer', 'firstName lastName profileImage')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: reviews.length,
            reviews
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all reviews for customer
// @route   GET /api/reviews/customer/list
// @access  Private (Customer)
exports.getCustomerReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ customer: req.user.id })
            .populate('provider', 'firstName lastName')
            .populate('booking')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: reviews.length,
            reviews
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single review
// @route   GET /api/reviews/:id
// @access  Public
exports.getReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id)
            .populate('customer', 'firstName lastName profileImage')
            .populate('provider', 'firstName lastName')
            .populate('booking');

        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        res.status(200).json({
            success: true,
            review
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private (Customer)
exports.updateReview = async (req, res) => {
    try {
        let review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        // Check authorization
        if (review.customer.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this review' });
        }

        const { rating, comment, categories, wouldRecommend } = req.body;

        if (rating) review.rating = rating;
        if (comment) review.comment = comment;
        if (categories) review.categories = categories;
        if (wouldRecommend !== undefined) review.wouldRecommend = wouldRecommend;

        await review.save();

        // Update provider rating
        const allReviews = await Review.find({ provider: review.provider, isPublished: true });
        const totalRating = allReviews.reduce((sum, rev) => sum + rev.rating, 0);
        const averageRating = totalRating / allReviews.length;

        await User.findByIdAndUpdate(review.provider, {
            'rating.averageRating': averageRating,
            'rating.totalReviews': allReviews.length
        });

        res.status(200).json({
            success: true,
            message: 'Review updated successfully',
            review
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private (Customer)
exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        // Check authorization
        if (review.customer.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this review' });
        }

        await Review.findByIdAndDelete(req.params.id);

        // Update provider rating
        const allReviews = await Review.find({ provider: review.provider, isPublished: true });
        if (allReviews.length > 0) {
            const totalRating = allReviews.reduce((sum, rev) => sum + rev.rating, 0);
            const averageRating = totalRating / allReviews.length;
            await User.findByIdAndUpdate(review.provider, {
                'rating.averageRating': averageRating,
                'rating.totalReviews': allReviews.length
            });
        } else {
            await User.findByIdAndUpdate(review.provider, {
                'rating.averageRating': 0,
                'rating.totalReviews': 0
            });
        }

        res.status(200).json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Add response to review
// @route   POST /api/reviews/:id/respond
// @access  Private (Provider)
exports.respondToReview = async (req, res) => {
    try {
        const { responseText } = req.body;

        let review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        review.responses.push({
            responderId: req.user.id,
            responseText,
            respondedAt: Date.now()
        });

        await review.save();

        res.status(200).json({
            success: true,
            message: 'Response added successfully',
            review
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
