import { toast } from "react-toastify";

class DealService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'deal_c';
    
    // Define updateable fields for database operations
    this.updateableFields = [
      'Name', 'Tags', 'Owner', 'title_c', 'value_c', 'stage_c', 
      'expectedCloseDate_c', 'notes_c', 'createdAt_c', 'updatedAt_c', 'contactId_c'
    ];
  }

  // Fetch all deals with proper field mapping
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "title_c" } },
          { field: { Name: "value_c" } },
          { field: { Name: "stage_c" } },
          { field: { Name: "expectedCloseDate_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "createdAt_c" } },
          { field: { Name: "updatedAt_c" } },
          { 
            field: { Name: "contactId_c" },
            referenceField: { field: { Name: "Name" } }
          }
        ],
        orderBy: [
          { fieldName: "createdAt_c", sorttype: "DESC" }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching deals:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error fetching deals:", error.message);
        toast.error("Failed to fetch deals");
      }
      return [];
    }
  }

  // Get deal by ID
  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "title_c" } },
          { field: { Name: "value_c" } },
          { field: { Name: "stage_c" } },
          { field: { Name: "expectedCloseDate_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "createdAt_c" } },
          { field: { Name: "updatedAt_c" } },
          { 
            field: { Name: "contactId_c" },
            referenceField: { field: { Name: "Name" } }
          }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching deal with ID ${id}:`, error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error fetching deal:", error.message);
        toast.error("Failed to fetch deal details");
      }
      return null;
    }
  }

  // Create new deal (only updateable fields)
  async create(dealData) {
    try {
      const params = {
        records: [
          {
            Name: dealData.Name || dealData.title || "",
            Tags: dealData.Tags || "",
            title_c: dealData.title_c || dealData.title || "",
            value_c: parseFloat(dealData.value_c || dealData.value || 0),
            stage_c: dealData.stage_c || dealData.stage || "Lead",
            expectedCloseDate_c: dealData.expectedCloseDate_c || dealData.expectedCloseDate || null,
            notes_c: dealData.notes_c || dealData.notes || "",
            createdAt_c: new Date().toISOString(),
            updatedAt_c: new Date().toISOString(),
            contactId_c: parseInt(dealData.contactId_c || dealData.contactId) || null
          }
        ]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create deals ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success("Deal created successfully");
          return successfulRecords[0].data;
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating deal:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error creating deal:", error.message);
        toast.error("Failed to create deal");
      }
      return null;
    }
  }

  // Update deal (only updateable fields)
  async update(id, dealData) {
    try {
      const params = {
        records: [
          {
            Id: parseInt(id),
            Name: dealData.Name || dealData.title,
            Tags: dealData.Tags,
            title_c: dealData.title_c || dealData.title,
            value_c: parseFloat(dealData.value_c || dealData.value || 0),
            stage_c: dealData.stage_c || dealData.stage,
            expectedCloseDate_c: dealData.expectedCloseDate_c || dealData.expectedCloseDate,
            notes_c: dealData.notes_c || dealData.notes,
            updatedAt_c: new Date().toISOString(),
            contactId_c: dealData.contactId_c ? parseInt(dealData.contactId_c) : (dealData.contactId ? parseInt(dealData.contactId) : null)
          }
        ]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update deals ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          toast.success("Deal updated successfully");
          return successfulUpdates[0].data;
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating deal:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error updating deal:", error.message);
        toast.error("Failed to update deal");
      }
      return null;
    }
  }

  // Delete deal
  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete deals ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulDeletions.length > 0) {
          toast.success("Deal deleted successfully");
          return true;
        }
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting deal:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error deleting deal:", error.message);
        toast.error("Failed to delete deal");
      }
      return false;
    }
  }
}

const dealService = new DealService();
export default dealService;