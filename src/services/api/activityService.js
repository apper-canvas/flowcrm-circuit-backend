import { toast } from "react-toastify";

class ActivityService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'activity_c';
    
    // Define updateable fields for database operations
    this.updateableFields = [
      'Name', 'Tags', 'Owner', 'type_c', 'dealId_c', 'title_c', 
      'description_c', 'dueDate_c', 'completed_c', 'outcome_c', 
      'createdAt_c', 'contactId_c'
    ];
  }

  // Fetch all activities with proper field mapping
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "type_c" } },
          { field: { Name: "dealId_c" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "dueDate_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "outcome_c" } },
          { field: { Name: "createdAt_c" } },
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
        console.error("Error fetching activities:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error fetching activities:", error.message);
        toast.error("Failed to fetch activities");
      }
      return [];
    }
  }

  // Get activity by ID
  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "type_c" } },
          { field: { Name: "dealId_c" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "dueDate_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "outcome_c" } },
          { field: { Name: "createdAt_c" } },
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
        console.error(`Error fetching activity with ID ${id}:`, error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error fetching activity:", error.message);
        toast.error("Failed to fetch activity details");
      }
      return null;
    }
  }

  // Create new activity (only updateable fields)
  async create(activityData) {
    try {
      const params = {
        records: [
          {
            Name: activityData.Name || activityData.title || "",
            Tags: activityData.Tags || "",
            type_c: activityData.type_c || activityData.type || "call",
            dealId_c: activityData.dealId_c || activityData.dealId || "",
            title_c: activityData.title_c || activityData.title || "",
            description_c: activityData.description_c || activityData.description || "",
            dueDate_c: activityData.dueDate_c || activityData.dueDate || null,
            completed_c: "false", // Always start as not completed
            outcome_c: activityData.outcome_c || activityData.outcome || "",
            createdAt_c: new Date().toISOString(),
            contactId_c: parseInt(activityData.contactId_c || activityData.contactId) || null
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
          console.error(`Failed to create activities ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success("Activity created successfully");
          return successfulRecords[0].data;
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating activity:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error creating activity:", error.message);
        toast.error("Failed to create activity");
      }
      return null;
    }
  }

  // Update activity (only updateable fields)
  async update(id, activityData) {
    try {
      const params = {
        records: [
          {
            Id: parseInt(id),
            Name: activityData.Name || activityData.title,
            Tags: activityData.Tags,
            type_c: activityData.type_c || activityData.type,
            dealId_c: activityData.dealId_c || activityData.dealId,
            title_c: activityData.title_c || activityData.title,
            description_c: activityData.description_c || activityData.description,
            dueDate_c: activityData.dueDate_c || activityData.dueDate,
            completed_c: activityData.completed_c !== undefined ? 
              (activityData.completed_c ? "true" : "false") : 
              (activityData.completed ? "true" : "false"),
            outcome_c: activityData.outcome_c || activityData.outcome,
            contactId_c: activityData.contactId_c ? parseInt(activityData.contactId_c) : (activityData.contactId ? parseInt(activityData.contactId) : null)
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
          console.error(`Failed to update activities ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          toast.success("Activity updated successfully");
          return successfulUpdates[0].data;
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating activity:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error updating activity:", error.message);
        toast.error("Failed to update activity");
      }
      return null;
    }
  }

  // Delete activity
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
          console.error(`Failed to delete activities ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulDeletions.length > 0) {
          toast.success("Activity deleted successfully");
          return true;
        }
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting activity:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error deleting activity:", error.message);
        toast.error("Failed to delete activity");
      }
      return false;
    }
  }
}

const activityService = new ActivityService();
export default activityService;