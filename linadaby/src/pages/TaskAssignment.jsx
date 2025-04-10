import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Select, 
  MenuItem, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Snackbar, 
  Alert,
  Typography
} from '@mui/material';
import TaskService from '../services/taskService';

const TaskAssignment = () => {
  const [taskId, setTaskId] = useState('');
  const [status, setStatus] = useState('');
  const [assignedStaffName, setAssignedStaffName] = useState('');
  const [tasks, setTasks] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const user = JSON.parse(localStorage.getItem('zpddyzUser'));

  const handleSearch = async () => {
    if (!taskId && !status && !assignedStaffName) {
      setSnackbar({
        open: true,
        message: 'At least one item should be set',
        severity: 'error'
      });
      return;
    }

    try {
      const response = await TaskService.searchTasks(taskId, status, assignedStaffName);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setSnackbar({
        open: true,
        message: 'Error fetching tasks',
        severity: 'error'
      });
    }
  };

  const handleUpdateTask = (task) => {
    setSelectedTask(task);
    setOpenDialog(true);
  };

  const handleAssignTeam = async (newAssignTeam) => {
    if (!newAssignTeam) {
      setSnackbar({
        open: true,
        message: 'Assign Team cannot be empty',
        severity: 'error'
      });
      return;
    }

    try {
      const updatedTaskData = {
        assignTeam: newAssignTeam,
        status: 'Assigned' // Update status to 'Assigned'
      };
      await TaskService.updateTask(selectedTask.id, updatedTaskData);
      handleSearch();
      setOpenDialog(false);
      setSnackbar({
        open: true,
        message: 'Task updated successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error updating task:', error);
      setSnackbar({
        open: true,
        message: 'Error updating task',
        severity: 'error'
      });
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          label="Task ID"
          value={taskId}
          onChange={(e) => setTaskId(e.target.value)}
        />
        <Select
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          displayEmpty
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value="Not Assigned">Not Assigned</MenuItem>
          <MenuItem value="Assigned">Assigned</MenuItem>
          <MenuItem value="In progress">In progress</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Done">Done</MenuItem>
          <MenuItem value="Rejected">Rejected</MenuItem>
        </Select>
        <TextField
          label="Assigned Staff Name"
          value={assignedStaffName}
          onChange={(e) => setAssignedStaffName(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleSearch}>
          Search
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#ADD8E6', fontWeight: 'bold' }}> {/* Light blue background */}
              <TableCell>Task ID</TableCell>
              <TableCell>Task Name</TableCell>
              <TableCell>Assign Team</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Step ID</TableCell>
              <TableCell>Template ID</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map(task => (
              <TableRow key={task.id}>
                <TableCell>{task.id}</TableCell>
                <TableCell>{task.name}</TableCell>
                <TableCell>{task.assignTeam}</TableCell>
                <TableCell>{task.status}</TableCell>
                <TableCell>{task.stepId}</TableCell>
                <TableCell>{task.templateId}</TableCell>
                <TableCell>
                  {!task.assignTeam && user.isManager && (
                    <Button variant="outlined" color="primary" onClick={() => handleUpdateTask(task)}>
                      Assign
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {tasks.length === 0 && (
        <Typography variant="body1" align="center" sx={{ mt: 2 }}>
          No Result
        </Typography>
      )}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Task Assignment</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Task ID"
              value={selectedTask?.id}
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              label="Task Name"
              value={selectedTask?.name}
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              label="Assign Team"
              value={selectedTask?.assignTeam || ''}
              onChange={(e) => setSelectedTask({ ...selectedTask, assignTeam: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={() => handleAssignTeam(selectedTask.assignTeam)}>
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={1000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TaskAssignment;