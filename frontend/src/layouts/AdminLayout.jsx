import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import {
  FiHome,
  FiFolder,
  FiAward,
  FiBook,
  FiMail,
  FiSettings,
  FiLogOut,
  FiBriefcase,
} from "react-icons/fi";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";

const AdminLayout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const menuItems = [
    { path: "/admin", icon: FiHome, label: "Dashboard", exact: true },
    { path: "/admin/projects", icon: FiFolder, label: "Projects" },
    { path: "/admin/skills", icon: FiAward, label: "Skills" },
    { path: "/admin/experiences", icon: FiBriefcase, label: "Experience" },
    { path: "/admin/blogs", icon: FiBook, label: "Blogs" },
    { path: "/admin/contacts", icon: FiMail, label: "Contacts" },
    { path: "/admin/settings", icon: FiSettings, label: "Settings" },
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark-900">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-dark-800 shadow-lg z-40">
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200 dark:border-dark-700">
            <h1 className="text-2xl font-bold gradient-text">Dashboard</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Welcome, {user?.name}
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive(item.path, item.exact)
                    ? "bg-primary-600 text-white shadow-lg"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700"
                }`}
              >
                <item.icon className="text-xl" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-gray-200 dark:border-dark-700">
            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 transition-all duration-200 mb-2"
            >
              <FiHome className="text-xl" />
              <span className="font-medium">View Site</span>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
            >
              <FiLogOut className="text-xl" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="ml-64 min-h-screen">
        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
