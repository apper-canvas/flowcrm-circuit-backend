import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Textarea from "@/components/atoms/Textarea";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import contactService from "@/services/api/contactService";
import dealService from "@/services/api/dealService";
import activityService from "@/services/api/activityService";

const ContactDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [contact, setContact] = useState(null);
  const [deals, setDeals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({});

  const loadContactData = async () => {
    try {
      setError(null);
      setLoading(true);
      
      const [contactData, dealsData, activitiesData] = await Promise.all([
        contactService.getById(parseInt(id)),
        dealService.getAll(),
        activityService.getAll()
      ]);
      
      setContact(contactData);
      setDeals(dealsData.filter(deal => deal.contactId === id));
      setActivities(activitiesData.filter(activity => activity.contactId === id));
      setEditForm(contactData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContactData();
  }, [id]);

  const handleSave = async () => {
    try {
      const updatedContact = await contactService.update(parseInt(id), editForm);
      setContact(updatedContact);
      setEditMode(false);
      toast.success("Contact updated successfully");
    } catch (error) {
      toast.error("Failed to update contact");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this contact? This action cannot be undone.")) {
      try {
        await contactService.delete(parseInt(id));
        toast.success("Contact deleted successfully");
        navigate("/contacts");
      } catch (error) {
        toast.error("Failed to delete contact");
      }
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      lead: "warning",
      customer: "success",
      partner: "info"
    };
    return colors[type] || "default";
  };

  const getTypeIcon = (type) => {
    const icons = {
      lead: "Target",
      customer: "UserCheck",
      partner: "Handshake"
    };
    return icons[type] || "User";
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

  const getStageColor = (stage) => {
    const colors = {
      "Lead": "warning",
      "Qualified": "info",
      "Proposal": "secondary",
      "Negotiation": "accent",
      "Closed Won": "success",
      "Closed Lost": "error"
    };
    return colors[stage] || "default";
  };

  if (loading) return <Loading />;
  if (error) return <Error onRetry={loadContactData} />;
  if (!contact) return <Error title="Contact not found" message="The contact you're looking for doesn't exist." />;

  const tabs = [
    { id: "overview", label: "Overview", icon: "User" },
    { id: "deals", label: "Deals", icon: "DollarSign", count: deals.length },
    { id: "activities", label: "Activities", icon: "Calendar", count: activities.length }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate("/contacts")}
            icon="ArrowLeft"
          >
            Back to Contacts
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {contact.name}
            </h1>
            <p className="text-gray-600 mt-1">{contact.company}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          {!editMode ? (
            <>
              <Button variant="outline" onClick={() => setEditMode(true)} icon="Edit">
                Edit Contact
              </Button>
              <Button variant="outline" onClick={handleDelete} className="text-red-600 border-red-300 hover:bg-red-50">
                <ApperIcon name="Trash2" size={16} />
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setEditMode(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} icon="Save">
                Save Changes
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Contact Info Card */}
      <Card className="p-6">
        <div className="flex items-start space-x-6">
          <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
            <ApperIcon name={getTypeIcon(contact.type)} size={32} className="text-white" />
          </div>
          
          <div className="flex-1">
            {editMode ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                />
                <Input
                  label="Company"
                  value={editForm.company}
                  onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                />
                <Input
                  label="Email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                />
                <Input
                  label="Phone"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                />
                <Input
                  label="Address"
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                />
                <Select
                  label="Type"
                  value={editForm.type}
                  onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                  options={[
                    { value: "lead", label: "Lead" },
                    { value: "customer", label: "Customer" },
                    { value: "partner", label: "Partner" }
                  ]}
                />
                <div className="md:col-span-2">
                  <Textarea
                    label="Notes"
                    value={editForm.notes}
                    onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{contact.name}</h2>
                    <p className="text-lg text-gray-600">{contact.company}</p>
                    <div className="mt-2">
                      <Badge variant={getTypeColor(contact.type)}>{contact.type}</Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {contact.email && (
                      <div className="flex items-center space-x-3">
                        <ApperIcon name="Mail" size={18} className="text-gray-400" />
                        <span className="text-gray-700">{contact.email}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(`mailto:${contact.email}`, "_blank")}
                          className="text-primary-600 hover:text-primary-700"
                        >
                          <ApperIcon name="ExternalLink" size={14} />
                        </Button>
                      </div>
                    )}
                    {contact.phone && (
                      <div className="flex items-center space-x-3">
                        <ApperIcon name="Phone" size={18} className="text-gray-400" />
                        <span className="text-gray-700">{contact.phone}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(`tel:${contact.phone}`, "_blank")}
                          className="text-primary-600 hover:text-primary-700"
                        >
                          <ApperIcon name="ExternalLink" size={14} />
                        </Button>
                      </div>
                    )}
                    {contact.address && (
                      <div className="flex items-center space-x-3">
                        <ApperIcon name="MapPin" size={18} className="text-gray-400" />
                        <span className="text-gray-700">{contact.address}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Contact Details</h3>
                    <div className="mt-2 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Created:</span>
                        <span className="text-gray-900">{format(new Date(contact.createdAt), "MMM dd, yyyy")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Updated:</span>
                        <span className="text-gray-900">{format(new Date(contact.updatedAt), "MMM dd, yyyy")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Deals:</span>
                        <span className="text-gray-900">{deals.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Activities:</span>
                        <span className="text-gray-900">{activities.length}</span>
                      </div>
                    </div>
                  </div>
                  
                  {contact.notes && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Notes</h3>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">{contact.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <ApperIcon name={tab.icon} size={16} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <Badge variant="secondary" size="sm">{tab.count}</Badge>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === "deals" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deals.map((deal) => (
              <motion.div
                key={deal.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="p-6 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{deal.title}</h3>
                      <p className="text-2xl font-bold text-primary-600 mt-1">
                        ${deal.value?.toLocaleString() || "0"}
                      </p>
                    </div>
                    <Badge variant={getStageColor(deal.stage)} size="sm">
                      {deal.stage}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Calendar" size={16} />
                      <span>Expected: {format(new Date(deal.expectedCloseDate), "MMM dd, yyyy")}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Clock" size={16} />
                      <span>Created: {format(new Date(deal.createdAt), "MMM dd, yyyy")}</span>
                    </div>
                  </div>
                  
                  {deal.notes && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700 line-clamp-2">{deal.notes}</p>
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
            {deals.length === 0 && (
              <div className="col-span-full">
                <Card className="p-12 text-center">
                  <ApperIcon name="DollarSign" size={48} className="text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No deals yet</h3>
                  <p className="text-gray-600">Create your first deal with this contact to start tracking opportunities.</p>
                </Card>
              </div>
            )}
          </div>
        )}

        {activeTab === "activities" && (
          <div className="space-y-4">
            {activities.map((activity) => (
              <motion.div
                key={activity.Id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
                      <ApperIcon name={getActivityIcon(activity.type)} size={20} className="text-primary-600" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{activity.title}</h3>
                          <p className="text-gray-600 mt-1">{activity.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="primary" size="sm">{activity.type}</Badge>
                          {activity.completed ? (
                            <Badge variant="success" size="sm">Completed</Badge>
                          ) : (
                            <Badge variant="warning" size="sm">Pending</Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <ApperIcon name="Calendar" size={16} />
                          <span>Created: {format(new Date(activity.createdAt), "MMM dd, yyyy 'at' h:mm a")}</span>
                        </div>
                        {activity.dueDate && (
                          <div className="flex items-center space-x-1">
                            <ApperIcon name="Clock" size={16} />
                            <span>Due: {format(new Date(activity.dueDate), "MMM dd, yyyy 'at' h:mm a")}</span>
                          </div>
                        )}
                      </div>
                      
                      {activity.outcome && (
                        <div className="mt-3 p-3 bg-green-50 rounded-lg">
                          <p className="text-sm text-green-800">
                            <strong>Outcome:</strong> {activity.outcome}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
            {activities.length === 0 && (
              <Card className="p-12 text-center">
                <ApperIcon name="Calendar" size={48} className="text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No activities yet</h3>
                <p className="text-gray-600">Start tracking your interactions by creating activities for this contact.</p>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactDetail;