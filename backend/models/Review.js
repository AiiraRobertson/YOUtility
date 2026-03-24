const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 500
    },
    categories: {
        cleanliness: {
            type: Number,
            min: 1,
            max: 5
        },
        punctuality: {
            type: Number,
            min: 1,
            max: 5
        },
        professionalism: {
            type: Number,
            min: 1,
            max: 5
        },
        quality: {
            type: Number,
            min: 1,
            max: 5
        }
    },
    wouldRecommend: {
        type: Boolean,
        default: true
    },
    isVerifiedBooking: {
        type: Boolean,
        default: true
    },
    helpfulCount: {
        type: Number,
        default: 0
    },
    responses: [{
        responderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        responseText: String,
        respondedAt: Date
    }],
    isPublished: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Review', reviewSchema);
