import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import api from "../utils/api";
import toast from "react-hot-toast";
import ProjectCard from "../components/ProjectCard";

gsap.registerPlugin(ScrollTrigger);

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const projectsGridRef = useRef(null);

  useEffect(() => {
    fetchProjects();
  }, [filter]);

  const fetchProjects = async () => {
    try {
      const params = filter !== "all" ? { category: filter } : {};
      const { data } = await api.get("/projects", { params });
      setProjects(data);
    } catch (error) {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && projects.length > 0 && projectsGridRef.current) {
      gsap.fromTo(".project-item-gsap",
        {
          y: 80,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          clearProps: "all",
        }
      );
    }
  }, [loading, projects, filter]);

  const categories = ["all", "web", "mobile", "fullstack", "ai/ml", "other"];

  return (
    <div className="min-h-screen pt-20">
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold mb-4">
              My <span className="gradient-text">Projects</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Explore my latest work and creations
            </p>
          </motion.div>

          {/* Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                  filter === cat
                    ? "bg-primary-600 text-white shadow-lg"
                    : "bg-gray-200 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-dark-600"
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="card p-6 animate-pulse">
                  <div className="bg-gray-300 dark:bg-dark-700 h-48 rounded-lg mb-4"></div>
                  <div className="h-6 bg-gray-300 dark:bg-dark-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-dark-700 rounded"></div>
                </div>
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 dark:text-gray-400">
                No projects found in this category.
              </p>
            </div>
          ) : (
            <div ref={projectsGridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <div key={project._id} className="project-item-gsap">
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Projects;
