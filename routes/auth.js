const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const RecentJoin = require('../models/RecentJoin');
const auth = require('../middleware/auth');

// Register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, city } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({
                message: 'Password must be at least 6 characters long'
            });
        }

        // Create new user
        user = new User({
            username,
            email,
            password,
            city
        });

        await user.save();

        // Add to recent joins
        const recentJoin = new RecentJoin({
            username: user.username,
            city: user.city
        });
        await recentJoin.save();

        // Create token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                city: user.city,
                profilePicture: user.profilePicture,
                bio: user.bio,
                createdAt: user.createdAt
            }
        });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ message: err.message || 'Server error' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Get recent joins for existing users
        const recentJoins = await RecentJoin.find({
            username: { $ne: user.username } // Exclude current user
        })
        .sort('-joinedAt')
        .limit(5)
        .lean() // Convert to plain JavaScript object
        .exec();

        // Create token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Send response with token and recent joins
        res.json({
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                city: user.city,
                createdAt: user.createdAt
            },
            recentJoins
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get current user
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get recent joins (excluding the current user)
        const recentJoins = await RecentJoin.find({
            username: { $ne: user.username }
        }).sort({ joinedAt: -1 }).limit(5);

        res.json({
            ...user.toObject(),
            recentJoins: recentJoins.map(join => ({
                username: join.username,
                joinedAt: join.joinedAt
            }))
        });
    } catch (err) {
        console.error('Get user error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
