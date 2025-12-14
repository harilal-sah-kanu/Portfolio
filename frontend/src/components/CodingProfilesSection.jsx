import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  SiLeetcode,
  SiCodechef,
  SiCodeforces,
  SiHackerrank,
  SiGeeksforgeeks,
} from "react-icons/si";
import { FiGithub, FiExternalLink, FiCode, FiBookOpen } from "react-icons/fi";
import { useState, useEffect } from "react";
import api from "../utils/api";

const CodingProfilesSection = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const response = await api.get("/coding-profiles");
      setProfiles(response.data.filter((p) => p.enabled));
    } catch (error) {
      // Silent error handling
    } finally {
      setLoading(false);
    }
  };

  const getPlatformIcon = (platform) => {
    const icons = {
      leetcode: <SiLeetcode size={32} />,
      codechef: <SiCodechef size={32} />,
      codeforces: <SiCodeforces size={32} />,
      hackerrank: <SiHackerrank size={32} />,
      github: <FiGithub size={32} />,
      geeksforgeeks: <SiGeeksforgeeks size={32} />,
      interviewbit: <FiBookOpen size={32} />,
    };
    return icons[platform] || <FiCode size={32} />;
  };

  const getPlatformColor = (platform) => {
    const colors = {
      leetcode: "from-yellow-500 to-orange-500",
      codechef: "from-brown-600 to-orange-700",
      codeforces: "from-blue-600 to-blue-800",
      hackerrank: "from-green-500 to-green-700",
      github: "from-gray-700 to-gray-900",
      geeksforgeeks: "from-green-600 to-green-800",
      interviewbit: "from-blue-600 to-blue-800",
    };
    return colors[platform] || "from-primary-600 to-purple-600";
  };

  if (loading || profiles.length === 0) {
    return null;
  }

  return (
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
            Coding{" "}
            <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              Profiles
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Follow my journey on competitive programming platforms
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          {profiles.map((profile, index) => (
            <motion.a
              key={profile._id}
              href={profile.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="card p-6 text-center group relative overflow-hidden"
            >
              {/* Gradient background on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${getPlatformColor(
                  profile.platform
                )} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              />

              {/* Icon */}
              <div className="relative mb-4 flex justify-center">
                <div
                  className={`p-4 rounded-full bg-gradient-to-br ${getPlatformColor(
                    profile.platform
                  )} text-white`}
                >
                  {getPlatformIcon(profile.platform)}
                </div>
              </div>

              {/* Platform Name */}
              <h3 className="text-lg font-bold text-gray-900 dark:text-white capitalize">
                {profile.platform}
              </h3>

              {/* External link icon */}
              <FiExternalLink className="absolute top-4 right-4 text-gray-400 group-hover:text-primary-600 transition-colors" />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CodingProfilesSection;
