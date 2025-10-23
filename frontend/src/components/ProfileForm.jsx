import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FiX, FiPlus } from "react-icons/fi";

const ProfileForm = ({ profile, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    bio: "",
    email: "",
    github: "",
    linkedin: "",
    twitter: "",
    roles: [],
  });
  const [loading, setLoading] = useState(false);
  const [newRole, setNewRole] = useState("");

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        title: profile.title || "",
        bio: profile.bio || "",
        email: profile.email || "",
        github: profile.github || "",
        linkedin: profile.linkedin || "",
        twitter: profile.twitter || "",
        roles: profile.roles || [],
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddRole = () => {
    if (!newRole.trim()) {
      toast.error("Please enter a role");
      return;
    }
    if (formData.roles.includes(newRole.trim())) {
      toast.error("This role already exists");
      return;
    }
    setFormData({
      ...formData,
      roles: [...formData.roles, newRole.trim()],
    });
    setNewRole("");
  };

  const handleRemoveRole = (index) => {
    setFormData({
      ...formData,
      roles: formData.roles.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      toast.success("Profile updated successfully!");
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="input"
            placeholder="Your Name"
            required
          />
        </div>

        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Professional Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="input"
            placeholder="Full Stack Developer"
            required
          />
        </div>

        {/* Bio */}
        <div>
          <label
            htmlFor="bio"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={4}
            className="input"
            placeholder="Tell us about yourself..."
          />
        </div>

        {/* Animated Roles */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Animated Roles
            <span className="text-xs text-gray-500 ml-2">
              (Will appear as typing animation on homepage)
            </span>
          </label>
          <div className="space-y-2">
            {/* Existing Roles */}
            {formData.roles.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.roles.map((role, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg"
                  >
                    <span className="text-sm">{role}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveRole(index)}
                      className="hover:text-red-600 transition-colors"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {/* Add New Role */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddRole();
                  }
                }}
                className="input flex-1"
                placeholder="e.g., Full Stack Developer, Web Developer..."
              />
              <button
                type="button"
                onClick={handleAddRole}
                className="btn-secondary flex items-center gap-2 whitespace-nowrap"
              >
                <FiPlus size={16} />
                Add
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Add multiple roles to create a rotating animation effect. Press
              Enter or click Add.
            </p>
          </div>
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="input"
            placeholder="your@email.com"
          />
        </div>

        {/* Social Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="github"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              GitHub Username
            </label>
            <input
              type="text"
              id="github"
              name="github"
              value={formData.github}
              onChange={handleChange}
              className="input"
              placeholder="username"
            />
          </div>

          <div>
            <label
              htmlFor="linkedin"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              LinkedIn Username
            </label>
            <input
              type="text"
              id="linkedin"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              className="input"
              placeholder="username"
            />
          </div>

          <div>
            <label
              htmlFor="twitter"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Twitter Username
            </label>
            <input
              type="text"
              id="twitter"
              name="twitter"
              value={formData.twitter}
              onChange={handleChange}
              className="input"
              placeholder="username"
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-dark-700">
        <button
          type="button"
          onClick={onClose}
          className="btn-secondary"
          disabled={loading}
        >
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;
