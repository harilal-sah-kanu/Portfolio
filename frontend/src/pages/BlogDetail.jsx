import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiCalendar, FiEye, FiArrowLeft, FiUser } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../utils/api";

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      // Try to fetch by slug first, then by ID if that fails
      let data;
      try {
        const response = await api.get(`/blogs/${id}`);
        data = response.data;
      } catch (error) {
        // If fetching by slug fails, it might be an ID
        if (error.response?.status === 404) {
          toast.error("Blog post not found");
          setLoading(false);
          return;
        }
        throw error;
      }

      setBlog(data);
      // Increment view count using the blog's actual ID
      if (data._id) {
        await api.post(`/blogs/${data._id}/views`);
      }
    } catch (error) {
      console.error("Error fetching blog:", error);
      toast.error("Failed to load blog post");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="container max-w-4xl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-dark-700 rounded w-1/3 mb-4"></div>
            <div className="h-12 bg-gray-300 dark:bg-dark-700 rounded w-full mb-4"></div>
            <div className="h-96 bg-gray-300 dark:bg-dark-700 rounded-2xl mb-8"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-300 dark:bg-dark-700 rounded"></div>
              <div className="h-4 bg-gray-300 dark:bg-dark-700 rounded"></div>
              <div className="h-4 bg-gray-300 dark:bg-dark-700 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="container text-center">
          <h1 className="text-4xl font-bold font-display mb-4">
            Blog Post Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The blog post you're looking for doesn't exist.
          </p>
          <Link
            to="/blog"
            className="btn-primary inline-flex items-center gap-2"
          >
            <FiArrowLeft /> Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container max-w-4xl">
        {/* Back Button */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:gap-3 transition-all mb-8"
        >
          <FiArrowLeft /> Back to Blog
        </Link>

        <article>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-5xl font-bold font-display mb-4">
              {blog.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400 mb-6">
              <div className="flex items-center gap-2">
                <FiUser size={18} />
                <span>{blog.author?.name || "Admin"}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCalendar size={18} />
                <span>
                  {new Date(blog.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FiEye size={18} />
                <span>{blog.views || 0} views</span>
              </div>
            </div>

            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {blog.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>

          {/* Featured Image */}
          {blog.image && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-[500px] object-cover rounded-2xl shadow-2xl"
              />
            </motion.div>
          )}

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="prose prose-lg dark:prose-invert max-w-none"
          >
            {/* Excerpt */}
            {blog.excerpt && (
              <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-8 font-medium content-display">
                {blog.excerpt}
              </p>
            )}

            {/* Main Content */}
            <div className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-4 content-display">
              {blog.content || blog.excerpt}
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 pt-8 border-t border-gray-200 dark:border-dark-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Written by
                </p>
                <p className="text-lg font-bold font-display">
                  {blog.author?.name || "Admin"}
                </p>
              </div>
              <Link to="/blog" className="btn-secondary">
                More Articles
              </Link>
            </div>
          </motion.div>
        </article>
      </div>
    </div>
  );
};

export default BlogDetail;
