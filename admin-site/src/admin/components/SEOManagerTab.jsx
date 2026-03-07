import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Search, Plus, Trash2, Edit2, Download, Save } from "lucide-react";
import Button from "../../components/ui/Button";
import { addAuditLog } from "../../redux/slices/auditSlice";

export default function SEOManagerTab() {
  const dispatch = useDispatch();
  const { adminEmail, adminRole } = useSelector((state) => state.auth);
  const canEdit = adminRole === "admin" || adminRole === "editor";

  const [seoData, setSeoData] = useState(() => {
    const saved = localStorage.getItem("seoManager");
    return saved
      ? JSON.parse(saved)
      : {
          globalMeta: {
            title: "DANVION - Digital Services",
            description: "Professional digital solutions and services",
            keywords: "digital, services, danvion",
          },
          pages: [
            {
              id: 1,
              path: "/",
              title: "Home - DANVION",
              description: "Welcome to DANVION",
              keywords: "home, danvion",
            },
            {
              id: 2,
              path: "/products",
              title: "Products - DANVION",
              description: "Our products and services",
              keywords: "products, services",
            },
          ],
          robotsTxt: `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /private\nSitemap: https://danvion.com/sitemap.xml`,
          sitemapSettings: {
            lastmod: new Date().toISOString().split("T")[0],
            changefreq: "weekly",
            priority: "0.8",
          },
        };
  });

  const [editingPageId, setEditingPageId] = useState(null);
  const [editPageData, setEditPageData] = useState(null);
  const [newPage, setNewPage] = useState(null);

  const handleSaveGlobalMeta = () => {
    localStorage.setItem("seoManager", JSON.stringify(seoData));
    dispatch(
      addAuditLog({
        adminEmail,
        adminRole,
        action: "update",
        section: "seo",
        itemName: "Global Meta Tags",
        description: "Updated global SEO meta tags",
        status: "success",
      }),
    );
  };

  const handleAddPage = () => {
    if (!newPage?.path) return;
    const page = {
      id: Date.now(),
      path: newPage.path,
      title: newPage.title || newPage.path,
      description: newPage.description || "",
      keywords: newPage.keywords || "",
    };
    setSeoData({
      ...seoData,
      pages: [...seoData.pages, page],
    });
    setNewPage(null);
    handleSaveGlobalMeta();
  };

  const handleUpdatePage = (id) => {
    setSeoData({
      ...seoData,
      pages: seoData.pages.map((p) => (p.id === id ? editPageData : p)),
    });
    setEditingPageId(null);
    handleSaveGlobalMeta();
  };

  const handleDeletePage = (id) => {
    if (window.confirm("Delete this page SEO configuration?")) {
      setSeoData({
        ...seoData,
        pages: seoData.pages.filter((p) => p.id !== id),
      });
      handleSaveGlobalMeta();
    }
  };

  const handleUpdateRobotsTxt = () => {
    localStorage.setItem("seoManager", JSON.stringify(seoData));
    dispatch(
      addAuditLog({
        adminEmail,
        adminRole,
        action: "update",
        section: "seo",
        itemName: "robots.txt",
        description: "Updated robots.txt configuration",
        status: "success",
      }),
    );
  };

  const generateSitemap = () => {
    const baseUrl = "https://danvion.com";
    const timestamp = new Date().toISOString().split("T")[0];

    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    seoData.pages.forEach((page) => {
      sitemap += `  <url>\n`;
      sitemap += `    <loc>${baseUrl}${page.path}</loc>\n`;
      sitemap += `    <lastmod>${timestamp}</lastmod>\n`;
      sitemap += `    <changefreq>${seoData.sitemapSettings.changefreq}</changefreq>\n`;
      sitemap += `    <priority>${seoData.sitemapSettings.priority}</priority>\n`;
      sitemap += `  </url>\n`;
    });

    sitemap += "</urlset>";
    return sitemap;
  };

  const downloadFile = (content, filename) => {
    const element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(content));
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Search className="h-6 w-6 text-brand-orange" />
          <h2 className="text-h3 font-bold text-brand-black">SEO Manager</h2>
        </div>
        <p className="text-gray-600">Manage meta tags, robots.txt, and sitemap</p>
      </div>

      {!canEdit && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 bg-blue-50 border-l-4 border-blue-400 text-blue-700 text-sm rounded-lg"
        >
          Only admin and editors can manage SEO settings.
        </motion.div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Global Meta Tags */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
            <h3 className="text-h4 font-bold text-brand-black mb-4">Global Meta Tags</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-brand-black mb-2">
                  Site Title
                </label>
                <input
                  type="text"
                  value={seoData.globalMeta.title}
                  onChange={(e) =>
                    setSeoData({
                      ...seoData,
                      globalMeta: { ...seoData.globalMeta, title: e.target.value },
                    })
                  }
                  disabled={!canEdit}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-black mb-2">
                  Meta Description
                </label>
                <textarea
                  value={seoData.globalMeta.description}
                  onChange={(e) =>
                    setSeoData({
                      ...seoData,
                      globalMeta: { ...seoData.globalMeta, description: e.target.value },
                    })
                  }
                  disabled={!canEdit}
                  rows="3"
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-black mb-2">Keywords</label>
                <input
                  type="text"
                  value={seoData.globalMeta.keywords}
                  onChange={(e) =>
                    setSeoData({
                      ...seoData,
                      globalMeta: { ...seoData.globalMeta, keywords: e.target.value },
                    })
                  }
                  disabled={!canEdit}
                  placeholder="Separated by commas"
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg disabled:bg-gray-50"
                />
              </div>

              {canEdit && (
                <Button
                  onClick={handleSaveGlobalMeta}
                  size="lg"
                  variant="default"
                  className="w-full"
                >
                  <Save className="h-4 w-4" />
                  Save Global Meta
                </Button>
              )}
            </div>
          </div>

          {/* Page-Specific Meta */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
            <h3 className="text-h4 font-bold text-brand-black mb-4">Page-Specific Meta Tags</h3>

            {/* Pages List */}
            <div className="space-y-3 mb-6">
              {seoData.pages.map((page) =>
                editingPageId === page.id ? (
                  <motion.div
                    key={page.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 border-2 border-brand-orange rounded-lg space-y-3 bg-orange-50"
                  >
                    <div>
                      <label className="block text-sm font-medium text-brand-black mb-1">
                        Path
                      </label>
                      <input
                        type="text"
                        value={editPageData.path}
                        onChange={(e) => setEditPageData({ ...editPageData, path: e.target.value })}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-brand-black mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={editPageData.title}
                        onChange={(e) =>
                          setEditPageData({ ...editPageData, title: e.target.value })
                        }
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-brand-black mb-1">
                        Description
                      </label>
                      <textarea
                        value={editPageData.description}
                        onChange={(e) =>
                          setEditPageData({ ...editPageData, description: e.target.value })
                        }
                        rows="2"
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-brand-black mb-1">
                        Keywords
                      </label>
                      <input
                        type="text"
                        value={editPageData.keywords}
                        onChange={(e) =>
                          setEditPageData({ ...editPageData, keywords: e.target.value })
                        }
                        placeholder="Separated by commas"
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg"
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleUpdatePage(page.id)}
                        size="md"
                        variant="default"
                        className="flex-1"
                      >
                        <Save className="h-4 w-4" />
                        Save
                      </Button>
                      <Button
                        onClick={() => setEditingPageId(null)}
                        size="md"
                        variant="outline"
                        className="flex-1"
                      >
                        <X className="h-4 w-4" />
                        Cancel
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={page.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 border-2 border-gray-200 rounded-lg flex items-start justify-between hover:border-brand-orange transition"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-brand-black">{page.path}</p>
                      <p className="text-sm text-gray-600">{page.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{page.description}</p>
                    </div>

                    {canEdit && (
                      <div className="flex gap-2 ml-4">
                        <Button
                          onClick={() => {
                            setEditingPageId(page.id);
                            setEditPageData(page);
                          }}
                          size="sm"
                          variant="outline"
                        >
                          <Edit2 className="h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDeletePage(page.id)}
                          size="sm"
                          variant="destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    )}
                  </motion.div>
                ),
              )}
            </div>

            {/* Add New Page */}
            {canEdit && !newPage && (
              <Button
                onClick={() => setNewPage({ path: "", title: "", description: "", keywords: "" })}
                size="lg"
                variant="default"
                className="w-full mb-4"
              >
                <Plus className="h-4 w-4" />
                Add Page Meta
              </Button>
            )}

            {newPage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 border-2 border-brand-orange rounded-lg space-y-3 bg-orange-50 mb-4"
              >
                <div>
                  <label className="block text-sm font-medium text-brand-black mb-1">
                    Page Path
                  </label>
                  <input
                    type="text"
                    placeholder="/page-name"
                    value={newPage.path}
                    onChange={(e) => setNewPage({ ...newPage, path: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-black mb-1">Title</label>
                  <input
                    type="text"
                    value={newPage.title}
                    onChange={(e) => setNewPage({ ...newPage, title: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-black mb-1">
                    Description
                  </label>
                  <textarea
                    value={newPage.description}
                    onChange={(e) => setNewPage({ ...newPage, description: e.target.value })}
                    rows="2"
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg"
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleAddPage} size="md" variant="default" className="flex-1">
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                  <Button
                    onClick={() => setNewPage(null)}
                    size="md"
                    variant="outline"
                    className="flex-1"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              </motion.div>
            )}
          </div>

          {/* robots.txt */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-h4 font-bold text-brand-black">robots.txt</h3>
              {canEdit && (
                <Button
                  onClick={() => downloadFile(seoData.robotsTxt, "robots.txt")}
                  size="md"
                  variant="outline"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              )}
            </div>

            <textarea
              value={seoData.robotsTxt}
              onChange={(e) => setSeoData({ ...seoData, robotsTxt: e.target.value })}
              disabled={!canEdit}
              rows="8"
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg font-mono text-sm disabled:bg-gray-50"
            />

            {canEdit && (
              <Button
                onClick={handleUpdateRobotsTxt}
                size="lg"
                variant="default"
                className="w-full mt-4"
              >
                <Save className="h-4 w-4" />
                Save robots.txt
              </Button>
            )}
          </div>

          {/* Sitemap Settings */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-h4 font-bold text-brand-black">Sitemap Settings</h3>
              <Button
                onClick={() => downloadFile(generateSitemap(), "sitemap.xml")}
                size="md"
                variant="outline"
              >
                <Download className="h-4 w-4" />
                Download XML
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-black mb-2">
                  Change Frequency
                </label>
                <select
                  value={seoData.sitemapSettings.changefreq}
                  onChange={(e) =>
                    setSeoData({
                      ...seoData,
                      sitemapSettings: { ...seoData.sitemapSettings, changefreq: e.target.value },
                    })
                  }
                  disabled={!canEdit}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg disabled:bg-gray-50"
                >
                  <option>always</option>
                  <option>hourly</option>
                  <option>daily</option>
                  <option>weekly</option>
                  <option>monthly</option>
                  <option>yearly</option>
                  <option>never</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-black mb-2">
                  Priority (0-1)
                </label>
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  value={seoData.sitemapSettings.priority}
                  onChange={(e) =>
                    setSeoData({
                      ...seoData,
                      sitemapSettings: { ...seoData.sitemapSettings, priority: e.target.value },
                    })
                  }
                  disabled={!canEdit}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg disabled:bg-gray-50"
                />
              </div>
            </div>

            {canEdit && (
              <Button
                onClick={handleSaveGlobalMeta}
                className="bg-brand-orange text-brand-black hover:opacity-90 w-full mt-4 gap-2"
              >
                <Save className="h-4 w-4" />
                Save Sitemap Settings
              </Button>
            )}
          </div>
        </motion.div>

        {/* Preview Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border-2 border-gray-200 rounded-2xl p-6 sticky top-20 h-fit"
        >
          <h3 className="text-h4 font-bold text-brand-black mb-4">Preview</h3>

          <div className="space-y-6">
            {/* Global Meta Preview */}
            <div className="border-2 border-gray-100 rounded-lg p-4 bg-gray-50">
              <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Global Meta</p>
              <div>
                <p className="text-sm font-semibold text-blue-600 truncate">
                  {seoData.globalMeta.title}
                </p>
                <p className="text-xs text-gray-600 line-clamp-2">
                  {seoData.globalMeta.description}
                </p>
              </div>
            </div>

            {/* Sample Page Preview */}
            {seoData.pages.length > 0 && (
              <div className="border-2 border-gray-100 rounded-lg p-4 bg-gray-50">
                <p className="text-xs font-semibold text-gray-600 uppercase mb-2">
                  Sample Page ({seoData.pages[0].path})
                </p>
                <div>
                  <p className="text-sm font-semibold text-blue-600 truncate">
                    {seoData.pages[0].title}
                  </p>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {seoData.pages[0].description}
                  </p>
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="pt-4 border-t-2 border-gray-100 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Pages Configured:</span>
                <span className="font-semibold text-brand-orange">{seoData.pages.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Sitemap Frequency:</span>
                <span className="font-semibold text-brand-orange">
                  {seoData.sitemapSettings.changefreq}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
