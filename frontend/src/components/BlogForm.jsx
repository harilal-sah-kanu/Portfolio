import { useState, useEffect, useRef } from "react";
import { FiSave, FiX, FiUpload, FiImage } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../utils/api";

const BlogForm = ({ blog, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    image: "",
    tags: "",
    published: false,
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title || "",
        excerpt: blog.excerpt || "",
        content: blog.content || "",
        image: blog.image || "",
        tags: blog.tags?.join(", ") || "",
        published: blog.published || false,
      });
    }
  }, [blog]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append("image", file);

    try {
      const { data } = await api.post("/upload/image", uploadFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setFormData({ ...formData, image: data.url });
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
      const blogData = {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
      };

      if (blog) {
        await api.put(`/blogs/${blog._id}`, blogData);
        toast.success("Blog updated successfully");
      } else {
        await api.post("/blogs", blogData);
        toast.success("Blog created successfully");
      }

      // Call callbacks after successful operation
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save blog");
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
          placeholder="Enter blog title"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Excerpt *</label>
        <textarea
          value={formData.excerpt}
          onChange={(e) =>
            setFormData({ ...formData, excerpt: e.target.value })
          }
          className="input"
          rows="3"
          placeholder="Short description of the blog post"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Content *</label>
        <textarea
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
          className="input"
          rows="10"
          placeholder="Write your blog content here (supports markdown)"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Featured Image</label>
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
              {uploading ? "Uploading..." : "Upload Image"}
            </button>
            <input
              type="url"
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
              className="input flex-1"
              placeholder="Or paste image URL"
            />
          </div>
          {formData.image && (
            <div className="relative">
              <img
                src={formData.image}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              <button
                type="button"
                onClick={() => setFormData({ ...formData, image: "" })}
                className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
              >
                <FiX size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Tags</label>
        <input
          type="text"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          className="input"
          placeholder="React, JavaScript, Web Development (comma-separated)"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Separate tags with commas
        </p>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="published"
          checked={formData.published}
          onChange={(e) =>
            setFormData({ ...formData, published: e.target.checked })
          }
          className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
        />
        <label htmlFor="published" className="text-sm font-medium">
          Publish immediately
        </label>
      </div>

      <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-dark-700">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 btn-primary flex items-center justify-center gap-2"
        >
          <FiSave />
          {loading ? "Saving..." : blog ? "Update Blog" : "Create Blog"}
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

export default BlogForm;
