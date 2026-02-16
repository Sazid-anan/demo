/**
 * Button Component
 * Modern button with multiple variants and sizes
 */
export default function Button({
  children,
  variant = "default",
  size = "default",
  className = "",
  ...props
}) {
  const variants = {
    default: "glass-orange-outline",
    outline: "glass-orange-outline",
    secondary: "glass-orange",
    ghost: "glass-orange-outline",
    destructive:
      "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    link: "glass-orange-outline",
  };

  const sizes = {
    default: "h-10 px-4 py-2 text-base",
    sm: "h-8 rounded-md px-3 text-sm",
    lg: "h-12 rounded-lg px-6 text-base",
    icon: "h-10 w-10 rounded-md p-0",
  };

  return (
    <button
      className={`
        relative px-8 py-3 rounded-full font-semibold text-base cursor-pointer transition-all duration-300 inline-flex items-center gap-2 glass-orange-outline
        inline-flex items-center justify-center gap-2
        whitespace-nowrap rounded-md font-medium
        transition-all disabled:opacity-50 disabled:cursor-not-allowed
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
        ${variants[variant] || variants.default}
        ${sizes[size] || sizes.default}
        ${className}
      `}
      tabIndex={0}
      style={{ transform: "none" }}
      {...props}
    >
      <span className="relative z-10">{children || "Enquiry"}</span>
    </button>
  );
}
