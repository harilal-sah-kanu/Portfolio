import { motion } from "framer-motion";
import { FiMapPin, FiCalendar, FiBriefcase } from "react-icons/fi";

const TimelineCard = ({ experience, index }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const duration = () => {
    const start = new Date(experience.startDate);
    const end = experience.current ? new Date() : new Date(experience.endDate);
    const months = Math.floor((end - start) / (1000 * 60 * 60 * 24 * 30));
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    if (years > 0) {
      return `${years} yr${years > 1 ? "s" : ""} ${
        remainingMonths > 0
          ? `${remainingMonths} mo${remainingMonths > 1 ? "s" : ""}`
          : ""
      }`;
    }
    return `${months} mo${months > 1 ? "s" : ""}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative"
    >
      <div
        className={`flex ${
          index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
        } flex-col gap-8 items-center`}
      >
        {/* Timeline dot and line */}
        <div className="hidden md:flex flex-col items-center absolute left-1/2 -translate-x-1/2 h-full">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
            className="w-4 h-4 rounded-full bg-primary-600 border-4 border-white dark:border-dark-800 shadow-lg z-10"
          ></motion.div>
          {index !== 0 && (
            <div className="w-0.5 flex-1 bg-gradient-to-b from-primary-600 to-primary-300 dark:to-primary-800"></div>
          )}
        </div>

        {/* Card */}
        <div
          className={`w-full md:w-5/12 ${
            index % 2 === 0 ? "md:text-right" : "md:text-left"
          }`}
        >
          <motion.div
            whileHover={{ y: -5 }}
            className="card p-6 hover:shadow-xl transition-all duration-300"
          >
            {experience.companyLogo && (
              <div
                className={`flex ${
                  index % 2 === 0 ? "md:justify-end" : "md:justify-start"
                } justify-start mb-4`}
              >
                <img
                  src={experience.companyLogo}
                  alt={experience.company}
                  className="h-12 w-12 object-contain rounded"
                />
              </div>
            )}

            <div className="flex items-center gap-2 mb-2 text-sm text-gray-600 dark:text-gray-400">
              <FiCalendar size={14} />
              <span>
                {formatDate(experience.startDate)} -{" "}
                {experience.current
                  ? "Present"
                  : formatDate(experience.endDate)}
                {" · "}
                {duration()}
              </span>
            </div>

            <h3 className="text-xl font-bold mb-1">{experience.position}</h3>
            <div className="flex items-center gap-2 mb-3 text-primary-600 dark:text-primary-400 font-semibold">
              <FiBriefcase size={16} />
              <span>{experience.company}</span>
            </div>

            {experience.location && (
              <div className="flex items-center gap-2 mb-3 text-sm text-gray-600 dark:text-gray-400">
                <FiMapPin size={14} />
                <span>{experience.location}</span>
              </div>
            )}

            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {experience.description}
            </p>

            {experience.achievements && experience.achievements.length > 0 && (
              <ul className="space-y-2 mb-4">
                {experience.achievements.map((achievement, i) => (
                  <li
                    key={i}
                    className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2"
                  >
                    <span className="text-primary-600 mt-1">•</span>
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
            )}

            {experience.technologies && experience.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {experience.technologies.map((tech, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-xs rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Spacer for the other side */}
        <div className="hidden md:block w-5/12"></div>
      </div>
    </motion.div>
  );
};

export default TimelineCard;
