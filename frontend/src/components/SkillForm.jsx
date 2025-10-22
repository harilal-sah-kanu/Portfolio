import { useState, useEffect } from "react";
import { FiSave, FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../utils/api";

const SkillForm = ({ skill, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    level: 50,
    category: "frontend",
    color: "#3b82f6",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (skill) {
      setFormData({
        name: skill.name || "",
        level: skill.level || 50,
        category: skill.category || "frontend",
        color: skill.color || "#3b82f6",
      });
    }
  }, [skill]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (skill) {
        await api.put(`/skills/${skill._id}`, formData);
        toast.success("Skill updated successfully");
      } else {
        await api.post("/skills", formData);
        toast.success("Skill created successfully");
      }

      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save skill");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Skill Name *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="input"
          placeholder="e.g., React, Node.js, Python"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Proficiency Level: {formData.level}%
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={formData.level}
          onChange={(e) =>
            setFormData({ ...formData, level: parseInt(e.target.value) })
          }
          className="w-full h-2 bg-gray-200 dark:bg-dark-700 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>Beginner</span>
          <span>Intermediate</span>
          <span>Expert</span>
        </div>
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
          <option value="frontend">Frontend</option>
          <option value="backend">Backend</option>
          <option value="database">Database</option>
          <option value="devops">DevOps</option>
          <option value="tools">Tools</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Color</label>
        <div className="flex gap-3 items-center">
          <input
            type="color"
            value={formData.color}
            onChange={(e) =>
              setFormData({ ...formData, color: e.target.value })
            }
            className="w-16 h-10 rounded border border-gray-300 dark:border-dark-600 cursor-pointer"
          />
          <input
            type="text"
            value={formData.color}
            onChange={(e) =>
              setFormData({ ...formData, color: e.target.value })
            }
            className="input flex-1"
            placeholder="#3b82f6"
            pattern="^#[0-9A-Fa-f]{6}$"
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Choose a color for the skill badge and progress bar
        </p>
      </div>

      <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-dark-700">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 btn-primary flex items-center justify-center gap-2"
        >
          <FiSave />
          {loading ? "Saving..." : skill ? "Update Skill" : "Create Skill"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 btn-secondary flex items-center justify-center gap-2"
        >
          <FiX />
          Cancel
        </button>
      </div>
    </form>
  );
};

export default SkillForm;
