const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    transactionId: {
        type: String,
        unique: true
    },
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
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    currency: {
        type: String,
        default: 'USD'
    },
    paymentMethod: {
        type: String,
        enum: ['credit_card', 'debit_card', 'paypal', 'bank_transfer'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    breakdown: {
        baseAmount: Number,
        taxAmount: Number,
        discountAmount: {
            type: Number,
            default: 0
        },
        platformFee: {
            type: Number,
            default: 0
        },
        providerAmount: Number
    },
    providerPayout: {
        status: {
            type: String,
            enum: ['pending', 'processed', 'failed'],
            default: 'pending'
        },
        amount: Number,
        processedAt: Date
    },
    receiptUrl: {
        type: String,
        default: null
    },
    failureReason: {
        type: String,
        default: null
    },
    refundDetails: {
        refundAmount: Number,
        refundReason: String,
        refundedAt: Date
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

// Generate unique transaction ID before saving
paymentSchema.pre('save', async function(next) {
    if (!this.transactionId) {
        this.transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
    }
    next();
});

module.exports = mongoose.model('Payment', paymentSchema);
