import { useState, useEffect, useRef } from "react";
import { FiSave, FiX, FiUpload } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../utils/api";

const ExperienceForm = ({ experience, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    category: "work",
    organization: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
    technologies: "",
    achievements: "",
    icon: "",
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (experience) {
      setFormData({
        title: experience.title || "",
        subtitle: experience.subtitle || "",
        category: experience.category || "work",
        organization: experience.organization || "",
        location: experience.location || "",
        startDate: experience.startDate?.split("T")[0] || "",
        endDate: experience.endDate?.split("T")[0] || "",
        current: experience.current || false,
        description: experience.description || "",
        technologies: experience.technologies?.join(", ") || "",
        achievements: experience.achievements?.join("\n") || "",
        icon: experience.icon || "",
      });
    }
  }, [experience]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append("image", file);

    try {
      const { data } = await api.post("/upload/image", uploadFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFormData({ ...formData, icon: data.url });
      toast.success("Icon uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload icon");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const experienceData = {
        ...formData,
        technologies: formData.technologies
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t),
        achievements: formData.achievements
          .split("\n")
          .map((a) => a.trim())
          .filter((a) => a),
      };

      if (experience) {
        await api.put(`/experiences/${experience._id}`, experienceData);
        toast.success("Experience updated successfully");
      } else {
        await api.post("/experiences", experienceData);
        toast.success("Experience added successfully");
      }

      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save experience");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="input"
            placeholder="e.g. Software Engineer, Graduated, Won Hackathon"
            required
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Main headline for this timeline event
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Category *</label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="input"
            required
          >
            <option value="work">Work Experience</option>
            <option value="education">Education</option>
            <option value="project">Project</option>
            <option value="achievement">Achievement</option>
            <option value="certification">Certification</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Subtitle</label>
          <input
            type="text"
            value={formData.subtitle}
            onChange={(e) =>
              setFormData({ ...formData, subtitle: e.target.value })
            }
            className="input"
            placeholder="e.g. Senior Developer, Bachelor of Science"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Secondary description or role
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Organization</label>
          <input
            type="text"
            value={formData.organization}
            onChange={(e) =>
              setFormData({ ...formData, organization: e.target.value })
            }
            className="input"
            placeholder="Company, University, or Organization"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Location</label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
          className="input"
          placeholder="City, Country or Remote"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Start Date *</label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) =>
              setFormData({ ...formData, startDate: e.target.value })
            }
            className="input"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">End Date</label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) =>
              setFormData({ ...formData, endDate: e.target.value })
            }
            className="input"
            disabled={formData.current}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="current"
          checked={formData.current}
          onChange={(e) =>
            setFormData({ ...formData, current: e.target.checked, endDate: "" })
          }
          className="w-4 h-4 text-primary-600 rounded"
        />
        <label htmlFor="current" className="text-sm font-medium">
          This is ongoing
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description *</label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="input"
          rows="4"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Key Achievements (one per line)
        </label>
        <textarea
          value={formData.achievements}
          onChange={(e) =>
            setFormData({ ...formData, achievements: e.target.value })
          }
          className="input"
          rows="4"
          placeholder="Led a team of 5 developers&#10;Improved performance by 40%&#10;Implemented CI/CD pipeline"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Technologies (comma-separated)
        </label>
        <input
          type="text"
          value={formData.technologies}
          onChange={(e) =>
            setFormData({ ...formData, technologies: e.target.value })
          }
          className="input"
          placeholder="React, Node.js, MongoDB, AWS"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Icon/Logo</label>
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="btn-secondary flex items-center gap-2"
            >
              <FiUpload />
              {uploading ? "Uploading..." : "Upload Icon"}
            </button>
            <input
              type="url"
              value={formData.icon}
              onChange={(e) =>
                setFormData({ ...formData, icon: e.target.value })
              }
              className="input flex-1"
              placeholder="Or paste icon URL"
            />
          </div>
          {formData.icon && (
            <div className="relative inline-block">
              <img
                src={formData.icon}
                alt="Icon"
                className="h-16 w-16 object-contain rounded border border-gray-200 dark:border-dark-700"
              />
              <button
                type="button"
                onClick={() => setFormData({ ...formData, icon: "" })}
                className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
              >
                <FiX size={12} />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-dark-700">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 btn-primary flex items-center justify-center gap-2"
        >
          <FiSave />
          {loading ? "Saving..." : experience ? "Update" : "Add to Timeline"}
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

export default ExperienceForm;
