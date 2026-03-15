import { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  Image as ImageIcon,
  Upload,
  Trash2,
  Download,
  Filter,
  Search,
} from "lucide-react";
import Button from "../../components/ui/Button";
import { addAuditLog } from "../../redux/slices/auditSlice";

export default function MediaLibraryTab() {
  const dispatch = useDispatch();
  const { adminEmail, adminRole } = useSelector((state) => state.auth);
  const canEdit = adminRole === "admin" || adminRole === "editor";

  const [media, setMedia] = useState(() => {
    const saved = localStorage.getItem("mediaLibrary");
    if (saved) {
      // Backfill old seeded URLs that no longer exist on production.
      return JSON.parse(saved).map((item) => {
        if (item?.url === "/hero-image.jpg") {
          return { ...item, url: "/admin/logo.webp", name: "logo.webp" };
        }
        return item;
      });
    }

    return [
      {
        id: 1,
        name: "logo-optimized.png",
        url: "/admin/logo-optimized.png",
        size: "45 KB",
        category: "branding",
        uploadedAt: "2026-02-20",
        altText: "Danvion Logo",
      },
      {
        id: 2,
        name: "logo.webp",
        url: "/admin/logo.webp",
        size: "320 KB",
        category: "hero",
        uploadedAt: "2026-02-18",
        altText: "Hero section background",
      },
    ];
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [newImage, setNewImage] = useState(null);
  const [newImageName, setNewImageName] = useState("");
  const [newImageCategory, setNewImageCategory] = useState("general");
  const [newImageAlt, setNewImageAlt] = useState("");

  const categories = useMemo(() => {
    const unique = new Set(media.map((m) => m.category));
    return ["all", ...Array.from(unique).sort()];
  }, [media]);

  const filteredMedia = useMemo(() => {
    return media.filter((item) => {
      const matchCategory =
        filterCategory === "all" || item.category === filterCategory;
      const matchSearch =
        searchTerm === "" ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [media, filterCategory, searchTerm]);

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewImage(event.target?.result);
        setNewImageName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!newImage || !newImageName) return;

    try {
      const newMedia = {
        id: Date.now(),
        name: newImageName,
        url: newImage,
        size: "Auto",
        category: newImageCategory,
        uploadedAt: new Date().toISOString().split("T")[0],
        altText: newImageAlt || newImageName,
      };

      const updated = [...media, newMedia];
      setMedia(updated);
      localStorage.setItem("mediaLibrary", JSON.stringify(updated));

      dispatch(
        addAuditLog({
          adminEmail,
          adminRole,
          action: "create",
          section: "media",
          itemId: newMedia.id,
          itemName: newImageName,
          description: "Uploaded media file",
          status: "success",
        }),
      );

      setNewImage(null);
      setNewImageName("");
      setNewImageCategory("general");
      setNewImageAlt("");
    } catch (error) {
      dispatch(
        addAuditLog({
          adminEmail,
          adminRole,
          action: "create",
          section: "media",
          itemName: newImageName,
          status: "error",
          errorMessage: error.message,
        }),
      );
    }
  };

  const handleDelete = (id) => {
    if (!canEdit || !window.confirm("Delete this image?")) return;

    const item = media.find((m) => m.id === id);
    const updated = media.filter((m) => m.id !== id);
    setMedia(updated);
    localStorage.setItem("mediaLibrary", JSON.stringify(updated));

    dispatch(
      addAuditLog({
        adminEmail,
        adminRole,
        action: "delete",
        section: "media",
        itemId: id,
        itemName: item.name,
        description: "Deleted media file",
        status: "success",
      }),
    );
  };

  const handleDownload = (url, name) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    link.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <ImageIcon className="h-6 w-6 text-brand-orange" />
          <h2 className="text-h3 font-bold text-brand-black">Media Library</h2>
        </div>
        <p className="text-gray-600">
          Manage all images and assets for your website
        </p>
      </div>

      {/* Upload Section */}
      {canEdit && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-linear-to-br from-orange-50 to-white border-2 border-brand-orange rounded-2xl p-6 space-y-4"
        >
          <h3 className="text-h4 font-bold text-brand-black">
            Upload New Image
          </h3>

          <div className="space-y-4">
            {/* File Input */}
            <div>
              <label className="block text-sm font-semibold text-brand-black mb-2">
                Select Image
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-brand-orange focus:outline-none"
                />
                {newImage && (
                  <img
                    src={newImage}
                    alt="Preview"
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                )}
              </div>
            </div>

            {newImage && (
              <>
                {/* Image Name */}
                <div>
                  <label className="block text-sm font-semibold text-brand-black mb-2">
                    File Name
                  </label>
                  <input
                    type="text"
                    value={newImageName}
                    onChange={(e) => setNewImageName(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-brand-orange focus:outline-none"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-brand-black mb-2">
                    Category
                  </label>
                  <select
                    value={newImageCategory}
                    onChange={(e) => setNewImageCategory(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-brand-orange focus:outline-none"
                  >
                    <option value="general">General</option>
                    <option value="branding">Branding</option>
                    <option value="hero">Hero</option>
                    <option value="products">Products</option>
                    <option value="blog">Blog</option>
                    <option value="team">Team</option>
                  </select>
                </div>

                {/* Alt Text */}
                <div>
                  <label className="block text-sm font-semibold text-brand-black mb-2">
                    Alt Text (for accessibility)
                  </label>
                  <input
                    type="text"
                    value={newImageAlt}
                    onChange={(e) => setNewImageAlt(e.target.value)}
                    placeholder="Describe the image"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-brand-orange focus:outline-none"
                  />
                </div>

                {/* Upload Button */}
                <Button
                  onClick={handleUpload}
                  size="lg"
                  variant="default"
                  className="w-full"
                >
                  <Upload className="h-4 w-4" />
                  Upload Image
                </Button>
              </>
            )}
          </div>
        </motion.div>
      )}

      {/* Search & Filter */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row gap-3"
      >
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search images..."
            className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-brand-orange focus:outline-none"
          />
        </div>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-brand-orange focus:outline-none"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "all" ? "All Categories" : cat}
            </option>
          ))}
        </select>
      </motion.div>

      {/* Media Grid */}
      {filteredMedia.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 bg-gray-50 rounded-2xl"
        >
          <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">No images found</p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filteredMedia.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition"
            >
              {/* Image */}
              <div className="relative h-40 bg-gray-100 overflow-hidden">
                <img
                  src={item.url}
                  alt={item.altText}
                  className="w-full h-full object-cover hover:scale-105 transition"
                />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition flex items-center justify-center gap-2 opacity-0 hover:opacity-100">
                  <Button
                    onClick={() => handleDownload(item.url, item.name)}
                    size="icon"
                    variant="outline"
                    title="Download"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  {canEdit && (
                    <Button
                      onClick={() => handleDelete(item.id)}
                      size="icon"
                      variant="destructive"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <p
                  className="font-semibold text-sm text-brand-black truncate"
                  title={item.name}
                >
                  {item.name}
                </p>
                <p className="text-xs text-gray-500 mt-1">{item.size}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full capitalize">
                    {item.category}
                  </span>
                  <p className="text-xs text-gray-500">{item.uploadedAt}</p>
                </div>
                <p className="text-xs text-gray-600 mt-2 line-clamp-1">
                  {item.altText}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Summary */}
      <div className="text-sm text-gray-600 text-center">
        <p>
          Showing <strong>{filteredMedia.length}</strong> of{" "}
          <strong>{media.length}</strong> images
        </p>
      </div>
    </motion.div>
  );
}
