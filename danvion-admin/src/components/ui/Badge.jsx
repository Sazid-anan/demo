import React from "react";
import PropTypes from "prop-types";

const Badge = React.memo(function Badge({ children, variant = "default", className = "" }) {
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
});

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["default", "secondary", "outline", "destructive"]),
  className: PropTypes.string,
};

Badge.defaultProps = {
  variant: "default",
  className: "",
};

export default Badge;
