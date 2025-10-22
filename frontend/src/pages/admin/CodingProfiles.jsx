import { useState, useEffect } from "react";
import {
  FiPlus,
  FiEdit,
  FiTrash,
  FiExternalLink,
  FiEye,
  FiEyeOff,
  FiCalendar,
} from "react-icons/fi";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../../utils/api";
import Modal from "../../components/Modal";
import CodingProfileForm from "../../components/CodingProfileForm";
import ConfirmDialog from "../../components/ConfirmDialog";
import ContributionCalendar from "../../components/ContributionCalendar";
import TodayActivity from "../../components/TodayActivity";

const CodingProfiles = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState(null);
  const [selectedCalendarProfile, setSelectedCalendarProfile] = useState(null);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      // Fetch all profiles including disabled ones
      const { data } = await api.get("/coding-profiles");
      setProfiles(data);
    } catch (error) {
      toast.error("Failed to load coding profiles");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setProfileToDelete(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/coding-profiles/${profileToDelete}`);
      toast.success("Profile deleted successfully");
      fetchProfiles();
    } catch (error) {
      toast.error("Failed to delete profile");
    } finally {
      setShowConfirm(false);
      setProfileToDelete(null);
    }
  };

  const toggleVisibility = async (profile) => {
    try {
      await api.put(`/coding-profiles/${profile._id}`, {
        ...profile,
        enabled: !profile.enabled,
      });
      toast.success(profile.enabled ? "Profile hidden" : "Profile shown");
      fetchProfiles();
    } catch (error) {
      toast.error("Failed to update visibility");
    }
  };

  const openCreateModal = () => {
    setSelectedProfile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (profile) => {
    setSelectedProfile(profile);
    setIsModalOpen(true);
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    setSelectedProfile(null);
    fetchProfiles();
  };

  const platformColors = {
    leetcode: "from-yellow-600 to-orange-600",
    codechef: "from-amber-700 to-amber-900",
    codeforces: "from-blue-600 to-cyan-600",
    hackerrank: "from-green-600 to-emerald-600",
    github: "from-gray-700 to-gray-900",
    geeksforgeeks: "from-green-600 to-green-800",
    interviewbit: "from-blue-600 to-blue-800",
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display mb-2">
            Coding Profiles
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your coding platform statistics
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="btn-primary flex items-center gap-2"
        >
          <FiPlus /> Add Profile
        </button>
      </div>

      {/* Today's Activity Component */}
      {!loading && profiles.length > 0 && (
        <TodayActivity codingProfiles={profiles} />
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-6 bg-gray-300 dark:bg-dark-700 rounded w-1/2 mb-4"></div>
              <div className="h-20 bg-gray-300 dark:bg-dark-700 rounded"></div>
            </div>
          ))}
        </div>
      ) : profiles.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No coding profiles yet. Add your first one!
          </p>
          <button
            onClick={openCreateModal}
            className="btn-primary inline-flex items-center gap-2"
          >
            <FiPlus /> Add Profile
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((profile) => (
            <motion.div
              key={profile._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6 hover:shadow-lg transition-shadow relative"
            >
              {!profile.enabled && (
                <div className="absolute top-4 right-4">
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                    Hidden
                  </span>
                </div>
              )}

              <div className="mb-4">
                <div
                  className={`inline-flex px-4 py-2 rounded-lg bg-gradient-to-r ${
                    platformColors[profile.platform]
                  } text-white font-semibold capitalize mb-2`}
                >
                  {profile.platform}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  @{profile.username}
                </p>
              </div>

              <div className="mb-4">
                {profile.platform === "leetcode" && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Total Solved
                      </span>
                      <span className="font-bold text-primary-600">
                        {profile.stats.totalSolved || 0}
                      </span>
                    </div>
                    <div className="flex gap-4 text-xs">
                      <span className="text-green-600">
                        Easy: {profile.stats.easySolved || 0}
                      </span>
                      <span className="text-yellow-600">
                        Med: {profile.stats.mediumSolved || 0}
                      </span>
                      <span className="text-red-600">
                        Hard: {profile.stats.hardSolved || 0}
                      </span>
                    </div>
                  </div>
                )}

                {(profile.platform === "codeforces" ||
                  profile.platform === "codechef") && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Rating
                      </span>
                      <span className="font-bold text-primary-600">
                        {profile.stats.rating || 0}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                      <span>Max: {profile.stats.maxRating || 0}</span>
                      <span>
                        Contests: {profile.stats.contestParticipation || 0}
                      </span>
                    </div>
                  </div>
                )}

                {profile.platform === "github" && (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="text-center p-2 rounded bg-gray-50 dark:bg-dark-700">
                      <div className="font-bold text-gray-900 dark:text-white">
                        {profile.stats.totalRepos || 0}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">
                        Repos
                      </div>
                    </div>
                    <div className="text-center p-2 rounded bg-gray-50 dark:bg-dark-700">
                      <div className="font-bold text-yellow-600">
                        {profile.stats.totalStars || 0}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">
                        Stars
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2 flex-wrap">
                <a
                  href={profile.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 btn-secondary text-sm flex items-center justify-center gap-2"
                >
                  <FiExternalLink size={14} />
                  Visit
                </a>
                <button
                  onClick={() => toggleVisibility(profile)}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                    profile.enabled
                      ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                  title={
                    profile.enabled ? "Hide from public" : "Show on public"
                  }
                >
                  {profile.enabled ? (
                    <FiEye size={16} />
                  ) : (
                    <FiEyeOff size={16} />
                  )}
                </button>
                <button
                  onClick={() => openEditModal(profile)}
                  className="px-3 py-2 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
                >
                  <FiEdit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(profile._id)}
                  className="px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                  <FiTrash size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Single Combined Contribution Calendar */}
      {profiles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12"
        >
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-6">
              <FiCalendar className="text-2xl text-primary-600" />
              <h2 className="text-2xl font-bold">Combined Daily Activity</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Track your daily contributions across all platforms in one view
            </p>

            <ContributionCalendar
              profileId="combined"
              platform="All Platforms"
              contributions={profiles}
              isCombined={true}
            />
          </div>
        </motion.div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProfile(null);
        }}
        title={selectedProfile ? "Edit Coding Profile" : "Add Coding Profile"}
      >
        <CodingProfileForm
          profile={selectedProfile}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedProfile(null);
          }}
        />
      </Modal>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => {
          setShowConfirm(false);
          setProfileToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Coding Profile"
        message="Are you sure you want to delete this coding profile? This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
};

export default CodingProfiles;
