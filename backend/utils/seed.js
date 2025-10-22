import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import Project from "../models/Project.js";
import Skill from "../models/Skill.js";
import Blog from "../models/Blog.js";
import connectDB from "../config/db.js";

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Project.deleteMany();
    await Skill.deleteMany();
    await Blog.deleteMany();

    console.log("🗑️  Data cleared!");

    // Create admin user
    const admin = await User.create({
      name: "Admin",
      email: process.env.ADMIN_EMAIL || "admin@portfolio.com",
      password: process.env.ADMIN_PASSWORD || "admin123",
      role: "admin",
      avatar:
        "https://ui-avatars.com/api/?name=Admin&background=3B82F6&color=fff",
    });

    console.log("✅ Admin user created!");

    // Sample projects
    const projects = [
      {
        title: "E-Commerce Platform",
        description: "Full-stack MERN e-commerce with payment integration",
        fullDescription:
          "A complete e-commerce solution with user authentication, product management, cart functionality, and Stripe payment integration.",
        image:
          "https://images.unsplash.com/photo-1557821552-17105176677c?w=800",
        images: [
          "https://images.unsplash.com/photo-1557821552-17105176677c?w=800",
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
        ],
        techStack: ["React", "Node.js", "Express", "MongoDB", "Stripe"],
        category: "fullstack",
        links: {
          github: "https://github.com/yourusername/ecommerce",
          live: "https://demo-ecommerce.com",
        },
        featured: true,
        status: "completed",
        tags: ["ecommerce", "payments", "fullstack"],
        order: 1,
      },
      {
        title: "AI Chat Application",
        description: "Real-time chat app with AI-powered responses",
        fullDescription:
          "A modern chat application featuring real-time messaging, AI integration for smart replies, and beautiful UI.",
        image:
          "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800",
        techStack: ["React", "Socket.io", "OpenAI", "TailwindCSS"],
        category: "ai/ml",
        links: {
          github: "https://github.com/yourusername/ai-chat",
          live: "https://ai-chat-demo.com",
        },
        featured: true,
        status: "completed",
        tags: ["ai", "chat", "realtime"],
        order: 2,
      },
      {
        title: "Task Management Dashboard",
        description: "Collaborative task manager with drag & drop",
        fullDescription:
          "A Trello-like task management system with drag-and-drop, team collaboration, and real-time updates.",
        image:
          "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800",
        techStack: ["React", "TypeScript", "Firebase", "DnD Kit"],
        category: "web",
        links: {
          github: "https://github.com/yourusername/task-manager",
        },
        featured: false,
        status: "completed",
        tags: ["productivity", "collaboration"],
        order: 3,
      },
    ];

    await Project.insertMany(projects);
    console.log("✅ Projects seeded!");

    // Sample skills
    const skills = [
      {
        name: "React",
        category: "frontend",
        level: 90,
        icon: "react",
        color: "#61DAFB",
        order: 1,
      },
      {
        name: "Node.js",
        category: "backend",
        level: 85,
        icon: "nodejs",
        color: "#68A063",
        order: 2,
      },
      {
        name: "TypeScript",
        category: "frontend",
        level: 80,
        icon: "typescript",
        color: "#3178C6",
        order: 3,
      },
      {
        name: "MongoDB",
        category: "database",
        level: 75,
        icon: "mongodb",
        color: "#47A248",
        order: 4,
      },
      {
        name: "Express",
        category: "backend",
        level: 85,
        icon: "express",
        color: "#000000",
        order: 5,
      },
      {
        name: "TailwindCSS",
        category: "frontend",
        level: 90,
        icon: "tailwind",
        color: "#06B6D4",
        order: 6,
      },
      {
        name: "Docker",
        category: "devops",
        level: 70,
        icon: "docker",
        color: "#2496ED",
        order: 7,
      },
      {
        name: "Git",
        category: "tools",
        level: 85,
        icon: "git",
        color: "#F05032",
        order: 8,
      },
    ];

    await Skill.insertMany(skills);
    console.log("✅ Skills seeded!");

    // Sample blog
    const blogs = [
      {
        title: "Getting Started with MERN Stack",
        slug: "getting-started-with-mern-stack",
        excerpt:
          "Learn how to build full-stack applications using MongoDB, Express, React, and Node.js.",
        content: `# Getting Started with MERN Stack

The MERN stack is a popular choice for building modern web applications. It consists of:

- **MongoDB**: NoSQL database
- **Express**: Backend framework
- **React**: Frontend library
- **Node.js**: JavaScript runtime

In this guide, we'll explore how to set up and build your first MERN application.

## Prerequisites

- Basic JavaScript knowledge
- Node.js installed
- MongoDB installed or Atlas account

## Let's get started!`,
        coverImage:
          "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800",
        author: admin._id,
        tags: ["mern", "javascript", "tutorial"],
        category: "tutorial",
        published: true,
        readTime: 8,
      },
    ];

    await Blog.insertMany(blogs);
    console.log("✅ Blogs seeded!");

    console.log("🎉 Database seeded successfully!");
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
