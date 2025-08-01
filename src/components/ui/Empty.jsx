import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No data found", 
  message = "Get started by adding your first item.", 
  actionLabel = "Add Item",
  onAction,
  icon = "Inbox",
  className = "" 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex flex-col items-center justify-center py-16 px-6 text-center ${className}`}
    >
      <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} size={40} className="text-gray-400" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md">
        {message}
      </p>
      
      {onAction && (
        <Button onClick={onAction} icon="Plus">
          {actionLabel}
        </Button>
      )}
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-lg">
        <div className="p-4 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg">
          <ApperIcon name="Users" size={24} className="text-primary-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-primary-800">Manage Contacts</p>
        </div>
        <div className="p-4 bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-lg">
          <ApperIcon name="GitBranch" size={24} className="text-secondary-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-secondary-800">Track Pipeline</p>
        </div>
        <div className="p-4 bg-gradient-to-br from-accent-50 to-accent-100 rounded-lg">
          <ApperIcon name="Calendar" size={24} className="text-accent-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-accent-800">Schedule Activities</p>
        </div>
      </div>
    </motion.div>
  );
};

export default Empty;