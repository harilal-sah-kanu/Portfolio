import Experience from "../models/Experience.js";

// @desc    Get all experiences
// @route   GET /api/experiences
// @access  Public
export const getExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find().sort({
      startDate: -1,
      order: 1,
    });
    res.json(experiences);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get single experience
// @route   GET /api/experiences/:id
// @access  Public
export const getExperience = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);

    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    res.json(experience);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Create experience
// @route   POST /api/experiences
// @access  Private/Admin
export const createExperience = async (req, res) => {
  try {
    const experience = await Experience.create(req.body);
    res.status(201).json(experience);
  } catch (error) {
    res.status(400).json({ message: "Invalid data", error: error.message });
  }
};

// @desc    Update experience
// @route   PUT /api/experiences/:id
// @access  Private/Admin
export const updateExperience = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);

    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    Object.assign(experience, req.body);
    const updatedExperience = await experience.save();

    res.json(updatedExperience);
  } catch (error) {
    res.status(400).json({ message: "Invalid data", error: error.message });
  }
};

// @desc    Delete experience
// @route   DELETE /api/experiences/:id
// @access  Private/Admin
export const deleteExperience = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);

    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    await experience.deleteOne();
    res.json({ message: "Experience removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
