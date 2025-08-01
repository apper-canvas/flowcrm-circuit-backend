import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import contactService from "@/services/api/contactService";
import dealService from "@/services/api/dealService";
import activityService from "@/services/api/activityService";

const Dashboard = () => {
  const [data, setData] = useState({
    contacts: [],
    deals: [],
    activities: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setError(null);
      setLoading(true);
      
      const [contacts, deals, activities] = await Promise.all([
        contactService.getAll(),
        dealService.getAll(),
        activityService.getAll()
      ]);
      
      setData({ contacts, deals, activities });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    
    const handleDataUpdate = () => {
      loadData();
    };
    
    window.addEventListener("dataUpdated", handleDataUpdate);
    return () => window.removeEventListener("dataUpdated", handleDataUpdate);
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error onRetry={loadData} />;

  const stats = {
    totalContacts: data.contacts.length,
    totalDeals: data.deals.length,
    pipelineValue: data.deals.reduce((sum, deal) => sum + (deal.value || 0), 0),
    pendingActivities: data.activities.filter(activity => !activity.completed).length,
    closedDeals: data.deals.filter(deal => deal.stage === "Closed Won").length,
    conversionRate: data.deals.length > 0 ? Math.round((data.deals.filter(deal => deal.stage === "Closed Won").length / data.deals.length) * 100) : 0
  };

  const recentActivities = data.activities
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const upcomingActivities = data.activities
    .filter(activity => !activity.completed && activity.dueDate)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  const dealsByStage = data.deals.reduce((acc, deal) => {
    acc[deal.stage] = (acc[deal.stage] || 0) + 1;
    return acc;
  }, {});

  const getActivityIcon = (type) => {
    const icons = {
      call: "Phone",
      meeting: "Users",
      task: "CheckSquare",
      email: "Mail"
    };
    return icons[type] || "Activity";
  };

  const getActivityColor = (type) => {
    const colors = {
      call: "primary",
      meeting: "secondary",
      task: "accent",
      email: "info"
    };
    return colors[type] || "default";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's what's happening with your sales pipeline.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <p className="text-sm text-gray-500">
            Last updated: {format(new Date(), "MMM dd, yyyy 'at' h:mm a")}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="Users" size={24} className="text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-primary-700">Total Contacts</p>
                <p className="text-2xl font-bold text-primary-900">{stats.totalContacts}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 bg-gradient-to-br from-secondary-50 to-secondary-100 border-secondary-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="GitBranch" size={24} className="text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-700">Active Deals</p>
                <p className="text-2xl font-bold text-secondary-900">{stats.totalDeals}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 bg-gradient-to-br from-accent-50 to-accent-100 border-accent-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-accent-500 to-accent-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="DollarSign" size={24} className="text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-accent-700">Pipeline Value</p>
                <p className="text-2xl font-bold text-accent-900">${stats.pipelineValue.toLocaleString()}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="CheckCircle" size={24} className="text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-green-700">Closed Deals</p>
                <p className="text-2xl font-bold text-green-900">{stats.closedDeals}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="Calendar" size={24} className="text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-orange-700">Pending Tasks</p>
                <p className="text-2xl font-bold text-orange-900">{stats.pendingActivities}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="TrendingUp" size={24} className="text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-700">Conversion Rate</p>
                <p className="text-2xl font-bold text-blue-900">{stats.conversionRate}%</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Pipeline Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="xl:col-span-1"
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Pipeline Stages</h3>
              <Button variant="outline" size="sm" icon="GitBranch">
                View Pipeline
              </Button>
            </div>
            
            <div className="space-y-4">
              {Object.entries(dealsByStage).map(([stage, count]) => (
                <div key={stage} className="flex items-center justify-between">
                  <span className="text-gray-600">{stage}</span>
                  <Badge variant="primary">{count}</Badge>
                </div>
              ))}
              {Object.keys(dealsByStage).length === 0 && (
                <p className="text-gray-500 text-center py-4">No deals in pipeline</p>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="xl:col-span-1"
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
              <Button variant="outline" size="sm" icon="Activity">
                View All
              </Button>
            </div>
            
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.Id} className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r ${
                    getActivityColor(activity.type) === "primary" ? "from-primary-100 to-primary-200" :
                    getActivityColor(activity.type) === "secondary" ? "from-secondary-100 to-secondary-200" :
                    getActivityColor(activity.type) === "accent" ? "from-accent-100 to-accent-200" :
                    "from-blue-100 to-blue-200"
                  }`}>
                    <ApperIcon 
                      name={getActivityIcon(activity.type)} 
                      size={16} 
                      className={`${
                        getActivityColor(activity.type) === "primary" ? "text-primary-600" :
                        getActivityColor(activity.type) === "secondary" ? "text-secondary-600" :
                        getActivityColor(activity.type) === "accent" ? "text-accent-600" :
                        "text-blue-600"
                      }`} 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(activity.createdAt), "MMM dd, h:mm a")}
                    </p>
                  </div>
                  <Badge variant={getActivityColor(activity.type)} size="sm">
                    {activity.type}
                  </Badge>
                </div>
              ))}
              {recentActivities.length === 0 && (
                <p className="text-gray-500 text-center py-4">No recent activities</p>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Upcoming Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="xl:col-span-1"
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Upcoming Tasks</h3>
              <Button variant="outline" size="sm" icon="Calendar">
                View Calendar
              </Button>
            </div>
            
            <div className="space-y-4">
              {upcomingActivities.map((activity) => (
                <div key={activity.Id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r ${
                    getActivityColor(activity.type) === "primary" ? "from-primary-100 to-primary-200" :
                    getActivityColor(activity.type) === "secondary" ? "from-secondary-100 to-secondary-200" :
                    getActivityColor(activity.type) === "accent" ? "from-accent-100 to-accent-200" :
                    "from-blue-100 to-blue-200"
                  }`}>
                    <ApperIcon 
                      name={getActivityIcon(activity.type)} 
                      size={16} 
                      className={`${
                        getActivityColor(activity.type) === "primary" ? "text-primary-600" :
                        getActivityColor(activity.type) === "secondary" ? "text-secondary-600" :
                        getActivityColor(activity.type) === "accent" ? "text-accent-600" :
                        "text-blue-600"
                      }`} 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                    <p className="text-xs text-gray-500">
                      Due: {format(new Date(activity.dueDate), "MMM dd, h:mm a")}
                    </p>
                  </div>
                  <Badge 
                    variant={new Date(activity.dueDate) < new Date() ? "error" : "warning"} 
                    size="sm"
                  >
                    {new Date(activity.dueDate) < new Date() ? "Overdue" : "Pending"}
                  </Badge>
                </div>
              ))}
              {upcomingActivities.length === 0 && (
                <p className="text-gray-500 text-center py-4">No upcoming activities</p>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;