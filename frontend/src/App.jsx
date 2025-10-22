import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import useThemeStore from "./store/themeStore";

// Layouts
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

// Public Pages
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Skills from "./pages/Skills";
import Experience from "./pages/Experience";
import Analytics from "./pages/Analytics";
import CodingStats from "./pages/CodingStats";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Contact from "./pages/Contact";
import Login from "./pages/Login";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProjects from "./pages/admin/Projects";
import AdminSkills from "./pages/admin/Skills";
import AdminExperiences from "./pages/admin/Experiences";
import AdminCodingProfiles from "./pages/admin/CodingProfiles";
import AdminBlogs from "./pages/admin/Blogs";
import AdminContacts from "./pages/admin/Contacts";
import AdminSettings from "./pages/admin/Settings";

// Protected Route
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const { theme } = useThemeStore();

  useEffect(() => {
    // Apply theme on mount
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:id" element={<ProjectDetail />} />
        <Route path="skills" element={<Skills />} />
        <Route path="experience" element={<Experience />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="coding-stats" element={<CodingStats />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:id" element={<BlogDetail />} />
        <Route path="contact" element={<Contact />} />
      </Route>

      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="projects" element={<AdminProjects />} />
        <Route path="skills" element={<AdminSkills />} />
        <Route path="experiences" element={<AdminExperiences />} />
        <Route path="coding-profiles" element={<AdminCodingProfiles />} />
        <Route path="blogs" element={<AdminBlogs />} />
        <Route path="contacts" element={<AdminContacts />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
    </Routes>
  );
}

export default App;
