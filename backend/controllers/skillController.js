import Skill from "../models/Skill.js";

// @desc    Get all skills
// @route   GET /api/skills
// @access  Public
export const getSkills = async (req, res) => {
  try {
    const { category } = req.query;

    let filter = {};
    if (category) filter.category = category;

    const skills = await Skill.find(filter).sort({ order: 1, createdAt: -1 });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single skill
// @route   GET /api/skills/:id
// @access  Public
export const getSkillById = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (skill) {
      res.json(skill);
    } else {
      res.status(404).json({ message: "Skill not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a skill
// @route   POST /api/skills
// @access  Private/Admin
export const createSkill = async (req, res) => {
  try {
    const skill = new Skill({
      name: req.body.name,
      category: req.body.category,
      level: req.body.level,
      icon: req.body.icon || "",
      color: req.body.color || "#3B82F6",
      description: req.body.description || "",
    });

    const createdSkill = await skill.save();
    res.status(201).json(createdSkill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a skill
// @route   PUT /api/skills/:id
// @access  Private/Admin
export const updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (skill) {
      skill.name = req.body.name || skill.name;
      skill.category = req.body.category || skill.category;
      skill.level = req.body.level !== undefined ? req.body.level : skill.level;
      skill.icon = req.body.icon || skill.icon;
      skill.color = req.body.color || skill.color;
      skill.description = req.body.description || skill.description;

      const updatedSkill = await skill.save();
      res.json(updatedSkill);
    } else {
      res.status(404).json({ message: "Skill not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a skill
// @route   DELETE /api/skills/:id
// @access  Private/Admin
export const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (skill) {
      await skill.deleteOne();
      res.json({ message: "Skill removed" });
    } else {
      res.status(404).json({ message: "Skill not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reorder skills
// @route   POST /api/skills/reorder
// @access  Private/Admin
export const reorderSkills = async (req, res) => {
  try {
    const { skills } = req.body; // Array of { id, order }

    const updatePromises = skills.map((item) =>
      Skill.findByIdAndUpdate(item.id, { order: item.order })
    );

    await Promise.all(updatePromises);

    res.json({ message: "Skills reordered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
