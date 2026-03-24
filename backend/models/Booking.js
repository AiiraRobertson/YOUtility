const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    bookingId: {
        type: String,
        unique: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'in_progress', 'completed', 'cancelled', 'rejected'],
        default: 'pending'
    },
    scheduledDate: {
        type: Date,
        required: true
    },
    scheduledTime: {
        type: String,
        required: true
    },
    duration: {
        type: Number, // in hours
        required: true
    },
    location: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },
    price: {
        basePrice: Number,
        taxAmount: Number,
        discountAmount: {
            type: Number,
            default: 0
        },
        totalPrice: Number
    },
    specialRequests: {
        type: String,
        default: ''
    },
    notes: {
        type: String,
        default: ''
    },
    progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    acceptedAt: {
        type: Date,
        default: null
    },
    startedAt: {
        type: Date,
        default: null
    },
    completedAt: {
        type: Date,
        default: null
    },
    cancellationReason: {
        type: String,
        default: null
    },
    rejectReason: {
        type: String,
        default: null
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

// Generate unique booking ID before saving
bookingSchema.pre('save', async function(next) {
    if (!this.bookingId) {
        const count = await mongoose.model('Booking').countDocuments();
        this.bookingId = `BK${Date.now()}${count + 1}`;
    }
    next();
});

module.exports = mongoose.model('Booking', bookingSchema);
