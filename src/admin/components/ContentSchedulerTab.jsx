import { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Calendar, Plus, Edit2, Trash2, X, Save, Clock } from "lucide-react";
import Button from "../../components/ui/Button";
import { addAuditLog } from "../../redux/slices/auditSlice";

export default function ContentSchedulerTab() {
  const dispatch = useDispatch();
  const { adminEmail, adminRole } = useSelector((state) => state.auth);
  const canEdit = adminRole === "admin" || adminRole === "editor";

  const [schedules, setSchedules] = useState(() => {
    const saved = localStorage.getItem("contentSchedules");
    return saved ? JSON.parse(saved) : [];
  });

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    type: "blog",
    scheduledDate: "",
    scheduledTime: "",
    description: "",
    status: "draft",
  });

  const contentTypes = ["blog", "product", "announcement", "update"];
  const statuses = ["draft", "scheduled", "published"];

  const handleAddSchedule = () => {
    setEditingId(null);
    setFormData({
      title: "",
      type: "blog",
      scheduledDate: "",
      scheduledTime: "",
      description: "",
      status: "draft",
    });
    setShowForm(true);
  };

  const handleEditSchedule = (schedule) => {
    if (!canEdit) return;
    setEditingId(schedule.id);
    setFormData(schedule);
    setShowForm(true);
  };

  const handleSaveSchedule = () => {
    if (!formData.title.trim() || !formData.scheduledDate) {
      alert("Please fill in all required fields");
      return;
    }

    let updated;
    if (editingId) {
      updated = schedules.map((s) =>
        s.id === editingId
          ? { ...formData, id: editingId, updatedAt: new Date().toISOString() }
          : s,
      );
      dispatch(
        addAuditLog({
          adminEmail,
          adminRole,
          action: "update",
          section: "scheduler",
          itemId: editingId,
          itemName: formData.title,
          description: "Updated scheduled content",
          status: "success",
        }),
      );
    } else {
      const newSchedule = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      updated = [...schedules, newSchedule];
      dispatch(
        addAuditLog({
          adminEmail,
          adminRole,
          action: "create",
          section: "scheduler",
          itemId: newSchedule.id,
          itemName: formData.title,
          description: "Scheduled new content for publishing",
          status: "success",
        }),
      );
    }

    setSchedules(updated);
    localStorage.setItem("contentSchedules", JSON.stringify(updated));
    setShowForm(false);
  };

  const handleDeleteSchedule = (id) => {
    if (!canEdit || !window.confirm("Delete this schedule?")) return;

    const schedule = schedules.find((s) => s.id === id);
    const updated = schedules.filter((s) => s.id !== id);
    setSchedules(updated);
    localStorage.setItem("contentSchedules", JSON.stringify(updated));

    dispatch(
      addAuditLog({
        adminEmail,
        adminRole,
        action: "delete",
        section: "scheduler",
        itemId: id,
        itemName: schedule.title,
        description: "Deleted scheduled content",
        status: "success",
      }),
    );
  };

  const upcomingSchedules = useMemo(() => {
    return schedules
      .filter((s) => s.status !== "published")
      .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));
  }, [schedules]);

  const publishedSchedules = useMemo(() => {
    return schedules
      .filter((s) => s.status === "published")
      .sort((a, b) => new Date(b.scheduledDate) - new Date(a.scheduledDate));
  }, [schedules]);

  const getStatusColor = (status) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "blog":
        return "bg-purple-100 text-purple-700";
      case "product":
        return "bg-blue-100 text-blue-700";
      case "announcement":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="h-6 w-6 text-brand-orange" />
            <h2 className="text-h3 font-bold text-brand-black">Content Scheduler</h2>
          </div>
          <p className="text-gray-600">Schedule posts for future publishing</p>
        </div>
        {canEdit && (
          <Button onClick={handleAddSchedule} size="lg" variant="default">
            📅 Schedule Content
          </Button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-orange-50 to-white border-2 border-brand-orange rounded-2xl p-6 space-y-4"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-h4 font-bold text-brand-black">
              {editingId ? "Edit Schedule" : "New Schedule"}
            </h3>
            <button
              onClick={() => setShowForm(false)}
              className="p-2 hover:bg-gray-200 rounded-lg transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-brand-black mb-2">
                Content Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter title"
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-brand-orange focus:outline-none"
              />
            </div>

            {/* Type & Date */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-brand-black mb-2">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-brand-orange focus:outline-none"
                >
                  {contentTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-brand-black mb-2">
                  Schedule Date *
                </label>
                <input
                  type="date"
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-brand-orange focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-brand-black mb-2">Time</label>
                <input
                  type="time"
                  value={formData.scheduledTime}
                  onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-brand-orange focus:outline-none"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-brand-black mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-brand-orange focus:outline-none"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-brand-black mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Add notes or description..."
                rows="3"
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-brand-orange focus:outline-none"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button onClick={handleSaveSchedule} size="md" variant="default" className="flex-1">
                <Save className="h-4 w-4" />
                Save Schedule
              </Button>
              <Button
                onClick={() => setShowForm(false)}
                size="md"
                variant="outline"
                className="flex-1"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Upcoming Schedules */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h3 className="text-h4 font-bold text-brand-black mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-brand-orange" />
          Upcoming & Drafts ({upcomingSchedules.length})
        </h3>

        {upcomingSchedules.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-2xl">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">No upcoming schedules</p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingSchedules.map((schedule, index) => (
              <motion.div
                key={schedule.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-bold text-brand-black">{schedule.title}</h4>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-semibold ${getStatusColor(schedule.status)}`}
                      >
                        {schedule.status}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-semibold ${getTypeColor(schedule.type)}`}
                      >
                        {schedule.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      📅 {schedule.scheduledDate}
                      {schedule.scheduledTime && ` at ${schedule.scheduledTime}`}
                    </p>
                    {schedule.description && (
                      <p className="text-sm text-gray-500 mt-1">{schedule.description}</p>
                    )}
                  </div>
                  {canEdit && (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEditSchedule(schedule)}
                        size="sm"
                        variant="outline"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDeleteSchedule(schedule.id)}
                        size="sm"
                        variant="destructive"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Published History */}
      {publishedSchedules.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-h4 font-bold text-brand-black mb-4">
            Published ({publishedSchedules.length})
          </h3>

          <div className="space-y-3">
            {publishedSchedules.map((schedule, index) => (
              <motion.div
                key={schedule.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200 rounded-lg p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-bold text-brand-black">{schedule.title}</h4>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-semibold ${getTypeColor(schedule.type)}`}
                      >
                        {schedule.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">✓ Published on {schedule.scheduledDate}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
