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
  FiCode,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import api from "../utils/api";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showResumePreview, setShowResumePreview] = useState(false);
  const [pdfLoadError, setPdfLoadError] = useState(false);

  // Typing animation state
  const [displayedText, setDisplayedText] = useState("");
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // GSAP refs
  const heroRef = useRef(null);
  const textRef = useRef(null);
  const imageRef = useRef(null);
  const socialRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/auth/portfolio-owner");
        if (response.data) {
          setProfile(response.data);
        }
      } catch (error) {
        // Silent error handling
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // GSAP animations
  useEffect(() => {
    if (!loading && profile && heroRef.current) {
      const ctx = gsap.context(() => {
        // Animate text elements
        gsap.from(".hero-text", {
          y: 50,
          opacity: 0,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
        });

        // Animate profile image
        gsap.from(imageRef.current, {
          scale: 0.8,
          opacity: 0,
          duration: 1.2,
          ease: "elastic.out(1, 0.75)",
          delay: 0.3,
        });

        // Animate social icons
        gsap.from(".social-icon", {
          scale: 0,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.7)",
          delay: 0.8,
        });

        // Floating animation for profile image
        gsap.to(imageRef.current, {
          y: -20,
          duration: 2.5,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      }, heroRef);

      return () => ctx.revert();
    }
  }, [loading, profile]);

  // Typing animation effect
  useEffect(() => {
    // Get roles from profile or use defaults
    const roles =
      profile?.roles?.length > 0
        ? profile.roles
        : [
            "Full Stack Developer",
            "Web Developer",
            "Software Engineer",
            "MERN Stack Developer",
          ];

    const currentRole = roles[currentRoleIndex];
    const typingSpeed = isDeleting ? 50 : 100;
    const pauseTime = isDeleting ? 500 : 2000;

    if (!isDeleting && displayedText === currentRole) {
      // Finished typing, pause before deleting
      const timeout = setTimeout(() => setIsDeleting(true), pauseTime);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && displayedText === "") {
      // Finished deleting, move to next role
      setIsDeleting(false);
      setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
      return;
    }

    const timeout = setTimeout(() => {
      setDisplayedText((prev) => {
        if (isDeleting) {
          return currentRole.substring(0, prev.length - 1);
        } else {
          return currentRole.substring(0, prev.length + 1);
        }
      });
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, currentRoleIndex, profile]);

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
    <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-white via-blue-50 to-purple-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 -mt-20 pt-20">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated gradient orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.6, 0.4],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 -left-20 w-96 h-96 bg-gradient-to-br from-blue-400 to-cyan-400 dark:from-blue-600 dark:to-cyan-600 rounded-full blur-3xl opacity-30"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.6, 0.4],
            x: [0, -30, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-40 right-0 w-[500px] h-[500px] bg-gradient-to-br from-purple-400 to-pink-400 dark:from-purple-600 dark:to-pink-600 rounded-full blur-3xl opacity-30"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 40, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-indigo-400 to-blue-400 dark:from-indigo-600 dark:to-blue-600 rounded-full blur-3xl opacity-25"
        />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000,transparent)]" />
      </div>

      {/* Content Container */}
      <div className="container relative z-10 px-4 py-12 md:py-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-7xl mx-auto">
          {/* Left Side - Content */}
          <div ref={textRef} className="order-2 lg:order-1 space-y-4">
            {/* Greeting Badge */}
            <div className="hero-text inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-100 to-purple-100 dark:from-primary-900/30 dark:to-purple-900/30 border border-primary-200 dark:border-primary-800 backdrop-blur-sm">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-500"></span>
              </span>
              <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                Welcome to my portfolio
              </span>
            </div>

            {/* Name with enhanced styling */}
            <h1 className="hero-text text-4xl md:text-5xl lg:text-6xl font-black mb-2 leading-tight">
              <span className="block text-gray-700 dark:text-gray-300 mb-1 text-xl md:text-2xl font-semibold">Hi, I'm</span>
              <span className="block text-gray-900 dark:text-white">
                {profile.name}
              </span>
            </h1>

            {/* Title with Typing Animation */}
            <div className="hero-text flex items-center gap-2 text-xl md:text-2xl lg:text-3xl font-bold text-gray-700 dark:text-gray-300 min-h-[2.5rem]">
              <span className="text-primary-600 dark:text-primary-400">&gt;</span>
              <span>{displayedText}</span>
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="inline-block w-1 h-6 md:h-8 bg-primary-600 dark:bg-primary-400"
              />
            </div>

            {/* Bio with better styling */}
            <p className="hero-text text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl">
              {profile.bio}
            </p>

            {/* CTA Buttons - Enhanced */}
            <div className="hero-text flex flex-wrap gap-3 pt-2">
              <Link
                to="/projects"
                className="group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105"
              >
                <span className="relative z-10 flex items-center gap-2">
                  View Projects
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
              
              <Link
                to="/contact"
                className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                Let's Talk
              </Link>
              
              {profile.resume?.url && (
                <button
                  onClick={() => setShowResumePreview(true)}
                  className="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 text-gray-900 dark:text-white font-semibold inline-flex items-center gap-2 hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <FiEye size={18} />
                  Resume
                </button>
              )}
            </div>

            {/* Social Links - Enhanced */}
            <div ref={socialRef} className="flex items-center gap-3 pt-3">
              <div className="flex gap-3">
                {profile.github && (
                  <a
                    href={`https://github.com/${profile.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon group p-2.5 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 hover:from-blue-500 hover:to-purple-500 text-gray-700 dark:text-gray-300 hover:text-white transition-all duration-300 hover:shadow-lg hover:scale-110"
                    aria-label="GitHub"
                  >
                    <FiGithub size={18} className="group-hover:scale-110 transition-transform" />
                  </a>
                )}
                {profile.linkedin && (
                  <a
                    href={`https://linkedin.com/in/${profile.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon group p-2.5 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 hover:from-blue-500 hover:to-purple-500 text-gray-700 dark:text-gray-300 hover:text-white transition-all duration-300 hover:shadow-lg hover:scale-110"
                    aria-label="LinkedIn"
                  >
                    <FiLinkedin size={18} className="group-hover:scale-110 transition-transform" />
                  </a>
                )}
                {profile.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="social-icon group p-2.5 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 hover:from-blue-500 hover:to-purple-500 text-gray-700 dark:text-gray-300 hover:text-white transition-all duration-300 hover:shadow-lg hover:scale-110"
                    aria-label="Email"
                  >
                    <FiMail size={18} className="group-hover:scale-110 transition-transform" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Profile Image */}
          <div ref={imageRef} className="order-1 lg:order-2 flex justify-center items-center">
            <div className="relative">
              {/* Multiple animated blob backgrounds for depth */}
              <motion.div
                animate={{
                  scale: [1, 1.08, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 -z-30 opacity-40"
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
                  filter: "blur(20px)",
                  transform: "scale(1.3)",
                }}
              />
              
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, -8, 8, 0],
                }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute inset-0 -z-20 opacity-50"
                style={{
                  background: "linear-gradient(225deg, #f093fb 0%, #f5576c 100%)",
                  borderRadius: "50% 50% 40% 60% / 40% 60% 40% 60%",
                  filter: "blur(15px)",
                  transform: "scale(1.25)",
                }}
              />

              <motion.div
                animate={{
                  scale: [1, 1.06, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 -z-10"
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
                  borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
                  filter: "blur(2px)",
                  transform: "scale(1.15)",
                }}
              />

              <div 
                className="relative w-[20rem] h-[20rem] md:w-[24rem] md:h-[24rem] lg:w-[28rem] lg:h-[28rem] overflow-hidden shadow-2xl"
                style={{
                  borderRadius: "40% 60% 60% 40% / 60% 40% 60% 40%",
                }}
              >
                {profile.profileImage?.url ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <img
                      src={profile.profileImage.url}
                      alt={profile.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center">
                    <span className="text-8xl md:text-9xl font-bold text-gray-400 dark:text-gray-600">
                      {profile.name?.charAt(0) || "?"}
                    </span>
                  </div>
                )}
                
                <motion.div
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                    repeatDelay: 2,
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  style={{
                    transform: "skewX(-20deg)",
                  }}
                />
              </div>

              {/* Floating animation shadow */}
              <motion.div
                animate={{
                  y: [0, -20, 0],
                  scale: [1, 0.9, 1],
                  opacity: [0.3, 0.15, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-4/5 h-12 bg-gray-900/20 dark:bg-gray-100/10 rounded-full blur-2xl"
              />

              {/* Decorative dots */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-4 -left-4 w-20 h-20 bg-blue-500/30 rounded-full blur-xl"
              />
              
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.4, 0.8, 0.4],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
                className="absolute -bottom-6 -right-6 w-24 h-24 bg-purple-500/30 rounded-full blur-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Resume Preview Modal */}
      {showResumePreview && profile.resume && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80c backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowResumePreview(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-6xl h-[90vh] bg-white dark:bg-dark-800 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gray-800 dark:bg-dark-700 px-6 py-4 flex justify-between items-center border-b border-gray-700 dark:border-dark-600">
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
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 dark:bg-dark-600 dark:hover:bg-dark-500 text-white flex items-center gap-2 transition-all"
                >
                  <FiDownload size={18} />
                  Download
                </button>
                <button
                  onClick={() => setShowResumePreview(false)}
                  className="w-10 h-10 bg-gray-700 hover:bg-gray-600 dark:bg-dark-600 dark:hover:bg-dark-500 flex items-center justify-center text-white transition-all"
                >
                  <FiX size={20} />
                </button>
              </div>
            </div>

            {/* PDF Content */}
            <div className="w-full h-[calc(100%-4rem)] bg-gray-100 dark:bg-dark-900">
              {pdfLoadError ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <div className="w-20 h-20 bg-gray-800 dark:bg-dark-600 flex items-center justify-center mb-6">
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
                    className="px-6 py-3 bg-gray-800 dark:bg-dark-600 text-white flex items-center gap-2 font-semibold hover:bg-gray-700 dark:hover:bg-dark-500 transition-all"
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
