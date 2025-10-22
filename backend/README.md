# Portfolio Backend API

Backend API for the editable portfolio with admin panel.

## 🚀 Features

- **Authentication**: JWT-based auth with role-based access control
- **CRUD APIs**: Full CRUD operations for Projects, Skills, Blogs, and Contacts
- **Admin Panel**: Protected routes for admin-only operations
- **Drag & Drop**: Reorder functionality for projects and skills
- **Image Uploads**: Cloudinary integration (optional)
- **Validation**: Request validation with express-validator

## 📦 Installation

1. Install dependencies:

```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
```

3. Update `.env` with your MongoDB URI and JWT secret

4. Seed the database (creates admin user and sample data):

```bash
npm run seed
```

## 🏃 Running the Server

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

## 📚 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (Protected)
- `PUT /api/auth/profile` - Update profile (Protected)

### Projects

- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create project (Admin)
- `PUT /api/projects/:id` - Update project (Admin)
- `DELETE /api/projects/:id` - Delete project (Admin)
- `POST /api/projects/reorder` - Reorder projects (Admin)

### Skills

- `GET /api/skills` - Get all skills
- `POST /api/skills` - Create skill (Admin)
- `PUT /api/skills/:id` - Update skill (Admin)
- `DELETE /api/skills/:id` - Delete skill (Admin)
- `POST /api/skills/reorder` - Reorder skills (Admin)

### Blogs

- `GET /api/blogs` - Get all blogs
- `GET /api/blogs/:slug` - Get blog by slug
- `POST /api/blogs` - Create blog (Admin)
- `PUT /api/blogs/:id` - Update blog (Admin)
- `DELETE /api/blogs/:id` - Delete blog (Admin)

### Contacts

- `GET /api/contacts` - Get all contacts (Admin)
- `POST /api/contacts` - Submit contact form (Public)
- `PUT /api/contacts/:id/status` - Update status (Admin)
- `DELETE /api/contacts/:id` - Delete contact (Admin)

## 🔐 Default Admin Credentials

After seeding:

- Email: `admin@portfolio.com`
- Password: `admin123`

**⚠️ Change these in production!**

## 🛠️ Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs for password hashing
- express-validator for validation
- Cloudinary (optional for images)
