import React from 'react';

interface ButtonProps {
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  children: React.ReactNode;
  bgColor?: string;
  hoverBgColor?: string;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  type = "button",
  onClick,
  children,
  bgColor = "bg-blue-500",
  hoverBgColor = "hover:bg-blue-600",
  className = "",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${bgColor} ${hoverBgColor}  px-4 py-2 rounded transition-colors ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
