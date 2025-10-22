import { motion } from "framer-motion";
import { FiCheck, FiX } from "react-icons/fi";
import {
  SiLeetcode,
  SiCodechef,
  SiCodeforces,
  SiHackerrank,
  SiGeeksforgeeks,
} from "react-icons/si";
import { FiGithub, FiCode, FiBookOpen } from "react-icons/fi";
import { useState } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";

const TodayActivity = ({ codingProfiles, onUpdate }) => {
  const [updating, setUpdating] = useState(false);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getPlatformIcon = (platform) => {
    const icons = {
      leetcode: <SiLeetcode className="text-yellow-500" size={24} />,
      codechef: <SiCodechef className="text-brown-600" size={24} />,
      codeforces: <SiCodeforces className="text-blue-600" size={24} />,
      hackerrank: <SiHackerrank className="text-green-600" size={24} />,
      github: <FiGithub className="text-gray-900 dark:text-white" size={24} />,
      geeksforgeeks: <SiGeeksforgeeks className="text-green-700" size={24} />,
      interviewbit: <FiBookOpen className="text-blue-700" size={24} />,
      codingninja: <FiCode className="text-orange-600" size={24} />,
      naukri: <FiCode className="text-purple-600" size={24} />,
    };
    return icons[platform] || <FiCode size={24} />;
  };

  const getTodayStatus = (profile) => {
    const todayContribution = profile.dailyContributions?.find(
      (c) => new Date(c.date).toDateString() === today.toDateString()
    );
    return todayContribution?.solved || false;
  };

  const handleTogglePlatform = async (profileId, currentStatus) => {
    setUpdating(true);
    try {
      await api.post(`/coding-profiles/${profileId}/daily-contribution`, {
        date: today.toISOString(),
        solved: !currentStatus,
        contributed: !currentStatus,
      });
      toast.success(!currentStatus ? "Marked as solved!" : "Unmarked");
      if (onUpdate) onUpdate();
      window.location.reload();
    } catch (error) {
      toast.error("Failed to update");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="card p-6 mb-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Today's Activity
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {today.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-primary-600">
            {codingProfiles.filter((p) => getTodayStatus(p)).length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Platforms Active
          </div>
        </div>
      </div>

      {/* Platforms Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {codingProfiles.map((profile, index) => {
          const isSolved = getTodayStatus(profile);
          return (
            <motion.div
              key={profile._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleTogglePlatform(profile._id, isSolved)}
              className={`
                relative p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer
                ${
                  isSolved
                    ? "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-300 dark:border-green-700 shadow-lg shadow-green-100 dark:shadow-green-900/20"
                    : "bg-white dark:bg-dark-800 border-gray-200 dark:border-dark-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md"
                }
                ${updating ? "opacity-50 pointer-events-none" : ""}
              `}
            >
              {/* Status Badge */}
              <div className="absolute -top-2 -right-2">
                {isSolved ? (
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                    <FiCheck className="text-white" size={14} />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-dark-600 flex items-center justify-center">
                    <FiX
                      className="text-gray-600 dark:text-gray-400"
                      size={14}
                    />
                  </div>
                )}
              </div>

              {/* Platform Icon */}
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-dark-700">
                  {getPlatformIcon(profile.platform)}
                </div>
                <div>
                  <div className="font-semibold text-sm capitalize text-gray-900 dark:text-white">
                    {profile.platform}
                  </div>
                  <div
                    className={`text-xs mt-1 ${
                      isSolved
                        ? "text-green-600 dark:text-green-400 font-medium"
                        : "text-gray-500 dark:text-gray-500"
                    }`}
                  >
                    {isSolved ? "Solved Today ✓" : "Click to Mark"}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
        💡 Click on any platform card to mark/unmark today's activity
      </p>
    </motion.div>
  );
};

export default TodayActivity;
