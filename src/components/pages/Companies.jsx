import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import companyService from '@/services/api/companyService';
import ApperIcon from '@/components/ApperIcon';
import BulkEditModal from '@/components/organisms/BulkEditModal';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import Badge from '@/components/atoms/Badge';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';
import Card from '@/components/atoms/Card';

const Companies = () => {
  const navigate = useNavigate();
  
  // State management
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [industryFilter, setIndustryFilter] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [showBulkEdit, setShowBulkEdit] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    industry: 'technology',
    website: '',
    contactEmail: '',
    phoneNumber: '',
    companySize: 'small',
    address: '',
    description: ''
  });

  // Load companies data
  const loadCompanies = async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await companyService.getAll();
      setCompanies(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  // Listen for data updates
  useEffect(() => {
    const handleDataUpdate = () => {
      loadCompanies();
    };

    window.addEventListener("dataUpdated", handleDataUpdate);
    return () => window.removeEventListener("dataUpdated", handleDataUpdate);
  }, []);

  // Handle company deletion
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this company? This action cannot be undone.")) {
      const success = await companyService.delete(id);
      if (success) {
        loadCompanies();
      }
    }
  };

  // Handle selection
  const handleSelectAll = () => {
    if (selectedCompanies.length === filteredAndSortedCompanies.length) {
      setSelectedCompanies([]);
    } else {
      setSelectedCompanies(filteredAndSortedCompanies.map(company => company.Id));
    }
  };

  const handleSelectCompany = (companyId) => {
    setSelectedCompanies(prev => {
      if (prev.includes(companyId)) {
        return prev.filter(id => id !== companyId);
      } else {
        return [...prev, companyId];
      }
    });
  };

  // Handle bulk operations
  const handleBulkEdit = () => {
    if (selectedCompanies.length === 0) {
      toast.error("Please select companies to edit");
      return;
    }
    setShowBulkEdit(true);
  };

  const handleBulkUpdateComplete = () => {
    setSelectedCompanies([]);
    loadCompanies();
  };

  // Handle company creation
  const handleCreateCompany = async (e) => {
    e.preventDefault();
    const result = await companyService.create(createForm);
    if (result) {
      setShowCreateModal(false);
      setCreateForm({
        name: '',
        industry: 'technology',
        website: '',
        contactEmail: '',
        phoneNumber: '',
        companySize: 'small',
        address: '',
        description: ''
      });
      loadCompanies();
    }
  };

  // Filter and sort companies
  const filteredAndSortedCompanies = companies
    .filter(company => {
      const matchesSearch = company.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           company.industry_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           company.contactEmail_c?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesIndustry = !industryFilter || company.industry_c === industryFilter;
      return matchesSearch && matchesIndustry;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a.Name || "").localeCompare(b.Name || "");
        case "industry":
          return (a.industry_c || "").localeCompare(b.industry_c || "");
        case "created":
          return new Date(b.CreatedOn || 0) - new Date(a.CreatedOn || 0);
        default:
          return 0;
      }
    });

  // Helper functions
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

  if (loading) return <Loading />;
  if (error) return <Error onRetry={loadCompanies} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Companies
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your company relationships and business partnerships
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          {selectedCompanies.length > 0 && (
            <Button
              variant="outline"
              onClick={handleBulkEdit}
              icon="Edit"
            >
              Edit Selected ({selectedCompanies.length})
            </Button>
          )}
          <Button
            onClick={() => setShowCreateModal(true)}
            icon="Plus"
          >
            Add Company
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Search companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon="Search"
          />
          
          <Select
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
          >
            <option value="">All Industries</option>
            <option value="technology">Technology</option>
            <option value="healthcare">Healthcare</option>
            <option value="finance">Finance</option>
            <option value="retail">Retail</option>
            <option value="manufacturing">Manufacturing</option>
            <option value="education">Education</option>
            <option value="other">Other</option>
          </Select>
          
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Sort by Name</option>
            <option value="industry">Sort by Industry</option>
            <option value="created">Sort by Created Date</option>
          </Select>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={loadCompanies}
              icon="RefreshCw"
              size="sm"
            >
              Refresh
            </Button>
          </div>
        </div>
      </Card>

      {/* Companies List */}
      {filteredAndSortedCompanies.length === 0 ? (
        <Empty 
          title="No companies found"
          description="Get started by adding your first company"
          action={{
            label: "Add Company",
            onClick: () => setShowCreateModal(true)
          }}
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedCompanies.length === filteredAndSortedCompanies.length && filteredAndSortedCompanies.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Industry
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedCompanies.map((company, index) => {
                  const isSelected = selectedCompanies.includes(company.Id);
                  
                  return (
                    <motion.tr
                      key={company.Id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`hover:bg-gray-50 transition-colors ${isSelected ? 'bg-primary-50' : ''}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectCompany(company.Id)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
                            <ApperIcon name="Building" size={20} className="text-primary-600" />
                          </div>
                          <div>
                            <button
                              onClick={() => navigate(`/companies/${company.Id}`)}
                              className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors text-left"
                            >
                              {company.Name || "Unnamed Company"}
                            </button>
                            {company.website_c && (
                              <div className="text-sm text-gray-500">
                                <a 
                                  href={company.website_c.startsWith('http') ? company.website_c : `https://${company.website_c}`}
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="hover:text-primary-600 transition-colors"
                                >
                                  {company.website_c}
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <ApperIcon name={getIndustryIcon(company.industry_c)} size={16} className="text-gray-400" />
                          <Badge variant={getIndustryColor(company.industry_c)} size="sm">
                            {company.industry_c || "Other"}
                          </Badge>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          {company.contactEmail_c && (
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <ApperIcon name="Mail" size={14} />
                              <span>{company.contactEmail_c}</span>
                            </div>
                          )}
                          {company.phoneNumber_c && (
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <ApperIcon name="Phone" size={14} />
                              <span>{company.phoneNumber_c}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={getSizeColor(company.companySize_c)} size="sm">
                          {company.companySize_c || "Small"}
                        </Badge>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {company.CreatedOn ? format(new Date(company.CreatedOn), "MMM dd, yyyy") : "N/A"}
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/companies/${company.Id}`)}
                            icon="Eye"
                          >
                            View
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(company.Id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <ApperIcon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Create Company Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-6 text-white">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Add New Company</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleCreateCompany} className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Company Name"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  required
                />
                <Select
                  label="Industry"
                  value={createForm.industry}
                  onChange={(e) => setCreateForm({ ...createForm, industry: e.target.value })}
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
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Website"
                  value={createForm.website}
                  onChange={(e) => setCreateForm({ ...createForm, website: e.target.value })}
                  placeholder="https://example.com"
                />
                <Input
                  label="Contact Email"
                  type="email"
                  value={createForm.contactEmail}
                  onChange={(e) => setCreateForm({ ...createForm, contactEmail: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Phone Number"
                  value={createForm.phoneNumber}
                  onChange={(e) => setCreateForm({ ...createForm, phoneNumber: e.target.value })}
                />
                <Select
                  label="Company Size"
                  value={createForm.companySize}
                  onChange={(e) => setCreateForm({ ...createForm, companySize: e.target.value })}
                  options={[
                    { value: "startup", label: "Startup" },
                    { value: "small", label: "Small" },
                    { value: "medium", label: "Medium" },
                    { value: "large", label: "Large" },
                    { value: "enterprise", label: "Enterprise" }
                  ]}
                />
              </div>
              
              <Input
                label="Address"
                value={createForm.address}
                onChange={(e) => setCreateForm({ ...createForm, address: e.target.value })}
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Company description..."
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Create Company
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Edit Modal */}
      <BulkEditModal
        isOpen={showBulkEdit}
        onClose={() => setShowBulkEdit(false)}
        selectedRecords={selectedCompanies}
        recordType="company"
        onUpdateComplete={handleBulkUpdateComplete}
      />
    </div>
  );
};

export default Companies;