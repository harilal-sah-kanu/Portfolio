export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const ROUTES = {
  HOME: "/",
  PROJECTS: "/projects",
  SKILLS: "/skills",
  BLOG: "/blog",
  CONTACT: "/contact",
  ADMIN: "/admin",
  LOGIN: "/login",
};

export const THEME = {
  LIGHT: "light",
  DARK: "dark",
};

export const SKILL_CATEGORIES = [
  "frontend",
  "backend",
  "database",
  "devops",
  "tools",
  "other",
];

export const PROJECT_CATEGORIES = [
  "web",
  "mobile",
  "fullstack",
  "ai/ml",
  "other",
];
