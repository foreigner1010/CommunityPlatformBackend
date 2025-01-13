# Community Platform

A modern, full-stack MERN application for building and managing online communities. Live demo: [Community Platform](https://communityplatformshivansh.netlify.app)

## 🌟 Features

- **User Authentication**: Secure JWT-based authentication system
- **Community Dashboard**: Real-time updates and activity feed
- **Member Directory**: Searchable directory with filtering capabilities
- **Recent Updates**: Track community activities and member interactions
- **Responsive Design**: Beautiful UI that works on all devices

## 🚀 Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- JWT Authentication
- RESTful API

### Frontend
- React.js
- Material-UI (MUI)
- React Query
- React Router
- Axios

## 🔗 Live Links

- **Frontend**: [https://communityplatformshivansh.netlify.app](https://communityplatformshivansh.netlify.app)
- **Backend API**: [https://communityplatformbackend.onrender.com](https://communityplatformbackend.onrender.com)

## 🛠️ Installation

### Backend
```bash
# Clone the repository
git clone https://github.com/foreigner1010/CommunityPlatformBackend.git

# Install dependencies
npm install

# Set up environment variables
Create .env file with:
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret

# Start the server
npm start
```

### Frontend
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Frontend (.env)
```
VITE_API_URL=your_backend_api_url
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Community
- `GET /api/community/updates` - Get community updates
- `POST /api/community/updates` - Create update
- `GET /api/community/stats` - Get community statistics

### Members
- `GET /api/members` - Get all members
- `GET /api/members/:id` - Get member details

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Developer

Built with ❤️ by Shivansh
