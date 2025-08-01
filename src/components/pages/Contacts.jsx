import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
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
import contactService from "@/services/api/contactService";

const Contacts = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  const loadContacts = async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await contactService.getAll();
      setContacts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
    
    const handleDataUpdate = () => {
      loadContacts();
    };
    
    window.addEventListener("dataUpdated", handleDataUpdate);
    return () => window.removeEventListener("dataUpdated", handleDataUpdate);
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      try {
        await contactService.delete(id);
        setContacts(contacts.filter(contact => contact.Id !== id));
        toast.success("Contact deleted successfully");
      } catch (error) {
        toast.error("Failed to delete contact");
      }
    }
  };

  const filteredAndSortedContacts = contacts
    .filter(contact => {
      const matchesSearch = 
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = filterType === "all" || contact.type === filterType;
      
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "company":
          return a.company.localeCompare(b.company);
        case "created":
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

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

  if (loading) return <Loading type="table" />;
  if (error) return <Error onRetry={loadContacts} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Contacts
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your customers, leads, and business partners
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Search contacts..."
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
                { value: "lead", label: "Leads" },
                { value: "customer", label: "Customers" },
                { value: "partner", label: "Partners" }
              ]}
            />
            
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={[
                { value: "name", label: "Sort by Name" },
                { value: "company", label: "Sort by Company" },
                { value: "created", label: "Sort by Date" }
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Contacts Grid */}
      {filteredAndSortedContacts.length === 0 ? (
        <Empty
          title="No contacts found"
          message={searchTerm || filterType !== "all" 
            ? "Try adjusting your search or filter criteria." 
            : "Start building your network by adding your first contact."}
          actionLabel="Add Contact"
          icon="Users"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAndSortedContacts.map((contact, index) => (
            <motion.div
              key={contact.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary-500">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                      <ApperIcon name={getTypeIcon(contact.type)} size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{contact.name}</h3>
                      <p className="text-gray-600">{contact.company}</p>
                    </div>
                  </div>
                  <Badge variant={getTypeColor(contact.type)} size="sm">
                    {contact.type}
                  </Badge>
                </div>

                <div className="space-y-2 mb-4">
                  {contact.email && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <ApperIcon name="Mail" size={16} />
                      <span className="truncate">{contact.email}</span>
                    </div>
                  )}
                  {contact.phone && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <ApperIcon name="Phone" size={16} />
                      <span>{contact.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <ApperIcon name="Calendar" size={16} />
                    <span>Added {format(new Date(contact.createdAt), "MMM dd, yyyy")}</span>
                  </div>
                </div>

                {contact.notes && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700 line-clamp-2">{contact.notes}</p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/contacts/${contact.Id}`)}
                    icon="Eye"
                  >
                    View Details
                  </Button>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(`mailto:${contact.email}`, "_blank")}
                      className="text-primary-600 hover:text-primary-700"
                    >
                      <ApperIcon name="Mail" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(`tel:${contact.phone}`, "_blank")}
                      className="text-secondary-600 hover:text-secondary-700"
                    >
                      <ApperIcon name="Phone" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(contact.Id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <ApperIcon name="Trash2" size={16} />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Stats Summary */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600">{contacts.length}</div>
            <div className="text-sm text-gray-600">Total Contacts</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-warning">{contacts.filter(c => c.type === "lead").length}</div>
            <div className="text-sm text-gray-600">Leads</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-success">{contacts.filter(c => c.type === "customer").length}</div>
            <div className="text-sm text-gray-600">Customers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-info">{contacts.filter(c => c.type === "partner").length}</div>
            <div className="text-sm text-gray-600">Partners</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Contacts;