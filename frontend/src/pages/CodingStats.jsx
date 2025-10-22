import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CodingStatsCard from "../components/CodingStatsCard";
import api from "../utils/api";
import toast from "react-hot-toast";

const CodingStats = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const { data } = await api.get("/coding-profiles");
        setProfiles(data);
      } catch (error) {
        toast.error("Failed to load coding profiles");
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, []);

  return (
    <div className="py-20">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Coding <span className="gradient-text">Statistics</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            My performance across various coding platforms
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="h-6 bg-gray-300 dark:bg-dark-700 rounded w-1/2 mb-4"></div>
                <div className="h-20 bg-gray-300 dark:bg-dark-700 rounded mb-3"></div>
                <div className="h-4 bg-gray-300 dark:bg-dark-700 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : profiles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
              No coding profiles added yet.
            </p>
            <p className="text-gray-500 dark:text-gray-500">
              Check back soon for my coding statistics and achievements.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {profiles.map((profile, index) => (
              <CodingStatsCard
                key={profile._id}
                profile={profile}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CodingStats;
