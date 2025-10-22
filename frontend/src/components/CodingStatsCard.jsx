import { motion } from "framer-motion";
import { FiExternalLink, FiTrendingUp, FiAward, FiCode } from "react-icons/fi";
import {
  SiLeetcode,
  SiCodechef,
  SiCodeforces,
  SiHackerrank,
  SiGithub,
} from "react-icons/si";

const CodingStatsCard = ({ profile, index }) => {
  const platformIcons = {
    leetcode: SiLeetcode,
    codechef: SiCodechef,
    codeforces: SiCodeforces,
    hackerrank: SiHackerrank,
    github: SiGithub,
  };

  const platformColors = {
    leetcode: "from-yellow-600 to-orange-600",
    codechef: "from-brown-600 to-amber-800",
    codeforces: "from-blue-600 to-cyan-600",
    hackerrank: "from-green-600 to-emerald-600",
    github: "from-gray-700 to-gray-900",
  };

  const Icon = platformIcons[profile.platform] || FiCode;

  const renderStats = () => {
    const { stats, platform } = profile;

    if (platform === "leetcode") {
      const total = stats.totalSolved || 0;
      const easy = stats.easySolved || 0;
      const medium = stats.mediumSolved || 0;
      const hard = stats.hardSolved || 0;

      return (
        <>
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                Total Solved
              </span>
              <span className="text-2xl font-bold text-primary-600">
                {total}
              </span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-dark-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{
                  width: `${Math.min((total / 1000) * 100, 100)}%`,
                }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-primary-600 to-purple-600"
              ></motion.div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Easy
              </div>
              <div className="text-xl font-bold text-green-600">{easy}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Medium
              </div>
              <div className="text-xl font-bold text-yellow-600">{medium}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Hard
              </div>
              <div className="text-xl font-bold text-red-600">{hard}</div>
            </div>
          </div>

          {stats.ranking > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-dark-700">
              <div className="flex items-center gap-2 text-sm">
                <FiTrendingUp className="text-primary-600" />
                <span className="text-gray-600 dark:text-gray-400">
                  Ranking:{" "}
                  <span className="font-bold text-gray-900 dark:text-white">
                    {stats.ranking.toLocaleString()}
                  </span>
                </span>
              </div>
            </div>
          )}
        </>
      );
    }

    if (platform === "codeforces" || platform === "codechef") {
      return (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Current Rating
              </div>
              <div className="text-3xl font-bold text-primary-600">
                {stats.rating || 0}
              </div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Max Rating
              </div>
              <div className="text-3xl font-bold text-purple-600">
                {stats.maxRating || 0}
              </div>
            </div>
          </div>

          {stats.contestParticipation > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-dark-700">
              <div className="flex items-center gap-2 text-sm">
                <FiAward className="text-primary-600" />
                <span className="text-gray-600 dark:text-gray-400">
                  Contests:{" "}
                  <span className="font-bold text-gray-900 dark:text-white">
                    {stats.contestParticipation}
                  </span>
                </span>
              </div>
            </div>
          )}
        </>
      );
    }

    if (platform === "github") {
      return (
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-dark-700">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              Repositories
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.totalRepos || 0}
            </div>
          </div>
          <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-dark-700">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              Stars
            </div>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.totalStars || 0}
            </div>
          </div>
          <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-dark-700">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              Commits
            </div>
            <div className="text-2xl font-bold text-primary-600">
              {stats.totalCommits || 0}
            </div>
          </div>
          <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-dark-700">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              Followers
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {stats.followers || 0}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="text-center text-gray-600 dark:text-gray-400">
        <div className="text-4xl font-bold mb-2">{stats.totalSolved || 0}</div>
        <div className="text-sm">Problems Solved</div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="card p-6 hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`p-3 rounded-lg bg-gradient-to-br ${
              platformColors[profile.platform]
            } text-white`}
          >
            <Icon size={24} />
          </div>
          <div>
            <h3 className="font-bold capitalize text-lg">{profile.platform}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              @{profile.username}
            </p>
          </div>
        </div>
        <a
          href={profile.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
        >
          <FiExternalLink className="text-gray-600 dark:text-gray-400" />
        </a>
      </div>

      {renderStats()}

      {profile.stats.badges && profile.stats.badges.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-dark-700">
          <div className="flex flex-wrap gap-2">
            {profile.stats.badges.map((badge, i) => (
              <span
                key={i}
                className="px-2 py-1 text-xs rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CodingStatsCard;
