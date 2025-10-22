import Blog from "../models/Blog.js";

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
export const getBlogs = async (req, res) => {
  try {
    const { published, category, tag, search } = req.query;

    let filter = {};

    // Only show published blogs to public
    if (published !== "false") filter.published = true;
    if (category) filter.category = category;
    if (tag) filter.tags = { $in: [tag] };
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const blogs = await Blog.find(filter)
      .populate("author", "name avatar")
      .sort({ createdAt: -1 });

    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single blog by slug or ID
// @route   GET /api/blogs/:slug
// @access  Public
export const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    // Try to find by slug first
    let blog = await Blog.findOne({ slug }).populate("author", "name avatar");

    // If not found by slug, try by ID (for backward compatibility)
    if (!blog && slug.match(/^[0-9a-fA-F]{24}$/)) {
      blog = await Blog.findById(slug).populate("author", "name avatar");
    }

    if (blog) {
      res.json(blog);
    } else {
      res.status(404).json({ message: "Blog not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a blog
// @route   POST /api/blogs
// @access  Private/Admin
export const createBlog = async (req, res) => {
  try {
    const blog = new Blog({
      title: req.body.title,
      excerpt: req.body.excerpt,
      content: req.body.content,
      coverImage: req.body.coverImage || "",
      author: req.user._id,
      tags: req.body.tags || [],
      category: req.body.category || "general",
      published: req.body.published || false,
      readTime: req.body.readTime || 5,
    });

    const createdBlog = await blog.save();
    res.status(201).json(createdBlog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a blog
// @route   PUT /api/blogs/:id
// @access  Private/Admin
export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (blog) {
      blog.title = req.body.title || blog.title;
      blog.excerpt = req.body.excerpt || blog.excerpt;
      blog.content = req.body.content || blog.content;
      blog.coverImage = req.body.coverImage || blog.coverImage;
      blog.tags = req.body.tags || blog.tags;
      blog.category = req.body.category || blog.category;
      blog.published =
        req.body.published !== undefined ? req.body.published : blog.published;
      blog.readTime = req.body.readTime || blog.readTime;

      const updatedBlog = await blog.save();
      res.json(updatedBlog);
    } else {
      res.status(404).json({ message: "Blog not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a blog
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (blog) {
      await blog.deleteOne();
      res.json({ message: "Blog removed" });
    } else {
      res.status(404).json({ message: "Blog not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Increment blog views
// @route   POST /api/blogs/:id/views
// @access  Public
export const incrementViews = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (blog) {
      blog.views += 1;
      await blog.save();
      res.json({ views: blog.views });
    } else {
      res.status(404).json({ message: "Blog not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
