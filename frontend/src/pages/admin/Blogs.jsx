import { useState, useEffect } from "react";
import { FiPlus, FiEdit, FiTrash, FiEye, FiCalendar } from "react-icons/fi";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../../utils/api";
import Modal from "../../components/Modal";
import BlogForm from "../../components/BlogForm";
import ConfirmDialog from "../../components/ConfirmDialog";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const { data } = await api.get("/blogs");
      setBlogs(data);
    } catch (error) {
      toast.error("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setBlogToDelete(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/blogs/${blogToDelete}`);
      toast.success("Blog deleted successfully");
      fetchBlogs();
    } catch (error) {
      toast.error("Failed to delete blog");
    } finally {
      setShowConfirm(false);
      setBlogToDelete(null);
    }
  };

  const togglePublish = async (id, currentStatus) => {
    try {
      await api.put(`/blogs/${id}`, { published: !currentStatus });
      toast.success(currentStatus ? "Blog unpublished" : "Blog published");
      fetchBlogs();
    } catch (error) {
      toast.error("Failed to update blog status");
    }
  };

  const openCreateModal = () => {
    setSelectedBlog(null);
    setIsModalOpen(true);
  };

  const openEditModal = (blog) => {
    setSelectedBlog(blog);
    setIsModalOpen(true);
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    setSelectedBlog(null);
    fetchBlogs();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display mb-2">Manage Blogs</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Write and publish blog posts
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="btn-primary flex items-center gap-2"
        >
          <FiPlus /> New Blog Post
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-6 bg-gray-300 dark:bg-dark-700 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-300 dark:bg-dark-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-300 dark:bg-dark-700 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : blogs.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No blog posts yet. Create your first post!
          </p>
          <button
            onClick={openCreateModal}
            className="btn-primary inline-flex items-center gap-2"
          >
            <FiPlus /> New Blog Post
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {blogs.map((blog) => (
            <motion.div
              key={blog._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold font-display">
                      {blog.title}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        blog.published
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {blog.published ? "Published" : "Draft"}
                    </span>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {blog.excerpt}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <FiCalendar size={14} />
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <FiEye size={14} />
                      {blog.views || 0} views
                    </div>
                  </div>

                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex gap-2 mt-3">
                      {blog.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => togglePublish(blog._id, blog.published)}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      blog.published
                        ? "bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300"
                        : "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                    }`}
                  >
                    {blog.published ? "Unpublish" : "Publish"}
                  </button>
                  <button
                    onClick={() => openEditModal(blog)}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <FiEdit size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                  >
                    <FiTrash size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBlog(null);
        }}
        title={selectedBlog ? "Edit Blog Post" : "Create New Blog Post"}
      >
        <BlogForm
          blog={selectedBlog}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedBlog(null);
          }}
        />
      </Modal>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => {
          setShowConfirm(false);
          setBlogToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Blog Post"
        message="Are you sure you want to delete this blog post? This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
};

export default Blogs;
