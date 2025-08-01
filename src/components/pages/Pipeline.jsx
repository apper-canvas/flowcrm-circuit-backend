import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { toast } from "react-toastify";
import contactService from "@/services/api/contactService";
import dealService from "@/services/api/dealService";
import ApperIcon from "@/components/ApperIcon";
import QuickAddModal from "@/components/organisms/QuickAddModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const Pipeline = () => {
const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [draggedDeal, setDraggedDeal] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const stages = [
    { name: "Lead", color: "bg-yellow-100 border-yellow-300", textColor: "text-yellow-800" },
    { name: "Qualified", color: "bg-blue-100 border-blue-300", textColor: "text-blue-800" },
    { name: "Proposal", color: "bg-purple-100 border-purple-300", textColor: "text-purple-800" },
    { name: "Negotiation", color: "bg-orange-100 border-orange-300", textColor: "text-orange-800" },
    { name: "Closed Won", color: "bg-green-100 border-green-300", textColor: "text-green-800" },
    { name: "Closed Lost", color: "bg-red-100 border-red-300", textColor: "text-red-800" }
  ];

  const loadData = async () => {
    try {
      setError(null);
      setLoading(true);
      
      const [dealsData, contactsData] = await Promise.all([
        dealService.getAll(),
        contactService.getAll()
      ]);
      
      setDeals(dealsData);
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

  const handleDragStart = (e, deal) => {
    setDraggedDeal(deal);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e, newStage) => {
    e.preventDefault();
    
    if (draggedDeal && draggedDeal.stage !== newStage) {
      try {
        const updatedDeal = await dealService.update(draggedDeal.Id, {
          ...draggedDeal,
          stage: newStage
        });
        
        setDeals(deals.map(deal => 
          deal.Id === draggedDeal.Id ? updatedDeal : deal
        ));
        
        toast.success(`Deal moved to ${newStage}`);
      } catch (error) {
        toast.error("Failed to update deal stage");
      }
    }
    
    setDraggedDeal(null);
  };

  const getContactName = (contactId) => {
    const contact = contacts.find(c => c.Id.toString() === contactId);
    return contact ? contact.name : "Unknown Contact";
  };

  const getStageDeals = (stageName) => {
    return deals.filter(deal => deal.stage === stageName);
  };

  const getStageValue = (stageName) => {
    return getStageDeals(stageName).reduce((sum, deal) => sum + (deal.value || 0), 0);
  };

  const getTotalPipelineValue = () => {
    return deals.reduce((sum, deal) => sum + (deal.value || 0), 0);
  };

  if (loading) return <Loading />;
  if (error) return <Error onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Sales Pipeline
          </h1>
          <p className="text-gray-600 mt-1">
            Track and manage your deals through the sales process
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Add New Deal
          </Button>
        </div>
      </div>

      {/* Pipeline Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="GitBranch" size={24} className="text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-primary-700">Total Deals</p>
              <p className="text-2xl font-bold text-primary-900">{deals.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-secondary-50 to-secondary-100 border-secondary-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="DollarSign" size={24} className="text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-700">Pipeline Value</p>
              <p className="text-2xl font-bold text-secondary-900">${getTotalPipelineValue().toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckCircle" size={24} className="text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-green-700">Closed Won</p>
              <p className="text-2xl font-bold text-green-900">{getStageDeals("Closed Won").length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="TrendingUp" size={24} className="text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-orange-700">Conversion Rate</p>
              <p className="text-2xl font-bold text-orange-900">
                {deals.length > 0 ? Math.round((getStageDeals("Closed Won").length / deals.length) * 100) : 0}%
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Pipeline Board */}
      {deals.length === 0 ? (
        <Empty
          title="No deals in pipeline"
          message="Start tracking your sales opportunities by creating your first deal."
          actionLabel="Add Deal"
          icon="GitBranch"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 min-h-[600px]">
          {stages.map((stage) => {
            const stageDeals = getStageDeals(stage.name);
            const stageValue = getStageValue(stage.name);
            
            return (
              <div
                key={stage.name}
                className="flex flex-col"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage.name)}
              >
                {/* Stage Header */}
                <div className={`p-4 rounded-t-lg border-2 ${stage.color} ${stage.textColor}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{stage.name}</h3>
                    <Badge variant="secondary" size="sm">{stageDeals.length}</Badge>
                  </div>
                  <p className="text-sm font-medium">
                    ${stageValue.toLocaleString()}
                  </p>
                </div>

                {/* Stage Content */}
                <div className="flex-1 bg-gray-50 border-l-2 border-r-2 border-b-2 border-gray-200 rounded-b-lg p-2 space-y-3 min-h-[500px]">
                  {stageDeals.map((deal, index) => (
                    <motion.div
                      key={deal.Id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      draggable
                      onDragStart={(e) => handleDragStart(e, deal)}
                      className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-all duration-200 transform hover:scale-105"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-gray-900 text-sm line-clamp-2">
                          {deal.title}
                        </h4>
                        <ApperIcon name="GripVertical" size={16} className="text-gray-400 flex-shrink-0 ml-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-primary-600">
                            ${deal.value?.toLocaleString() || "0"}
                          </span>
                        </div>
                        
                        <div className="text-xs text-gray-600 space-y-1">
                          <div className="flex items-center space-x-1">
                            <ApperIcon name="User" size={12} />
                            <span className="truncate">{getContactName(deal.contactId)}</span>
                          </div>
                          
                          {deal.expectedCloseDate && (
                            <div className="flex items-center space-x-1">
                              <ApperIcon name="Calendar" size={12} />
                              <span>{format(new Date(deal.expectedCloseDate), "MMM dd")}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center space-x-1">
                            <ApperIcon name="Clock" size={12} />
                            <span>{format(new Date(deal.createdAt), "MMM dd")}</span>
                          </div>
                        </div>
                        
                        {deal.notes && (
                          <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-700 line-clamp-2">
                            {deal.notes}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  
                  {stageDeals.length === 0 && (
                    <div className="flex items-center justify-center h-32 text-gray-400">
                      <div className="text-center">
                        <ApperIcon name="Plus" size={24} className="mx-auto mb-2 opacity-50" />
                        <p className="text-xs">Drop deals here</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pipeline Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Stage Distribution</h3>
          <div className="space-y-3">
            {stages.map((stage) => {
              const stageDeals = getStageDeals(stage.name);
              const percentage = deals.length > 0 ? (stageDeals.length / deals.length) * 100 : 0;
              
              return (
                <div key={stage.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{stage.name}</span>
                    <span className="text-sm text-gray-600">{stageDeals.length} deals</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        stage.name === "Lead" ? "bg-yellow-500" :
                        stage.name === "Qualified" ? "bg-blue-500" :
                        stage.name === "Proposal" ? "bg-purple-500" :
                        stage.name === "Negotiation" ? "bg-orange-500" :
                        stage.name === "Closed Won" ? "bg-green-500" :
                        "bg-red-500"
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}%</div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Value by Stage</h3>
          <div className="space-y-4">
            {stages.map((stage) => {
              const stageValue = getStageValue(stage.name);
              const percentage = getTotalPipelineValue() > 0 ? (stageValue / getTotalPipelineValue()) * 100 : 0;
              
              return (
                <div key={stage.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${
                      stage.name === "Lead" ? "bg-yellow-500" :
                      stage.name === "Qualified" ? "bg-blue-500" :
                      stage.name === "Proposal" ? "bg-purple-500" :
                      stage.name === "Negotiation" ? "bg-orange-500" :
                      stage.name === "Closed Won" ? "bg-green-500" :
                      "bg-red-500"
                    }`} />
                    <span className="text-sm font-medium text-gray-700">{stage.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">
                      ${stageValue.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
</Card>
      </div>

      {/* Add Deal Modal */}
      <QuickAddModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        type="deal"
        onSuccess={() => {
          setShowAddModal(false);
          loadData(); // Refresh the pipeline data
        }}
      />
    </div>
  );
};

export default Pipeline;