import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiSun, FiMoon } from "react-icons/fi";
import useThemeStore from "../store/themeStore";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/projects", label: "Projects" },
    { path: "/skills", label: "Skills" },
    { path: "/experience", label: "Experience" },
    { path: "/blog", label: "Blog" },
    { path: "/contact", label: "Contact" },
  ];

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Backdrop blur overlay for mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-white/80 dark:bg-dark-900/80 backdrop-blur-md z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || isOpen
            ? "bg-white/90 dark:bg-dark-900/90 backdrop-blur-lg shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold gradient-text">
              Portfolio
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative font-medium transition-colors duration-200 ${
                    isActive(link.path)
                      ? "text-primary-600 dark:text-primary-400"
                      : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                  }`}
                >
                  {link.label}
                  {isActive(link.path) && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-400"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              ))}

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-200 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-dark-600 transition-colors duration-200"
                aria-label="Toggle theme"
              >
                {theme === "light" ? <FiMoon size={20} /> : <FiSun size={20} />}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-200 dark:bg-dark-700 text-gray-700 dark:text-gray-300"
                aria-label="Toggle theme"
              >
                {theme === "light" ? <FiMoon size={20} /> : <FiSun size={20} />}
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg bg-gray-200 dark:bg-dark-700 text-gray-700 dark:text-gray-300"
                aria-label="Toggle menu"
              >
                {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="md:hidden overflow-hidden bg-white/95 dark:bg-dark-800/95 backdrop-blur-sm rounded-b-2xl shadow-xl"
              >
                <div className="py-4 space-y-2 px-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`block px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                        isActive(link.path)
                          ? "bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-md"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 hover:shadow-sm"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
