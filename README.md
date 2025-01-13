# Community Platform Backend

A Node.js/Express backend for the Community Platform application with MongoDB Atlas integration.

## Features

- User Authentication (JWT-based)
- Community Updates Management
- Member Directory
- Real-time Activity Tracking
- Secure API Endpoints

## Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- JSON Web Tokens (JWT)
- bcrypt.js for password hashing

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/foreigner1010/CommunityPlatformBackend.git
   cd CommunityPlatformBackend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. Start the server:
   - Development mode: `npm run dev`
   - Production mode: `npm start`

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user

### Community
- GET `/api/community/updates` - Get community updates
- POST `/api/community/updates` - Create new update
- GET `/api/community/stats` - Get community statistics

### Members
- GET `/api/members` - Get all members
- GET `/api/members/:id` - Get member details

## Deployment

This backend is configured for deployment on Render.com:

1. Build Command: `npm install`
2. Start Command: `npm start`
3. Add environment variables in Render dashboard
