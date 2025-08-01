import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const MobileSidebar = ({ isOpen, onClose }) => {
  const navigationItems = [
    { name: "Dashboard", path: "/dashboard", icon: "BarChart3" },
    { name: "Contacts", path: "/contacts", icon: "Users" },
    { name: "Pipeline", path: "/pipeline", icon: "GitBranch" },
    { name: "Activities", path: "/activities", icon: "Calendar" },
    { name: "Settings", path: "/settings", icon: "Settings" }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 shadow-2xl z-50 lg:hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-700 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Zap" size={24} className="text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">FlowCRM</h1>
                  <p className="text-xs text-gray-400">Sales Management</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <ApperIcon name="X" size={20} className="text-gray-400" />
              </button>
            </div>

{/* Navigation */}
            <nav className="p-4 space-y-2">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-primary-500/20 to-secondary-500/20 text-white border border-primary-500/30"
                        : "text-gray-300 hover:text-white hover:bg-gray-800"
                    }`
                  }
                >
                  <ApperIcon name={item.icon} size={20} />
                  <span className="font-medium">{item.name}</span>
                </NavLink>
              ))}
              
              {/* Logout Button */}
              <button
                onClick={() => {
                  if (window.confirm("Are you sure you want to logout?")) {
                    const { ApperUI } = window.ApperSDK;
                    ApperUI.logout();
                    onClose();
                  }
                }}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-gray-300 hover:text-white hover:bg-gray-800 w-full text-left"
              >
                <ApperIcon name="LogOut" size={20} />
                <span className="font-medium">Logout</span>
              </button>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileSidebar;