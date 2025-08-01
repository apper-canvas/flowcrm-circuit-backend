import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Select = forwardRef(({ 
  className, 
  label,
  error,
  options = [],
  children,
  ...props 
}, ref) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={cn(
          "w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm",
          "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
          "transition-all duration-200 bg-white",
          error && "border-error focus:ring-error",
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
        {children}
      </select>
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  );
});

Select.displayName = "Select";

export default Select;