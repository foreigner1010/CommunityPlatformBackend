const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get all users with search and filters
router.get('/', async (req, res) => {
    try {
        const {
            search,
            skills,
            location,
            role,
            status,
            sortBy,
            page = 1,
            limit = 10
        } = req.query;

        // Build query
        const query = {};
        
        // Search in username, email, bio
        if (search) {
            query.$or = [
                { username: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { bio: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } }
            ];
        }

        // Filter by skills
        if (skills) {
            query.skills = { $in: skills.split(',') };
        }

        // Filter by location
        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }

        // Filter by role
        if (role) {
            query.role = role;
        }

        // Filter by status
        if (status) {
            query.status = status;
        }

        // Build sort object
        const sortObject = {};
        if (sortBy) {
            const [field, order] = sortBy.split(':');
            sortObject[field] = order === 'desc' ? -1 : 1;
        } else {
            sortObject.createdAt = -1;
        }

        // Execute query with pagination
        const skip = (page - 1) * limit;
        const users = await User.find(query)
            .select('-password')
            .sort(sortObject)
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count
        const total = await User.countDocuments(query);

        res.json({
            users,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            total
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
