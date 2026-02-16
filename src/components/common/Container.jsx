/**
 * Container Component - Mobile-First Responsive
 * Centered content wrapper with full-width responsive approach
 *
 * Breakpoints handled by CSS media queries:
 * - Mobile: Full width with padding
 * - Tablet: Full width with increased padding
 * - Laptop: Responsive width managed by CSS
 * - Desktop: Full content utilization
 */
export default function Container({ children, className = "" }) {
  return (
    <div
      className={`
        w-full mx-auto
        px-3 sm:px-4
        ${className}
      `}
    >
      {children}
    </div>
  );
}
