const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get all members
router.get('/', auth, async (req, res) => {
    try {
        const { city } = req.query;
        let query = {};
        
        // Add city filter if provided
        if (city) {
            query.city = city;
        }

        const users = await User.find(query)
            .select('username email city profilePicture bio createdAt')
            .sort({ createdAt: -1 });

        res.json(users);
    } catch (err) {
        console.error('Error fetching members:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
