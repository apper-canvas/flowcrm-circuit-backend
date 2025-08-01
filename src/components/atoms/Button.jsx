import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  loading = false,
  icon,
  children, 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:from-primary-600 hover:to-secondary-600 focus:ring-primary-500 shadow-md hover:shadow-lg transform hover:scale-105",
    secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-primary-500 shadow-sm hover:shadow-md",
    outline: "border border-primary-500 text-primary-600 hover:bg-primary-50 focus:ring-primary-500",
    ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500",
    accent: "bg-gradient-to-r from-accent-500 to-accent-600 text-white hover:from-accent-600 hover:to-accent-700 focus:ring-accent-500 shadow-md hover:shadow-lg transform hover:scale-105"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.98 }}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <>
          <ApperIcon name="Loader2" size={16} className="animate-spin mr-2" />
          Loading...
        </>
      ) : (
        <>
          {icon && <ApperIcon name={icon} size={16} className="mr-2" />}
          {children}
        </>
      )}
    </motion.button>
  );
});

Button.displayName = "Button";

export default Button;