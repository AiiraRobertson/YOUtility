const User = require('../models/User');
const { validationResult } = require('express-validator');

// @desc    Get all providers
// @route   GET /api/users/providers
// @access  Public
exports.getProviders = async (req, res) => {
    try {
        const { service, city, rating } = req.query;
        
        let query = { userType: 'provider', isVerified: true };
        
        if (service) {
            // Will match based on services array
            query.services = { $exists: true, $ne: [] };
        }
        
        if (city) {
            query['address.city'] = { $regex: city, $options: 'i' };
        }

        let providers = await User.find(query)
            .populate('services')
            .select('-password')
            .sort({ 'rating.averageRating': -1 });

        if (rating) {
            providers = providers.filter(p => p.rating.averageRating >= parseFloat(rating));
        }

        res.status(200).json({
            success: true,
            count: providers.length,
            providers
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single provider
// @route   GET /api/users/providers/:id
// @access  Public
exports.getProvider = async (req, res) => {
    try {
        const provider = await User.findById(req.params.id)
            .populate('services')
            .select('-password');

        if (!provider || provider.userType !== 'provider') {
            return res.status(404).json({ success: false, message: 'Provider not found' });
        }

        res.status(200).json({
            success: true,
            provider
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
exports.updateProfile = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { firstName, lastName, phone, address, experience, certifications } = req.body;

        // Check authorization
        if (req.params.id !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this user' });
        }

        let user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (phone) user.phone = phone;
        if (address) user.address = { ...user.address, ...address };
        
        // Provider specific updates
        if (user.userType === 'provider') {
            if (experience) user.experience = experience;
            if (certifications) user.certifications = certifications;
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate('services')
            .select('-password');

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Search users by name
// @route   GET /api/users/search
// @access  Public
exports.searchUsers = async (req, res) => {
    try {
        const { q, userType } = req.query;

        if (!q) {
            return res.status(400).json({ success: false, message: 'Search query required' });
        }

        let query = {
            $or: [
                { firstName: { $regex: q, $options: 'i' } },
                { lastName: { $regex: q, $options: 'i' } }
            ]
        };

        if (userType) {
            query.userType = userType;
        }

        const users = await User.find(query)
            .select('-password')
            .limit(10);

        res.status(200).json({
            success: true,
            count: users.length,
            users
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
