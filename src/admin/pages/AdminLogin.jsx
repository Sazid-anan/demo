import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { loginAdmin, clearLoginError } from "../../redux/slices/authSlice";
import Button from "../../components/ui/Button";

/**
 * Admin Login Page
 * Simple login authentication for admin panel
 */
export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, loginError } = useSelector((state) => state.auth);

  // Navigate to dashboard once logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/admin");
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(clearLoginError());
    dispatch(loginAdmin({ email, password }));
  };

  return (
    <div
      className="min-h-screen admin-area flex items-center justify-center p-4 relative"
      style={{
        fontFamily: "'Comfortaa', cursive",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="admin-card w-full max-w-md rounded-3xl p-8"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img
              src="/logo.png"
              alt="Danvion"
              className="h-12 w-12 rounded-xl border border-gray-200 bg-white p-2"
            />
          </div>
          <p className="text-xs uppercase tracking-[0.4em] text-gray-500">
            Danvion
          </p>
          <h1 className="text-h2 font-bold text-brand-black mt-2">
            Admin Access
          </h1>
          <p className="text-gray-600 mt-1">Secure login required</p>
        </div>

        {/* Error Message */}
        {loginError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm"
          >
            {loginError}
          </motion.div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label
              htmlFor="email"
              className="block text-sm font-medium text-brand-black mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              autocomplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border rounded-xl focus:outline-none transition-colors"
              placeholder="admin@danvion.com"
            />
          </motion.div>

          {/* Password Input */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label
              htmlFor="password"
              className="block text-sm font-medium text-brand-black mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              autocomplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border rounded-xl focus:outline-none transition-colors"
              placeholder="••••••"
            />
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <button
              type="submit"
              className="w-full px-8 py-4 text-lg font-bold rounded-xl transition-all duration-300 cursor-pointer !bg-brand-orange !text-brand-black hover:shadow-xl hover:-translate-y-0.5 orange-pop-hover"
            >
              Sign In
            </button>
          </motion.div>
        </form>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-slate-500 mt-6"
        >
          Admin Panel - Danvion Ltd.
        </motion.p>
      </motion.div>
    </div>
  );
}
