import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BarChart3,
  Package,
  FileText,
  Users,
  Star,
  Mail,
  User,
  LogOut,
} from "lucide-react";
import { logoutAdmin } from "../../redux/slices/authSlice";
import { setActiveTab } from "../../redux/slices/adminSlice";
import { fetchContent } from "../../redux/slices/contentSlice";
import EditProductsTab from "../components/EditProductsTab";
import EditTeamTab from "../components/EditTeamTab";
import MessagesTab from "../components/MessagesTab";
import AnalyticsWidget from "../components/AnalyticsWidget";
import TestimonialsTab from "../components/TestimonialsTab";
import BlogsTab from "../components/BlogsTab";

/**
 * Admin Dashboard
 * Main admin panel with tabs for managing content
 */
export default function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, adminEmail } = useSelector((state) => state.auth);
  const { activeTab } = useSelector((state) => state.admin);
  const storageBucket =
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    "danvion-ltd.firebasestorage.app";

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/admin/login");
    }
  }, [isLoggedIn, navigate]);

  // Fetch content on mount
  useEffect(() => {
    dispatch(fetchContent());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logoutAdmin());
    navigate("/admin/login");
  };

  const tabs = [
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "products", label: "Products", icon: Package },
    { id: "blogs", label: "Blog Posts", icon: FileText },
    { id: "team", label: "Leadership Team", icon: Users },
    { id: "testimonials", label: "Testimonials", icon: Star },
    { id: "messages", label: "Messages", icon: Mail },
  ];

  const tabGroups = [
    {
      title: "Dashboard",
      items: ["analytics"],
    },
    {
      title: "Content",
      items: ["products", "blogs", "team", "testimonials", "messages"],
    },
  ];

  if (!isLoggedIn) return null;

  return (
    <div
      className="min-h-screen admin-area text-brand-black"
      style={{
        fontFamily: "'Comfortaa', cursive",
      }}
    >
      {/* Main Content */}
      <div className="w-full mx-auto px-4 py-12">
        <div className="admin-header mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src="/logo.png"
              alt="Danvion"
              className="h-12 w-12 rounded-xl border border-gray-200 bg-white p-2"
            />
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
                Danvion Admin
              </p>
              <h1 className="text-h2 font-bold text-brand-black mt-2">
                Content Control Center
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Update pages, assets, and messages with confidence.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="admin-chip">Live data</span>
            <span className="admin-chip">Signed in</span>
          </div>
        </div>
        <div className="grid lg:grid-cols-[260px_1fr] gap-8">
          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:block"
          >
            <div className="admin-panel sticky top-28 rounded-2xl p-5">
              <div className="mb-6">
                <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
                  Navigation
                </p>
                <h2 className="text-2xl font-bold text-brand-black mt-2">
                  Dashboard
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Manage your content and publish updates.
                </p>
              </div>
              <div className="space-y-4">
                {tabGroups.map((group) => (
                  <div key={group.title}>
                    <p className="admin-group-title mb-2">{group.title}</p>
                    <div className="space-y-2">
                      {group.items.map((id) => {
                        const tab = tabs.find((item) => item.id === id);
                        if (!tab) return null;
                        return (
                          <motion.button
                            key={tab.id}
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => dispatch(setActiveTab(tab.id))}
                            className={`admin-nav-button w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all border-2 orange-pop-hover ${
                              activeTab === tab.id
                                ? "bg-brand-orange text-brand-black border-brand-orange shadow-lg"
                                : "bg-white text-brand-orange border-gray-200 hover:bg-gray-50 hover:border-brand-orange"
                            }`}
                          >
                            <tab.icon className="h-5 w-5" />
                            <span className="text-sm">{tab.label}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 border-t-2 border-gray-200 pt-4 space-y-3">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>Storage:</span>
                  <span className="font-semibold text-brand-black">
                    {storageBucket}
                  </span>
                </div>
                <div className="flex items-center gap-3 bg-white/80 border border-gray-200 px-3 py-2 rounded-xl">
                  <User className="h-4 w-4 text-brand-orange" />
                  <span className="text-xs text-brand-black truncate">
                    {adminEmail}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  className="w-full px-4 py-2 bg-white border-2 border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-brand-black text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </motion.button>
              </div>
            </div>
          </motion.aside>

          {/* Content */}
          <div>
            {/* Mobile Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex lg:hidden gap-3 mb-6 overflow-x-auto pb-2"
            >
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => dispatch(setActiveTab(tab.id))}
                  className={`admin-nav-button px-5 py-3 rounded-full font-semibold transition-all flex items-center gap-2 border-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-brand-orange text-brand-black border-brand-orange shadow-xl"
                      : "bg-white text-brand-orange border-gray-200 hover:shadow-lg hover:border-brand-orange"
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </motion.button>
              ))}
            </motion.div>

            {/* Tab Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="admin-panel rounded-3xl p-8 md:p-12"
            >
              {activeTab === "analytics" && <AnalyticsWidget />}
              {activeTab === "products" && <EditProductsTab />}
              {activeTab === "blogs" && <BlogsTab />}
              {activeTab === "team" && <EditTeamTab />}
              {activeTab === "testimonials" && <TestimonialsTab />}
              {activeTab === "messages" && <MessagesTab />}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
