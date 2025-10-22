import { motion } from "framer-motion";
import {
  FiGithub,
  FiLinkedin,
  FiMail,
  FiEye,
  FiDownload,
  FiX,
  FiBriefcase,
  FiZap,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../utils/api";

const Hero = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showResumePreview, setShowResumePreview] = useState(false);
  const [pdfLoadError, setPdfLoadError] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/auth/portfolio-owner");
        if (response.data) {
          setProfile(response.data);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <section className="relative min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </section>
    );
  }

  if (!profile) {
    return (
      <section className="relative min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-900">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Failed to load profile
          </p>
        </div>
      </section>
    );
  }

  const handleDownloadResume = () => {
    if (!profile?.resume?.url) return;

    const link = document.createElement("a");
    link.href = profile.resume.url;
    link.download = profile.resume.filename || "resume.pdf";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 -left-1/4 w-96 h-96 bg-primary-400/20 dark:bg-primary-600/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-3xl"
        />
      </div>

      {/* Content Container */}
      <div className="container relative z-10 px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-7xl mx-auto">
          {/* Left Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="order-2 lg:order-1"
          >
            {/* Greeting */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="mb-4"
            >
              <span className="text-lg md:text-xl text-primary-600 dark:text-primary-400 font-medium">
                Hello, I'm
              </span>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                {profile.name}
              </span>
            </motion.h1>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl md:text-2xl lg:text-3xl font-semibold mb-6 text-gray-700 dark:text-gray-300"
            >
              {profile.title}
            </motion.h2>

            {/* Bio */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-base md:text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed"
            >
              {profile.bio}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-wrap gap-4 mb-8"
            >
              <Link
                to="/projects"
                className="btn-primary inline-block hover:scale-105 transition-transform"
              >
                View Projects
              </Link>
              <Link
                to="/contact"
                className="btn-outline inline-block hover:scale-105 transition-transform"
              >
                Contact Me
              </Link>
              {profile.resume?.url && (
                <>
                  <button
                    onClick={() => setShowResumePreview(true)}
                    className="btn-secondary inline-flex items-center gap-2 hover:scale-105 transition-transform"
                  >
                    <FiEye size={18} />
                    Resume
                  </button>
                </>
              )}
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="flex gap-4"
            >
              {profile.github && (
                <motion.a
                  href={`https://github.com/${profile.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 rounded-full bg-white dark:bg-dark-800 shadow-lg text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-all"
                  aria-label="GitHub"
                >
                  <FiGithub size={24} />
                </motion.a>
              )}
              {profile.linkedin && (
                <motion.a
                  href={`https://linkedin.com/in/${profile.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 rounded-full bg-white dark:bg-dark-800 shadow-lg text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-all"
                  aria-label="LinkedIn"
                >
                  <FiLinkedin size={24} />
                </motion.a>
              )}
              {profile.email && (
                <motion.a
                  href={`mailto:${profile.email}`}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 rounded-full bg-white dark:bg-dark-800 shadow-lg text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-all"
                  aria-label="Email"
                >
                  <FiMail size={24} />
                </motion.a>
              )}
            </motion.div>
          </motion.div>

          {/* Right Side - Profile Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="order-1 lg:order-2 flex justify-center"
          >
            <div className="relative">
              {/* Image Container - No animations */}
              <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
                {/* Gradient Border */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500 via-purple-500 to-pink-500 rounded-full p-1">
                  <div className="w-full h-full bg-white dark:bg-dark-900 rounded-full p-2">
                    {profile.profileImage?.url ? (
                      <img
                        src={profile.profileImage.url}
                        alt={profile.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-primary-100 to-purple-100 dark:from-primary-900/30 dark:to-purple-900/30 flex items-center justify-center">
                        <span className="text-6xl md:text-8xl font-bold text-primary-600 dark:text-primary-400">
                          {profile.name?.charAt(0) || "?"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Floating Icon Badges */}
                <div className="absolute -top-4 -right-4 bg-white dark:bg-dark-800 rounded-full p-3 shadow-xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center">
                    <FiBriefcase className="text-white" size={24} />
                  </div>
                </div>

                <div className="absolute -bottom-4 -left-4 bg-white dark:bg-dark-800 rounded-full p-3 shadow-xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <FiZap className="text-white" size={24} />
                  </div>
                </div>
              </div>

              {/* Decorative Dots Pattern */}
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%]">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, rgba(99, 102, 241, 0.1) 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Resume Preview Modal */}
      {showResumePreview && profile.resume && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowResumePreview(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-6xl h-[90vh] bg-white dark:bg-dark-800 rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-purple-600 px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <FiEye className="text-white" size={24} />
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Resume Preview
                  </h3>
                  <p className="text-sm text-white/80">
                    {profile.resume.filename || "document.pdf"}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleDownloadResume}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg flex items-center gap-2 transition-all"
                >
                  <FiDownload size={18} />
                  Download
                </button>
                <button
                  onClick={() => setShowResumePreview(false)}
                  className="w-10 h-10 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all"
                >
                  <FiX size={20} />
                </button>
              </div>
            </div>

            {/* PDF Content */}
            <div className="w-full h-[calc(100%-4rem)] bg-gray-100 dark:bg-dark-900">
              {pdfLoadError ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary-600 to-purple-600 flex items-center justify-center mb-6">
                    <FiDownload className="text-white" size={32} />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    Preview Not Available
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                    Your browser doesn't support inline PDF viewing. Download
                    the file to view it.
                  </p>
                  <button
                    onClick={handleDownloadResume}
                    className="px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg flex items-center gap-2 font-semibold hover:shadow-lg transition-all"
                  >
                    <FiDownload size={20} />
                    Download Resume
                  </button>
                </div>
              ) : (
                <iframe
                  src={`${profile.resume.url}#toolbar=0&navpanes=0`}
                  className="w-full h-full border-0"
                  title="Resume Preview"
                  onError={() => setPdfLoadError(true)}
                />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

export default Hero;
