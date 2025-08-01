import { toast } from "react-toastify";

class CompanyService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'company_c';
    
    // Define field mappings for database operations (only Updateable fields)
    this.updateableFields = [
      'Name', 'Tags', 'Owner', 'industry_c', 'website_c', 'contactEmail_c',
      'phoneNumber_c', 'companySize_c', 'address_c', 'description_c'
    ];
  }

  // Fetch all companies with proper field mapping
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "industry_c" } },
          { field: { Name: "website_c" } },
          { field: { Name: "contactEmail_c" } },
          { field: { Name: "phoneNumber_c" } },
          { field: { Name: "companySize_c" } },
          { field: { Name: "address_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
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
        console.error("Error fetching companies:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error fetching companies:", error.message);
        toast.error("Failed to fetch companies");
      }
      return [];
    }
  }

  // Get company by ID
  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "industry_c" } },
          { field: { Name: "website_c" } },
          { field: { Name: "contactEmail_c" } },
          { field: { Name: "phoneNumber_c" } },
          { field: { Name: "companySize_c" } },
          { field: { Name: "address_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
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
        console.error(`Error fetching company with ID ${id}:`, error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error fetching company:", error.message);
        toast.error("Failed to fetch company details");
      }
      return null;
    }
  }

  // Create new company (only updateable fields)
  async create(companyData) {
    try {
      const params = {
        records: [
          {
            Name: companyData.Name || companyData.name || "",
            Tags: companyData.Tags || "",
            industry_c: companyData.industry_c || companyData.industry || "other",
            website_c: companyData.website_c || companyData.website || "",
            contactEmail_c: companyData.contactEmail_c || companyData.contactEmail || "",
            phoneNumber_c: companyData.phoneNumber_c || companyData.phoneNumber || "",
            companySize_c: companyData.companySize_c || companyData.companySize || "small",
            address_c: companyData.address_c || companyData.address || "",
            description_c: companyData.description_c || companyData.description || ""
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
          console.error(`Failed to create companies ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success("Company created successfully");
          return successfulRecords[0].data;
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating company:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error creating company:", error.message);
        toast.error("Failed to create company");
      }
      return null;
    }
  }

  // Update company (only updateable fields)
  async update(id, companyData) {
    try {
      const params = {
        records: [
          {
            Id: parseInt(id),
            Name: companyData.Name || companyData.name,
            Tags: companyData.Tags,
            industry_c: companyData.industry_c || companyData.industry,
            website_c: companyData.website_c || companyData.website,
            contactEmail_c: companyData.contactEmail_c || companyData.contactEmail,
            phoneNumber_c: companyData.phoneNumber_c || companyData.phoneNumber,
            companySize_c: companyData.companySize_c || companyData.companySize,
            address_c: companyData.address_c || companyData.address,
            description_c: companyData.description_c || companyData.description
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
          console.error(`Failed to update companies ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          toast.success("Company updated successfully");
          return successfulUpdates[0].data;
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating company:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error updating company:", error.message);
        toast.error("Failed to update company");
      }
      return null;
    }
  }

  // Bulk update companies (only updateable fields)
  async bulkUpdate(companyIds, updateData) {
    try {
      const records = companyIds.map(id => {
        const record = { Id: parseInt(id) };
        
        // Only include updateable fields that are provided
        if (updateData.Name !== undefined) record.Name = updateData.Name;
        if (updateData.Tags !== undefined) record.Tags = updateData.Tags;
        if (updateData.Owner !== undefined) record.Owner = updateData.Owner;
        if (updateData.industry_c !== undefined) record.industry_c = updateData.industry_c;
        if (updateData.website_c !== undefined) record.website_c = updateData.website_c;
        if (updateData.contactEmail_c !== undefined) record.contactEmail_c = updateData.contactEmail_c;
        if (updateData.phoneNumber_c !== undefined) record.phoneNumber_c = updateData.phoneNumber_c;
        if (updateData.companySize_c !== undefined) record.companySize_c = updateData.companySize_c;
        if (updateData.address_c !== undefined) record.address_c = updateData.address_c;
        if (updateData.description_c !== undefined) record.description_c = updateData.description_c;
        
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
          console.error(`Failed to update companies ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          toast.success(`${successfulUpdates.length} companies updated successfully`);
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
        console.error("Error bulk updating companies:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error bulk updating companies:", error.message);
        toast.error("Failed to update companies");
      }
      return { success: false, error: error.message };
    }
  }

  // Delete company
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
          console.error(`Failed to delete companies ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulDeletions.length > 0) {
          toast.success("Company deleted successfully");
          return true;
        }
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting company:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error deleting company:", error.message);
        toast.error("Failed to delete company");
      }
      return false;
    }
  }

  // Search companies by name
  async searchByName(searchTerm) {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "industry_c" } },
          { field: { Name: "website_c" } },
          { field: { Name: "contactEmail_c" } },
          { field: { Name: "companySize_c" } }
        ],
        where: [
          {
            FieldName: "Name",
            Operator: "Contains",
            Values: [searchTerm]
          }
        ],
        orderBy: [
          { fieldName: "Name", sorttype: "ASC" }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error searching companies:", error.message);
      return [];
    }
  }
}

const companyService = new CompanyService();
export default companyService;