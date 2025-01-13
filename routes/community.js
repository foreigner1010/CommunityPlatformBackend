const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Update = require('../models/Update');

// Get community stats
router.get('/stats', async (req, res) => {
    try {
        const totalMembers = await User.countDocuments();
        const onlineMembers = Math.floor(Math.random() * totalMembers); // This should be replaced with actual online tracking
        const totalUpdates = await Update.countDocuments();
        const recentActivity = await Update.countDocuments({
            createdAt: { $gte: new Date(Date.now() - 24*60*60*1000) }
        });
        
        res.json({
            totalMembers,
            onlineMembers,
            totalUpdates,
            recentActivity,
            lastUpdated: new Date()
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get community updates
router.get('/updates', async (req, res) => {
    try {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000); // 1 hour ago
        const updates = await Update.find({
            createdAt: { $gte: oneHourAgo }
        })
            .sort({ createdAt: -1 })
            .populate('author', 'username')
            .limit(10);
        res.json(updates);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create new update
router.post('/updates', async (req, res) => {
    try {
        const { title, content, type, importance } = req.body;
        const update = new Update({
            title,
            content,
            type,
            importance,
            author: req.user._id // This should come from auth middleware
        });
        await update.save();
        res.status(201).json(update);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Like/Unlike update
router.post('/updates/:id/like', async (req, res) => {
    try {
        const update = await Update.findById(req.params.id);
        if (!update) {
            return res.status(404).json({ message: 'Update not found' });
        }

        const likeIndex = update.likes.indexOf(req.user._id);
        if (likeIndex > -1) {
            update.likes.splice(likeIndex, 1);
        } else {
            update.likes.push(req.user._id);
        }

        await update.save();
        res.json(update);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
