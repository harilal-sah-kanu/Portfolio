import { useState, useEffect } from "react";
import { FiPlus, FiEdit, FiTrash, FiMapPin, FiCalendar } from "react-icons/fi";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../../utils/api";
import Modal from "../../components/Modal";
import ExperienceForm from "../../components/ExperienceForm";
import ConfirmDialog from "../../components/ConfirmDialog";

const Experiences = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [experienceToDelete, setExperienceToDelete] = useState(null);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const { data } = await api.get("/experiences");
      setExperiences(data);
    } catch (error) {
      toast.error("Failed to load experiences");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setExperienceToDelete(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/experiences/${experienceToDelete}`);
      toast.success("Experience deleted successfully");
      fetchExperiences();
    } catch (error) {
      toast.error("Failed to delete experience");
    } finally {
      setShowConfirm(false);
      setExperienceToDelete(null);
    }
  };

  const openCreateModal = () => {
    setSelectedExperience(null);
    setIsModalOpen(true);
  };

  const openEditModal = (experience) => {
    setSelectedExperience(experience);
    setIsModalOpen(true);
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    setSelectedExperience(null);
    fetchExperiences();
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display mb-2">
            Work Experience
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your professional timeline
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="btn-primary flex items-center gap-2"
        >
          <FiPlus /> Add Experience
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-6 bg-gray-300 dark:bg-dark-700 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-300 dark:bg-dark-700 rounded w-full mb-2"></div>
            </div>
          ))}
        </div>
      ) : experiences.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No experiences yet. Add your first one!
          </p>
          <button
            onClick={openCreateModal}
            className="btn-primary inline-flex items-center gap-2"
          >
            <FiPlus /> Add Experience
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {experiences.map((exp) => (
            <motion.div
              key={exp._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-4 flex-1">
                  {exp.companyLogo && (
                    <img
                      src={exp.companyLogo}
                      alt={exp.company}
                      className="h-12 w-12 object-contain rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">{exp.position}</h3>
                    <p className="text-primary-600 dark:text-primary-400 font-semibold mb-2">
                      {exp.company}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <div className="flex items-center gap-1">
                        <FiCalendar size={14} />
                        {formatDate(exp.startDate)} -{" "}
                        {exp.current ? "Present" : formatDate(exp.endDate)}
                      </div>
                      {exp.location && (
                        <div className="flex items-center gap-1">
                          <FiMapPin size={14} />
                          {exp.location}
                        </div>
                      )}
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {exp.description}
                    </p>

                    {exp.technologies && exp.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 text-xs rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => openEditModal(exp)}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <FiEdit size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(exp._id)}
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
          setSelectedExperience(null);
        }}
        title={selectedExperience ? "Edit Experience" : "Add New Experience"}
      >
        <ExperienceForm
          experience={selectedExperience}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedExperience(null);
          }}
        />
      </Modal>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => {
          setShowConfirm(false);
          setExperienceToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Timeline Entry"
        message="Are you sure you want to delete this timeline entry? This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
};

export default Experiences;
