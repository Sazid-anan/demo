import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Camera } from "lucide-react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { db } from "../../services/firebaseClient";
import { uploadImage } from "../../services/storage";
import Button from "../../components/ui/Button";

/**
 * Testimonials Tab
 * Admin interface for managing customer testimonials
 */
export default function TestimonialsTab() {
  const [testimonials, setTestimonials] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [lastDeleted, setLastDeleted] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    company: "",
    content: "",
    image_url: "",
    rating: 5,
  });

  const loadTestimonials = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const snap = await getDocs(
        query(collection(db, "testimonials"), orderBy("created_at", "desc")),
      );
      const data = snap.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setTestimonials(data);
    } catch (err) {
      setError(err?.message || "Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTestimonials();
  }, [loadTestimonials]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rating" ? parseInt(value) : value,
    }));
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

  const handleAddTestimonial = async () => {
    try {
      setError("");
      if (!formData.name || !formData.content) {
        setError("Please fill in Name and Testimonial");
        return;
      }

      let image_url = formData.image_url;
      if (imageFile) {
        image_url = await uploadImage(imageFile, "testimonials");
      }

      const data = {
        ...formData,
        image_url,
      };

      if (editingId) {
        await setDoc(doc(db, "testimonials", editingId), data, {
          merge: true,
        });
      } else {
        data.created_at = new Date().toISOString();
        await addDoc(collection(db, "testimonials"), data);
      }

      setFormData({
        name: "",
        role: "",
        company: "",
        content: "",
        image_url: "",
        rating: 5,
      });
      setImageFile(null);
      setImagePreview("");
      setShowForm(false);
      setEditingId(null);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      await loadTestimonials();
    } catch (err) {
      setError(err?.message || "Failed to save testimonial");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this testimonial?")) return;
    try {
      const deleted = testimonials.find((t) => t.id === id);
      await deleteDoc(doc(db, "testimonials", id));
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
      if (deleted) {
        setLastDeleted({ id, data: deleted });
      }
    } catch (err) {
      setError(err?.message || "Failed to delete testimonial");
    }
  };

  const handleUndo = async () => {
    if (!lastDeleted?.id || !lastDeleted?.data) return;
    try {
      const { id, data } = lastDeleted;
      await setDoc(doc(db, "testimonials", id), data);
      setLastDeleted(null);
      await loadTestimonials();
    } catch (err) {
      setError(err?.message || "Failed to restore testimonial");
    }
  };

  const handleEdit = (testimonial) => {
    setFormData({
      name: testimonial.name || "",
      role: testimonial.role || "",
      company: testimonial.company || "",
      content: testimonial.content || "",
      image_url: testimonial.image_url || "",
      rating: testimonial.rating || 5,
    });
    setImagePreview(testimonial.image_url || "");
    setImageFile(null);
    setEditingId(testimonial.id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      name: "",
      role: "",
      company: "",
      content: "",
      image_url: "",
      rating: 5,
    });
    setImageFile(null);
    setImagePreview("");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h2 className="text-xl font-bold text-brand-black mb-2">
            Testimonials
          </h2>
          <p className="text-gray-600 text-sm">
            Manage customer testimonials and reviews
          </p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} size="md">
            + Add Testimonial
          </Button>
        )}
      </div>

      {saveSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg"
        >
          ✓ Testimonial saved successfully!
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg"
        >
          ❌ {error}
        </motion.div>
      )}

      {lastDeleted && (
        <div className="admin-section admin-section--soft p-4 text-gray-700 border border-gray-200 flex flex-wrap items-center justify-between gap-3">
          <span>Testimonial deleted. You can undo this action.</span>
          <button
            type="button"
            onClick={handleUndo}
            className="px-4 py-2 text-sm bg-brand-orange text-brand-black rounded-lg hover:shadow-md transition-all"
          >
            Undo
          </button>
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="admin-section p-6 space-y-4"
        >
          <h3 className="font-bold text-brand-black mb-4">
            {editingId ? "Edit Testimonial" : "Add New Testimonial"}
          </h3>

          <div>
            <label className="block text-sm font-medium text-brand-black mb-2">
              Customer Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition-all"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-black mb-2">
                Role/Title
              </label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="CEO, Product Manager, etc."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-black mb-2">
                Company
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Company Name"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-black mb-2">
              Testimonial *
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="What did you love about working with us?"
              rows="4"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition-all resize-none"
            />
          </div>

          {/* Image Upload Section */}
          <div className="admin-card-lite p-4">
            <h4 className="font-bold text-brand-black mb-4">Profile Image</h4>
            {imagePreview && (
              <div className="mb-4">
                <div className="w-32 h-32 rounded overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-brand-black mb-2">
                Upload file
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  id="testimonial-file-input"
                />
                <label
                  htmlFor="testimonial-file-input"
                  className="block w-full px-4 py-3 border-2 border-dashed border-brand-orange rounded-lg text-center cursor-pointer hover:bg-brand-orange/5 transition-colors"
                >
                  <span className="text-brand-orange font-medium inline-flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    Choose file
                  </span>
                  <p className="text-xs text-gray-500 mt-1">or drag and drop</p>
                </label>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-black mb-2">
                Rating (1-5 stars)
              </label>
              <select
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition-all"
              >
                <option value="5">★★★★★ (5 stars)</option>
                <option value="4">★★★★☆ (4 stars)</option>
                <option value="3">★★★☆☆ (3 stars)</option>
                <option value="2">★★☆☆☆ (2 stars)</option>
                <option value="1">★☆☆☆☆ (1 star)</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button onClick={handleAddTestimonial} size="md">
              {editingId ? "Update Testimonial" : "Add Testimonial"}
            </Button>
            <button
              onClick={handleCancel}
              className="px-6 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* Testimonials List */}
      {loading ? (
        <div className="p-8 text-center text-gray-600">
          Loading testimonials...
        </div>
      ) : testimonials.length === 0 ? (
        <div className="admin-section admin-section--soft p-8 text-center text-gray-600">
          No testimonials yet. Add one to get started!
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="admin-section p-6 space-y-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h4 className="font-bold text-brand-black">
                    {testimonial.name}
                  </h4>
                  {testimonial.role && (
                    <p className="text-sm text-brand-orange">
                      {testimonial.role}
                      {testimonial.company && ` at ${testimonial.company}`}
                    </p>
                  )}
                  <div className="text-lg mt-1">
                    {"★".repeat(testimonial.rating || 5)}
                    {"☆".repeat(5 - (testimonial.rating || 5))}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(testimonial.id)}
                  className="text-red-600 hover:text-red-700 text-lg"
                  title="Delete"
                >
                  ✕
                </button>
              </div>

              <p className="text-gray-700 text-sm line-clamp-3">
                "{testimonial.content}"
              </p>

              <button
                onClick={() => handleEdit(testimonial)}
                className="text-sm text-brand-orange hover:text-brand-orange font-medium"
              >
                Edit
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
