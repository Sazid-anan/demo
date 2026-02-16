import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Lightbulb, Upload } from "lucide-react";
import {
  saveTeamMember,
  deleteTeamMember,
} from "../../redux/slices/contentSlice";
import { uploadImage } from "../../services/storage";
import Button from "../../components/ui/Button";

/**
 * Edit Team Members Tab
 * Allows admin to manage leadership team members
 */
export default function EditTeamTab() {
  const dispatch = useDispatch();
  const { teamMembers } = useSelector((state) => state.content);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    image: "",
    bio: "",
    displayOrder: 0,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [saveError, setSaveError] = useState("");

  const handleEdit = (member) => {
    setEditingId(member.id);
    setFormData({
      name: member.name || "",
      role: member.role || "",
      image: member.image || "",
      bio: member.bio || "",
      displayOrder: member.display_order || 0,
    });
    setImagePreview(member.image || "");
    setImageFile(null);
  };

  const handleNewMember = () => {
    setEditingId("NEW");
    setFormData({
      name: "",
      role: "",
      image: "",
      bio: "",
      displayOrder: teamMembers.length,
    });
    setImagePreview("");
    setImageFile(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ name: "", role: "", image: "", bio: "", displayOrder: 0 });
    setImagePreview("");
    setImageFile(null);
    setSaveSuccess(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.role.trim()) {
      alert("Please fill in name and role");
      return;
    }

    try {
      setSaveError("");
      let imageUrl = formData.image;

      // Upload new image if selected
      if (imageFile) {
        imageUrl = await uploadImage(imageFile, "team");
      }

      const payload = {
        ...(editingId && editingId !== "NEW" && { id: editingId }),
        name: formData.name.trim(),
        role: formData.role.trim(),
        bio: formData.bio.trim(),
        image: imageUrl,
        display_order: parseInt(formData.displayOrder) || 0,
      };

      await dispatch(saveTeamMember(payload)).unwrap();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      handleCancel();
    } catch (err) {
      console.error("Failed to save team member", err);
      setSaveError(err?.message || String(err));
    }
  };

  const handleDelete = async (id) => {
    try {
      setSaveError("");
      await dispatch(deleteTeamMember(id)).unwrap();
      setDeleteConfirm(null);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to delete team member", err);
      setSaveError(err?.message || String(err));
    }
  };

  const isEditing = editingId !== null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-4xl"
    >
      <div>
        <h2 className="text-xl font-bold text-brand-black mb-2">
          Leadership Team
        </h2>
        <p className="text-gray-600 text-sm">Manage team members</p>
      </div>

      {saveSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg"
        >
          ✓ Team member saved successfully!
        </motion.div>
      )}

      {saveError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg"
        >
          ❌ {saveError}
        </motion.div>
      )}

      {/* Team Members List */}
      {!isEditing && (
        <div className="space-y-4">
          <Button onClick={handleNewMember} size="lg" className="w-full">
            + Add New Team Member
          </Button>

          {teamMembers.length === 0 ? (
            <div className="admin-section admin-section--soft p-8 text-center text-gray-600">
              No team members yet. Click "Add New Team Member" to get started.
            </div>
          ) : (
            <div className="grid gap-4">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="admin-card-lite flex gap-4 p-4 hover:shadow-lg transition-all"
                >
                  {member.image && (
                    <div className="w-20 h-20 rounded overflow-hidden flex-shrink-0">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-grow min-w-0">
                    <h3 className="font-bold text-brand-black">
                      {member.name}
                    </h3>
                    <p className="text-brand-orange font-semibold text-sm">
                      {member.role}
                    </p>
                    {member.bio && (
                      <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                        {member.bio}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Order: {member.display_order || 0}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEdit(member)}
                      className="px-4 py-2 bg-brand-orange text-brand-black rounded font-semibold hover:shadow-lg transition-all"
                    >
                      Edit
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setDeleteConfirm(member.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded font-semibold hover:shadow-lg transition-all"
                    >
                      Delete
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Edit Form */}
      {isEditing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="admin-section space-y-6 p-6"
        >
          <h3 className="font-bold text-lg text-brand-black">
            {editingId ? "Edit Team Member" : "Add New Team Member"}
          </h3>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-brand-black mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition-all duration-300 shadow-sm hover:shadow-md orange-pop-hover"
              placeholder="John Doe"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-brand-black mb-2">
              Job Title *
            </label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition-all duration-300 shadow-sm hover:shadow-md orange-pop-hover"
              placeholder="Chief Technology Officer"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-brand-black mb-2">
              Bio / Description
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              rows="3"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition-all duration-300 shadow-sm hover:shadow-md resize-none orange-pop-hover"
              placeholder="Brief bio or description..."
            ></textarea>
          </div>

          {/* Display Order */}
          <div>
            <label className="block text-sm font-medium text-brand-black mb-2">
              Display Order
            </label>
            <input
              type="number"
              value={formData.displayOrder}
              onChange={(e) =>
                setFormData({ ...formData, displayOrder: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition-all duration-300 shadow-sm hover:shadow-md orange-pop-hover"
              placeholder="0"
              min="0"
            />
          </div>

          {/* Image */}
          <div className="admin-card-lite p-4">
            <h4 className="font-bold text-brand-black mb-4">Profile Image</h4>
            {imagePreview && (
              <div className="mb-4">
                <div className="w-40 h-40 rounded overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-brand-black mb-2">
                  Or upload file
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    id="team-file-input"
                  />
                  <label
                    htmlFor="team-file-input"
                    className="block w-full px-4 py-3 border-2 border-dashed border-brand-orange rounded-lg text-center cursor-pointer hover:bg-brand-orange/5 transition-colors"
                  >
                    <span className="text-brand-orange font-medium inline-flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Choose file
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      or drag and drop
                    </p>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button onClick={handleSave} size="lg" className="flex-grow">
              Save Member
            </Button>
            <button
              onClick={handleCancel}
              className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <motion.div className="bg-white p-6 rounded-lg shadow-xl max-w-sm">
            <h3 className="font-bold text-lg text-brand-black mb-4">
              Delete Team Member?
            </h3>
            <p className="text-gray-600 mb-6">This action cannot be undone.</p>
            <div className="flex gap-4">
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-grow px-4 py-2 bg-red-500 text-white rounded font-semibold hover:bg-red-600"
              >
                Confirm Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-grow px-4 py-2 border border-gray-300 rounded font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Info Box */}
      <div className="admin-section admin-section--soft p-6">
        <h3 className="font-bold text-brand-black mb-2 inline-flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-brand-orange" />
          Tips
        </h3>
        <ul className="text-gray-600 text-sm space-y-1">
          <li>
            • Images should be square (e.g., 300x300px) for best appearance
          </li>
          <li>• Use display order to control team member position page</li>
          <li>• Members are displayed in order (0, 1, 2, etc.)</li>
        </ul>
      </div>
    </motion.div>
  );
}
