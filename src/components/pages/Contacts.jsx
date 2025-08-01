import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { toast } from "react-toastify";
import BulkEditModal from "@/components/organisms/BulkEditModal";
import contactService from "@/services/api/contactService";
import ApperIcon from "@/components/ApperIcon";
import QuickAddModal from "@/components/organisms/QuickAddModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Card from "@/components/atoms/Card";
const Contacts = () => {
  const navigate = useNavigate();
const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showBulkEdit, setShowBulkEdit] = useState(false);
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
// Bulk selection handlers
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedContacts([]);
      setSelectAll(false);
    } else {
      setSelectedContacts(filteredAndSortedContacts.map(contact => contact.Id));
      setSelectAll(true);
    }
  };

  const handleSelectContact = (contactId) => {
    setSelectedContacts(prev => {
      const isSelected = prev.includes(contactId);
      const newSelection = isSelected
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId];
      setSelectAll(newSelection.length === filteredAndSortedContacts.length);
      return newSelection;
    });
  };

  const handleBulkEdit = () => {
    setShowBulkEdit(true);
  };

  const handleBulkUpdateComplete = () => {
    setSelectedContacts([]);
    setSelectAll(false);
    setShowBulkEdit(false);
    loadContacts(); // Refresh the contact list
  };
const filteredAndSortedContacts = contacts
    .filter(contact => {
      const contactName = contact.Name || contact.name || "";
      const contactCompany = contact.company_c || contact.company || "";
      const contactEmail = contact.email_c || contact.email || "";
      const contactType = contact.type_c || contact.type || "";
      
      const matchesSearch = 
        contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contactCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contactEmail.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = filterType === "all" || contactType === filterType;
      
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      const aName = a.Name || a.name || "";
      const bName = b.Name || b.name || "";
      const aCompany = a.company_c || a.company || "";
      const bCompany = b.company_c || b.company || "";
      const aCreated = a.createdAt_c || a.createdAt || "";
      const bCreated = b.createdAt_c || b.createdAt || "";
      
      switch (sortBy) {
        case "name":
          return aName.localeCompare(bName);
        case "company":
          return aCompany.localeCompare(bCompany);
        case "created":
          return new Date(bCreated) - new Date(aCreated);
        default:
          return 0;
      }
    });

const getTypeColor = (type) => {
    const contactType = type || "lead";
    const colors = {
      lead: "warning",
      customer: "success",
      partner: "info"
    };
    return colors[contactType] || "default";
  };

  const getTypeIcon = (type) => {
    const contactType = type || "lead";
    const icons = {
      lead: "Target",
      customer: "UserCheck",
      partner: "Handshake"
    };
    return icons[contactType] || "User";
  };

  if (loading) return <Loading type="table" />;
if (error) return <Error onRetry={loadContacts} />;

  return (
    <>
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
<div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
            {selectedContacts.length > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  {selectedContacts.length} selected
                </span>
                <Button
                  variant="secondary"
                  onClick={handleBulkEdit}
                  icon="Edit"
                  className="w-full sm:w-auto"
                >
                  Bulk Edit
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSelectedContacts([]);
                    setSelectAll(false);
                  }}
                  className="text-sm"
                >
                  Clear
                </Button>
              </div>
            )}
            <Button
              variant="primary"
              onClick={() => setShowQuickAdd(true)}
              icon="UserPlus"
              className="w-full sm:w-auto"
            >
              Add Contact
            </Button>
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
{/* Select All Checkbox */}
          {filteredAndSortedContacts.length > 0 && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
                />
                <span className="text-sm font-medium text-gray-700">
                  Select all contacts ({filteredAndSortedContacts.length})
                </span>
              </label>
            </div>
          )}

          {filteredAndSortedContacts.map((contact, index) => {
            const contactName = contact.Name || contact.name || "Unnamed Contact";
            const contactCompany = contact.company_c || contact.company || "";
            const contactEmail = contact.email_c || contact.email || "";
            const contactPhone = contact.phone_c || contact.phone || "";
            const contactType = contact.type_c || contact.type || "lead";
            const contactNotes = contact.notes_c || contact.notes || "";
            const createdAt = contact.createdAt_c || contact.createdAt || contact.CreatedOn;
            const isSelected = selectedContacts.includes(contact.Id);
            
            return (
              <motion.div
                key={contact.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`p-6 hover:shadow-lg transition-all duration-200 border-l-4 ${
                  isSelected ? 'border-l-primary-600 bg-primary-50' : 'border-l-primary-500'
                }`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectContact(contact.Id)}
                        className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
                      />
                      <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                        <ApperIcon name={getTypeIcon(contactType)} size={20} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{contactName}</h3>
                        <p className="text-gray-600">{contactCompany}</p>
                      </div>
                    </div>
                    <Badge variant={getTypeColor(contactType)} size="sm">
                      {contactType}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    {contactEmail && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <ApperIcon name="Mail" size={16} />
                        <span className="truncate">{contactEmail}</span>
                      </div>
                    )}
                    {contactPhone && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <ApperIcon name="Phone" size={16} />
                        <span>{contactPhone}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <ApperIcon name="Calendar" size={16} />
                      <span>Added {createdAt ? format(new Date(createdAt), "MMM dd, yyyy") : "Unknown"}</span>
                    </div>
                  </div>

                  {contactNotes && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700 line-clamp-2">{contactNotes}</p>
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
                        onClick={() => window.open(`mailto:${contactEmail}`, "_blank")}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        <ApperIcon name="Mail" size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(`tel:${contactPhone}`, "_blank")}
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
);
          })}
        </div>
      )}
      </div>

      {/* Stats Summary */}
      <Card className="p-6">
<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600">{contacts.length}</div>
            <div className="text-sm text-gray-600">Total Contacts</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-warning">
              {contacts.filter(c => (c.type_c || c.type) === "lead").length}
            </div>
            <div className="text-sm text-gray-600">Leads</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-success">
              {contacts.filter(c => (c.type_c || c.type) === "customer").length}
            </div>
            <div className="text-sm text-gray-600">Customers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-info">
              {contacts.filter(c => (c.type_c || c.type) === "partner").length}
            </div>
            <div className="text-sm text-gray-600">Partners</div>
          </div>
        </div>
      </Card>
    </div>

{/* Quick Add Modal */}
    <QuickAddModal 
      isOpen={showQuickAdd} 
      onClose={() => setShowQuickAdd(false)} 
    />

    {/* Bulk Edit Modal */}
    <BulkEditModal
      isOpen={showBulkEdit}
      onClose={() => setShowBulkEdit(false)}
      selectedRecords={selectedContacts}
      recordType="contact"
      onUpdateComplete={handleBulkUpdateComplete}
    />
  </>
  );
};

export default Contacts;