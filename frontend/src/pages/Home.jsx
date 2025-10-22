import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiGithub,
  FiLinkedin,
  FiMail,
  FiArrowDown,
  FiArrowRight,
} from "react-icons/fi";
import { useEffect, useState } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";
import Hero from "../components/Hero";
import ProjectCard from "../components/ProjectCard";
import SkillCard from "../components/SkillCard";
import CodingProfilesSection from "../components/CodingProfilesSection";

const Home = () => {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProjects: 0,
    yearsExperience: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, skillsRes, allProjectsRes, experienceRes] =
          await Promise.all([
            api.get("/projects?featured=true"),
            api.get("/skills"),
            api.get("/projects"),
            api.get("/experiences"),
          ]);

        setFeaturedProjects(projectsRes.data.slice(0, 3));
        setSkills(skillsRes.data.slice(0, 8));

        // Calculate real stats
        const totalProjects = allProjectsRes.data.length;

        // Calculate years of experience from the earliest start date
        let yearsExperience = 0;
        if (experienceRes.data.length > 0) {
          const dates = experienceRes.data.map(
            (exp) => new Date(exp.startDate)
          );
          const earliestDate = new Date(Math.min(...dates));
          const today = new Date();
          yearsExperience = Math.floor(
            (today - earliestDate) / (1000 * 60 * 60 * 24 * 365)
          );
        }

        setStats({
          totalProjects,
          yearsExperience: yearsExperience > 0 ? yearsExperience : 1,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load content");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Featured Projects Section */}
      <section className="section bg-gray-50 dark:bg-dark-800">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Featured{" "}
              <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                Projects
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Check out some of my recent work
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card-3d p-6 animate-pulse">
                  <div className="bg-gray-300 dark:bg-dark-700 h-48 rounded-lg mb-4"></div>
                  <div className="h-6 bg-gray-300 dark:bg-dark-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-dark-700 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project, index) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/projects" className="btn-primary inline-block">
              View All Projects
            </Link>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              My{" "}
              <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                Skills
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Technologies and tools I work with
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="card p-6 animate-pulse">
                  <div className="h-12 bg-gray-300 dark:bg-dark-700 rounded mb-4"></div>
                  <div className="h-4 bg-gray-300 dark:bg-dark-700 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill._id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <SkillCard skill={skill} />
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/skills" className="btn-outline inline-block">
              View All Skills
            </Link>
          </div>
        </div>
      </section>

      {/* Coding Profiles Section */}
      <CodingProfilesSection />

      {/* CTA Section - Minimalistic */}
      <section className="section relative overflow-hidden bg-white dark:bg-dark-900">
        <div className="container relative z-10 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            {/* Minimalistic Divider */}
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="h-px bg-gradient-to-r from-transparent via-primary-500 to-transparent mb-16"
            />

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-gray-100"
            >
              Let's Work{" "}
              <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                Together
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl mb-12 max-w-2xl mx-auto text-gray-600 dark:text-gray-400 leading-relaxed"
            >
              Have a project in mind? Let's create something amazing together.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            >
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <span>Get In Touch</span>
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/projects"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-gray-300 dark:border-dark-700 text-gray-900 dark:text-gray-100 font-medium rounded-lg hover:border-primary-500 dark:hover:border-primary-500 transition-all duration-300 hover:scale-105"
              >
                View My Work
              </Link>
            </motion.div>

            {/* Real Stats - Minimalistic */}
            {!loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-2 gap-8 md:gap-12 max-w-lg mx-auto pt-12 border-t border-gray-200 dark:border-dark-700"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7 }}
                  className="text-center"
                >
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    {stats.totalProjects}+
                  </div>
                  <div className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                    Projects
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8 }}
                  className="text-center"
                >
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    {stats.yearsExperience}+
                  </div>
                  <div className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                    Years Experience
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Minimalistic Divider */}
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="h-px bg-gradient-to-r from-transparent via-primary-500 to-transparent mt-16"
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
