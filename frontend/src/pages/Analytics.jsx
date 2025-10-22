import { useState, useEffect } from "react";
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
  const [hoveredRatingPoint, setHoveredRatingPoint] = useState(null);
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
  const getCurrentStreak = () => {
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

    // Calculate streak
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      if (allDates.has(date.toDateString())) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }

    return streak;
  };

  // Calculate total active days across all platforms
  const getTotalActiveDays = () => {
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
  };

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          {/* Total Problems */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-6 bg-gradient-to-br from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-primary-500 to-purple-500 text-white">
                <FiTarget size={24} />
              </div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Solved
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {stats.totalSolved}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Problems</p>
          </motion.div>

          {/* Contests */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                <FiAward size={24} />
              </div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Contests
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {stats.totalContests}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Participated
            </p>
          </motion.div>

          {/* Current Streak */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 text-white">
                <FiActivity size={24} />
              </div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Current Streak
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {getCurrentStreak()} 🔥
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Days Active
            </p>
          </motion.div>

          {/* Total Active Days */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                <FiCalendar size={24} />
              </div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Active Days
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {getTotalActiveDays()}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Total Days
            </p>
          </motion.div>

          {/* GitHub Stars */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card p-6 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 text-white">
                <FiTrendingUp size={24} />
              </div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Stars
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {stats.totalStars}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Total Stars
            </p>
          </motion.div>
        </div>

        {/* Platform Distribution & LeetCode Stats - Half Half */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Problems Solved by Platform */}
          {platformDistribution.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="card p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <FiBarChart2 className="text-2xl text-primary-600" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Problems Solved
                </h2>
              </div>

              <div className="flex flex-col items-center justify-center gap-8">
                {/* Pie Chart */}
                <div className="relative w-56 h-56">
                  <svg viewBox="0 0 200 200" className="transform -rotate-90">
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
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
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
              className="card p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <SiLeetcode className="text-2xl text-yellow-500" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  LeetCode Distribution
                </h2>
              </div>

              <div className="flex flex-col items-center justify-center gap-8">
                {/* Pie Chart */}
                <div className="relative w-56 h-56">
                  <svg viewBox="0 0 200 200" className="transform -rotate-90">
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
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
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

        {/* Rating Graph - Full Width Mountain Chart */}
        {codingProfiles.filter(
          (p) => p.stats?.rating > 0 || p.stats?.maxRating > 0
        ).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="card p-8 mb-12 w-full overflow-hidden"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <FiTrendingUp className="text-3xl text-primary-600" />
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Contest Rating Trends
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Track your competitive programming ratings across platforms
                  </p>
                </div>
              </div>
              {/* Legend */}
              <div className="flex gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-1 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    Current Rating
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-1 border-t-2 border-dashed border-amber-500"></div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    Peak Rating
                  </span>
                </div>
              </div>
            </div>

            <div className="relative w-full bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-dark-800 dark:via-dark-900 dark:to-dark-800 rounded-2xl p-8 shadow-inner overflow-hidden">
              {/* Hover Tooltip */}
              {hoveredRatingPoint && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute top-4 right-4 z-50 bg-white dark:bg-dark-700 shadow-lg rounded-lg px-3 py-2 border border-primary-400 dark:border-primary-500 pointer-events-none"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="scale-75">
                      {getPlatformIcon(hoveredRatingPoint.platform)}
                    </div>
                    <span className="font-bold text-sm capitalize text-gray-900 dark:text-white">
                      {hoveredRatingPoint.platform}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1">
                      <span className="text-gray-600 dark:text-gray-400">
                        Current:
                      </span>
                      <span className="font-bold text-primary-600">
                        {hoveredRatingPoint.currentRating}
                      </span>
                    </div>
                    {hoveredRatingPoint.maxRating > 0 && (
                      <div className="flex items-center gap-1">
                        <span className="text-gray-600 dark:text-gray-400">
                          Peak:
                        </span>
                        <span className="font-bold text-amber-600">
                          {hoveredRatingPoint.maxRating}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Y-axis with values */}
              <div className="absolute left-2 top-8 bottom-16 flex flex-col justify-between text-sm font-medium text-gray-600 dark:text-gray-400">
                {(() => {
                  const maxRating = Math.max(
                    ...codingProfiles
                      .filter((p) => p.stats?.maxRating > 0)
                      .map((p) => p.stats.maxRating),
                    1000
                  );
                  const steps = 6;
                  return Array.from({ length: steps }, (_, i) => (
                    <div key={i} className="flex items-center">
                      <span className="w-12 text-right">
                        {Math.round(
                          (maxRating / (steps - 1)) * (steps - 1 - i)
                        )}
                      </span>
                    </div>
                  ));
                })()}
              </div>

              {/* Chart SVG */}
              <div className="ml-16 mr-4" style={{ height: "400px" }}>
                <svg
                  className="w-full h-full"
                  viewBox="0 0 1200 400"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <defs>
                    {/* Gradient for mountain fill */}
                    <linearGradient
                      id="mountainGradient"
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                      <stop
                        offset="50%"
                        stopColor="#8b5cf6"
                        stopOpacity="0.2"
                      />
                      <stop
                        offset="100%"
                        stopColor="#a78bfa"
                        stopOpacity="0.05"
                      />
                    </linearGradient>

                    {/* Glow effect for points */}
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Horizontal grid lines */}
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <motion.line
                      key={`grid-${i}`}
                      x1="0"
                      y1={i * 80}
                      x2="1200"
                      y2={i * 80}
                      stroke="currentColor"
                      strokeWidth="1"
                      className="text-gray-200 dark:text-dark-700"
                      strokeDasharray="5,5"
                      opacity="0.3"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                    />
                  ))}

                  {(() => {
                    const platforms = codingProfiles.filter(
                      (p) => p.stats?.rating > 0 || p.stats?.maxRating > 0
                    );

                    if (platforms.length === 0) return null;

                    const maxRating = Math.max(
                      ...platforms.map(
                        (p) => p.stats?.maxRating || p.stats?.rating || 0
                      ),
                      1000
                    );

                    const padding = 100;
                    const chartWidth = 1200 - padding * 2;
                    const xStep =
                      chartWidth / Math.max(platforms.length - 1, 1);

                    // Generate smooth curve points
                    const currentPoints = platforms.map((profile, index) => {
                      const x = padding + xStep * index;
                      const y =
                        380 - ((profile.stats?.rating || 0) / maxRating) * 360;
                      return { x, y, profile };
                    });

                    const maxPoints = platforms.map((profile, index) => {
                      const x = padding + xStep * index;
                      const y =
                        380 -
                        ((profile.stats?.maxRating ||
                          profile.stats?.rating ||
                          0) /
                          maxRating) *
                          360;
                      return { x, y, profile };
                    });

                    // Create smooth curved paths using quadratic bezier curves
                    const createSmoothPath = (points) => {
                      if (points.length < 2) return "";

                      let path = `M ${points[0].x},${points[0].y}`;

                      for (let i = 0; i < points.length - 1; i++) {
                        const current = points[i];
                        const next = points[i + 1];
                        const controlX = (current.x + next.x) / 2;
                        path += ` Q ${controlX},${current.y} ${controlX},${
                          (current.y + next.y) / 2
                        }`;
                        path += ` Q ${controlX},${next.y} ${next.x},${next.y}`;
                      }

                      return path;
                    };

                    const currentPath = createSmoothPath(currentPoints);
                    const maxPath = createSmoothPath(maxPoints);

                    // Create area path
                    const areaPath = `${currentPath} L ${
                      currentPoints[currentPoints.length - 1].x
                    },400 L ${currentPoints[0].x},400 Z`;

                    return (
                      <>
                        {/* Mountain area fill with animation */}
                        <motion.path
                          d={areaPath}
                          fill="url(#mountainGradient)"
                          initial={{ opacity: 0, scaleY: 0 }}
                          animate={{ opacity: 1, scaleY: 1 }}
                          transition={{
                            duration: 1.5,
                            delay: 0.3,
                            ease: "easeOut",
                          }}
                          style={{ transformOrigin: "bottom" }}
                        />

                        {/* Max rating line (dashed) */}
                        <motion.path
                          d={maxPath}
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="3"
                          strokeDasharray="8,4"
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: 0.8 }}
                          transition={{
                            duration: 2,
                            delay: 0.5,
                            ease: "easeInOut",
                          }}
                        />

                        {/* Current rating line with gradient */}
                        <motion.path
                          d={currentPath}
                          fill="none"
                          stroke="url(#lineGradient)"
                          strokeWidth="4"
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{
                            duration: 2.5,
                            delay: 0.6,
                            ease: "easeInOut",
                          }}
                        />

                        {/* Line gradient definition */}
                        <defs>
                          <linearGradient
                            id="lineGradient"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="0%"
                          >
                            <stop offset="0%" stopColor="#6366f1" />
                            <stop offset="50%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="#a78bfa" />
                          </linearGradient>
                        </defs>

                        {/* Data points with animation and glow */}
                        {currentPoints.map((point, index) => (
                          <g key={`point-${index}`}>
                            {/* Max rating point */}
                            <motion.circle
                              cx={maxPoints[index].x}
                              cy={maxPoints[index].y}
                              r="5"
                              fill="#f59e0b"
                              stroke="white"
                              strokeWidth="2"
                              filter="url(#glow)"
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{
                                delay: 1 + index * 0.15,
                                duration: 0.5,
                                type: "spring",
                              }}
                              className="cursor-pointer"
                              onMouseEnter={() => {
                                setHoveredRatingPoint({
                                  platform: point.profile.platform,
                                  currentRating:
                                    point.profile.stats?.rating || 0,
                                  maxRating:
                                    point.profile.stats?.maxRating || 0,
                                });
                              }}
                              onMouseLeave={() => setHoveredRatingPoint(null)}
                            />

                            {/* Current rating point */}
                            <motion.circle
                              cx={point.x}
                              cy={point.y}
                              r="6"
                              fill="#6366f1"
                              stroke="white"
                              strokeWidth="3"
                              filter="url(#glow)"
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{
                                delay: 1.2 + index * 0.15,
                                duration: 0.5,
                                type: "spring",
                              }}
                              whileHover={{ scale: 1.5 }}
                              className="cursor-pointer"
                              onMouseEnter={() => {
                                setHoveredRatingPoint({
                                  platform: point.profile.platform,
                                  currentRating:
                                    point.profile.stats?.rating || 0,
                                  maxRating:
                                    point.profile.stats?.maxRating || 0,
                                });
                              }}
                              onMouseLeave={() => setHoveredRatingPoint(null)}
                            />

                            {/* Vertical connector line */}
                            {maxPoints[index].y !== point.y && (
                              <motion.line
                                x1={point.x}
                                y1={maxPoints[index].y}
                                x2={point.x}
                                y2={point.y}
                                stroke="#cbd5e1"
                                strokeWidth="1.5"
                                strokeDasharray="3,3"
                                opacity="0.4"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{
                                  delay: 1.5 + index * 0.1,
                                  duration: 0.5,
                                }}
                              />
                            )}
                          </g>
                        ))}
                      </>
                    );
                  })()}
                </svg>
              </div>

              {/* X-axis platform labels */}
              <div className="mt-6 ml-16 mr-4 flex justify-between items-center">
                {codingProfiles
                  .filter((p) => p.stats?.rating > 0 || p.stats?.maxRating > 0)
                  .map((profile, index) => (
                    <motion.div
                      key={profile._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.8 + index * 0.1 }}
                      className="flex flex-col items-center gap-2 group cursor-pointer"
                    >
                      <div className="p-3 rounded-xl bg-white dark:bg-dark-700 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                        {getPlatformIcon(profile.platform)}
                      </div>
                      <span className="text-sm font-bold capitalize text-gray-800 dark:text-gray-200">
                        {profile.platform}
                      </span>
                      <div className="text-center">
                        <div className="text-lg font-extrabold text-primary-600">
                          {profile.stats?.rating || 0}
                        </div>
                        {profile.stats?.maxRating > 0 && (
                          <div className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
                            Peak: {profile.stats.maxRating}
                          </div>
                        )}
                        {profile.stats?.contestParticipation > 0 && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {profile.stats.contestParticipation} contests
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Platform-wise Breakdown */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
            <FiActivity className="text-primary-600" />
            Platform-wise Stats
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {codingProfiles.map((profile, index) => (
              <motion.div
                key={profile._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="card p-6 hover:shadow-xl transition-shadow"
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

        {/* Contribution Calendars Section */}
        <div className="mt-16">
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
