import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Home,
  ShoppingBag,
  MessageCircle,
  Grid3x3,
  User,
  Search,
  Mail,
  BookOpen,
} from "lucide-react";

/**
 * Mobile Navigation Bar Variants
 * Different styles matching the reference designs
 */

// Variant 1: Icon Only with Pill Shape
export function MobileNavPill({ theme = "dark" }) {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState("");

  // Detect which section is in view
  useEffect(() => {
    const handleScroll = () => {
      // Only track sections on home page
      if (location.pathname !== "/") {
        setActiveSection("");
        return;
      }

      const contactSection = document.getElementById("contact");
      if (contactSection) {
        const rect = contactSection.getBoundingClientRect();
        const isContactInView = rect.top <= 200 && rect.bottom >= 200;

        if (isContactInView) {
          setActiveSection("#contact");
        } else if (window.scrollY < 300) {
          // Near top of page
          setActiveSection("");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  // Navigation items matching main website header
  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "#contact", icon: Mail, label: "Contact" },
    { path: "/products", icon: ShoppingBag, label: "Products" },
    { path: "/blogs", icon: BookOpen, label: "Blogs" },
  ];

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/" && activeSection === "";
    }
    if (path === "#contact") {
      return location.pathname === "/" && activeSection === "#contact";
    }
    if (path.startsWith("#")) {
      return false;
    }
    return location.pathname.startsWith(path);
  };

  const isDark = theme === "dark";

  const handleClick = (e, path) => {
    // Handle Home button click
    if (path === "/") {
      e.preventDefault();
      if (location.pathname === "/") {
        // Already on home page, scroll to top
        window.scrollTo({ top: 0, behavior: "smooth" });
        setActiveSection(""); // Clear active section
      } else {
        // Navigate to home page
        // eslint-disable-next-line react-hooks/immutability
        window.location.href = "/";
      }
      return;
    }

    // Handle anchor links (like #contact)
    if (path.startsWith("#")) {
      e.preventDefault();
      setActiveSection(path); // Immediately set as active
      const el = document.getElementById(path.substring(1));
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
      if (location.pathname !== "/") {
        // eslint-disable-next-line react-hooks/immutability
        window.location.href = `/${path}`;
      }
    }
  };

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 sm:hidden"
    >
      <div
        className={`
          ${isDark ? "bg-gray-900/90 border-gray-700/50" : "bg-white/90 border-gray-300/50"}
          backdrop-blur-xl
          rounded-none sm:rounded-full px-4 py-2.5
          flex items-center justify-center gap-3
          shadow-2xl border
          w-[calc(100vw-1rem)] max-w-[420px]
        `}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          const isAnchor = item.path.startsWith("#");
          const isHome = item.path === "/";

          // Use 'a' tag for Home and anchor links to handle custom click behavior
          const LinkComponent = isAnchor || isHome ? "a" : Link;
          const linkProps =
            isAnchor || isHome
              ? { href: item.path, onClick: (e) => handleClick(e, item.path) }
              : { to: item.path };

          return (
            <LinkComponent key={item.path} {...linkProps} className="flex-1 flex justify-center">
              <motion.div
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center gap-1"
              >
                <div
                  className={`
                    p-2 rounded-none sm:rounded-full transition-all
                    ${
                      active
                        ? "bg-[#ff6600] text-white shadow-lg"
                        : isDark
                          ? "text-gray-400 hover:bg-gray-800/50"
                          : "text-gray-600 hover:bg-gray-200/70"
                    }
                  `}
                >
                  <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                </div>
                <span
                  className={`
                    text-xs leading-tight font-semibold transition-colors
                    ${active ? "text-[#ff6600]" : isDark ? "text-gray-400" : "text-gray-600"}
                  `}
                >
                  {item.label}
                </span>
              </motion.div>
            </LinkComponent>
          );
        })}
      </div>
    </motion.nav>
  );
}

