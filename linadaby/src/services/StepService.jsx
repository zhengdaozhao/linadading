import axios from 'axios';

const API_URL = 'http://localhost:9700/api/steps';

const StepService = {
  getAllSteps: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching steps:', error);
      throw error;
    }
  },

  getStepById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching step with id ${id}:`, error);
      throw error;
    }
  },

  getStepsByWorkflowId: async (workflowId) => {
    try {
      const response = await axios.get(`${API_URL}/workflow/${workflowId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching steps for workflow ${workflowId}:`, error);
      throw error;
    }
  },

  saveStep: async (step) => {
    try {
      const response = await axios.post(API_URL, step);
      return response.data;
    } catch (error) {
      console.error('Error saving step:', error);
      throw error;
    }
  },

  updateStep: async (id, step) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, step);
      return response.data;
    } catch (error) {
      console.error(`Error updating step with id ${id}:`, error);
      throw error;
    }
  },

  deleteStep: async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting step with id ${id}:`, error);
      throw error;
    }
  }
};

export default StepService;
