import { toast } from "react-toastify";
import React from "react";

class ContactService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'contact_c';
    
    // Define field mappings for database operations
    this.updateableFields = [
      'Name', 'Tags', 'Owner', 'company_c', 'email_c', 'phone_c', 
      'address_c', 'type_c', 'industry_c', 'companySize_c', 
      'engagementLevel_c', 'leadScore_c', 'notes_c', 'createdAt_c', 'updatedAt_c'
    ];
  }

  // Fetch all contacts with proper field mapping
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "company_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "address_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "industry_c" } },
          { field: { Name: "companySize_c" } },
          { field: { Name: "engagementLevel_c" } },
          { field: { Name: "leadScore_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "createdAt_c" } },
          { field: { Name: "updatedAt_c" } }
        ],
        orderBy: [
          { fieldName: "Name", sorttype: "ASC" }
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
        console.error("Error fetching contacts:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error fetching contacts:", error.message);
        toast.error("Failed to fetch contacts");
      }
      return [];
    }
  }

  // Get contact by ID
  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "company_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "address_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "industry_c" } },
          { field: { Name: "companySize_c" } },
          { field: { Name: "engagementLevel_c" } },
          { field: { Name: "leadScore_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "createdAt_c" } },
          { field: { Name: "updatedAt_c" } }
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
        console.error(`Error fetching contact with ID ${id}:`, error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error fetching contact:", error.message);
        toast.error("Failed to fetch contact details");
      }
      return null;
    }
  }

  // Create new contact (only updateable fields)
  async create(contactData) {
    try {
      const params = {
        records: [
          {
            Name: contactData.Name || contactData.name || "",
            Tags: contactData.Tags || "",
            company_c: contactData.company_c || contactData.company || "",
            email_c: contactData.email_c || contactData.email || "",
            phone_c: contactData.phone_c || contactData.phone || "",
            address_c: contactData.address_c || contactData.address || "",
            type_c: contactData.type_c || contactData.type || "lead",
            industry_c: contactData.industry_c || contactData.industry || "other",
            companySize_c: contactData.companySize_c || contactData.companySize || "small",
            engagementLevel_c: contactData.engagementLevel_c || contactData.engagementLevel || "medium",
            leadScore_c: parseInt(contactData.leadScore_c || contactData.leadScore || 0),
            notes_c: contactData.notes_c || contactData.notes || "",
            createdAt_c: new Date().toISOString(),
            updatedAt_c: new Date().toISOString()
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
          console.error(`Failed to create contacts ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success("Contact created successfully");
          return successfulRecords[0].data;
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating contact:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error creating contact:", error.message);
        toast.error("Failed to create contact");
      }
      return null;
    }
  }

  // Update contact (only updateable fields)
  async update(id, contactData) {
    try {
      const params = {
        records: [
          {
            Id: parseInt(id),
            Name: contactData.Name || contactData.name,
            Tags: contactData.Tags,
            company_c: contactData.company_c || contactData.company,
            email_c: contactData.email_c || contactData.email,
            phone_c: contactData.phone_c || contactData.phone,
            address_c: contactData.address_c || contactData.address,
            type_c: contactData.type_c || contactData.type,
            industry_c: contactData.industry_c || contactData.industry,
            companySize_c: contactData.companySize_c || contactData.companySize,
engagementLevel_c: contactData.engagementLevel_c || contactData.engagementLevel,
            leadScore_c: parseInt(contactData.leadScore_c || contactData.leadScore || 0),
            notes_c: contactData.notes_c || contactData.notes,
            updatedAt_c: new Date().toISOString()
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
          console.error(`Failed to update contacts ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          toast.success("Contact updated successfully");
          return successfulUpdates[0].data;
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating contact:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error updating contact:", error.message);
        toast.error("Failed to update contact");
      }
      return null;
    }
  }
// Bulk update contacts (only updateable fields)
  async bulkUpdate(contactIds, updateData) {
    try {
      // Prepare records array with only updateable fields
      const records = contactIds.map(id => {
        const record = { Id: parseInt(id) };
        
        // Only include updateable fields that are provided
        if (updateData.Name !== undefined) record.Name = updateData.Name;
        if (updateData.Tags !== undefined) record.Tags = updateData.Tags;
        if (updateData.Owner !== undefined) record.Owner = updateData.Owner;
        if (updateData.company_c !== undefined) record.company_c = updateData.company_c;
        if (updateData.email_c !== undefined) record.email_c = updateData.email_c;
        if (updateData.phone_c !== undefined) record.phone_c = updateData.phone_c;
        if (updateData.address_c !== undefined) record.address_c = updateData.address_c;
        if (updateData.type_c !== undefined) record.type_c = updateData.type_c;
        if (updateData.industry_c !== undefined) record.industry_c = updateData.industry_c;
        if (updateData.companySize_c !== undefined) record.companySize_c = updateData.companySize_c;
        if (updateData.engagementLevel_c !== undefined) record.engagementLevel_c = updateData.engagementLevel_c;
        if (updateData.leadScore_c !== undefined) record.leadScore_c = parseFloat(updateData.leadScore_c) || 0;
        if (updateData.notes_c !== undefined) record.notes_c = updateData.notes_c;
        
        // Always update the modification timestamp
        record.updatedAt_c = new Date().toISOString();
        
        return record;
      });

      const params = { records };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return { success: false, message: response.message };
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update contacts ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          toast.success(`${successfulUpdates.length} contacts updated successfully`);
          return { 
            success: true, 
            updatedCount: successfulUpdates.length,
            failedCount: failedUpdates.length,
            data: successfulUpdates.map(result => result.data)
          };
        }
      }
      
      return { success: false, message: "No records were updated" };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error bulk updating contacts:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error bulk updating contacts:", error.message);
        toast.error("Failed to update contacts");
      }
      return { success: false, error: error.message };
    }
  }

  // Delete contact
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
          console.error(`Failed to delete contacts ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulDeletions.length > 0) {
          toast.success("Contact deleted successfully");
          return true;
        }
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting contact:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error deleting contact:", error.message);
        toast.error("Failed to delete contact");
      }
      return false;
    }
  }

  // Lead scoring functionality preserved
  calculateLeadScore(contact, scoringConfig) {
    if (!scoringConfig || !scoringConfig.enabled) {
      return 0;
    }

    const { criteria, weights } = scoringConfig;
    let totalScore = 0;

    // Company size scoring
    const companySize = contact.companySize_c || contact.companySize || 'other';
    const companySizeScore = criteria.companySize[companySize] || 0;
    totalScore += companySizeScore * weights.companySize;

    // Contact type scoring
    const contactType = contact.type_c || contact.type || 'lead';
    const contactTypeScore = criteria.contactType[contactType] || 0;
    totalScore += contactTypeScore * weights.contactType;

    // Industry scoring
    const industry = contact.industry_c || contact.industry || 'other';
    const industryScore = criteria.industry[industry] || criteria.industry.other;
    totalScore += industryScore * weights.industry;

    // Engagement level scoring
    const engagementLevel = contact.engagementLevel_c || contact.engagementLevel || 'low';
    const engagementScore = criteria.engagementLevel[engagementLevel] || 0;
    totalScore += engagementScore * weights.engagementLevel;

    return Math.round(totalScore);
  }

  async updateContactScore(id, scoringConfig) {
    const contact = await this.getById(id);
    if (contact) {
      const leadScore = this.calculateLeadScore(contact, scoringConfig);
      return await this.update(id, { leadScore_c: leadScore });
    }
    return null;
  }

  async recalculateAllScores(scoringConfig) {
    try {
      const contacts = await this.getAll();
      
      for (const contact of contacts) {
        const leadScore = this.calculateLeadScore(contact, scoringConfig);
        await this.update(contact.Id, { leadScore_c: leadScore });
      }
      
      toast.success("Lead scores recalculated successfully");
      return true;
    } catch (error) {
      console.error("Error recalculating scores:", error.message);
      toast.error("Failed to recalculate lead scores");
      return false;
    }
  }
}

const contactService = new ContactService();
export default contactService;