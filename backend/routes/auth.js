const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', [
    body('firstName', 'First name is required').notEmpty(),
    body('lastName', 'Last name is required').notEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    body('phone', 'Phone number is required').notEmpty(),
    body('userType', 'User type must be customer or provider').isIn(['customer', 'provider'])
], authController.register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password is required').exists()
], authController.login);

// @route   GET /api/auth/me
// @desc    Get current logged in user
// @access  Private
router.get('/me', require('../middleware/auth').protect, authController.getMe);

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', require('../middleware/auth').protect, authController.logout);

module.exports = router;
