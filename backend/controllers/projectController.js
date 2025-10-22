import Project from "../models/Project.js";

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
export const getProjects = async (req, res) => {
  try {
    const { category, featured, search } = req.query;

    let filter = {};

    if (category) filter.category = category;
    if (featured) filter.featured = featured === "true";
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const projects = await Project.find(filter).sort({
      order: 1,
      createdAt: -1,
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (project) {
      res.json(project);
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a project
// @route   POST /api/projects
// @access  Private/Admin
export const createProject = async (req, res) => {
  try {
    const project = new Project({
      title: req.body.title,
      description: req.body.description,
      fullDescription: req.body.fullDescription,
      image: req.body.image,
      images: req.body.images || [],
      techStack: req.body.techStack,
      category: req.body.category,
      links: req.body.links,
      featured: req.body.featured || false,
      status: req.body.status || "completed",
      tags: req.body.tags || [],
    });

    const createdProject = await project.save();
    res.status(201).json(createdProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private/Admin
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (project) {
      project.title = req.body.title || project.title;
      project.description = req.body.description || project.description;
      project.fullDescription =
        req.body.fullDescription || project.fullDescription;
      project.image = req.body.image || project.image;
      project.images = req.body.images || project.images;
      project.techStack = req.body.techStack || project.techStack;
      project.category = req.body.category || project.category;
      project.links = req.body.links || project.links;
      project.featured =
        req.body.featured !== undefined ? req.body.featured : project.featured;
      project.status = req.body.status || project.status;
      project.tags = req.body.tags || project.tags;

      const updatedProject = await project.save();
      res.json(updatedProject);
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (project) {
      await project.deleteOne();
      res.json({ message: "Project removed" });
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reorder projects (for drag & drop)
// @route   POST /api/projects/reorder
// @access  Private/Admin
export const reorderProjects = async (req, res) => {
  try {
    const { projects } = req.body; // Array of { id, order }

    const updatePromises = projects.map((item) =>
      Project.findByIdAndUpdate(item.id, { order: item.order })
    );

    await Promise.all(updatePromises);

    res.json({ message: "Projects reordered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
