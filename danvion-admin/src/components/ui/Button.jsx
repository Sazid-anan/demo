import React from "react";
import PropTypes from "prop-types";
import { useResponsive } from "../../hooks/useResponsive";

const Button = React.memo(function Button({
  children,
  variant = "default",
  size = "default",
  className = "",
  ...props
}) {
  const { isMobile } = useResponsive();
  const variants = {
    default:
      "bg-brand-orange text-brand-black hover:bg-orange-600 shadow-lg hover:shadow-xl hover:scale-105",
    outline:
      "border-2 border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-brand-black",
    secondary: "bg-gray-700 text-white hover:bg-gray-800 shadow-lg hover:shadow-xl hover:scale-105",
    ghost: "bg-transparent text-brand-orange hover:bg-orange-50 border-2 border-brand-orange",
    destructive: "bg-red-600 text-white hover:bg-red-700 shadow-lg hover:shadow-xl hover:scale-105",
    link: "text-brand-orange hover:text-orange-600 underline",
    success: "bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl hover:scale-105",
  };

  const sizes = {
    default: "h-11 px-6 py-2.5 text-base rounded-xl",
    sm: "h-9 px-4 py-2 text-sm rounded-lg",
    md: "h-10 px-5 py-2 text-sm font-semibold rounded-lg",
    lg: "h-13 px-8 py-3 text-base rounded-xl",
    icon: "h-11 w-11 rounded-lg p-0",
  };

  return (
    <button
      className={`
        relative inline-flex items-center justify-center gap-2
        font-bold whitespace-nowrap
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2
        ${variants[variant] || variants.default}
        ${sizes[size] || sizes.default}
        ${className}
      `}
      tabIndex={0}
      {...props}
    >
      <span className="relative z-10 inline-flex items-center gap-1 leading-snug align-middle">
        {children || "Button"}
      </span>
    </button>
  );
});

Button.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf([
    "default",
    "outline",
    "secondary",
    "ghost",
    "destructive",
    "link",
    "success",
  ]),
  size: PropTypes.oneOf(["default", "sm", "md", "lg", "icon"]),
  className: PropTypes.string,
};

Button.defaultProps = {
  variant: "default",
  size: "default",
  className: "",
};

export default Button;
