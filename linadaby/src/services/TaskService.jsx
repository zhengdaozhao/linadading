import axios from 'axios';

const API_URL = 'http://localhost:9700/api/tasks';

const searchTasks = (taskId, status, assignedStaffName) => {
  return axios.get(API_URL, {
    params: {
      taskId,
      status,
      assignedStaffName
    }
  });
};

const updateTask = (taskId, taskData) => {
  return axios.put(`${API_URL}/${taskId}`, taskData);
};

const TaskService = {
  searchTasks,
  updateTask
};

export default TaskService;