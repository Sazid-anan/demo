import React from "react";
import PropTypes from "prop-types";

export const Card = React.memo(function Card({ children, className = "" }) {
  return (
    <div
      className={`
      bg-card text-card-foreground 
      rounded-xl border border-border
      flex flex-col gap-6
      transition-all duration-300 ease-out
      hover:shadow-xl hover:border-orange-200/50
      ${className}
    `}
    >
      {children}
    </div>
  );
});

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export const CardContent = React.memo(function CardContent({ children, className = "" }) {
  return (
    <div
      className={`
      px-6 pb-6
      ${className}
    `}
    >
      {children}
    </div>
  );
});

CardContent.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