// Variant 2: Profile Button Style (Text + Icon)
export function MobileNavWithProfile({ theme = "dark" }) {
  const location = useLocation();
  const isDark = theme === "dark";

  const navItems = [
    { path: "/", icon: Home },
    { path: "/products", icon: ShoppingBag },
    { path: "/messages", icon: MessageCircle },
    { path: "/apps", icon: Grid3x3 },
  ];

  const isActive = (path) =>
    location.pathname === path || (path === "/" && location.pathname === "/");
  const profileActive = location.pathname === "/profile";

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 sm:hidden"
    >
      <div
        className={`
          ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}
          rounded-none sm:rounded-full px-4 py-3
          flex items-center gap-2
          shadow-2xl border-2
        `}
      >
        {/* Regular icon navigation items */}
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link key={item.path} to={item.path}>
              <motion.div
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                className={`
                  p-3 rounded-none sm:rounded-full transition-all
                  ${
                    active
                      ? "bg-[#ff6600] text-white shadow-lg"
                      : isDark
                        ? "text-gray-400 hover:bg-gray-800 hover:text-white"
                        : "text-gray-700 hover:bg-gray-100 hover:text-[#ff6600]"
                  }
                `}
              >
                <Icon size={24} strokeWidth={active ? 2.8 : 2.2} />
              </motion.div>
            </Link>
          );
        })}

        {/* Profile button with text */}
        <Link to="/profile">
          <motion.div
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            className={`
              px-4 py-2.5 rounded-none sm:rounded-full
              flex items-center gap-2
              font-semibold text-sm
              transition-all
              ${
                profileActive
                  ? "bg-[#ff6600] text-white shadow-lg"
                  : isDark
                    ? "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-[#ff6600]"
              }
            `}
          >
            <User size={20} strokeWidth={profileActive ? 2.8 : 2.2} />
            <span>Profile</span>
          </motion.div>
        </Link>
      </div>
    </motion.nav>
  );
}

// Variant 3: With Labels Below Icons
export function MobileNavWithLabels({ theme = "dark" }) {
  const location = useLocation();
  const isDark = theme === "dark";

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/products", label: "Shop", icon: ShoppingBag },
    { path: "/messages", label: "Messages", icon: MessageCircle },
    { path: "/search", label: "Search", icon: Search },
    { path: "/profile", label: "Profile", icon: User },
  ];

  const isActive = (path) =>
    location.pathname === path || (path === "/" && location.pathname === "/");

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 sm:hidden"
    >
      <div
        className={`
          ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}
          rounded-none sm:rounded-full px-6 py-3
          flex items-center gap-6
          shadow-2xl border-2
        `}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link key={item.path} to={item.path}>
              <motion.div
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center gap-1"
              >
                <div
                  className={`
                    p-2 rounded-none sm:rounded-full transition-all
                    ${
                      active
                        ? "bg-[#ff6600] text-white shadow-lg"
                        : isDark
                          ? "text-gray-400"
                          : "text-gray-700"
                    }
                  `}
                >
                  <Icon size={20} strokeWidth={active ? 2.8 : 2.2} />
                </div>
                <span
                  className={`
                    text-xs font-semibold transition-colors
                    ${active ? "text-[#ff6600]" : isDark ? "text-gray-400" : "text-gray-600"}
                  `}
                >
                  {item.label}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}

// Variant 4: Minimal Icons Only (Compact)
export function MobileNavCompact({ theme = "dark" }) {
  const location = useLocation();
  const isDark = theme === "dark";

  const navItems = [
    { path: "/", icon: Home },
    { path: "/products", icon: ShoppingBag },
    { path: "/messages", icon: MessageCircle },
    { path: "/apps", icon: Grid3x3 },
    { path: "/profile", icon: User },
  ];

  const isActive = (path) =>
    location.pathname === path || (path === "/" && location.pathname === "/");

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 sm:hidden"
    >
      <div
        className={`
          ${isDark ? "bg-gray-900/95" : "bg-white/95"}
          backdrop-blur-lg
          rounded-none sm:rounded-full px-3 py-2.5
          flex items-center gap-1
          shadow-2xl border-2
          ${isDark ? "border-gray-800" : "border-gray-200"}
        `}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link key={item.path} to={item.path}>
              <motion.div
                whileTap={{ scale: 0.85 }}
                whileHover={{ scale: 1.05 }}
                className={`
                  p-2.5 rounded-none sm:rounded-full transition-all relative
                  ${
                    active
                      ? "bg-[#ff6600] text-white shadow-lg"
                      : isDark
                        ? "text-gray-500 hover:text-white hover:bg-gray-800"
                        : "text-gray-700 hover:text-[#ff6600] hover:bg-gray-100"
                  }
                `}
              >
                <Icon size={22} strokeWidth={active ? 2.8 : 2.2} />
              </motion.div>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}

/**
 * Usage Examples:
 *
 * import {
 *   MobileNavPill,
 *   MobileNavWithProfile,
 *   MobileNavWithLabels,
 *   MobileNavCompact
 * } from './components/layout/MobileNavBar';
 *
 * // Use any variant:
 * <MobileNavPill theme="dark" />
 * <MobileNavWithProfile theme="light" />
 * <MobileNavWithLabels theme="dark" />
 * <MobileNavCompact theme="light" />
 */
