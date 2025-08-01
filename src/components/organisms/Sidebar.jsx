import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = () => {
  const navigationItems = [
    { name: "Dashboard", path: "/dashboard", icon: "BarChart3" },
    { name: "Contacts", path: "/contacts", icon: "Users" },
    { name: "Pipeline", path: "/pipeline", icon: "GitBranch" },
    { name: "Activities", path: "/activities", icon: "Calendar" },
    { name: "Settings", path: "/settings", icon: "Settings" }
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 border-r border-gray-700 shadow-2xl z-40">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
            <ApperIcon name="Zap" size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">FlowCRM</h1>
            <p className="text-xs text-gray-400">Sales Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive
                  ? "bg-gradient-to-r from-primary-500/20 to-secondary-500/20 text-white border border-primary-500/30"
                  : "text-gray-300 hover:text-white hover:bg-gray-800"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <ApperIcon 
                  name={item.icon} 
                  size={20} 
                  className={`transition-colors ${
                    isActive ? "text-primary-400" : "text-gray-400 group-hover:text-white"
                  }`} 
                />
                <span className="font-medium">{item.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="ml-auto w-2 h-2 bg-accent-500 rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Section */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
        <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-800/50">
          <div className="w-8 h-8 bg-gradient-to-r from-accent-500 to-accent-600 rounded-full flex items-center justify-center">
            <ApperIcon name="User" size={16} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Sales Manager</p>
            <p className="text-xs text-gray-400">Active User</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;