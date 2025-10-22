import { useState, useEffect } from "react";
import {
  FiFolder,
  FiCode,
  FiFileText,
  FiMail,
  FiTrendingUp,
} from "react-icons/fi";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../../utils/api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    blogs: 0,
    contacts: 0,
    totalViews: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [projects, skills, blogs, contacts] = await Promise.all([
        api.get("/projects"),
        api.get("/skills"),
        api.get("/blogs"),
        api.get("/contacts"),
      ]);

      const totalViews = blogs.data.reduce(
        (sum, blog) => sum + (blog.views || 0),
        0
      );

      setStats({
        projects: projects.data.length,
        skills: skills.data.length,
        blogs: blogs.data.length,
        contacts: contacts.data.filter((c) => c.status === "new").length,
        totalViews,
      });
    } catch (error) {
      toast.error("Failed to load dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: "Total Projects",
      value: stats.projects,
      icon: FiFolder,
      color: "blue",
    },
    { label: "Skills", value: stats.skills, icon: FiCode, color: "green" },
    {
      label: "Blog Posts",
      value: stats.blogs,
      icon: FiFileText,
      color: "purple",
    },
    {
      label: "New Messages",
      value: stats.contacts,
      icon: FiMail,
      color: "red",
    },
    {
      label: "Blog Views",
      value: stats.totalViews,
      icon: FiTrendingUp,
      color: "yellow",
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
      green:
        "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
      purple:
        "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
      red: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
      yellow:
        "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
    };
    return colors[color] || colors.blue;
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display mb-2">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back! Here's an overview of your portfolio.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-4 bg-gray-300 dark:bg-dark-700 rounded w-24 mb-3"></div>
                  <div className="h-8 bg-gray-300 dark:bg-dark-700 rounded w-16"></div>
                </div>
                <div className="w-12 h-12 bg-gray-300 dark:bg-dark-700 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold font-display">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(
                    stat.color
                  )}`}
                >
                  <stat.icon size={24} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="text-xl font-bold font-display mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <a
              href="/admin/projects"
              className="block p-3 rounded-lg bg-gray-50 dark:bg-dark-700 hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FiFolder className="text-primary-600" />
                <span className="font-medium">Manage Projects</span>
              </div>
            </a>
            <a
              href="/admin/skills"
              className="block p-3 rounded-lg bg-gray-50 dark:bg-dark-700 hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FiCode className="text-primary-600" />
                <span className="font-medium">Manage Skills</span>
              </div>
            </a>
            <a
              href="/admin/blogs"
              className="block p-3 rounded-lg bg-gray-50 dark:bg-dark-700 hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FiFileText className="text-primary-600" />
                <span className="font-medium">Write Blog Post</span>
              </div>
            </a>
            <a
              href="/admin/contacts"
              className="block p-3 rounded-lg bg-gray-50 dark:bg-dark-700 hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FiMail className="text-primary-600" />
                <span className="font-medium">View Messages</span>
              </div>
            </a>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-bold font-display mb-4">System Info</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-dark-700">
              <span className="text-gray-600 dark:text-gray-400">
                Portfolio Version
              </span>
              <span className="font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-dark-700">
              <span className="text-gray-600 dark:text-gray-400">Stack</span>
              <span className="font-medium">MERN</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-dark-700">
              <span className="text-gray-600 dark:text-gray-400">Database</span>
              <span className="font-medium">MongoDB</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Status</span>
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded font-medium">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
