import { useState, useEffect } from "react";
import { FiSave, FiX, FiRefreshCw } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../utils/api";

const CodingProfileForm = ({ profile, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    platform: "leetcode",
    username: "",
    enabled: true,
    stats: {
      totalSolved: 0,
      easySolved: 0,
      mediumSolved: 0,
      hardSolved: 0,
      ranking: 0,
      rating: 0,
      maxRating: 0,
      totalRepos: 0,
      totalStars: 0,
      totalCommits: 0,
      followers: 0,
      contestParticipation: 0,
    },
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        platform: profile.platform || "leetcode",
        username: profile.username || "",
        enabled: profile.enabled !== undefined ? profile.enabled : true,
        stats: {
          totalSolved: profile.stats?.totalSolved || 0,
          easySolved: profile.stats?.easySolved || 0,
          mediumSolved: profile.stats?.mediumSolved || 0,
          hardSolved: profile.stats?.hardSolved || 0,
          ranking: profile.stats?.ranking || 0,
          rating: profile.stats?.rating || 0,
          maxRating: profile.stats?.maxRating || 0,
          totalRepos: profile.stats?.totalRepos || 0,
          totalStars: profile.stats?.totalStars || 0,
          totalCommits: profile.stats?.totalCommits || 0,
          followers: profile.stats?.followers || 0,
          contestParticipation: profile.stats?.contestParticipation || 0,
        },
      });
    }
  }, [profile]);

  const generateProfileUrl = (platform, username) => {
    const urls = {
      leetcode: `https://leetcode.com/${username}`,
      codechef: `https://www.codechef.com/users/${username}`,
      codeforces: `https://codeforces.com/profile/${username}`,
      hackerrank: `https://www.hackerrank.com/${username}`,
      github: `https://github.com/${username}`,
      geeksforgeeks: `https://www.geeksforgeeks.org/user/${username}/`,
      interviewbit: `https://www.interviewbit.com/profile/${username}`,
    };
    return urls[platform] || "";
  };

  const fetchStats = async () => {
    if (!formData.username.trim()) {
      toast.error("Please enter a username first");
      return;
    }

    setFetching(true);
    try {
      const { data } = await api.post("/coding-profiles/fetch-stats", {
        platform: formData.platform,
        username: formData.username,
      });

      setFormData({
        ...formData,
        stats: data.stats,
      });
      toast.success("Stats fetched successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to fetch stats. Please enter manually."
      );
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const profileData = {
        ...formData,
        profileUrl: generateProfileUrl(formData.platform, formData.username),
      };

      if (profile) {
        await api.put(`/coding-profiles/${profile._id}`, profileData);
        toast.success("Profile updated successfully");
      } else {
        await api.post("/coding-profiles", profileData);
        toast.success("Profile added successfully");
      }
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  const renderStatsFields = () => {
    const { platform } = formData;

    if (platform === "leetcode") {
      return (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Total Solved
              </label>
              <input
                type="number"
                value={formData.stats.totalSolved}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stats: {
                      ...formData.stats,
                      totalSolved: parseInt(e.target.value) || 0,
                    },
                  })
                }
                className="input"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Ranking</label>
              <input
                type="number"
                value={formData.stats.ranking}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stats: {
                      ...formData.stats,
                      ranking: parseInt(e.target.value) || 0,
                    },
                  })
                }
                className="input"
                min="0"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Easy</label>
              <input
                type="number"
                value={formData.stats.easySolved}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stats: {
                      ...formData.stats,
                      easySolved: parseInt(e.target.value) || 0,
                    },
                  })
                }
                className="input"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Medium</label>
              <input
                type="number"
                value={formData.stats.mediumSolved}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stats: {
                      ...formData.stats,
                      mediumSolved: parseInt(e.target.value) || 0,
                    },
                  })
                }
                className="input"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Hard</label>
              <input
                type="number"
                value={formData.stats.hardSolved}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stats: {
                      ...formData.stats,
                      hardSolved: parseInt(e.target.value) || 0,
                    },
                  })
                }
                className="input"
                min="0"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Contest Rating
              </label>
              <input
                type="number"
                value={formData.stats.rating}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stats: {
                      ...formData.stats,
                      rating: parseInt(e.target.value) || 0,
                    },
                  })
                }
                className="input"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Contests Attended
              </label>
              <input
                type="number"
                value={formData.stats.contestParticipation}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stats: {
                      ...formData.stats,
                      contestParticipation: parseInt(e.target.value) || 0,
                    },
                  })
                }
                className="input"
                min="0"
              />
            </div>
          </div>
        </>
      );
    }

    if (platform === "codeforces") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Current Rating
            </label>
            <input
              type="number"
              value={formData.stats.rating}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  stats: {
                    ...formData.stats,
                    rating: parseInt(e.target.value) || 0,
                  },
                })
              }
              className="input"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Max Rating</label>
            <input
              type="number"
              value={formData.stats.maxRating}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  stats: {
                    ...formData.stats,
                    maxRating: parseInt(e.target.value) || 0,
                  },
                })
              }
              className="input"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Contests</label>
            <input
              type="number"
              value={formData.stats.contestParticipation}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  stats: {
                    ...formData.stats,
                    contestParticipation: parseInt(e.target.value) || 0,
                  },
                })
              }
              className="input"
              min="0"
            />
          </div>
        </div>
      );
    }

    if (platform === "codechef") {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Current Rating
              </label>
              <input
                type="number"
                value={formData.stats.rating}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stats: {
                      ...formData.stats,
                      rating: parseInt(e.target.value) || 0,
                    },
                  })
                }
                className="input"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Max Rating
              </label>
              <input
                type="number"
                value={formData.stats.maxRating}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stats: {
                      ...formData.stats,
                      maxRating: parseInt(e.target.value) || 0,
                    },
                  })
                }
                className="input"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Contests</label>
              <input
                type="number"
                value={formData.stats.contestParticipation}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stats: {
                      ...formData.stats,
                      contestParticipation: parseInt(e.target.value) || 0,
                    },
                  })
                }
                className="input"
                min="0"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Total Problems Solved
            </label>
            <input
              type="number"
              value={formData.stats.totalSolved}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  stats: {
                    ...formData.stats,
                    totalSolved: parseInt(e.target.value) || 0,
                  },
                })
              }
              className="input"
              min="0"
            />
          </div>
        </div>
      );
    }

    if (
      platform === "hackerrank" ||
      platform === "geeksforgeeks" ||
      platform === "interviewbit"
    ) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Problems Solved
            </label>
            <input
              type="number"
              value={formData.stats.totalSolved}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  stats: {
                    ...formData.stats,
                    totalSolved: parseInt(e.target.value) || 0,
                  },
                })
              }
              className="input"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Rating/Score
            </label>
            <input
              type="number"
              value={formData.stats.rating}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  stats: {
                    ...formData.stats,
                    rating: parseInt(e.target.value) || 0,
                  },
                })
              }
              className="input"
              min="0"
            />
          </div>
          {platform !== "interviewbit" && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Contest Participation
              </label>
              <input
                type="number"
                value={formData.stats.contestParticipation}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stats: {
                      ...formData.stats,
                      contestParticipation: parseInt(e.target.value) || 0,
                    },
                  })
                }
                className="input"
                min="0"
              />
            </div>
          )}
          {platform === "interviewbit" && (
            <div>
              <label className="block text-sm font-medium mb-2">Ranking</label>
              <input
                type="number"
                value={formData.stats.ranking}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stats: {
                      ...formData.stats,
                      ranking: parseInt(e.target.value) || 0,
                    },
                  })
                }
                className="input"
                min="0"
              />
            </div>
          )}
        </div>
      );
    }

    if (platform === "github") {
      return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Repositories
            </label>
            <input
              type="number"
              value={formData.stats.totalRepos}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  stats: {
                    ...formData.stats,
                    totalRepos: parseInt(e.target.value) || 0,
                  },
                })
              }
              className="input"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Stars</label>
            <input
              type="number"
              value={formData.stats.totalStars}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  stats: {
                    ...formData.stats,
                    totalStars: parseInt(e.target.value) || 0,
                  },
                })
              }
              className="input"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Commits</label>
            <input
              type="number"
              value={formData.stats.totalCommits}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  stats: {
                    ...formData.stats,
                    totalCommits: parseInt(e.target.value) || 0,
                  },
                })
              }
              className="input"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Followers</label>
            <input
              type="number"
              value={formData.stats.followers}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  stats: {
                    ...formData.stats,
                    followers: parseInt(e.target.value) || 0,
                  },
                })
              }
              className="input"
              min="0"
            />
          </div>
        </div>
      );
    }

    return (
      <div>
        <label className="block text-sm font-medium mb-2">
          Problems Solved
        </label>
        <input
          type="number"
          value={formData.stats.totalSolved}
          onChange={(e) =>
            setFormData({
              ...formData,
              stats: {
                ...formData.stats,
                totalSolved: parseInt(e.target.value) || 0,
              },
            })
          }
          className="input"
          min="0"
        />
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Platform *</label>
          <select
            value={formData.platform}
            onChange={(e) =>
              setFormData({ ...formData, platform: e.target.value })
            }
            className="input w-full"
            required
            disabled={!!profile}
          >
            <option value="leetcode">LeetCode</option>
            <option value="codechef">CodeChef</option>
            <option value="codeforces">Codeforces</option>
            <option value="hackerrank">HackerRank</option>
            <option value="github">GitHub</option>
            <option value="geeksforgeeks">GeeksForGeeks</option>
            <option value="interviewbit">InterviewBit</option>
          </select>
          {profile && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Platform cannot be changed after creation
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Username *</label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            className="input w-full mb-3"
            placeholder="Enter your username"
            required
          />
          <button
            type="button"
            onClick={fetchStats}
            disabled={fetching || !formData.username.trim()}
            className="btn-primary w-full inline-flex items-center justify-center gap-2"
          >
            <FiRefreshCw className={fetching ? "animate-spin" : ""} />
            {fetching ? "Fetching..." : "Fetch Stats"}
          </button>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Profile URL:{" "}
            {generateProfileUrl(
              formData.platform,
              formData.username || "username"
            )}
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">
          Statistics
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
            (Click "Fetch Stats" to auto-fill or enter manually)
          </span>
        </h3>
        {renderStatsFields()}
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="enabled"
          checked={formData.enabled}
          onChange={(e) =>
            setFormData({ ...formData, enabled: e.target.checked })
          }
          className="w-4 h-4 text-primary-600 rounded"
        />
        <label htmlFor="enabled" className="text-sm font-medium">
          Show on public profile
        </label>
      </div>

      <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-dark-700">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 btn-primary flex items-center justify-center gap-2"
        >
          <FiSave />
          {loading ? "Saving..." : profile ? "Update" : "Add Profile"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 btn-secondary flex items-center justify-center gap-2"
        >
          <FiX />
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CodingProfileForm;
