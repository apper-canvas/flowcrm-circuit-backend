import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ title = "Something went wrong", message, onRetry, className = "" }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center py-12 px-6 text-center ${className}`}
    >
      <div className="w-16 h-16 bg-gradient-to-r from-red-100 to-red-200 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name="AlertTriangle" size={32} className="text-error" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md">
        {message || "We encountered an error while loading your data. Please try again or contact support if the problem persists."}
      </p>
      
      <div className="flex space-x-3">
        {onRetry && (
          <Button onClick={onRetry} icon="RefreshCw">
            Try Again
          </Button>
        )}
        <Button variant="outline" onClick={() => window.location.reload()}>
          Refresh Page
        </Button>
      </div>
      
      <div className="mt-8 p-4 bg-gray-50 rounded-lg max-w-md">
        <p className="text-sm text-gray-500">
          If this issue continues, please contact our support team with the error details.
        </p>
      </div>
    </motion.div>
  );
};

export default Error;