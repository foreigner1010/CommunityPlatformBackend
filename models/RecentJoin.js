const mongoose = require('mongoose');

const recentJoinSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    joinedAt: {
        type: Date,
        default: Date.now,
        expires: 86400 // Document will be automatically deleted after 24 hours
    }
});

module.exports = mongoose.model('RecentJoin', recentJoinSchema);
