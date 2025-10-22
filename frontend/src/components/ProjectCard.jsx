import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiGithub, FiExternalLink } from "react-icons/fi";

const ProjectCard = ({ project }) => {
  return (
    <motion.div whileHover={{ y: -8 }} className="card overflow-hidden group">
      {/* Project Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4 flex gap-2">
            {project.links?.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                <FiGithub size={20} />
              </a>
            )}
            {project.links?.live && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                <FiExternalLink size={20} />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Project Info */}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">
          {project.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.techStack?.slice(0, 3).map((tech, index) => (
            <span
              key={index}
              className="px-3 py-1 text-xs font-medium rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
            >
              {tech}
            </span>
          ))}
          {project.techStack?.length > 3 && (
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300">
              +{project.techStack.length - 3} more
            </span>
          )}
        </div>

        {/* View Details */}
        <Link
          to={`/projects/${project._id}`}
          className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:gap-3 transition-all duration-200 font-medium"
        >
          View Details
          <FiExternalLink size={16} />
        </Link>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
