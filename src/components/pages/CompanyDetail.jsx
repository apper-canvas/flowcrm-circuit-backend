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
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import companyService from "@/services/api/companyService";
import contactService from "@/services/api/contactService";

const CompanyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [company, setCompany] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({});

  const loadCompanyData = async () => {
    try {
      setError(null);
      setLoading(true);
      
      const [companyData, contactsData] = await Promise.all([
        companyService.getById(parseInt(id)),
        contactService.getAll()
      ]);
      
      setCompany(companyData);
      // Filter contacts that belong to this company
      setContacts(contactsData.filter(contact => 
        contact.company_c?.toLowerCase() === companyData?.Name?.toLowerCase()
      ));
      setEditForm(companyData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanyData();
  }, [id]);

  const handleSave = async () => {
    try {
      const updatedCompany = await companyService.update(parseInt(id), editForm);
      setCompany(updatedCompany);
      setEditMode(false);
      toast.success("Company updated successfully");
    } catch (error) {
      toast.error("Failed to update company");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this company? This action cannot be undone.")) {
      try {
        await companyService.delete(parseInt(id));
        toast.success("Company deleted successfully");
        navigate("/companies");
      } catch (error) {
        toast.error("Failed to delete company");
      }
    }
  };

  const getIndustryColor = (industry) => {
    const colors = {
      technology: "info",
      healthcare: "success",
      finance: "warning",
      retail: "accent",
      manufacturing: "secondary",
      education: "primary",
      other: "default"
    };
    return colors[industry] || "default";
  };

  const getIndustryIcon = (industry) => {
    const icons = {
      technology: "Laptop",
      healthcare: "Heart",
      finance: "DollarSign",
      retail: "ShoppingBag",
      manufacturing: "Settings",
      education: "GraduationCap",
      other: "Building"
    };
    return icons[industry] || "Building";
  };

  const getSizeColor = (size) => {
    const colors = {
      startup: "warning",
      small: "info",
      medium: "primary",
      large: "secondary",
      enterprise: "success"
    };
    return colors[size] || "default";
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

  if (loading) return <Loading />;
  if (error) return <Error onRetry={loadCompanyData} />;
  if (!company) return <Error title="Company not found" message="The company you're looking for doesn't exist." />;

  const tabs = [
    { id: "overview", label: "Overview", icon: "Building" },
    { id: "contacts", label: "Associated Contacts", icon: "Users", count: contacts.length }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate("/companies")}
            icon="ArrowLeft"
          >
            Back to Companies
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {company.Name}
            </h1>
            <p className="text-gray-600 mt-1">
              {company.industry_c && (
                <Badge variant={getIndustryColor(company.industry_c)} size="sm">
                  {company.industry_c}
                </Badge>
              )}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          {!editMode ? (
            <>
              <Button variant="outline" onClick={() => setEditMode(true)} icon="Edit">
                Edit Company
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

      {/* Company Info Card */}
      <Card className="p-6">
        <div className="flex items-start space-x-6">
          <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
            <ApperIcon name={getIndustryIcon(company.industry_c)} size={32} className="text-white" />
          </div>
          
          <div className="flex-1">
            {editMode ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Company Name"
                  value={editForm.Name || ""}
                  onChange={(e) => setEditForm({ ...editForm, Name: e.target.value })}
                />
                <Select
                  label="Industry"
                  value={editForm.industry_c || ""}
                  onChange={(e) => setEditForm({ ...editForm, industry_c: e.target.value })}
                  options={[
                    { value: "technology", label: "Technology" },
                    { value: "healthcare", label: "Healthcare" },
                    { value: "finance", label: "Finance" },
                    { value: "retail", label: "Retail" },
                    { value: "manufacturing", label: "Manufacturing" },
                    { value: "education", label: "Education" },
                    { value: "other", label: "Other" }
                  ]}
                />
                <Input
                  label="Website"
                  value={editForm.website_c || ""}
                  onChange={(e) => setEditForm({ ...editForm, website_c: e.target.value })}
                />
                <Input
                  label="Contact Email"
                  type="email"
                  value={editForm.contactEmail_c || ""}
                  onChange={(e) => setEditForm({ ...editForm, contactEmail_c: e.target.value })}
                />
                <Input
                  label="Phone Number"
                  value={editForm.phoneNumber_c || ""}
                  onChange={(e) => setEditForm({ ...editForm, phoneNumber_c: e.target.value })}
                />
                <Select
                  label="Company Size"
                  value={editForm.companySize_c || ""}
                  onChange={(e) => setEditForm({ ...editForm, companySize_c: e.target.value })}
                  options={[
                    { value: "startup", label: "Startup" },
                    { value: "small", label: "Small" },
                    { value: "medium", label: "Medium" },
                    { value: "large", label: "Large" },
                    { value: "enterprise", label: "Enterprise" }
                  ]}
                />
                <div className="md:col-span-2">
                  <Input
                    label="Address"
                    value={editForm.address_c || ""}
                    onChange={(e) => setEditForm({ ...editForm, address_c: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={editForm.description_c || ""}
                    onChange={(e) => setEditForm({ ...editForm, description_c: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{company.Name}</h2>
                    <div className="mt-2 flex items-center space-x-2">
                      <Badge variant={getIndustryColor(company.industry_c)}>{company.industry_c || "Other"}</Badge>
                      <Badge variant={getSizeColor(company.companySize_c)}>{company.companySize_c || "Small"}</Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {company.website_c && (
                      <div className="flex items-center space-x-3">
                        <ApperIcon name="Globe" size={18} className="text-gray-400" />
                        <a 
                          href={company.website_c.startsWith('http') ? company.website_c : `https://${company.website_c}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-700 transition-colors"
                        >
                          {company.website_c}
                        </a>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(company.website_c.startsWith('http') ? company.website_c : `https://${company.website_c}`, "_blank")}
                          className="text-primary-600 hover:text-primary-700"
                        >
                          <ApperIcon name="ExternalLink" size={14} />
                        </Button>
                      </div>
                    )}
                    {company.contactEmail_c && (
                      <div className="flex items-center space-x-3">
                        <ApperIcon name="Mail" size={18} className="text-gray-400" />
                        <span className="text-gray-700">{company.contactEmail_c}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(`mailto:${company.contactEmail_c}`, "_blank")}
                          className="text-primary-600 hover:text-primary-700"
                        >
                          <ApperIcon name="ExternalLink" size={14} />
                        </Button>
                      </div>
                    )}
                    {company.phoneNumber_c && (
                      <div className="flex items-center space-x-3">
                        <ApperIcon name="Phone" size={18} className="text-gray-400" />
                        <span className="text-gray-700">{company.phoneNumber_c}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(`tel:${company.phoneNumber_c}`, "_blank")}
                          className="text-primary-600 hover:text-primary-700"
                        >
                          <ApperIcon name="ExternalLink" size={14} />
                        </Button>
                      </div>
                    )}
                    {company.address_c && (
                      <div className="flex items-center space-x-3">
                        <ApperIcon name="MapPin" size={18} className="text-gray-400" />
                        <span className="text-gray-700">{company.address_c}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Company Details</h3>
                    <div className="mt-2 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Created:</span>
                        <span className="text-gray-900">
                          {company.CreatedOn ? format(new Date(company.CreatedOn), "MMM dd, yyyy") : "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Updated:</span>
                        <span className="text-gray-900">
                          {company.ModifiedOn ? format(new Date(company.ModifiedOn), "MMM dd, yyyy") : "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Associated Contacts:</span>
                        <span className="text-gray-900">{contacts.length}</span>
                      </div>
                    </div>
                  </div>
                  
                  {company.description_c && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Description</h3>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">{company.description_c}</p>
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
        {activeTab === "contacts" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contacts.map((contact) => (
              <motion.div
                key={contact.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="p-6 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
                        <ApperIcon name={getTypeIcon(contact.type_c)} size={20} className="text-primary-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{contact.Name}</h3>
                        <p className="text-sm text-gray-600">{contact.email_c}</p>
                      </div>
                    </div>
                    <Badge variant={getTypeColor(contact.type_c)} size="sm">
                      {contact.type_c}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    {contact.phone_c && (
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="Phone" size={16} />
                        <span>{contact.phone_c}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Calendar" size={16} />
                      <span>
                        Added: {contact.createdAt_c ? format(new Date(contact.createdAt_c), "MMM dd, yyyy") : "N/A"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/contacts/${contact.Id}`)}
                      className="w-full"
                    >
                      View Contact Details
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
            {contacts.length === 0 && (
              <div className="col-span-full">
                <Card className="p-12 text-center">
                  <ApperIcon name="Users" size={48} className="text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No associated contacts</h3>
                  <p className="text-gray-600">Contacts with this company name will appear here automatically.</p>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDetail;