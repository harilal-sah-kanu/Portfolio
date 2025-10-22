import { motion } from "framer-motion";

const SkillCard = ({ skill }) => {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.05 }}
      className="card p-6 relative overflow-hidden group"
    >
      {/* Animated Background Gradient */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(135deg, ${skill.color}15, ${skill.color}05)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Skill Name */}
        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          {skill.name}
        </h3>

        {/* Progress Bar */}
        <div className="relative w-full h-3 bg-gray-200 dark:bg-dark-700 rounded-full overflow-hidden mb-3">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${skill.level}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
            className="absolute top-0 left-0 h-full rounded-full"
            style={{
              background: `linear-gradient(90deg, ${skill.color}, ${skill.color}cc)`,
            }}
          >
            <motion.div
              className="absolute inset-0"
              animate={{
                backgroundPosition: ["0% 0%", "100% 0%"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)`,
                backgroundSize: "200% 100%",
              }}
            />
          </motion.div>
        </div>

        {/* Level Percentage with Animation */}
        <div className="flex items-center justify-between">
          <motion.span
            className="text-sm font-semibold"
            style={{ color: skill.color }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            {skill.level}% Proficiency
          </motion.span>
          <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            {skill.category}
          </span>
        </div>
      </div>

      {/* Decorative Corner Accent */}
      <motion.div
        className="absolute top-0 right-0 w-20 h-20 rounded-bl-full opacity-10 group-hover:opacity-20 transition-opacity"
        style={{ backgroundColor: skill.color }}
      />
    </motion.div>
  );
};

export default SkillCard;
