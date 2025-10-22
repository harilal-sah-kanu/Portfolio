# 🚀 MERN Portfolio with Admin Panel

> A modern, full-stack developer portfolio with admin dashboard, coding stats integration, and analytics.

![MERN Stack](https://img.shields.io/badge/MERN-Stack-green?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)
![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen?style=for-the-badge)

---

## ✨ Features

### 🎨 Frontend

- Modern, responsive design with dark mode
- Smooth animations using Framer Motion
- 365-day contribution calendar (GitHub-style)
- Interactive coding stats dashboard
- Blog system with markdown support

### 🔐 Admin Panel

- Secure JWT authentication
- Complete content management (CRUD)
- Image upload to ImageKit CDN
- Drag & drop reordering
- Real-time coding profile sync
- Password change functionality

### 📊 Analytics

- Coding profile statistics (LeetCode, Codeforces, CodeChef, etc.)
- Animated rating charts
- Problem distribution graphs
- Contest performance tracking

---

## 🛠️ Tech Stack

**Frontend:**

- React 18 + Vite
- Tailwind CSS
- Framer Motion
- Zustand (State Management)
- React Router DOM
- Axios

**Backend:**

- Node.js + Express
- MongoDB (Mongoose)
- JWT Authentication
- ImageKit (CDN)
- Multer (File Upload)
- Bcrypt (Password Hashing)

---

## 🚀 Quick Start

### Prerequisites

- Node.js (v18+)
- MongoDB Atlas account
- ImageKit account

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/harilal-sah-kanu/Portfolio.git
   cd Portfolio
   ```

2. **Install dependencies**

   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

3. **Setup environment variables**

   Create `.env` files in both `backend` and `frontend` folders.
   See **[SETUP.md](./SETUP.md)** for detailed configuration.

4. **Start development servers**

   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000
   - Admin: http://localhost:5173/admin

---

## 📖 Documentation

For complete setup and deployment instructions, see **[SETUP.md](./SETUP.md)**

The setup guide includes:

- ✅ Local development setup
- ✅ MongoDB Atlas configuration
- ✅ ImageKit CDN setup
- ✅ Environment variables
- ✅ Backend deployment (Render)
- ✅ Frontend deployment (Vercel)
- ✅ Network architecture explanation
- ✅ Troubleshooting guide

---

## 🌐 Deployment

### Free Hosting ($0/month)

**Backend** → [Render](https://render.com)

- Free tier (spins down after 15 min inactivity)
- Auto-deploy from GitHub

**Frontend** → [Vercel](https://vercel.com)

- Unlimited bandwidth
- Auto-deploy from GitHub
- Custom domain support

**Database** → [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

- 512MB storage free
- Shared cluster

**Images** → [ImageKit](https://imagekit.io)

- 20GB bandwidth/month free
- Image optimization & CDN

See **[SETUP.md](./SETUP.md)** for step-by-step deployment guide.

---

## 🔒 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Protected admin routes
- ✅ CORS configuration
- ✅ Environment variable protection
- ✅ Input validation
- ✅ XSS protection

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 🙏 Acknowledgments

- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - Database hosting
- [Render](https://render.com) - Backend hosting
- [Vercel](https://vercel.com) - Frontend hosting
- [ImageKit](https://imagekit.io) - Image CDN
- [Tailwind CSS](https://tailwindcss.com) - CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library

---

## ⭐ Show Your Support

Give a ⭐ if this project helped you!

---

**Built with ❤️ using the MERN Stack**

_Total Hosting Cost: $0/month (Free tier)_
