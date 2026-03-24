const mongoose = require('mongoose');

const earningsSchema = new mongoose.Schema({
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    totalEarnings: {
        type: Number,
        default: 0
    },
    totalJobs: {
        type: Number,
        default: 0
    },
    monthlyEarnings: [{
        month: String, // YYYY-MM format
        earnings: Number,
        jobsCompleted: Number,
        transactions: [mongoose.Schema.Types.ObjectId] // Payment IDs
    }],
    availableBalance: {
        type: Number,
        default: 0
    },
    pendingBalance: {
        type: Number,
        default: 0
    },
    withdrawals: [{
        amount: Number,
        method: String,
        status: {
            type: String,
            enum: ['pending', 'processed', 'failed'],
            default: 'pending'
        },
        requestedAt: Date,
        processedAt: Date
    }],
    paymentHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment'
    }],
    updatedAt: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Earnings', earningsSchema);
