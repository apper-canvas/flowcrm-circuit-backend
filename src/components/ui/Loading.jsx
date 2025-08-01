import { motion } from "framer-motion";

const Loading = ({ type = "default", className = "" }) => {
  if (type === "skeleton") {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2"></div>
                </div>
                <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "table") {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>
        <div className="p-6 border-b border-gray-200">
          <div className="animate-pulse">
            <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/4"></div>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full"></div>
                  <div className="flex-1 grid grid-cols-4 gap-4">
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-gray-200 border-t-primary-500 rounded-full mx-auto mb-4"
        />
        <p className="text-gray-600 font-medium">Loading...</p>
        <p className="text-gray-400 text-sm mt-1">Please wait while we fetch your data</p>
      </div>
    </div>
  );
};

export default Loading;