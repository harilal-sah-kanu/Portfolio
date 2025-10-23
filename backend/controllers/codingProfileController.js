import CodingProfile from "../models/CodingProfile.js";
import axios from "axios";

// @desc    Get all coding profiles
// @route   GET /api/coding-profiles
// @access  Public
export const getCodingProfiles = async (req, res) => {
  try {
    const profiles = await CodingProfile.find({ enabled: true });
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get single coding profile
// @route   GET /api/coding-profiles/:id
// @access  Public
export const getCodingProfile = async (req, res) => {
  try {
    const profile = await CodingProfile.findById(req.params.id);

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Create or update coding profile
// @route   POST /api/coding-profiles
// @access  Private/Admin
export const createOrUpdateCodingProfile = async (req, res) => {
  try {
    const { platform, username, profileUrl, stats, enabled } = req.body;

    let profile = await CodingProfile.findOne({ platform });

    if (profile) {
      // Update existing
      profile.username = username;
      profile.profileUrl = profileUrl;
      profile.stats = { ...profile.stats, ...stats };
      profile.enabled = enabled !== undefined ? enabled : profile.enabled;
      profile.lastUpdated = Date.now();

      await profile.save();
      res.json(profile);
    } else {
      // Create new
      profile = await CodingProfile.create({
        platform,
        username,
        profileUrl,
        stats,
        enabled: enabled !== undefined ? enabled : true,
      });
      res.status(201).json(profile);
    }
  } catch (error) {
    res.status(400).json({ message: "Invalid data", error: error.message });
  }
};

// @desc    Update coding profile stats
// @route   PUT /api/coding-profiles/:id
// @access  Private/Admin
export const updateCodingProfile = async (req, res) => {
  try {
    const profile = await CodingProfile.findById(req.params.id);

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    Object.assign(profile, req.body);
    profile.lastUpdated = Date.now();

    const updatedProfile = await profile.save();
    res.json(updatedProfile);
  } catch (error) {
    res.status(400).json({ message: "Invalid data", error: error.message });
  }
};

// @desc    Delete coding profile
// @route   DELETE /api/coding-profiles/:id
// @access  Private/Admin
export const deleteCodingProfile = async (req, res) => {
  try {
    const profile = await CodingProfile.findById(req.params.id);

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    await profile.deleteOne();
    res.json({ message: "Profile removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Fetch stats from platform
// @route   POST /api/coding-profiles/fetch-stats
// @access  Private/Admin
export const fetchPlatformStats = async (req, res) => {
  try {
    const { platform, username } = req.body;

    if (!platform || !username) {
      return res
        .status(400)
        .json({ message: "Platform and username are required" });
    }

    let stats = {};

    switch (platform) {
      case "leetcode":
        try {
          // Fetch user profile and contest data
          const leetcodeResponse = await axios.post(
            "https://leetcode.com/graphql",
            {
              query: `
                query userProfile($username: String!) {
                  matchedUser(username: $username) {
                    submitStats {
                      acSubmissionNum {
                        difficulty
                        count
                      }
                    }
                    profile {
                      ranking
                      reputation
                    }
                    userContestRanking(username: $username) {
                      rating
                      attendedContestsCount
                      globalRanking
                    }
                  }
                }
              `,
              variables: { username },
            }
          );

          const data = leetcodeResponse.data?.data?.matchedUser;
          if (!data) {
            throw new Error("User not found");
          }

          const submissions = data.submitStats.acSubmissionNum;
          const contestData = data.userContestRanking;

          stats = {
            totalSolved:
              submissions.find((s) => s.difficulty === "All")?.count || 0,
            easySolved:
              submissions.find((s) => s.difficulty === "Easy")?.count || 0,
            mediumSolved:
              submissions.find((s) => s.difficulty === "Medium")?.count || 0,
            hardSolved:
              submissions.find((s) => s.difficulty === "Hard")?.count || 0,
            ranking: data.profile?.ranking || 0,
            rating: Math.round(contestData?.rating || 0),
            contestParticipation: contestData?.attendedContestsCount || 0,
          };
        } catch (error) {
          throw new Error(
            "Failed to fetch LeetCode stats. Please check username or enter manually."
          );
        }
        break;

      case "github":
        try {
          const githubResponse = await axios.get(
            `https://api.github.com/users/${username}`,
            {
              headers: {
                Accept: "application/vnd.github.v3+json",
              },
            }
          );
          const data = githubResponse.data;

          // Fetch starred repos to count total stars on user's repos
          let totalStars = 0;
          try {
            const reposResponse = await axios.get(
              `https://api.github.com/users/${username}/repos?per_page=100`,
              {
                headers: {
                  Accept: "application/vnd.github.v3+json",
                },
              }
            );
            totalStars = reposResponse.data.reduce(
              (sum, repo) => sum + (repo.stargazers_count || 0),
              0
            );
          } catch (e) {
            console.log("Could not fetch repos for star count");
          }

          stats = {
            totalRepos: data.public_repos || 0,
            followers: data.followers || 0,
            totalStars: totalStars,
            totalCommits: 0, // GitHub API doesn't provide total commits easily
          };
        } catch (error) {
          throw new Error(
            "Failed to fetch GitHub stats. Please check username or enter manually."
          );
        }
        break;

      case "codeforces":
        try {
          const cfResponse = await axios.get(
            `https://codeforces.com/api/user.info?handles=${username}`
          );
          const data = cfResponse.data?.result?.[0];

          if (!data) {
            throw new Error("User not found");
          }

          stats = {
            rating: data.rating || 0,
            maxRating: data.maxRating || 0,
            contestParticipation: 0,
          };

          // Fetch contest participation count
          try {
            const ratingResponse = await axios.get(
              `https://codeforces.com/api/user.rating?handle=${username}`
            );
            stats.contestParticipation =
              ratingResponse.data?.result?.length || 0;
          } catch (e) {
            console.log("Could not fetch contest participation");
          }
        } catch (error) {
          throw new Error(
            "Failed to fetch Codeforces stats. Please check username or enter manually."
          );
        }
        break;

      case "codechef":
        try {
          // Try primary CodeChef API
          let ccResponse;
          try {
            ccResponse = await axios.get(
              `https://codechef-api.vercel.app/handle/${username}`
            );
          } catch (e) {
            // Try alternative API
            ccResponse = await axios.get(
              `https://competitive-coding-api.herokuapp.com/api/codechef/${username}`
            );
          }

          const data = ccResponse.data;

          if (!data || data.success === false) {
            throw new Error("User not found");
          }

          // Handle different API response formats
          stats = {
            rating: data.currentRating || data.rating || 0,
            maxRating: data.highestRating || data.highest_rating || 0,
            totalSolved: data.totalProblemsSolved || data.solved || 0,
            contestParticipation:
              data.ratingNumber || data.contests_participated || 0,
          };
        } catch (error) {
          throw new Error(
            "Failed to fetch CodeChef stats. Please check username or enter manually."
          );
        }
        break;

      case "hackerrank":
        try {
          // Using unofficial HackerRank API
          const hrResponse = await axios.get(
            `https://www.hackerrank.com/rest/hackers/${username}/scores_elo`
          );
          const data = hrResponse.data;

          if (!data || !data.models) {
            throw new Error("User not found");
          }

          // Get problem solving score
          let totalSolved = 0;
          const psData = data.models.find((m) => m.category === "algorithms");
          if (psData) {
            totalSolved = psData.submissions_count || 0;
          }

          stats = {
            totalSolved: totalSolved,
            rating: psData?.score || 0,
            contestParticipation: data.models?.length || 0,
          };
        } catch (error) {
          throw new Error(
            "Failed to fetch HackerRank stats. Please check username or enter manually."
          );
        }
        break;

      case "geeksforgeeks":
        try {
          // Try multiple GFG APIs
          let data = null;
          const apis = [
            `https://geeks-for-geeks-api.vercel.app/${username}`,
            `https://geeksforgeeks-stats-api.vercel.app/api/${username}`,
            `https://gfg-profile-api.vercel.app/api/${username}`,
          ];

          for (const apiUrl of apis) {
            try {
              const response = await axios.get(apiUrl, {
                timeout: 5000,
                headers: {
                  "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                },
              });
              if (response.data && !response.data.error) {
                data = response.data;
                console.log("GFG API Response:", JSON.stringify(data, null, 2));
                break;
              }
            } catch (e) {
              console.log(`Failed to fetch from ${apiUrl}:`, e.message);
              continue;
            }
          }

          if (!data) {
            throw new Error("User not found on any API");
          }

          // Handle different API response formats
          stats = {
            totalSolved:
              data.totalProblemsSolved ||
              data.solved ||
              data.solvedStats?.overall?.count ||
              data.total_problems_solved ||
              data.problemsSolved ||
              data.info?.totalProblemsSolved ||
              data.info?.problemsSolved ||
              0,
            rating:
              data.score ||
              data.coding_score ||
              data.codingScore ||
              data.institute_rank ||
              data.instituteRank ||
              data.info?.score ||
              data.info?.instituteRank ||
              0,
            contestParticipation:
              data.monthlyScore ||
              data.monthly_score ||
              data.contestRating ||
              data.info?.monthlyScore ||
              0,
          };

          console.log("GFG Extracted Stats:", stats);
        } catch (error) {
          console.error("GFG Error:", error.message);
          throw new Error(
            "Failed to fetch GeeksForGeeks stats. Please enter manually."
          );
        }
        break;

      case "interviewbit":
        try {
          // Try multiple InterviewBit approaches
          let data = null;

          // Try API first
          try {
            const response = await axios.get(
              `https://www.interviewbit.com/api/users/${username}/`,
              {
                timeout: 5000,
                headers: {
                  "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                },
              }
            );
            data = response.data;
            console.log(
              "InterviewBit API Response:",
              JSON.stringify(data, null, 2)
            );
          } catch (e) {
            console.log("InterviewBit API failed:", e.message);
            // Try alternative endpoint
            const response = await axios.get(
              `https://www.interviewbit.com/profile/${username}`,
              {
                timeout: 5000,
                headers: {
                  "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                },
              }
            );
            // This would need HTML parsing, so for now just throw
            throw new Error("Direct profile scraping needed");
          }

          if (!data || !data.user) {
            throw new Error("User not found");
          }

          stats = {
            totalSolved:
              data.user.problems_solved ||
              data.user.problemsSolved ||
              data.user.solved_count ||
              0,
            rating:
              data.user.score ||
              data.user.rating ||
              data.user.hacker_score ||
              0,
            ranking:
              data.user.rank ||
              data.user.ranking ||
              data.user.all_time_rank ||
              0,
          };

          console.log("InterviewBit Extracted Stats:", stats);
        } catch (error) {
          console.error("InterviewBit Error:", error.message);
          throw new Error(
            "Failed to fetch InterviewBit stats. Please enter manually."
          );
        }
        break;

      default:
        return res.status(400).json({ message: "Unsupported platform" });
    }

    res.json({ stats });
  } catch (error) {
    res.status(400).json({
      message: error.message || "Failed to fetch stats",
    });
  }
};

// @desc    Update daily contribution
// @route   POST /api/coding-profiles/:id/daily-contribution
// @access  Private/Admin
export const updateDailyContribution = async (req, res) => {
  try {
    const { date, solved, contributed } = req.body;
    const profile = await CodingProfile.findById(req.params.id);

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Find if contribution for this date exists
    const contributionDate = new Date(date);
    contributionDate.setHours(0, 0, 0, 0);

    const existingIndex = profile.dailyContributions.findIndex(
      (c) => c.date.toDateString() === contributionDate.toDateString()
    );

    if (existingIndex >= 0) {
      // Update existing contribution
      profile.dailyContributions[existingIndex].solved = solved;
      profile.dailyContributions[existingIndex].contributed = contributed;
    } else {
      // Add new contribution
      profile.dailyContributions.push({
        date: contributionDate,
        solved,
        contributed,
      });
    }

    // Keep only last 365 days
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    profile.dailyContributions = profile.dailyContributions.filter(
      (c) => c.date >= oneYearAgo
    );

    await profile.save();
    res.json(profile);
  } catch (error) {
    res.status(400).json({ message: "Invalid data", error: error.message });
  }
};

// @desc    Sync all data (stats + contributions) from platform APIs
// @route   POST /api/coding-profiles/:id/sync-all
// @access  Private/Admin
export const syncAllPlatformData = async (req, res) => {
  try {
    const profile = await CodingProfile.findById(req.params.id);

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const { platform, username } = profile;
    let stats = {};
    let contributions = [];
    let syncedDays = 0;

    switch (platform) {
      case "leetcode":
        try {
          // Fetch stats
          const leetcodeResponse = await axios.post(
            "https://leetcode.com/graphql",
            {
              query: `
                query userProfile($username: String!) {
                  matchedUser(username: $username) {
                    submitStats {
                      acSubmissionNum {
                        difficulty
                        count
                      }
                    }
                    profile {
                      ranking
                      reputation
                    }
                    userContestRanking(username: $username) {
                      rating
                      attendedContestsCount
                      globalRanking
                    }
                    submissionCalendar
                  }
                }
              `,
              variables: { username },
            }
          );

          const data = leetcodeResponse.data?.data?.matchedUser;
          if (!data) {
            throw new Error("User not found");
          }

          // Process stats
          const submissions = data.submitStats.acSubmissionNum;
          const contestData = data.userContestRanking;

          stats = {
            totalSolved:
              submissions.find((s) => s.difficulty === "All")?.count || 0,
            easySolved:
              submissions.find((s) => s.difficulty === "Easy")?.count || 0,
            mediumSolved:
              submissions.find((s) => s.difficulty === "Medium")?.count || 0,
            hardSolved:
              submissions.find((s) => s.difficulty === "Hard")?.count || 0,
            ranking: data.profile?.ranking || 0,
            rating: Math.round(contestData?.rating || 0),
            contestParticipation: contestData?.attendedContestsCount || 0,
          };

          // Process submission calendar (contributions)
          const calendar = data.submissionCalendar;
          if (calendar) {
            const calendarData = JSON.parse(calendar);
            Object.entries(calendarData).forEach(([timestamp, count]) => {
              if (count > 0) {
                const date = new Date(parseInt(timestamp) * 1000);
                date.setHours(0, 0, 0, 0);
                contributions.push({
                  date,
                  solved: true,
                  contributed: false,
                });
                syncedDays++;
              }
            });
          }
        } catch (error) {
          return res.status(400).json({
            message: `Failed to fetch LeetCode data: ${error.message}`,
          });
        }
        break;

      case "github":
        try {
          // Fetch stats
          const githubResponse = await axios.get(
            `https://api.github.com/users/${username}`,
            {
              headers: {
                Accept: "application/vnd.github.v3+json",
              },
            }
          );
          const userData = githubResponse.data;

          // Fetch repos for star count
          let totalStars = 0;
          try {
            const reposResponse = await axios.get(
              `https://api.github.com/users/${username}/repos?per_page=100`,
              {
                headers: {
                  Accept: "application/vnd.github.v3+json",
                },
              }
            );
            totalStars = reposResponse.data.reduce(
              (sum, repo) => sum + (repo.stargazers_count || 0),
              0
            );
          } catch (e) {
            console.log("Could not fetch repos for star count");
          }

          stats = {
            totalRepos: userData.public_repos || 0,
            followers: userData.followers || 0,
            totalStars: totalStars,
          };

          // Fetch contributions
          const eventsResponse = await axios.get(
            `https://api.github.com/users/${username}/events?per_page=100`,
            {
              headers: {
                Accept: "application/vnd.github.v3+json",
              },
            }
          );

          const activeDates = new Set();
          eventsResponse.data.forEach((event) => {
            const date = new Date(event.created_at);
            date.setHours(0, 0, 0, 0);
            activeDates.add(date.toDateString());
          });

          activeDates.forEach((dateStr) => {
            contributions.push({
              date: new Date(dateStr),
              solved: false,
              contributed: true,
            });
            syncedDays++;
          });
        } catch (error) {
          return res.status(400).json({
            message: `Failed to fetch GitHub data: ${error.message}`,
          });
        }
        break;

      case "codeforces":
        try {
          // Fetch stats
          const cfResponse = await axios.get(
            `https://codeforces.com/api/user.info?handles=${username}`
          );
          const data = cfResponse.data?.result?.[0];

          if (!data) {
            throw new Error("User not found");
          }

          stats = {
            rating: data.rating || 0,
            maxRating: data.maxRating || 0,
            rank: data.rank || "",
            maxRank: data.maxRank || "",
          };

          // Fetch contest participation
          try {
            const ratingResponse = await axios.get(
              `https://codeforces.com/api/user.rating?handle=${username}`
            );
            stats.contestParticipation =
              ratingResponse.data?.result?.length || 0;
          } catch (e) {
            stats.contestParticipation = 0;
          }

          // Fetch submissions for active days
          try {
            const submissionsResponse = await axios.get(
              `https://codeforces.com/api/user.status?handle=${username}&from=1&count=1000`
            );
            const submissions = submissionsResponse.data?.result || [];

            const activeDates = new Set();
            submissions.forEach((submission) => {
              const date = new Date(submission.creationTimeSeconds * 1000);
              date.setHours(0, 0, 0, 0);
              activeDates.add(date.toDateString());
            });

            activeDates.forEach((dateStr) => {
              contributions.push({
                date: new Date(dateStr),
                solved: true,
                contributed: false,
              });
              syncedDays++;
            });
          } catch (e) {
            console.log("Could not fetch Codeforces submissions");
          }
        } catch (error) {
          return res.status(400).json({
            message: `Failed to fetch Codeforces data: ${error.message}`,
          });
        }
        break;

      case "codechef":
        try {
          // CodeChef doesn't have a public API, return error
          return res.status(400).json({
            message:
              "CodeChef doesn't have a public API. Please update stats and contributions manually.",
          });
        } catch (error) {
          return res.status(400).json({
            message: `Failed to fetch CodeChef data: ${error.message}`,
          });
        }
        break;

      default:
        return res.status(400).json({
          message: `Automatic sync not supported for ${platform}. Please update manually.`,
        });
    }

    // Update stats
    profile.stats = { ...profile.stats, ...stats };

    // Merge contributions
    contributions.forEach((newContribution) => {
      const existingIndex = profile.dailyContributions.findIndex(
        (c) => c.date.toDateString() === newContribution.date.toDateString()
      );

      if (existingIndex >= 0) {
        profile.dailyContributions[existingIndex].solved =
          profile.dailyContributions[existingIndex].solved ||
          newContribution.solved;
        profile.dailyContributions[existingIndex].contributed =
          profile.dailyContributions[existingIndex].contributed ||
          newContribution.contributed;
      } else {
        profile.dailyContributions.push(newContribution);
      }
    });

    // Keep only last 365 days
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    profile.dailyContributions = profile.dailyContributions.filter(
      (c) => c.date >= oneYearAgo
    );

    profile.lastUpdated = Date.now();
    await profile.save();

    res.json({
      message: `Successfully synced stats and ${syncedDays} days of contributions from ${platform}`,
      profile,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
