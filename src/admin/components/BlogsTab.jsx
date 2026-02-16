import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { saveBlog, deleteBlog } from "../../redux/slices/contentSlice";
import { uploadImage } from "../../services/storage";
import { renderMarkdown } from "../../utils/markdown";

/**
 * Blogs Tab
 * Allows admin to manage blog posts
 */
export default function BlogsTab() {
  const dispatch = useDispatch();
  const { blogs } = useSelector((state) => state.content);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    featured_image: "",
    author: "",
    category: "",
    published_date: new Date().toISOString().split("T")[0],
    read_time: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // Get unique categories from blogs
  const categories = Array.from(
    new Set((blogs || []).map((b) => b.category).filter((c) => c)),
  ).sort();

  const filteredBlogs = useMemo(() => {
    const safeBlogs = blogs || [];
    const query = searchQuery.trim().toLowerCase();

    let filtered = safeBlogs;

    // Filter by category
    if (categoryFilter) {
      filtered = filtered.filter((b) => b.category === categoryFilter);
    }

    // Filter by search query
    if (query) {
      filtered = filtered.filter((blog) => {
        const title = String(blog.title || "").toLowerCase();
        const excerpt = String(blog.excerpt || "").toLowerCase();
        const author = String(blog.author || "").toLowerCase();
        return (
          title.includes(query) ||
          excerpt.includes(query) ||
          author.includes(query)
        );
      });
    }

    return filtered;
  }, [searchQuery, categoryFilter, blogs]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddBlog = async () => {
    try {
      setErrorMessage("");
      if (!formData.title || !formData.content) {
        setErrorMessage("Please fill in required fields (Title and Content)");
        return;
      }

      let url =
        formData.featured_image && formData.featured_image.trim()
          ? formData.featured_image.trim()
          : null;
      if (!url && imageFile) {
        url = await uploadImage(imageFile, "blogs");
      }

      const newBlog = {
        id: editingId || Math.random(),
        ...formData,
        featured_image: url,
      };

      await dispatch(saveBlog(newBlog)).unwrap();
      setFormData({
        title: "",
        excerpt: "",
        content: "",
        featured_image: "",
        author: "",
        category: "",
        published_date: new Date().toISOString().split("T")[0],
        read_time: "",
      });
      setImageFile(null);
      setImagePreview("");
      setShowForm(false);
      setEditingId(null);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save blog", err);
      setErrorMessage("Failed to save blog: " + (err.message || err));
    }
  };

  const handleEditBlog = (blog) => {
    setFormData({
      title: blog.title || "",
      excerpt: blog.excerpt || "",
      content: blog.content || "",
      featured_image: blog.featured_image || "",
      author: blog.author || "",
      category: blog.category || "",
      published_date:
        blog.published_date || new Date().toISOString().split("T")[0],
      read_time: blog.read_time || "",
    });
    setImagePreview(blog.featured_image || "");
    setImageFile(null);
    setEditingId(blog.id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setErrorMessage("");
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      featured_image: "",
      author: "",
      category: "",
      published_date: new Date().toISOString().split("T")[0],
      read_time: "",
    });
    setImageFile(null);
    setImagePreview("");
  };

  const handleDeleteBlog = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this blog post permanently?",
      )
    ) {
      return;
    }
    try {
      await dispatch(deleteBlog(id)).unwrap();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to delete blog", err);
      setErrorMessage("Failed to delete blog: " + (err.message || err));
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-xl font-bold text-brand-black">
            Manage Blog Posts
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Add, edit, or remove blog posts
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-brand-orange hover:bg-brand-orange/90 text-brand-black font-semibold rounded-xl border-2 border-brand-orange transition-all shadow-lg"
        >
          {showForm ? "✕ Cancel" : "+ Add New Blog Post"}
        </motion.button>
      </div>

      {saveSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 font-semibold"
        >
          ✓ Blog post saved successfully!
        </motion.div>
      )}

      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800"
        >
          {errorMessage}
        </motion.div>
      )}

      {/* Blog Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-8 p-6 bg-white border-2 border-brand-orange rounded-2xl shadow-xl"
        >
          <h3 className="text-lg font-bold text-brand-black mb-6">
            {editingId ? "Edit Blog Post" : "Add New Blog Post"}
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-brand-black mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-brand-orange focus:outline-none transition-colors"
                placeholder="Enter blog title"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-brand-black mb-2">
                Author
              </label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-brand-orange focus:outline-none transition-colors"
                placeholder="Author name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-brand-black mb-2">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-brand-orange focus:outline-none transition-colors"
                placeholder="e.g., Edge AI, Technology, Innovation"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-brand-black mb-2">
                Published Date
              </label>
              <input
                type="date"
                name="published_date"
                value={formData.published_date}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-brand-orange focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-brand-black mb-2">
                Read Time (minutes)
              </label>
              <input
                type="number"
                name="read_time"
                value={formData.read_time}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-brand-orange focus:outline-none transition-colors"
                placeholder="5"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-brand-black mb-2">
                Featured Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-brand-orange focus:outline-none transition-colors"
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mt-2 h-32 w-auto rounded-lg object-cover"
                />
              )}
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-semibold text-brand-black mb-2">
              Excerpt
            </label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-brand-orange focus:outline-none transition-colors"
              placeholder="Brief description or excerpt (shown in blog list)"
            />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-semibold text-brand-black mb-2">
              Content * (Markdown supported)
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="10"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-brand-orange focus:outline-none transition-colors font-mono text-sm"
              placeholder="Use Markdown for formatting..."
            />
          </div>

          {formData.content && (
            <div className="mt-6">
              <label className="block text-sm font-semibold text-brand-black mb-2">
                Preview
              </label>
              <div
                className="prose prose-sm max-w-none p-4 bg-gray-50 rounded-xl border border-gray-200 markdown-content"
                dangerouslySetInnerHTML={{
                  __html: renderMarkdown(formData.content),
                }}
              />
            </div>
          )}

          <div className="flex gap-4 mt-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddBlog}
              className="px-6 py-3 bg-brand-orange hover:bg-brand-orange/90 text-brand-black font-semibold rounded-xl transition-all shadow-lg"
            >
              {editingId ? "Update Blog Post" : "Save Blog Post"}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCancel}
              className="px-6 py-3 bg-white hover:bg-gray-50 text-brand-black font-semibold rounded-xl border-2 border-gray-200 transition-all"
            >
              Cancel
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search blog posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-brand-orange focus:outline-none transition-colors"
        />
        {categories.length > 0 && (
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-brand-orange focus:outline-none transition-colors"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Blog List */}
      <div className="space-y-4">
        {filteredBlogs.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No blog posts yet. Click "Add New Blog Post" to get started!
          </p>
        ) : (
          filteredBlogs.map((blog) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-brand-orange transition-all"
            >
              <div className="flex flex-col md:flex-row gap-4">
                {blog.featured_image && (
                  <img
                    src={blog.featured_image}
                    alt={blog.title}
                    className="w-full md:w-32 h-32 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-brand-black mb-2">
                        {blog.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {blog.excerpt || "No excerpt"}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                        {blog.author && <span>✍️ {blog.author}</span>}
                        {blog.category && (
                          <span className="px-2 py-1 bg-gray-100 rounded">
                            {blog.category}
                          </span>
                        )}
                        {blog.published_date && (
                          <span>📅 {blog.published_date}</span>
                        )}
                        {blog.read_time && <span>⏱️ {blog.read_time} min</span>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEditBlog(blog)}
                        className="px-4 py-2 bg-white hover:bg-gray-50 text-brand-orange font-semibold rounded-lg border-2 border-brand-orange transition-all text-sm"
                      >
                        Edit
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDeleteBlog(blog.id)}
                        className="px-4 py-2 bg-white hover:bg-red-50 text-red-600 font-semibold rounded-lg border-2 border-red-200 hover:border-red-400 transition-all text-sm"
                      >
                        Delete
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
