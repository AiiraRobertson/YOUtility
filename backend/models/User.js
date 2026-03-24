const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        select: false
    },
    phone: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        enum: ['customer', 'provider'],
        required: true
    },
    profileImage: {
        type: String,
        default: null
    },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    rating: {
        averageRating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        totalReviews: {
            type: Number,
            default: 0
        }
    },
    // For providers
    services: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service'
    }],
    experience: {
        type: String,
        default: ''
    },
    certifications: [{
        type: String
    }],
    availability: {
        type: Boolean,
        default: true
    },
    // For customers
    paymentMethods: [{
        type: {
            type: String,
            enum: ['credit_card', 'debit_card', 'paypal', 'bank_transfer']
        },
        details: Object,
        isDefault: Boolean
    }],
    preferences: {
        notifications: {
            type: Boolean,
            default: true
        },
        emailUpdates: {
            type: Boolean,
            default: true
        }
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

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(process.env.BCRYPT_ROUNDS || 10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
