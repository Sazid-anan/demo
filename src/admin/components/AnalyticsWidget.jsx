import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, MailOpen, Package, Users } from "lucide-react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../services/firebaseClient";
import TestimonialsPreview from "./TestimonialsPreview";

/**
 * Analytics Widget
 * Displays key metrics for the admin dashboard
 */
export default function AnalyticsWidget() {
  const [stats, setStats] = useState({
    totalMessages: 0,
    unreadMessages: 0,
    totalProducts: 0,
    totalTeamMembers: 0,
    loading: true,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [messagesSnap, unreadSnap, productsSnap, teamSnap] =
          await Promise.all([
            getDocs(collection(db, "contact_messages")),
            getDocs(
              query(
                collection(db, "contact_messages"),
                where("is_read", "==", false),
              ),
            ),
            getDocs(collection(db, "products")),
            getDocs(collection(db, "team_members")),
          ]);

        setStats({
          totalMessages: messagesSnap.docs.length,
          unreadMessages: unreadSnap.docs.length,
          totalProducts: productsSnap.docs.length,
          totalTeamMembers: teamSnap.docs.length,
          loading: false,
        });
      } catch (error) {
        console.error("Failed to load analytics:", error);
        setStats((prev) => ({ ...prev, loading: false }));
      }
    };

    loadStats();
  }, []);

  const statCards = [
    {
      label: "Total Messages",
      value: stats.totalMessages,
      icon: Mail,
      color: "bg-blue-100 text-blue-700",
    },
    {
      label: "Unread Messages",
      value: stats.unreadMessages,
      icon: MailOpen,
      color: "bg-orange-100 text-brand-orange",
    },
    {
      label: "Products",
      value: stats.totalProducts,
      icon: Package,
      color: "bg-purple-100 text-purple-700",
    },
    {
      label: "Team Members",
      value: stats.totalTeamMembers,
      icon: Users,
      color: "bg-green-100 text-green-700",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-xl font-bold text-brand-black mb-2">
          Dashboard Analytics
        </h2>
        <p className="text-gray-600 text-sm">Key metrics at a glance</p>
      </div>

      {stats.loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="admin-card-lite h-24 bg-gradient-to-br from-gray-50 to-gray-100 animate-pulse"
            ></div>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="admin-card-lite p-6 relative overflow-hidden"
            >
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 opacity-50"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium text-gray-600">
                    {card.label}
                  </p>
                  <div className={`p-2 rounded-lg ${card.color}`}>
                    <card.icon className="h-5 w-5" />
                  </div>
                </div>

                <p className="text-4xl font-bold text-brand-black">
                  {card.value}
                </p>
              </div>

              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Testimonials Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="admin-section p-6 rounded-2xl"
      >
        <TestimonialsPreview />
      </motion.div>
    </motion.div>
  );
}
