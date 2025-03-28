import axios from 'axios';

// Base URL for API requests - adjust to match your Spring Boot server
const API_BASE_URL = 'http://localhost:9700/api';

// Create axios instance with common configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Template API service
const TemplateService = {
  // Get all templates
  getAllTemplates: async () => {
    try {
      const response = await apiClient.get('/templates');
      return response.data;
    } catch (error) {
      console.error('Error fetching templates:', error);
      throw error;
    }
  },
  
  // Get template by ID
  getTemplateById: async (id) => {
    try {
      const response = await apiClient.get(`/templates/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching template ${id}:`, error);
      throw error;
    }
  },
  
  // Save new template
  saveTemplate: async (template) => {
    try {
      const response = await apiClient.post('/templates', template);
      return response.data;
    } catch (error) {
      console.error('Error saving template:', error);
      throw error;
    }
  },
  
  // Update existing template
  updateTemplate: async (id, template) => {
    try {
      const response = await apiClient.put(`/templates/${id}`, template);
      return response.data;
    } catch (error) {
      console.error(`Error updating template ${id}:`, error);
      throw error;
    }
  },
  
  // Delete template
  deleteTemplate: async (id) => {
    try {
      const response = await apiClient.delete(`/templates/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting template ${id}:`, error);
      throw error;
    }
  }
};

export default TemplateService;