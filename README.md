# **Kizuna: Real-Time Chat Platform**

**Kizuna** is a feature-rich chat application built for seamless real-time communication. Powered by the **MERN** stack (MongoDB, Express, React, Node.js) with **Redis** caching and **Cloudinary** media handling, Kizuna delivers a responsive and scalable messaging experience.

## **Key Features**

- **Instant Messaging**: Real-time message delivery using **Socket.IO** for fluid conversations
- **Secure Authentication**: Robust user authentication system powered by **JWT** tokens
- **Media Sharing**: Support for image sharing and profile pictures through **Cloudinary** integration
- **Performance Optimized**: **Redis** caching implementation for faster data retrieval and OTP storage
- **Modern UI**: Clean and intuitive interface built with **React** and **Tailwind CSS**
- **Mobile Responsive**: Fully responsive design that works seamlessly across devices

## **Tech Stack**

### Frontend
- **React** - UI framework
- **Tailwind CSS** - Styling
- **Socket.IO Client** - Real-time communication
- **Axios** - HTTP client

### Backend
- **Node.js** & **Express** - Server framework
- **MongoDB** - Database
- **Redis** - Caching layer
- **Socket.IO** - WebSocket handling
- **Cloudinary** - Media storage
- **JWT** - Authentication

### Additional Tools
- **Mongoose** - MongoDB object modeling
- **Helmet** - Security headers
- **Cors** - Cross-origin resource sharing

## **Getting Started**

### Prerequisites
- Node.js
- MongoDB
- Redis (Better with Docker)
- Cloudinary account

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/AdiInfiniteLoop/Kizuna
cd Kizuna
```

2. **Set up environment variables**
```bash
# Create .env file in kizuna-backend directory
touch .env

# Backend environment variables
DEV_PORT=3000
DB_CONNECTION_STRING=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
CLOUDINARY_CLOUD=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key
FRONTEND_URL=https://kizuna-ten.vercel.app/
TWO_PASS=your_two_factor_secret
REDIS_HOST=your_redis_host
REDIS_USER=your_redis_username
REDIS_PORT=your_redis_port
REDIS_PASSWORD=your_redis_password
```

3. **Install dependencies**
```bash
# Install server dependencies
cd kizuna-backend
npm install

# Install client dependencies
cd ../kizuna-frontend
npm install
```

4. **Run the application**
```bash
# Start kizuna-backend 
npm run dev

# Start kizuna-frontend (from client directory)
npm run dev
```

The application will be available at:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

## **Key Functionalities**

- Real-time messaging
- User authentication and authorization
- Profile customization with image uploads
- Online status indicators
- Message delivery status
- Chat history persistence

## **Future Enhancements**

- PUB-SUB Architecture for Chat-Groups using Redis

## **Contributing**

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## **License**

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## **Acknowledgments**

- Socket.IO documentation
- MongoDB documentation
- React documentation
- Express.js documentation

---

Feel free to reach out with any questions or suggestions!

*Built with ❤️*
