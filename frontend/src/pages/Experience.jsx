import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiBriefcase,
  FiCalendar,
  FiMapPin,
  FiAward,
  FiBook,
  FiCodepen,
  FiUsers,
  FiTrendingUp,
} from "react-icons/fi";
import api from "../utils/api";
import toast from "react-hot-toast";

const Experience = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const { data } = await api.get("/experiences");
        setExperiences(data);
      } catch (error) {
        toast.error("Failed to load experiences");
      } finally {
        setLoading(false);
      }
    };
    fetchExperiences();
  }, []);

  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const options = { year: "numeric", month: "short" };
    return date.toLocaleDateString("en-US", options);
  };

  // Group experiences by category
  const groupedExperiences = experiences.reduce((acc, exp) => {
    if (!acc[exp.category]) {
      acc[exp.category] = [];
    }
    acc[exp.category].push(exp);
    return acc;
  }, {});

  const categoryColors = {
    work: "from-blue-500 to-blue-600",
    education: "from-purple-500 to-purple-600",
    internship: "from-green-500 to-green-600",
    freelance: "from-orange-500 to-orange-600",
    volunteer: "from-pink-500 to-pink-600",
    certification: "from-indigo-500 to-indigo-600",
  };

  const categoryIcons = {
    work: FiBriefcase,
    education: FiBook,
    internship: FiTrendingUp,
    freelance: FiCodepen,
    volunteer: FiUsers,
    certification: FiAward,
  };

  return (
    <div className="py-20">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Work <span className="gradient-text">Experience</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            My professional journey and key achievements
          </p>
        </motion.div>

        {loading ? (
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="h-6 bg-gray-300 dark:bg-dark-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-300 dark:bg-dark-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-300 dark:bg-dark-700 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : experiences.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
              No experience data available yet.
            </p>
            <p className="text-gray-500 dark:text-gray-500">
              Check back soon for updates on my professional journey.
            </p>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto">
            {Object.entries(groupedExperiences).map(
              ([category, categoryExps]) => {
                const CategoryIcon = categoryIcons[category];
                return (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                  >
                    {/* Category Header */}
                    <div className="flex items-center gap-3 mb-6">
                      <div
                        className={`p-2 rounded-lg bg-gradient-to-r ${categoryColors[category]} text-white`}
                      >
                        <CategoryIcon size={20} />
                      </div>
                      <h2 className="text-xl font-bold capitalize text-gray-900 dark:text-white">
                        {category}
                      </h2>
                      <div className="flex-1 h-px bg-gradient-to-r from-gray-300 dark:from-dark-600 to-transparent ml-4"></div>
                    </div>

                    {/* Zigzag Timeline */}
                    <div className="relative">
                      {/* Center Vertical Line - Hidden on mobile, shown on desktop */}
                      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gray-300 dark:from-dark-600 to-transparent transform -translate-x-1/2"></div>

                      {categoryExps.map((exp, index) => {
                        const isLeft = index % 2 === 0;
                        return (
                          <motion.div
                            key={exp._id}
                            initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative mb-8 last:mb-0 md:w-1/2 ${
                              isLeft ? "md:pr-8" : "md:ml-auto md:pl-8"
                            }`}
                          >
                            {/* Timeline Dot - Center on desktop, left on mobile */}
                            <div
                              className={`absolute w-6 h-6 md:w-8 md:h-8 rounded-full bg-white dark:bg-dark-800 border-3 border-primary-500 shadow-md flex items-center justify-center z-10 ${
                                isLeft
                                  ? "-left-3 md:right-0 md:left-auto md:translate-x-1/2"
                                  : "-left-3 md:left-0 md:-translate-x-1/2"
                              } top-6`}
                            >
                              <div
                                className={`w-2 h-2 md:w-3 md:h-3 rounded-full bg-gradient-to-br ${categoryColors[category]}`}
                              ></div>
                            </div>

                            {/* Content Card */}
                            <motion.div
                              whileHover={{
                                scale: 1.02,
                                x: isLeft ? -5 : 5,
                              }}
                              className={`card p-4 md:p-5 group hover:shadow-xl transition-all duration-300 ml-6 md:ml-0 ${
                                isLeft
                                  ? "md:border-r-4 border-l-4 border-transparent hover:border-primary-500"
                                  : "md:border-l-4 border-l-4 border-transparent hover:border-primary-500"
                              }`}
                            >
                              {/* Header with Title, Subtitle and Date */}
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                                <div className="flex-1 min-w-0">
                                  {/* Title */}
                                  <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mb-1">
                                    {exp.title}
                                  </h3>

                                  {/* Subtitle */}
                                  {exp.subtitle && (
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                      {exp.subtitle}
                                    </p>
                                  )}

                                  {/* Organization and Location */}
                                  <div className="flex flex-wrap items-center gap-3 mt-1">
                                    {exp.organization && (
                                      <p className="text-base font-semibold text-primary-600 dark:text-primary-400 flex items-center gap-1.5">
                                        <FiBriefcase
                                          size={14}
                                          className="flex-shrink-0"
                                        />
                                        <span className="truncate">
                                          {exp.organization}
                                        </span>
                                      </p>
                                    )}
                                    {exp.location && (
                                      <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                                        <FiMapPin
                                          size={12}
                                          className="flex-shrink-0"
                                        />
                                        <span className="truncate">
                                          {exp.location}
                                        </span>
                                      </p>
                                    )}
                                  </div>
                                </div>

                                {/* Date Badge */}
                                <div
                                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r ${categoryColors[category]} text-white font-medium text-xs shadow-md flex-shrink-0`}
                                >
                                  <FiCalendar size={12} />
                                  <span className="whitespace-nowrap">
                                    {formatDate(exp.startDate)} -{" "}
                                    {exp.current
                                      ? "Present"
                                      : formatDate(exp.endDate)}
                                  </span>
                                </div>
                              </div>

                              {/* Description */}
                              {exp.description && (
                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                                  {exp.description}
                                </p>
                              )}

                              {/* Key Achievements */}
                              {exp.achievements &&
                                exp.achievements.length > 0 && (
                                  <div className="mb-3">
                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                      Key Achievements:
                                    </h4>
                                    <ul className="space-y-1.5">
                                      {exp.achievements
                                        .slice(0, 3)
                                        .map((achievement, idx) => (
                                          <li
                                            key={idx}
                                            className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                                          >
                                            <span
                                              className={`mt-1.5 w-1.5 h-1.5 rounded-full bg-gradient-to-br ${categoryColors[category]} flex-shrink-0`}
                                            ></span>
                                            <span className="flex-1">
                                              {achievement}
                                            </span>
                                          </li>
                                        ))}
                                      {exp.achievements.length > 3 && (
                                        <li className="text-xs text-gray-500 dark:text-gray-500 ml-4">
                                          +{exp.achievements.length - 3} more
                                        </li>
                                      )}
                                    </ul>
                                  </div>
                                )}

                              {/* Skills/Technologies */}
                              {exp.technologies &&
                                exp.technologies.length > 0 && (
                                  <div className="pt-3 border-t border-gray-200 dark:border-dark-700">
                                    <div className="flex flex-wrap gap-1.5">
                                      {exp.technologies.map((tech, idx) => (
                                        <span
                                          key={idx}
                                          className="px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                                        >
                                          {tech}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                            </motion.div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                );
              }
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Experience;
