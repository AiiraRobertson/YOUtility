const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        enum: ['Electrician', 'Plumber', 'Carpenter', 'Car Mechanic', 'Painter', 'Barber', 'Chef', 'Other']
    },
    description: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        default: '🔧'
    },
    category: {
        type: String,
        required: true
    },
    basePrice: {
        type: Number,
        required: true,
        min: 0
    },
    estimatedDuration: {
        type: Number, // in hours
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    providers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Service', serviceSchema);
