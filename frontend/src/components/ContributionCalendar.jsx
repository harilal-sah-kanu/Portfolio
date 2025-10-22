import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiCheck, FiChevronDown } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../utils/api";

const ContributionCalendar = ({
  profileId,
  platform,
  contributions = [],
  readOnly = false,
  isCombined = false,
}) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [todayData, setTodayData] = useState({
    solved: false,
    contributed: false,
  });

  // Get combined contributions from all platforms
  const getCombinedContributions = () => {
    if (!isCombined || !Array.isArray(contributions)) return [];

    const combinedMap = new Map();

    contributions.forEach((profile) => {
      profile.dailyContributions?.forEach((c) => {
        const dateStr = new Date(c.date).toDateString();
        const existing = combinedMap.get(dateStr);

        if (!existing) {
          combinedMap.set(dateStr, {
            date: c.date,
            solved: c.solved,
            contributed: c.contributed,
          });
        } else {
          // Merge: if ANY platform has activity, mark as active
          combinedMap.set(dateStr, {
            date: c.date,
            solved: existing.solved || c.solved,
            contributed: existing.contributed || c.contributed,
          });
        }
      });
    });

    return Array.from(combinedMap.values());
  };

  const activeContributions = isCombined
    ? getCombinedContributions()
    : contributions;

  useEffect(() => {
    // Find today's contribution if exists
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayContribution = activeContributions.find(
      (c) => new Date(c.date).toDateString() === today.toDateString()
    );
    if (todayContribution) {
      setTodayData({
        solved: todayContribution.solved,
        contributed: todayContribution.contributed,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contributions, isCombined]); // Only depend on the original props, not derived state

  const handleUpdateContribution = async () => {
    try {
      const date = selectedDate || new Date();
      await api.post(`/coding-profiles/${profileId}/daily-contribution`, {
        date: date.toISOString(),
        solved: todayData.solved,
        contributed: todayData.contributed,
      });
      toast.success("Contribution updated!");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to update contribution");
    }
  };

  // Get last 365 days for heatmap
  const getDays = () => {
    const days = [];
    const today = new Date();
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      days.push(date);
    }
    return days;
  };

  // Organize days into weeks (like LeetCode)
  const getWeeks = () => {
    const days = getDays();
    const weeks = [];
    let currentWeek = [];

    // Find the day of week for first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = days[0].getDay();

    // Add empty cells for alignment
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push(null);
    }

    days.forEach((day) => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });

    // Add remaining days
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeks.push(currentWeek);
    }

    return weeks;
  };

  const getContributionLevel = (date) => {
    if (!date) return 0;
    const contribution = activeContributions.find(
      (c) => new Date(c.date).toDateString() === date.toDateString()
    );
    if (!contribution) return 0;
    if (contribution.solved && contribution.contributed) return 4;
    if (contribution.solved || contribution.contributed) return 2;
    return 1;
  };

  const getColor = (level) => {
    const colors = {
      0: "bg-gray-100 dark:bg-dark-700",
      1: "bg-green-100 dark:bg-green-900/30",
      2: "bg-green-300 dark:bg-green-700/60",
      3: "bg-green-500 dark:bg-green-600",
      4: "bg-green-700 dark:bg-green-500",
    };
    return colors[level] || colors[0];
  };

  // Calculate streak
  const getCurrentStreak = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let streak = 0;

    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const hasActivity = activeContributions.find(
        (c) =>
          new Date(c.date).toDateString() === date.toDateString() &&
          (c.solved || c.contributed)
      );

      if (hasActivity) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }

    return streak;
  };

  // Calculate total active days
  const getTotalActiveDays = () => {
    return activeContributions.filter((c) => c.solved || c.contributed).length;
  };

  const weeks = getWeeks();

  // Generate month labels with proper positioning based on week structure
  const getMonthLabels = () => {
    const labels = [];
    let lastMonth = -1;

    weeks.forEach((week, weekIndex) => {
      // Find first real day in this week
      const firstDay = week.find((day) => day !== null);
      if (firstDay) {
        const month = firstDay.getMonth();
        // Only add label if it's a new month and not the same as last label
        if (month !== lastMonth) {
          labels.push({
            name: firstDay.toLocaleDateString("en-US", { month: "short" }),
            weekIndex: weekIndex,
            month: month,
          });
          lastMonth = month;
        }
      }
    });

    return labels;
  };

  const monthLabels = getMonthLabels();

  // Check if this week is the start of a new month
  const isMonthStart = (weekIndex) => {
    if (weekIndex === 0) return false;

    // Check if ANY day in this week starts a new month compared to previous week
    const currentWeek = weeks[weekIndex];
    const previousWeek = weeks[weekIndex - 1];

    const currentFirstDay = currentWeek.find((day) => day !== null);
    const previousLastDay = [...previousWeek]
      .reverse()
      .find((day) => day !== null);

    if (currentFirstDay && previousLastDay) {
      return currentFirstDay.getMonth() !== previousLastDay.getMonth();
    }

    return false;
  };

  // Calculate position for month label accounting for gaps
  const getMonthLabelPosition = (weekIndex) => {
    let position = weekIndex * 16; // Base: 16px per week (14px cell + 2px gap)

    // Add extra spacing for each month boundary before this week
    let monthBoundariesBefore = 0;
    for (let i = 1; i < weekIndex; i++) {
      if (isMonthStart(i)) {
        monthBoundariesBefore++;
      }
    }
    position += monthBoundariesBefore * 12; // Add 12px gap for each month boundary

    return position;
  };

  return (
    <div className="space-y-3">
      {/* Stats Cards - Only show in admin mode and not in combined mode */}
      {!readOnly && !isCombined && (
        <div className="grid grid-cols-3 gap-3">
          {/* Current Streak */}
          <div className="card p-3 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
            <div className="text-xl font-bold text-orange-600 dark:text-orange-400">
              {getCurrentStreak()}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Day Streak 🔥
            </div>
          </div>

          {/* Total Active Days */}
          <div className="card p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
            <div className="text-xl font-bold text-green-600 dark:text-green-400">
              {getTotalActiveDays()}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Total Active Days
            </div>
          </div>

          {/* Today's Activity */}
          <div className="card p-3 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
            <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
              {todayData.solved || todayData.contributed ? "✓" : "—"}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Active Today
            </div>
          </div>
        </div>
      )}

      {/* Heatmap Card */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold capitalize">
            {platform} Contributions
          </h3>

          {/* Dropdown for Today's Activity - Hide in combined mode */}
          {!readOnly && !isCombined && (
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors"
            >
              <span>Mark Today</span>
              <FiChevronDown
                className={`transition-transform ${
                  showDropdown ? "rotate-180" : ""
                }`}
              />
            </button>
          )}
        </div>

        {/* Dropdown Content */}
        {!readOnly && showDropdown && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-3 p-3 bg-gray-50 dark:bg-dark-700 rounded-lg"
          >
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={todayData.solved}
                  onChange={(e) =>
                    setTodayData({ ...todayData, solved: e.target.checked })
                  }
                  className="w-4 h-4 text-primary-600 rounded"
                />
                <span className="text-gray-700 dark:text-gray-300">
                  Solved problem(s) today
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={todayData.contributed}
                  onChange={(e) =>
                    setTodayData({
                      ...todayData,
                      contributed: e.target.checked,
                    })
                  }
                  className="w-4 h-4 text-primary-600 rounded"
                />
                <span className="text-gray-700 dark:text-gray-300">
                  Made contribution today
                </span>
              </label>

              <button
                onClick={handleUpdateContribution}
                className="w-full btn-primary py-2 text-sm flex items-center justify-center gap-2"
              >
                <FiCheck />
                Save Today's Activity
              </button>
            </div>
          </motion.div>
        )}

        {/* Contribution Grid - LeetCode Style (Static, No Scroll) */}
        <div className="w-full pb-2">
          {/* Month Labels positioned above grid */}
          <div className="relative mb-1 ml-14">
            <div className="flex gap-0.5">
              {weeks.map((week, weekIdx) => {
                const monthLabel = monthLabels.find(
                  (label) => label.weekIndex === weekIdx
                );
                return (
                  <div key={weekIdx} className="flex-1 text-center">
                    {monthLabel && (
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {monthLabel.name}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-2 w-full">
            {/* Day Labels */}
            <div className="flex flex-col justify-around text-xs text-gray-600 dark:text-gray-400 pr-2">
              <div className="h-4 flex items-center">Sun</div>
              <div className="h-4 flex items-center">Mon</div>
              <div className="h-4 flex items-center">Tue</div>
              <div className="h-4 flex items-center">Wed</div>
              <div className="h-4 flex items-center">Thu</div>
              <div className="h-4 flex items-center">Fri</div>
              <div className="h-4 flex items-center">Sat</div>
            </div>

            {/* Weeks Grid - No wrap to prevent overlapping */}
            <div className="flex gap-0.5 flex-1">
              {weeks.map((week, weekIdx) => (
                <div key={weekIdx} className="flex flex-col gap-0.5 flex-1">
                  {week.map((day, dayIdx) => (
                    <div
                      key={`${weekIdx}-${dayIdx}`}
                      className={`w-full aspect-square rounded-sm ${
                        day
                          ? getColor(getContributionLevel(day))
                          : "bg-transparent"
                      } ${
                        day
                          ? "cursor-pointer hover:ring-1 hover:ring-primary-500"
                          : ""
                      } transition-colors duration-200`}
                      title={
                        day
                          ? `${day.toDateString()}\n${
                              getContributionLevel(day) > 0
                                ? "Active"
                                : "No activity"
                            }`
                          : ""
                      }
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between mt-4 text-xs text-gray-600 dark:text-gray-400">
          {/* Info Note */}
          {isCombined && (
            <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg">
              <FiCheck className="text-blue-600" />
              <p className="text-xs text-blue-700 dark:text-blue-400">
                <span className="font-semibold">Note:</span> Tracking started
                from app launch. Sync platforms to update contributions
                automatically.
              </p>
            </div>
          )}

          <div className="flex items-center gap-2">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-4 h-4 rounded-sm bg-gray-100 dark:bg-dark-700" />
              <div className="w-4 h-4 rounded-sm bg-green-100 dark:bg-green-900/30" />
              <div className="w-4 h-4 rounded-sm bg-green-300 dark:bg-green-700/60" />
              <div className="w-4 h-4 rounded-sm bg-green-500 dark:bg-green-600" />
              <div className="w-4 h-4 rounded-sm bg-green-700 dark:bg-green-500" />
            </div>
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContributionCalendar;
