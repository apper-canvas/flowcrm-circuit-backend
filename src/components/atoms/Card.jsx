import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  className, 
  hover = false,
  children, 
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "bg-white rounded-xl border border-gray-200 shadow-sm",
        hover && "hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer transform hover:scale-[1.02]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;