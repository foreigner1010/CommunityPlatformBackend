const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const RecentJoin = require('../models/RecentJoin');

async function clearDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB...');

        // Delete all users
        const deletedUsers = await User.deleteMany({});
        console.log(`Deleted ${deletedUsers.deletedCount} users`);

        // Delete all recent joins
        const deletedJoins = await RecentJoin.deleteMany({});
        console.log(`Deleted ${deletedJoins.deletedCount} recent joins`);

        console.log('Database cleared successfully');
    } catch (error) {
        console.error('Error clearing database:', error);
    } finally {
        // Close the connection
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
}

// Run the script
clearDatabase();
