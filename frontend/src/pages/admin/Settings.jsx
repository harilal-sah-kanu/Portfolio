import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  FiUser,
  FiSettings,
  FiSave,
  FiUpload,
  FiFileText,
  FiDownload,
  FiTrash,
  FiImage,
  FiLock,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import api from "../../utils/api";
import toast from "react-hot-toast";
import Modal from "../../components/Modal";
import ProfileForm from "../../components/ProfileForm";

const Settings = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [changingPassword, setChangingPassword] = useState(false);
  const resumeInputRef = useRef(null);
  const imageInputRef = useRef(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/auth/profile");
      setProfile(response.data);
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (formData) => {
    try {
      const response = await api.put("/auth/profile", formData);
      setProfile(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a PDF or DOC file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    setUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append("resume", file);

    try {
      const { data } = await api.post("/upload/resume", uploadFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfile({
        ...profile,
        resume: data,
      });
      toast.success("Resume uploaded successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload resume");
    } finally {
      setUploading(false);
    }
  };

  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a valid image (JPG, PNG, or WebP)");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB");
      return;
    }

    setUploadingImage(true);
    const uploadFormData = new FormData();
    uploadFormData.append("profileImage", file);

    try {
      const { data } = await api.post("/upload/profile-image", uploadFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfile({
        ...profile,
        profileImage: data,
      });
      toast.success("Profile image uploaded successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveProfileImage = async () => {
    if (!confirm("Are you sure you want to remove your profile image?")) return;

    try {
      await api.delete("/upload/profile-image");
      setProfile({
        ...profile,
        profileImage: null,
      });
      toast.success("Profile image removed successfully");
    } catch (error) {
      toast.error("Failed to remove profile image");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      toast.error("All fields are required");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setChangingPassword(true);
    try {
      await api.put("/auth/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      toast.success("Password changed successfully!");
      setIsPasswordModalOpen(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="card-3d p-6 animate-pulse">
          <div className="h-8 bg-gray-300 dark:bg-dark-700 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-12 bg-gray-300 dark:bg-dark-700 rounded"></div>
            <div className="h-12 bg-gray-300 dark:bg-dark-700 rounded"></div>
            <div className="h-24 bg-gray-300 dark:bg-dark-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1
            className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2"
            style={{
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            <span className="gradient-text-3d">Settings</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your portfolio settings and profile information
          </p>
        </div>
      </div>

      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-3d p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-gradient-to-r from-primary-100 to-purple-100 dark:from-primary-900/30 dark:to-purple-900/30">
              <FiUser className="text-2xl text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Profile Information
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Update your personal information and social links
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center gap-2"
          >
            <FiSettings size={18} />
            Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Image */}
          <div className="md:col-span-2 p-4 rounded-lg bg-gray-50 dark:bg-dark-700/50">
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-3">
              Profile Image
            </label>
            {profile?.profileImage?.url ? (
              <div className="flex items-center gap-6">
                <img
                  src={profile.profileImage.url}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-primary-500"
                />
                <div className="flex-1">
                  <p className="text-gray-900 dark:text-gray-100 font-medium mb-1">
                    {profile.profileImage.filename || "profile-image.jpg"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    Uploaded {new Date(profile.updatedAt).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => imageInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="btn-secondary flex items-center gap-2 text-sm"
                    >
                      <FiUpload size={14} />
                      {uploadingImage ? "Uploading..." : "Replace"}
                    </button>
                    <button
                      onClick={handleRemoveProfileImage}
                      className="btn-outline flex items-center gap-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <FiTrash size={14} />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 border-2 border-dashed border-gray-300 dark:border-dark-600 rounded-lg">
                <FiImage className="mx-auto text-4xl text-gray-400 mb-2" />
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  No profile image uploaded yet
                </p>
                <button
                  onClick={() => imageInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <FiUpload />
                  {uploadingImage ? "Uploading..." : "Upload Image"}
                </button>
              </div>
            )}
            <input
              ref={imageInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleProfileImageUpload}
              className="hidden"
            />
          </div>

          {/* Name */}
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-dark-700/50">
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-2">
              Full Name
            </label>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {profile?.name || "Not set"}
            </p>
          </div>

          {/* Title */}
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-dark-700/50">
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-2">
              Professional Title
            </label>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {profile?.title || "Not set"}
            </p>
          </div>

          {/* Bio */}
          <div className="md:col-span-2 p-4 rounded-lg bg-gray-50 dark:bg-dark-700/50">
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-2">
              Bio
            </label>
            <p className="text-gray-900 dark:text-gray-100">
              {profile?.bio || "No bio added yet"}
            </p>
          </div>

          {/* Email */}
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-dark-700/50">
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-2">
              Email
            </label>
            <p className="text-gray-900 dark:text-gray-100">
              {profile?.email || "Not set"}
            </p>
          </div>

          {/* GitHub */}
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-dark-700/50">
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-2">
              GitHub
            </label>
            <p className="text-gray-900 dark:text-gray-100">
              {profile?.github ? `@${profile.github}` : "Not set"}
            </p>
          </div>

          {/* LinkedIn */}
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-dark-700/50">
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-2">
              LinkedIn
            </label>
            <p className="text-gray-900 dark:text-gray-100">
              {profile?.linkedin ? `@${profile.linkedin}` : "Not set"}
            </p>
          </div>

          {/* Twitter */}
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-dark-700/50">
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-2">
              Twitter
            </label>
            <p className="text-gray-900 dark:text-gray-100">
              {profile?.twitter ? `@${profile.twitter}` : "Not set"}
            </p>
          </div>

          {/* Resume */}
          <div className="md:col-span-2 p-4 rounded-lg bg-gray-50 dark:bg-dark-700/50">
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-3">
              Resume / CV
            </label>
            {profile?.resume?.url ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FiFileText className="text-primary-600 text-2xl" />
                  <div>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">
                      {profile.resume.filename || "Resume.pdf"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Uploaded{" "}
                      {new Date(profile.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a
                    href={profile.resume.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary flex items-center gap-2 text-sm"
                  >
                    <FiDownload size={14} />
                    View
                  </a>
                  <button
                    onClick={() => resumeInputRef.current?.click()}
                    disabled={uploading}
                    className="btn-secondary flex items-center gap-2 text-sm"
                  >
                    <FiUpload size={14} />
                    {uploading ? "Uploading..." : "Replace"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 border-2 border-dashed border-gray-300 dark:border-dark-600 rounded-lg">
                <FiFileText className="mx-auto text-4xl text-gray-400 mb-2" />
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  No resume uploaded yet
                </p>
                <button
                  onClick={() => resumeInputRef.current?.click()}
                  disabled={uploading}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <FiUpload />
                  {uploading ? "Uploading..." : "Upload Resume"}
                </button>
              </div>
            )}
            <input
              ref={resumeInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeUpload}
              className="hidden"
            />
          </div>
        </div>
      </motion.div>

      {/* Security Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card-3d p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-gradient-to-r from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30">
              <FiLock className="text-2xl text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Security Settings
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage your account security and password
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsPasswordModalOpen(true)}
            className="btn-primary flex items-center gap-2 bg-red-600 hover:bg-red-700"
          >
            <FiLock size={18} />
            Change Password
          </button>
        </div>

        <div className="p-4 rounded-lg bg-gray-50 dark:bg-dark-700/50">
          <div className="flex items-center gap-3">
            <FiLock className="text-gray-500 dark:text-gray-400" />
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                Password
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Last changed:{" "}
                {new Date(profile?.updatedAt).toLocaleDateString() || "Never"}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit Profile"
      >
        <ProfileForm
          profile={profile}
          onSubmit={handleUpdateProfile}
          onClose={() => {
            setIsModalOpen(false);
            fetchProfile();
          }}
        />
      </Modal>

      {/* Change Password Modal */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => {
          setIsPasswordModalOpen(false);
          setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
        }}
        title="Change Password"
      >
        <form onSubmit={handleChangePassword} className="space-y-6">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.current ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value,
                  })
                }
                className="input pr-12"
                placeholder="Enter current password"
                required
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords({
                    ...showPasswords,
                    current: !showPasswords.current,
                  })
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {showPasswords.current ? (
                  <FiEyeOff size={20} />
                ) : (
                  <FiEye size={20} />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
                className="input pr-12"
                placeholder="Enter new password (min 6 characters)"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords({
                    ...showPasswords,
                    new: !showPasswords.new,
                  })
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {showPasswords.new ? (
                  <FiEyeOff size={20} />
                ) : (
                  <FiEye size={20} />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? "text" : "password"}
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
                className="input pr-12"
                placeholder="Confirm new password"
                required
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords({
                    ...showPasswords,
                    confirm: !showPasswords.confirm,
                  })
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {showPasswords.confirm ? (
                  <FiEyeOff size={20} />
                ) : (
                  <FiEye size={20} />
                )}
              </button>
            </div>
          </div>

          {/* Password Requirements */}
          <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
              Password Requirements:
            </p>
            <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1 list-disc list-inside">
              <li>Minimum 6 characters long</li>
              <li>Must match confirmation password</li>
              <li>Different from current password</li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t dark:border-dark-600">
            <button
              type="button"
              onClick={() => {
                setIsPasswordModalOpen(false);
                setPasswordData({
                  currentPassword: "",
                  newPassword: "",
                  confirmPassword: "",
                });
              }}
              className="btn-outline"
              disabled={changingPassword}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary bg-red-600 hover:bg-red-700 flex items-center gap-2"
              disabled={changingPassword}
            >
              <FiLock size={18} />
              {changingPassword ? "Changing..." : "Change Password"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Settings;
