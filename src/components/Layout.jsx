import { useState } from "react";
import { Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/organisms/Sidebar";
import MobileSidebar from "@/components/organisms/MobileSidebar";
import QuickAddModal from "@/components/organisms/QuickAddModal";
import ApperIcon from "@/components/ApperIcon";

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Desktop Layout */}
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-64">
          {/* Mobile Header */}
          <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ApperIcon name="Menu" size={24} className="text-gray-600" />
            </button>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              FlowCRM
            </h1>
            <button
              onClick={() => setIsQuickAddOpen(true)}
              className="p-2 rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:from-primary-600 hover:to-secondary-600 transition-all shadow-md"
            >
              <ApperIcon name="Plus" size={20} />
            </button>
          </div>

          {/* Page Content */}
          <main className="p-4 lg:p-6">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />

      {/* Quick Add Modal */}
      <QuickAddModal 
        isOpen={isQuickAddOpen} 
        onClose={() => setIsQuickAddOpen(false)} 
      />

      {/* Floating Action Button - Desktop */}
      <motion.button
        onClick={() => setIsQuickAddOpen(true)}
        className="hidden lg:flex fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-accent-500 to-accent-600 text-white rounded-full items-center justify-center shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200 z-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ApperIcon name="Plus" size={24} />
      </motion.button>
    </div>
  );
};

export default Layout;