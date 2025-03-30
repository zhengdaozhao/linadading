import axios from 'axios';

const API_URL = 'http://localhost:8080/api/workflows';

const workflowService = {
  getAllWorkflows: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching workflows:', error);
      throw error;
    }
  },

  getWorkflowById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching workflow with id ${id}:`, error);
      throw error;
    }
  },

  saveWorkflow: async (workflow) => {
    try {
      const response = await axios.post(API_URL, workflow);
      return response.data;
    } catch (error) {
      console.error('Error saving workflow:', error);
      throw error;
    }
  },

  updateWorkflow: async (id, workflow) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, workflow);
      return response.data;
    } catch (error) {
      console.error(`Error updating workflow with id ${id}:`, error);
      throw error;
    }
  },

  deleteWorkflow: async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting workflow with id ${id}:`, error);
      throw error;
    }
  }
};

export default workflowService;