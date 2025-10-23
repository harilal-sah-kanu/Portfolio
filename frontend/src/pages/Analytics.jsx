import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  FiCode,
  FiTrendingUp,
  FiAward,
  FiActivity,
  FiGithub,
  FiTarget,
  FiBarChart2,
  FiCalendar,
  FiBookOpen,
  FiPieChart,
  FiCheck,
} from "react-icons/fi";
import {
  SiLeetcode,
  SiCodechef,
  SiCodeforces,
  SiHackerrank,
  SiGeeksforgeeks,
} from "react-icons/si";
import api from "../utils/api";
import toast from "react-hot-toast";
import ContributionCalendar from "../components/ContributionCalendar";

const Analytics = () => {
  const [codingProfiles, setCodingProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredPlatform, setHoveredPlatform] = useState(null);
  const [hoveredDifficulty, setHoveredDifficulty] = useState(null);
  const [stats, setStats] = useState({
    totalSolved: 0,
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0,
    totalContests: 0,
    totalRepos: 0,
    totalStars: 0,
  });
  const [platformDistribution, setPlatformDistribution] = useState([]);

  useEffect(() => {
    fetchCodingProfiles();
  }, []);

  // Auto-refresh when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchCodingProfiles();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Auto-sync daily contributions every 5 minutes
  useEffect(() => {
    const autoSyncContributions = async () => {
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check each enabled profile
        for (const profile of codingProfiles.filter((p) => p.enabled)) {
          const todayContribution = profile.dailyContributions?.find(
            (c) => new Date(c.date).toDateString() === today.toDateString()
          );

          // If no contribution for today exists, create one
          if (!todayContribution) {
            try {
              await api.post(
                `/coding-profiles/${profile._id}/daily-contribution`,
                {
                  date: today.toISOString(),
                  solved: false,
                  contributed: false,
                }
              );
            } catch (error) {
              console.error(
                `Failed to create contribution for ${profile.platform}:`,
                error
              );
            }
          }
        }

        // Refresh profiles to get updated contributions
        fetchCodingProfiles();
      } catch (error) {
        console.error("Auto-sync error:", error);
      }
    };

    // Run immediately on load
    if (codingProfiles.length > 0) {
      autoSyncContributions();
    }

    // Set up interval to auto-sync every 5 minutes
    const syncInterval = setInterval(autoSyncContributions, 5 * 60 * 1000);

    // Cleanup interval on unmount
    return () => clearInterval(syncInterval);
  }, [codingProfiles.length]);

  const fetchCodingProfiles = async () => {
    try {
      const response = await api.get("/coding-profiles");
      const profiles = response.data.filter((profile) => profile.enabled);
      setCodingProfiles(profiles);
      calculateStats(profiles);
    } catch (error) {
      console.error("Error fetching coding profiles:", error);
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (profiles) => {
    let totalSolved = 0;
    let easySolved = 0;
    let mediumSolved = 0;
    let hardSolved = 0;
    let totalContests = 0;
    let totalRepos = 0;
    let totalStars = 0;
    const platformDist = [];

    profiles.forEach((profile) => {
      const solved = profile.stats?.totalSolved || 0;
      totalSolved += solved;

      // Only count Easy/Medium/Hard from LeetCode
      if (profile.platform === "leetcode") {
        easySolved += profile.stats?.easySolved || 0;
        mediumSolved += profile.stats?.mediumSolved || 0;
        hardSolved += profile.stats?.hardSolved || 0;
      }

      totalContests += profile.stats?.contestParticipation || 0;
      totalRepos += profile.stats?.totalRepos || 0;
      totalStars += profile.stats?.totalStars || 0;

      // Add to platform distribution if has solved problems
      if (solved > 0) {
        platformDist.push({
          platform: profile.platform,
          solved,
        });
      }
    });

    setStats({
      totalSolved,
      easySolved,
      mediumSolved,
      hardSolved,
      totalContests,
      totalRepos,
      totalStars,
    });
    setPlatformDistribution(platformDist);
  };

  // Get today's activity across all platforms
  const getTodayActivity = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayActivities = codingProfiles
      .map((profile) => {
        const todayContribution = profile.dailyContributions?.find(
          (c) => new Date(c.date).toDateString() === today.toDateString()
        );
        return {
          platform: profile.platform,
          solved: todayContribution?.solved || false,
          contributed: todayContribution?.contributed || false,
        };
      })
      .filter((activity) => activity.solved || activity.contributed);

    return todayActivities;
  };

  // Calculate current streak across all platforms
  const getCurrentStreak = useMemo(() => {
    if (codingProfiles.length === 0) return 0;

    // Get all unique dates with activity from all platforms
    const allDates = new Set();
    codingProfiles.forEach((profile) => {
      profile.dailyContributions?.forEach((c) => {
        if (c.solved || c.contributed) {
          allDates.add(new Date(c.date).toDateString());
        }
      });
    });

    if (allDates.size === 0) return 0;

    // Calculate streak
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if today has activity
    const hasActivityToday = allDates.has(today.toDateString());

    // Start from today if there's activity, otherwise start from yesterday
    const startDay = hasActivityToday ? 0 : 1;

    for (let i = startDay; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      if (allDates.has(date.toDateString())) {
        streak++;
      } else {
        // Break the streak on first gap
        break;
      }
    }

    return streak;
  }, [codingProfiles]);

  // Calculate total active days across all platforms
  const getTotalActiveDays = useMemo(() => {
    if (codingProfiles.length === 0) return 0;

    // Get all unique dates with activity from all platforms
    const allDates = new Set();
    codingProfiles.forEach((profile) => {
      profile.dailyContributions?.forEach((c) => {
        if (c.solved || c.contributed) {
          allDates.add(new Date(c.date).toDateString());
        }
      });
    });

    return allDates.size;
  }, [codingProfiles]);

  const getPlatformIcon = (platform) => {
    const icons = {
      leetcode: <SiLeetcode className="text-yellow-500" size={28} />,
      codechef: <SiCodechef className="text-brown-600" size={28} />,
      codeforces: <SiCodeforces className="text-blue-600" size={28} />,
      hackerrank: <SiHackerrank className="text-green-600" size={28} />,
      github: <FiGithub className="text-gray-900 dark:text-white" size={28} />,
      geeksforgeeks: <SiGeeksforgeeks className="text-green-700" size={28} />,
      interviewbit: <FiBookOpen className="text-blue-700" size={28} />,
    };
    return icons[platform] || <FiCode size={28} />;
  };

  const getPlatformColor = (platform) => {
    const colors = {
      leetcode: "from-yellow-500 to-orange-500",
      codechef: "from-brown-600 to-red-700",
      codeforces: "from-blue-600 to-blue-800",
      hackerrank: "from-green-500 to-green-700",
      github: "from-gray-700 to-gray-900",
      geeksforgeeks: "from-green-600 to-green-800",
      interviewbit: "from-blue-600 to-blue-800",
    };
    return colors[platform] || "from-primary-600 to-purple-600";
  };

  if (loading) {
    return (
      <section className="section bg-gray-50 dark:bg-dark-900">
        <div className="container">
          <div className="text-center py-20">
            <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Loading analytics...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section bg-gray-50 dark:bg-dark-900 min-h-screen">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Coding{" "}
            <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              Analytics
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Track my problem-solving journey and coding achievements across
            platforms
          </p>
        </motion.div>

        {/* Overall Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 md:gap-6 mb-6 md:mb-12">
          {/* Total Problems */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-4 sm:p-6 bg-gradient-to-br from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-br from-primary-500 to-purple-500 text-white">
                <FiTarget size={20} className="sm:w-6 sm:h-6" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1 text-center">
              {stats.totalSolved}
            </p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center">
              Total Solved
            </p>
          </motion.div>

          {/* Contests */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                <FiAward size={20} className="sm:w-6 sm:h-6" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1 text-center">
              {stats.totalContests}
            </p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center">
              Contests
            </p>
          </motion.div>

          {/* Current Streak */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-4 sm:p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 text-white">
                <FiActivity size={20} className="sm:w-6 sm:h-6" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1 flex items-center justify-center gap-2">
              <span>{getCurrentStreak}</span>
              <FiActivity className="text-orange-500" size={20} />
            </p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center">
              Current Streak
            </p>
          </motion.div>

          {/* Total Active Days */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card p-4 sm:p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                <FiCalendar size={20} className="sm:w-6 sm:h-6" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1 text-center">
              {getTotalActiveDays}
            </p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center">
              Active Days
            </p>
          </motion.div>

          {/* GitHub Stars */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card p-4 sm:p-6 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 text-white">
                <FiTrendingUp size={20} className="sm:w-6 sm:h-6" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1 text-center">
              {stats.totalStars}
            </p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center">
              Total Stars
            </p>
          </motion.div>
        </div>

        {/* Platform Distribution & LeetCode Stats - Half Half - Hidden on Mobile */}
        <div className="hidden lg:grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-8 md:mb-12 items-start">
          {/* Problems Solved by Platform */}
          {platformDistribution.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="card p-4 sm:p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <FiBarChart2 className="text-2xl text-primary-600" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Problems Solved
                </h2>
              </div>

              <div className="flex flex-col items-center justify-center gap-8">
                {/* Pie Chart */}
                <div className="relative w-full max-w-xs mx-auto aspect-square">
                  <svg
                    viewBox="0 0 200 200"
                    className="transform -rotate-90 w-full h-full"
                  >
                    {(() => {
                      let currentAngle = 0;
                      const total = platformDistribution.reduce(
                        (sum, p) => sum + p.solved,
                        0
                      );
                      const colors = {
                        leetcode: "#FFA116",
                        codechef: "#5B4638",
                        codeforces: "#1F8ACB",
                        hackerrank: "#00EA64",
                        github: "#333333",
                        geeksforgeeks: "#2F8D46",
                        interviewbit: "#1F8ACB",
                      };

                      return platformDistribution.map((item, index) => {
                        const percentage = (item.solved / total) * 100;
                        const angle = (percentage / 100) * 360;
                        const radius = 80;
                        const centerX = 100;
                        const centerY = 100;

                        const startAngle = (currentAngle * Math.PI) / 180;
                        const endAngle =
                          ((currentAngle + angle) * Math.PI) / 180;

                        const x1 = centerX + radius * Math.cos(startAngle);
                        const y1 = centerY + radius * Math.sin(startAngle);
                        const x2 = centerX + radius * Math.cos(endAngle);
                        const y2 = centerY + radius * Math.sin(endAngle);

                        const largeArc = angle > 180 ? 1 : 0;

                        const path = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

                        currentAngle += angle;

                        return (
                          <motion.path
                            key={item.platform}
                            d={path}
                            fill={colors[item.platform] || "#6366f1"}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.6 + index * 0.1 }}
                            className="hover:opacity-80 transition-opacity cursor-pointer"
                            onMouseEnter={() =>
                              setHoveredPlatform(item.platform)
                            }
                            onMouseLeave={() => setHoveredPlatform(null)}
                          />
                        );
                      });
                    })()}
                    <circle
                      cx="100"
                      cy="100"
                      r="50"
                      fill="white"
                      className="dark:fill-dark-800"
                    />
                  </svg>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {stats.totalSolved}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Total
                      </p>
                    </div>
                  </div>
                  {hoveredPlatform && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full mb-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-3 py-2 rounded-lg shadow-lg text-sm font-medium capitalize pointer-events-none">
                      {hoveredPlatform}
                    </div>
                  )}
                </div>

                {/* Legend */}
                <div className="w-full space-y-2">
                  {platformDistribution.map((item) => {
                    const percentage = (
                      (item.solved / stats.totalSolved) *
                      100
                    ).toFixed(1);
                    const colors = {
                      leetcode: "bg-yellow-500",
                      codechef: "bg-amber-700",
                      codeforces: "bg-blue-600",
                      hackerrank: "bg-green-600",
                      github: "bg-gray-700",
                      geeksforgeeks: "bg-green-700",
                      interviewbit: "bg-blue-700",
                    };

                    return (
                      <div
                        key={item.platform}
                        className="flex items-center gap-2"
                      >
                        <div
                          className={`w-3 h-3 rounded ${
                            colors[item.platform] || "bg-primary-600"
                          }`}
                        />
                        <div className="flex-1 flex justify-between items-center">
                          <span className="text-sm font-medium capitalize text-gray-900 dark:text-white">
                            {item.platform}
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {item.solved} ({percentage}%)
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* LeetCode Problem Distribution - Pie Chart */}
          {(stats.easySolved > 0 ||
            stats.mediumSolved > 0 ||
            stats.hardSolved > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="card p-4 sm:p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <SiLeetcode className="text-2xl text-yellow-500" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  LeetCode Distribution
                </h2>
              </div>

              <div className="flex flex-col items-center justify-center gap-8">
                {/* Pie Chart */}
                <div className="relative w-full max-w-xs mx-auto aspect-square">
                  <svg
                    viewBox="0 0 200 200"
                    className="transform -rotate-90 w-full h-full"
                  >
                    {(() => {
                      const data = [
                        {
                          label: "Easy",
                          value: stats.easySolved,
                          color: "#10B981",
                        },
                        {
                          label: "Medium",
                          value: stats.mediumSolved,
                          color: "#F59E0B",
                        },
                        {
                          label: "Hard",
                          value: stats.hardSolved,
                          color: "#EF4444",
                        },
                      ];
                      let currentAngle = 0;
                      const total =
                        stats.easySolved +
                        stats.mediumSolved +
                        stats.hardSolved;

                      return data.map((item, index) => {
                        const percentage = (item.value / total) * 100;
                        const angle = (percentage / 100) * 360;
                        const radius = 80;
                        const centerX = 100;
                        const centerY = 100;

                        const startAngle = (currentAngle * Math.PI) / 180;
                        const endAngle =
                          ((currentAngle + angle) * Math.PI) / 180;

                        const x1 = centerX + radius * Math.cos(startAngle);
                        const y1 = centerY + radius * Math.sin(startAngle);
                        const x2 = centerX + radius * Math.cos(endAngle);
                        const y2 = centerY + radius * Math.sin(endAngle);

                        const largeArc = angle > 180 ? 1 : 0;

                        const path = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

                        currentAngle += angle;

                        return (
                          <motion.path
                            key={item.label}
                            d={path}
                            fill={item.color}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.7 + index * 0.1 }}
                            className="hover:opacity-80 transition-opacity cursor-pointer"
                            onMouseEnter={() =>
                              setHoveredDifficulty(item.label)
                            }
                            onMouseLeave={() => setHoveredDifficulty(null)}
                          />
                        );
                      });
                    })()}
                    <circle
                      cx="100"
                      cy="100"
                      r="50"
                      fill="white"
                      className="dark:fill-dark-800"
                    />
                  </svg>

                  {/* Center Display */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                      {hoveredDifficulty ? (
                        <>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {hoveredDifficulty === "Easy" && stats.easySolved}
                            {hoveredDifficulty === "Medium" &&
                              stats.mediumSolved}
                            {hoveredDifficulty === "Hard" && stats.hardSolved}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {hoveredDifficulty}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-3xl font-bold text-gray-900 dark:text-white">
                            {stats.easySolved +
                              stats.mediumSolved +
                              stats.hardSolved}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Total
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Tooltip */}
                  {hoveredDifficulty && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full mb-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-3 py-2 rounded-lg shadow-lg text-sm font-medium pointer-events-none">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded ${
                            hoveredDifficulty === "Easy"
                              ? "bg-green-500"
                              : hoveredDifficulty === "Medium"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                        />
                        <span>
                          {hoveredDifficulty}:{" "}
                          {hoveredDifficulty === "Easy"
                            ? stats.easySolved
                            : hoveredDifficulty === "Medium"
                            ? stats.mediumSolved
                            : stats.hardSolved}{" "}
                          (
                          {(
                            ((hoveredDifficulty === "Easy"
                              ? stats.easySolved
                              : hoveredDifficulty === "Medium"
                              ? stats.mediumSolved
                              : stats.hardSolved) /
                              (stats.easySolved +
                                stats.mediumSolved +
                                stats.hardSolved)) *
                            100
                          ).toFixed(1)}
                          %)
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Legend */}
                <div className="w-full space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-green-500" />
                    <div className="flex-1 flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        Easy
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {stats.easySolved} (
                        {(
                          (stats.easySolved /
                            (stats.easySolved +
                              stats.mediumSolved +
                              stats.hardSolved)) *
                          100
                        ).toFixed(1)}
                        %)
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-yellow-500" />
                    <div className="flex-1 flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        Medium
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {stats.mediumSolved} (
                        {(
                          (stats.mediumSolved /
                            (stats.easySolved +
                              stats.mediumSolved +
                              stats.hardSolved)) *
                          100
                        ).toFixed(1)}
                        %)
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-red-500" />
                    <div className="flex-1 flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        Hard
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {stats.hardSolved} (
                        {(
                          (stats.hardSolved /
                            (stats.easySolved +
                              stats.mediumSolved +
                              stats.hardSolved)) *
                          100
                        ).toFixed(1)}
                        %)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Platform-wise Breakdown */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
            <FiActivity className="text-primary-600" />
            Platform-wise Stats
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {codingProfiles.map((profile, index) => (
              <motion.div
                key={profile._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="card p-3 sm:p-6 hover:shadow-xl transition-shadow"
              >
                {/* Platform Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getPlatformIcon(profile.platform)}
                    <h3 className="font-bold text-lg capitalize text-gray-900 dark:text-white">
                      {profile.platform}
                    </h3>
                  </div>
                  <a
                    href={profile.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    View →
                  </a>
                </div>

                {/* Username */}
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  @{profile.username}
                </p>

                {/* Stats */}
                <div className="space-y-3">
                  {profile.stats?.totalSolved > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Problems Solved
                      </span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {profile.stats.totalSolved}
                      </span>
                    </div>
                  )}

                  {profile.stats?.rating > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Rating
                      </span>
                      <span className="font-bold text-primary-600">
                        {profile.stats.rating}
                      </span>
                    </div>
                  )}

                  {profile.stats?.maxRating > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Max Rating
                      </span>
                      <span className="font-bold text-purple-600">
                        {profile.stats.maxRating}
                      </span>
                    </div>
                  )}

                  {profile.stats?.totalRepos > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Repositories
                      </span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {profile.stats.totalRepos}
                      </span>
                    </div>
                  )}

                  {profile.stats?.totalStars > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Total Stars
                      </span>
                      <span className="font-bold text-yellow-600">
                        {profile.stats.totalStars}
                      </span>
                    </div>
                  )}

                  {profile.stats?.contestParticipation > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Contests
                      </span>
                      <span className="font-bold text-blue-600">
                        {profile.stats.contestParticipation}
                      </span>
                    </div>
                  )}

                  {/* Easy/Medium/Hard breakdown */}
                  {profile.platform === "leetcode" && (
                    <div className="pt-3 border-t border-gray-200 dark:border-dark-700">
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Easy
                          </p>
                          <p className="font-bold text-green-600">
                            {profile.stats.easySolved || 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Medium
                          </p>
                          <p className="font-bold text-yellow-600">
                            {profile.stats.mediumSolved || 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Hard
                          </p>
                          <p className="font-bold text-red-600">
                            {profile.stats.hardSolved || 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Last Updated */}
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-4 flex items-center gap-1">
                  <FiCalendar size={12} />
                  Updated: {new Date(profile.lastUpdated).toLocaleDateString()}
                </p>
              </motion.div>
            ))}
          </div>

          {codingProfiles.length === 0 && (
            <div className="text-center py-12 card">
              <FiCode className="mx-auto text-6xl text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No coding profiles added yet
              </p>
            </div>
          )}
        </div>

        {/* Contribution Calendars Section - Hidden on Mobile */}
        <div className="mt-16 hidden lg:block">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Daily Contribution Tracking
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              View my consistent activity and contribution patterns across all
              platforms
            </p>
          </motion.div>

          <div className="space-y-8">
            {codingProfiles.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <ContributionCalendar
                  profileId="combined"
                  platform="All Platforms"
                  contributions={codingProfiles}
                  readOnly={true}
                  isCombined={true}
                />
              </motion.div>
            ) : (
              <div className="card p-12 text-center">
                <FiCalendar className="mx-auto text-6xl text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  No contribution data available yet
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Analytics;
