import { useState, useEffect, useRef } from "react";
import { FiSave, FiX, FiUpload } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../utils/api";

const ProjectForm = ({ project, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    techStack: "",
    category: "web",
    featured: false,
    links: {
      github: "",
      live: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || "",
        description: project.description || "",
        image: project.image || "",
        techStack: project.techStack?.join(", ") || "",
        category: project.category || "web",
        featured: project.featured || false,
        links: {
          github: project.links?.github || "",
          live: project.links?.live || "",
        },
      });
      setImagePreview(project.image || "");
    }
  }, [project]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const { data } = await api.post("/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setFormData((prev) => ({ ...prev, image: data.url }));
      setImagePreview(data.url);
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        techStack: formData.techStack.split(",").map((tech) => tech.trim()),
      };

      if (project) {
        await api.put(`/projects/${project._id}`, payload);
        toast.success("Project updated successfully");
      } else {
        await api.post("/projects", payload);
        toast.success("Project created successfully");
      }

      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Title *</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="input"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description *</label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="input min-h-[100px]"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Project Image *
        </label>
        <div className="space-y-3">
          {imagePreview && (
            <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-dark-600">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="btn-secondary flex items-center gap-2"
            >
              <FiUpload />
              {uploading
                ? "Uploading..."
                : imagePreview
                ? "Change Image"
                : "Upload Image"}
            </button>
            {!imagePreview && (
              <input
                type="url"
                value={formData.image}
                onChange={(e) => {
                  setFormData({ ...formData, image: e.target.value });
                  setImagePreview(e.target.value);
                }}
                className="input flex-1"
                placeholder="Or paste image URL"
              />
            )}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Tech Stack (comma-separated) *
        </label>
        <input
          type="text"
          value={formData.techStack}
          onChange={(e) =>
            setFormData({ ...formData, techStack: e.target.value })
          }
          className="input"
          placeholder="React, Node.js, MongoDB"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Category</label>
        <select
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          className="input"
        >
          <option value="web">Web</option>
          <option value="mobile">Mobile</option>
          <option value="fullstack">Full Stack</option>
          <option value="ai/ml">AI/ML</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">GitHub URL</label>
        <input
          type="url"
          value={formData.links.github}
          onChange={(e) =>
            setFormData({
              ...formData,
              links: { ...formData.links, github: e.target.value },
            })
          }
          className="input"
          placeholder="https://github.com/username/repo"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Live Demo URL</label>
        <input
          type="url"
          value={formData.links.live}
          onChange={(e) =>
            setFormData({
              ...formData,
              links: { ...formData.links, live: e.target.value },
            })
          }
          className="input"
          placeholder="https://example.com"
        />
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="featured"
          checked={formData.featured}
          onChange={(e) =>
            setFormData({ ...formData, featured: e.target.checked })
          }
          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
        />
        <label htmlFor="featured" className="text-sm font-medium">
          Featured Project
        </label>
      </div>

      <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-dark-700">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 btn-primary flex items-center justify-center gap-2"
        >
          <FiSave />
          {loading
            ? "Saving..."
            : project
            ? "Update Project"
            : "Create Project"}
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

export default ProjectForm;
