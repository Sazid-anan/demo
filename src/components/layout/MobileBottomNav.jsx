import { Home, ShoppingBag, MessageCircle, Mail, Info } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function MobileBottomNav() {
  const location = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/products", icon: ShoppingBag, label: "Products" },
    { path: "/blogs", icon: MessageCircle, label: "Blogs" },
    { path: "/about", icon: Info, label: "About" },
    { path: "/contact", icon: Mail, label: "Contact" },
  ];

  const isActive = (item) => {
    if (item.label === "Home" && location.pathname === "/") return true;
    if (item.label === "About" && location.pathname === "/") {
      return location.hash === "#about" || location.hash === "";
    }
    if (item.label === "Contact" && location.pathname === "/") {
      return location.hash === "#contact";
    }
    return location.pathname === item.path;
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-orange-500/30 safe-area-inset-bottom z-50">
      <div className="flex justify-around items-center px-3 py-3 pb-safe">
        {navItems.map((item) => {
          const Icon = item.icon;
          const itemIsActive = isActive(item);

          // Pill Button Style (for last item)
          if (item.isPill) {
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-full
                  transition-all duration-300 min-w-[90px] justify-center
                  ${
                    isActive
                      ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30"
                      : "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20"
                  }
                `}
              >
                <Icon className="w-5 h-5" strokeWidth={2.5} />
                <span className="text-sm font-semibold">{item.label}</span>
              </Link>
            );
          }

          // Regular Icon Button
          return (
            <Link
              key={item.path}
              to={
                item.label === "About"
                  ? "/#about"
                  : item.label === "Contact"
                    ? "/#contact"
                    : item.path
              }
              onClick={() => {
                if (item.label === "About") {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              className="flex flex-col items-center justify-center min-w-[60px] py-1.5 group"
            >
              <div
                className={`
                  flex items-center justify-center w-10 h-10 rounded-full mb-1
                  transition-all duration-300
                  ${itemIsActive ? "bg-orange-500/20" : "bg-transparent"}
                `}
              >
                <Icon
                  className={`
                    w-6 h-6 transition-colors duration-300
                    ${itemIsActive ? "text-orange-500" : "text-gray-300"}
                  `}
                  strokeWidth={itemIsActive ? 2.5 : 2}
                />
              </div>
              <span
                className={`
                  text-xs font-medium transition-colors duration-300
                  ${itemIsActive ? "text-orange-500" : "text-gray-300"}
                `}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
