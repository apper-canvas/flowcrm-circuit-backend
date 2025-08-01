import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format, isToday, isTomorrow, isPast, startOfDay } from "date-fns";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import activityService from "@/services/api/activityService";
import contactService from "@/services/api/contactService";

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("list");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const loadData = async () => {
    try {
      setError(null);
      setLoading(true);
      
      const [activitiesData, contactsData] = await Promise.all([
        activityService.getAll(),
        contactService.getAll()
      ]);
      
      setActivities(activitiesData);
      setContacts(contactsData);
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

  const handleToggleComplete = async (activity) => {
    try {
      const updatedActivity = await activityService.update(activity.Id, {
        ...activity,
        completed: !activity.completed,
        outcome: !activity.completed ? "Completed" : null
      });
      
      setActivities(activities.map(a => 
        a.Id === activity.Id ? updatedActivity : a
      ));
      
      toast.success(`Activity marked as ${!activity.completed ? "completed" : "pending"}`);
    } catch (error) {
      toast.error("Failed to update activity");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this activity?")) {
      try {
        await activityService.delete(id);
        setActivities(activities.filter(activity => activity.Id !== id));
        toast.success("Activity deleted successfully");
      } catch (error) {
        toast.error("Failed to delete activity");
      }
    }
  };

  const getContactName = (contactId) => {
    const contact = contacts.find(c => c.Id.toString() === contactId);
    return contact ? contact.name : "Unknown Contact";
  };

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

  const getDateLabel = (date) => {
    const activityDate = new Date(date);
    const today = startOfDay(new Date());
    
    if (isToday(activityDate)) return "Today";
    if (isTomorrow(activityDate)) return "Tomorrow";
    if (isPast(activityDate)) return "Past Due";
    return format(activityDate, "MMM dd, yyyy");
  };

  const getStatusBadge = (activity) => {
    if (activity.completed) {
      return <Badge variant="success" size="sm">Completed</Badge>;
    }
    
    if (activity.dueDate && isPast(new Date(activity.dueDate))) {
      return <Badge variant="error" size="sm">Overdue</Badge>;
    }
    
    return <Badge variant="warning" size="sm">Pending</Badge>;
  };

const filteredActivities = activities
    .filter(activity => {
      const matchesSearch = 
        activity.title?.toLowerCase()?.includes(searchTerm.toLowerCase()) || false ||
        activity.description?.toLowerCase()?.includes(searchTerm.toLowerCase()) || false ||
        getContactName(activity.contactId)?.toLowerCase()?.includes(searchTerm.toLowerCase()) || false;
      
      const matchesType = filterType === "all" || activity.type === filterType;
      
      const matchesStatus = 
        filterStatus === "all" ||
        (filterStatus === "completed" && activity.completed) ||
        (filterStatus === "pending" && !activity.completed) ||
        (filterStatus === "overdue" && !activity.completed && activity.dueDate && isPast(new Date(activity.dueDate)));
      
      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const groupedActivities = filteredActivities.reduce((groups, activity) => {
    if (activity.dueDate) {
      const dateLabel = getDateLabel(activity.dueDate);
      if (!groups[dateLabel]) {
        groups[dateLabel] = [];
      }
      groups[dateLabel].push(activity);
    } else {
      if (!groups["No Due Date"]) {
        groups["No Due Date"] = [];
      }
      groups["No Due Date"].push(activity);
    }
    return groups;
  }, {});

  const stats = {
    total: activities.length,
    completed: activities.filter(a => a.completed).length,
    pending: activities.filter(a => !a.completed).length,
    overdue: activities.filter(a => !a.completed && a.dueDate && isPast(new Date(a.dueDate))).length
  };

  if (loading) return <Loading />;
  if (error) return <Error onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Activities
          </h1>
          <p className="text-gray-600 mt-1">
            Track calls, meetings, tasks, and communications
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <Button
            variant={viewMode === "list" ? "primary" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
            icon="List"
          >
            List
          </Button>
          <Button
            variant={viewMode === "calendar" ? "primary" : "outline"}
            size="sm"
            onClick={() => setViewMode("calendar")}
            icon="Calendar"
          >
            Calendar
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Activity" size={24} className="text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-700">Total Activities</p>
              <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckCircle" size={24} className="text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-green-700">Completed</p>
              <p className="text-2xl font-bold text-green-900">{stats.completed}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Clock" size={24} className="text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-yellow-700">Pending</p>
              <p className="text-2xl font-bold text-yellow-900">{stats.pending}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="AlertTriangle" size={24} className="text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-red-700">Overdue</p>
              <p className="text-2xl font-bold text-red-900">{stats.overdue}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1 max-w-md relative">
            <Input
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <ApperIcon 
              name="Search" 
              size={20} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" 
            />
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              options={[
                { value: "all", label: "All Types" },
                { value: "call", label: "Calls" },
                { value: "meeting", label: "Meetings" },
                { value: "task", label: "Tasks" },
                { value: "email", label: "Emails" }
              ]}
            />
            
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              options={[
                { value: "all", label: "All Status" },
                { value: "pending", label: "Pending" },
                { value: "completed", label: "Completed" },
                { value: "overdue", label: "Overdue" }
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Activities List */}
      {filteredActivities.length === 0 ? (
        <Empty
          title="No activities found"
          message={searchTerm || filterType !== "all" || filterStatus !== "all"
            ? "Try adjusting your search or filter criteria."
            : "Start tracking your interactions by creating your first activity."}
          actionLabel="Add Activity"
          icon="Calendar"
        />
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedActivities).map(([dateLabel, dayActivities]) => (
            <div key={dateLabel}>
              {/* Date Header */}
              <div className="flex items-center space-x-4 mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{dateLabel}</h3>
                <Badge variant="secondary" size="sm">{dayActivities.length}</Badge>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Activities for this date */}
              <div className="space-y-4">
                {dayActivities.map((activity, index) => (
                  <motion.div
                    key={activity.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`p-6 hover:shadow-lg transition-all duration-200 ${
                      activity.completed ? "bg-green-50 border-green-200" : ""
                    }`}>
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <button
                            onClick={() => handleToggleComplete(activity)}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                              activity.completed
                                ? "bg-green-500 border-green-500 text-white"
                                : "border-gray-300 hover:border-primary-500"
                            }`}
                          >
                            {activity.completed && <ApperIcon name="Check" size={12} />}
                          </button>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
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
                                <div>
                                  <h3 className={`text-lg font-semibold ${
                                    activity.completed ? "text-gray-500 line-through" : "text-gray-900"
                                  }`}>
                                    {activity.title}
                                  </h3>
                                  <p className="text-gray-600 text-sm">
                                    {getContactName(activity.contactId)}
                                  </p>
                                </div>
                              </div>

                              {activity.description && (
                                <p className={`text-gray-700 mb-3 ${
                                  activity.completed ? "line-through text-gray-500" : ""
                                }`}>
                                  {activity.description}
                                </p>
                              )}

                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                {activity.dueDate && (
                                  <div className="flex items-center space-x-1">
                                    <ApperIcon name="Clock" size={14} />
                                    <span>{format(new Date(activity.dueDate), "h:mm a")}</span>
                                  </div>
                                )}
                                <div className="flex items-center space-x-1">
                                  <ApperIcon name="Calendar" size={14} />
                                  <span>Created {format(new Date(activity.createdAt), "MMM dd")}</span>
                                </div>
                                <Badge variant={getActivityColor(activity.type)} size="sm">
                                  {activity.type}
                                </Badge>
                              </div>

                              {activity.outcome && (
                                <div className="mt-3 p-3 bg-green-50 rounded-lg">
                                  <p className="text-sm text-green-800">
                                    <strong>Outcome:</strong> {activity.outcome}
                                  </p>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center space-x-2">
                              {getStatusBadge(activity)}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(activity.Id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <ApperIcon name="Trash2" size={16} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Activities;