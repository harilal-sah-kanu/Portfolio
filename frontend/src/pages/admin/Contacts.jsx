import { useState, useEffect } from "react";
import { FiMail, FiTrash, FiCheck, FiClock, FiArchive } from "react-icons/fi";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../../utils/api";
import ConfirmDialog from "../../components/ConfirmDialog";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showConfirm, setShowConfirm] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);

  const statusOptions = ["all", "new", "read", "replied", "archived"];

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const { data } = await api.get("/contacts");
      setContacts(data);
    } catch (error) {
      toast.error("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setContactToDelete(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/contacts/${contactToDelete}`);
      toast.success("Message deleted successfully");
      fetchContacts();
    } catch (error) {
      toast.error("Failed to delete message");
    } finally {
      setShowConfirm(false);
      setContactToDelete(null);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/contacts/${id}`, { status: newStatus });
      toast.success("Status updated");
      fetchContacts();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const filteredContacts =
    filter === "all"
      ? contacts
      : contacts.filter((contact) => contact.status === filter);

  const getStatusColor = (status) => {
    const colors = {
      new: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
      read: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300",
      replied:
        "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
      archived: "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300",
    };
    return colors[status] || colors.new;
  };

  const getStatusIcon = (status) => {
    const icons = {
      new: <FiMail size={14} />,
      read: <FiClock size={14} />,
      replied: <FiCheck size={14} />,
      archived: <FiArchive size={14} />,
    };
    return icons[status] || icons.new;
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display mb-2">
          Contact Messages
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage inquiries and messages from visitors
        </p>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto">
        {statusOptions.map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              filter === status
                ? "bg-primary-600 text-white"
                : "bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            <span className="ml-2 text-sm">
              (
              {status === "all"
                ? contacts.length
                : contacts.filter((c) => c.status === status).length}
              )
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-6 bg-gray-300 dark:bg-dark-700 rounded w-1/2 mb-3"></div>
              <div className="h-4 bg-gray-300 dark:bg-dark-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-300 dark:bg-dark-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            {filter === "all"
              ? "No contact messages yet."
              : `No ${filter} messages.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredContacts.map((contact) => (
            <motion.div
              key={contact._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold font-display">
                      {contact.name}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 ${getStatusColor(
                        contact.status
                      )}`}
                    >
                      {getStatusIcon(contact.status)}
                      {contact.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <a
                      href={`mailto:${contact.email}`}
                      className="hover:text-primary-600 transition-colors"
                    >
                      {contact.email}
                    </a>
                    {contact.phone && <span>{contact.phone}</span>}
                    <span className="text-xs">
                      {new Date(contact.createdAt).toLocaleDateString()} at{" "}
                      {new Date(contact.createdAt).toLocaleTimeString()}
                    </span>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-dark-700 p-4 rounded-lg">
                    {contact.message}
                  </p>
                </div>

                <div className="flex gap-2 ml-4">
                  <select
                    value={contact.status}
                    onChange={(e) =>
                      handleStatusChange(contact._id, e.target.value)
                    }
                    className="px-3 py-2 rounded-lg bg-white dark:bg-dark-700 border border-gray-300 dark:border-dark-600 text-sm"
                  >
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                    <option value="archived">Archived</option>
                  </select>
                  <button
                    onClick={() => handleDelete(contact._id)}
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

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => {
          setShowConfirm(false);
          setContactToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Message"
        message="Are you sure you want to delete this contact message? This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
};

export default Contacts;
