import { useEffect, useId, useRef } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

/**
 * Shared shell for detail modals (products/blogs).
 */
export default function DetailModalShell({
  isOpen,
  onClose,
  title,
  children,
  maxWidthClass = "max-w-4xl",
  contentClass = "p-4 sm:p-6",
  showBackdropBlur = true,
}) {
  const titleId = useId();
  const closeButtonRef = useRef(null);
  const previouslyFocusedElementRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    previouslyFocusedElementRef.current = document.activeElement;
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocusedElementRef.current?.focus?.();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-50 ${
        showBackdropBlur ? "bg-black/50 backdrop-blur-sm" : "bg-black/50"
      } flex items-center justify-center p-2 sm:p-4`}
      onClick={onClose}
      role="presentation"
    >
      <motion.div
        initial={{ scale: 0.94, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.94, y: 16 }}
        className={`bg-white rounded-xl sm:rounded-2xl shadow-2xl ${maxWidthClass} w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-10">
          <h2
            id={titleId}
            className="text-lg sm:text-xl md:text-2xl font-bold text-foreground pr-4"
          >
            {title}
          </h2>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
            type="button"
            aria-label="Close details"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className={contentClass}>{children}</div>
      </motion.div>
    </motion.div>
  );
}
