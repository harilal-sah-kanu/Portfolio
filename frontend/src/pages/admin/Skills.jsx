import { useState, useEffect } from "react";
import { FiPlus, FiEdit, FiTrash } from "react-icons/fi";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../../utils/api";
import Modal from "../../components/Modal";
import SkillForm from "../../components/SkillForm";
import ConfirmDialog from "../../components/ConfirmDialog";

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState(null);

  const categories = [
    "all",
    "frontend",
    "backend",
    "database",
    "devops",
    "tools",
    "other",
  ];

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const { data } = await api.get("/skills");
      setSkills(data);
    } catch (error) {
      toast.error("Failed to load skills");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setSkillToDelete(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/skills/${skillToDelete}`);
      toast.success("Skill deleted successfully");
      fetchSkills();
    } catch (error) {
      toast.error("Failed to delete skill");
    } finally {
      setShowConfirm(false);
      setSkillToDelete(null);
    }
  };

  const handleEdit = (skill) => {
    setSelectedSkill(skill);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedSkill(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSkill(null);
  };

  const filteredSkills =
    filter === "all"
      ? skills
      : skills.filter((skill) => skill.category === filter);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display mb-2">
            Manage Skills
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Add and organize your technical skills
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="btn-primary flex items-center gap-2"
        >
          <FiPlus /> Add Skill
        </button>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              filter === cat
                ? "bg-primary-600 text-white"
                : "bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600"
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="card p-4 animate-pulse">
              <div className="flex justify-between items-start mb-3">
                <div className="h-6 bg-gray-300 dark:bg-dark-700 rounded w-24"></div>
                <div className="h-6 bg-gray-300 dark:bg-dark-700 rounded w-12"></div>
              </div>
              <div className="h-2 bg-gray-300 dark:bg-dark-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 dark:bg-dark-700 rounded w-16"></div>
            </div>
          ))}
        </div>
      ) : filteredSkills.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {filter === "all"
              ? "No skills yet. Add your first skill!"
              : `No skills in ${filter} category.`}
          </p>
          <button className="btn-primary inline-flex items-center gap-2">
            <FiPlus /> Add Skill
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map((skill) => (
            <motion.div
              key={skill._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  {skill.icon && (
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: skill.color + "20" }}
                    >
                      <span style={{ color: skill.color }} className="text-xl">
                        {skill.icon}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold font-display">{skill.name}</h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {skill.category}
                    </span>
                  </div>
                </div>
                <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs rounded font-medium">
                  {skill.level}%
                </span>
              </div>

              <div className="mb-3">
                <div className="h-2 bg-gray-200 dark:bg-dark-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${skill.level}%`,
                      backgroundColor: skill.color,
                    }}
                  ></div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(skill)}
                  className="flex-1 btn-secondary flex items-center justify-center gap-2 text-sm"
                >
                  <FiEdit size={14} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(skill._id)}
                  className="px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                  <FiTrash size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedSkill ? "Edit Skill" : "Add New Skill"}
      >
        <SkillForm
          skill={selectedSkill}
          onClose={handleCloseModal}
          onSuccess={fetchSkills}
        />
      </Modal>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => {
          setShowConfirm(false);
          setSkillToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Skill"
        message="Are you sure you want to delete this skill? This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
};

export default Skills;
