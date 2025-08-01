import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Textarea from '@/components/atoms/Textarea';
import contactService from '@/services/api/contactService';
import dealService from '@/services/api/dealService';

const BulkEditModal = ({ isOpen, onClose, selectedRecords, recordType, onUpdateComplete }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});

  // Field configurations based on Tables & Fields JSON
  const fieldConfigs = {
    contact: {
      Name: { type: 'text', label: 'Name' },
      Tags: { type: 'text', label: 'Tags', placeholder: 'Comma-separated tags' },
      Owner: { type: 'text', label: 'Owner' },
      company_c: { type: 'text', label: 'Company' },
      email_c: { type: 'email', label: 'Email' },
      phone_c: { type: 'tel', label: 'Phone' },
      address_c: { type: 'text', label: 'Address' },
      type_c: { 
        type: 'select', 
        label: 'Type',
        options: [
          { value: '', label: 'No change' },
          { value: 'lead', label: 'Lead' },
          { value: 'customer', label: 'Customer' },
          { value: 'partner', label: 'Partner' }
        ]
      },
      industry_c: { 
        type: 'select', 
        label: 'Industry',
        options: [
          { value: '', label: 'No change' },
          { value: 'technology', label: 'Technology' },
          { value: 'healthcare', label: 'Healthcare' },
          { value: 'finance', label: 'Finance' },
          { value: 'retail', label: 'Retail' },
          { value: 'manufacturing', label: 'Manufacturing' },
          { value: 'education', label: 'Education' },
          { value: 'other', label: 'Other' }
        ]
      },
      companySize_c: { 
        type: 'select', 
        label: 'Company Size',
        options: [
          { value: '', label: 'No change' },
          { value: 'startup', label: 'Startup' },
          { value: 'small', label: 'Small' },
          { value: 'medium', label: 'Medium' },
          { value: 'large', label: 'Large' },
          { value: 'enterprise', label: 'Enterprise' }
        ]
      },
      engagementLevel_c: { 
        type: 'select', 
        label: 'Engagement Level',
        options: [
          { value: '', label: 'No change' },
          { value: 'high', label: 'High' },
          { value: 'medium', label: 'Medium' },
          { value: 'low', label: 'Low' }
        ]
      },
      leadScore_c: { type: 'number', label: 'Lead Score' },
      notes_c: { type: 'textarea', label: 'Notes' }
    },
    deal: {
      Name: { type: 'text', label: 'Name' },
      Tags: { type: 'text', label: 'Tags', placeholder: 'Comma-separated tags' },
      Owner: { type: 'text', label: 'Owner' },
      title_c: { type: 'text', label: 'Title' },
      value_c: { type: 'number', label: 'Value', step: '0.01' },
      stage_c: { 
        type: 'select', 
        label: 'Stage',
        options: [
          { value: '', label: 'No change' },
          { value: 'Lead', label: 'Lead' },
          { value: 'Qualified', label: 'Qualified' },
          { value: 'Proposal', label: 'Proposal' },
          { value: 'Negotiation', label: 'Negotiation' },
          { value: 'Closed Won', label: 'Closed Won' },
          { value: 'Closed Lost', label: 'Closed Lost' }
        ]
      },
      expectedCloseDate_c: { type: 'date', label: 'Expected Close Date' },
      notes_c: { type: 'textarea', label: 'Notes' },
      contactId_c: { type: 'text', label: 'Contact ID' }
    }
  };

  const resetForm = () => {
    setFormData({});
  };

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleClearField = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: null // null indicates field should be cleared
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedRecords.length === 0) {
      toast.error('No records selected');
      return;
    }

    // Filter out undefined values, keep null values for clearing fields
    const updateData = Object.fromEntries(
      Object.entries(formData).filter(([key, value]) => value !== undefined)
    );

    if (Object.keys(updateData).length === 0) {
      toast.error('No changes specified');
      return;
    }

    setLoading(true);

    try {
      let result;
      
      if (recordType === 'contact') {
        result = await contactService.bulkUpdate(selectedRecords, updateData);
      } else if (recordType === 'deal') {
        result = await dealService.bulkUpdate(selectedRecords, updateData);
      }

      if (result?.success) {
        toast.success(`Successfully updated ${result.updatedCount} ${recordType}s`);
        onUpdateComplete();
        onClose();
      } else {
        toast.error(result?.message || 'Update failed');
      }
    } catch (error) {
      toast.error('An error occurred during bulk update');
      console.error('Bulk update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentFields = fieldConfigs[recordType] || {};

  const renderField = (fieldName, config) => {
    const value = formData[fieldName] ?? '';
    const isCleared = formData[fieldName] === null;

    return (
      <div key={fieldName} className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            {config.label}
          </label>
          <button
            type="button"
            onClick={() => handleClearField(fieldName)}
            className="text-xs text-red-600 hover:text-red-800 transition-colors"
            title={`Clear ${config.label} for all selected records`}
          >
            Clear field
          </button>
        </div>
        
        {isCleared ? (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
            This field will be cleared for all selected records
            <button
              type="button"
              onClick={() => handleInputChange(fieldName, '')}
              className="ml-2 text-red-800 hover:text-red-900 underline"
            >
              Undo
            </button>
          </div>
        ) : (
          <>
            {config.type === 'select' ? (
              <Select
                value={value}
                onChange={(e) => handleInputChange(fieldName, e.target.value)}
                className="w-full"
              >
                {config.options.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            ) : config.type === 'textarea' ? (
              <Textarea
                value={value}
                onChange={(e) => handleInputChange(fieldName, e.target.value)}
                placeholder={config.placeholder || `Update ${config.label.toLowerCase()}`}
                rows={3}
                className="w-full"
              />
            ) : (
              <Input
                type={config.type}
                value={value}
                onChange={(e) => handleInputChange(fieldName, e.target.value)}
                placeholder={config.placeholder || `Update ${config.label.toLowerCase()}`}
                step={config.step}
                className="w-full"
              />
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={onClose}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl"
            >
              <div className="flex items-center justify-between p-6 border-b">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Bulk Edit {recordType === 'contact' ? 'Contacts' : 'Deals'}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Update {selectedRecords.length} selected {recordType}{selectedRecords.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <ApperIcon name="X" size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <ApperIcon name="Info" size={20} className="text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">How bulk editing works:</p>
                      <ul className="list-disc list-inside space-y-1 text-blue-700">
                        <li>Only fields with values will be updated</li>
                        <li>Leave fields empty to keep existing values unchanged</li>
                        <li>Use "Clear field" to remove values from all selected records</li>
                        <li>Changes will be applied to all {selectedRecords.length} selected records</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-96 overflow-y-auto">
                  {Object.entries(currentFields).map(([fieldName, config]) => 
                    renderField(fieldName, config)
                  )}
                </div>

                <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={onClose}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loading}
                    icon={loading ? "Loader2" : "Save"}
                    className={loading ? "animate-spin" : ""}
                  >
                    {loading ? 'Updating...' : `Update ${selectedRecords.length} ${recordType}${selectedRecords.length !== 1 ? 's' : ''}`}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BulkEditModal;