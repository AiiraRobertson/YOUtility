const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/providers
// @desc    Get all providers
// @access  Public
router.get('/providers', userController.getProviders);

// @route   GET /api/users/providers/:id
// @desc    Get single provider
// @access  Public
router.get('/providers/:id', userController.getProvider);

// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', protect, userController.getProfile);

// @route   PUT /api/users/:id
// @desc    Update user profile
// @access  Private
router.put('/:id', protect, [
    body('firstName').optional().notEmpty(),
    body('lastName').optional().notEmpty(),
    body('phone').optional().notEmpty()
], userController.updateProfile);

// @route   GET /api/users/search
// @desc    Search users by name
// @access  Public
router.get('/search', userController.searchUsers);

module.exports = router;
