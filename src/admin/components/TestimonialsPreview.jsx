import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../services/firebaseClient";

/**
 * Testimonials Preview Widget
 * Shows recent testimonials in admin dashboard
 */
export default function TestimonialsPreview() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const snap = await getDocs(
          query(collection(db, "testimonials"), orderBy("created_at", "desc")),
        );
        const data = snap.docs.map((docSnap) => docSnap.data());
        setTestimonials(data.slice(0, 2)); // Show only 2 latest
      } catch (error) {
        console.error("Failed to load testimonials:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTestimonials();
  }, []);

  if (loading) {
    return (
      <div className="admin-section p-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-20 bg-gray-100 rounded"></div>
      </div>
    );
  }

  if (testimonials.length === 0) {
    return (
      <div className="admin-section p-6 text-gray-600 text-center">
        <p>No testimonials yet</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <h3 className="text-lg font-bold text-brand-black flex items-center gap-2">
        <span>⭐ Recent Testimonials</span>
        <span className="text-sm font-normal text-gray-600">
          ({testimonials.length})
        </span>
      </h3>

      <div className="space-y-3">
        {testimonials.map((testimonial, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="admin-card-lite p-4 border-l-4 border-brand-orange"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <p className="font-semibold text-sm text-brand-black">
                  {testimonial.name}
                </p>
                {testimonial.role && (
                  <p className="text-xs text-brand-orange">
                    {testimonial.role}
                    {testimonial.company && ` at ${testimonial.company}`}
                  </p>
                )}
              </div>
              <div className="text-yellow-500 text-sm">
                {"★".repeat(testimonial.rating || 5)}
              </div>
            </div>
            <p className="text-xs text-gray-600 line-clamp-2">
              "{testimonial.content}"
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
