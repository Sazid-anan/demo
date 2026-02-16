/**
 * Badge Component
 * Modern badge/label component
 */
export default function Badge({
  children,
  variant = "default",
  className = "",
}) {
  const variants = {
    default: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    outline: "border border-foreground text-foreground",
    destructive: "bg-destructive text-destructive-foreground",
  };

  return (
    <span
      className={`
      inline-flex items-center justify-center 
      rounded-md border px-2.5 py-0.5 
      text-xs font-medium 
      w-fit whitespace-nowrap shrink-0 
      gap-1
      ${variants[variant] || variants.default}
      ${className}
    `}
    >
      {children}
    </span>
  );
}
