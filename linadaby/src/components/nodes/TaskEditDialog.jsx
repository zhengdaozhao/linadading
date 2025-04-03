import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Divider,
  Paper
} from '@mui/material';

const statusOptions = [
  'Not Assigned',
  'Assigned',
  'In progress',
  'Pending',
  'Done',
  'Rejected'
];

const TaskEditDialog = ({ open, onClose, task, onSave }) => {
  const [editedTask, setEditedTask] = useState({ 
    name: '',
    description: '', // Added description field
    innerNodes: []
  });
  
  // Initialize form when task changes
  useEffect(() => {
    if (task) {
      setEditedTask({
        ...task,
        description: task.description || '' // Initialize description
      });
    }
  }, [task]);
  
  const handleChange = (e) => {
    setEditedTask({
      ...editedTask,
      [e.target.name]: e.target.value
    });
  };
  
  // Handle changes to innerNode fields
  const handleInnerNodeChange = (nodeIndex, value) => {
    const updatedInnerNodes = [...editedTask.innerNodes];
    updatedInnerNodes[nodeIndex] = {
      ...updatedInnerNodes[nodeIndex],
      data: {
        ...updatedInnerNodes[nodeIndex].data,
        fields: value
      }
    };
    
    setEditedTask({
      ...editedTask,
      innerNodes: updatedInnerNodes
    });
  };
  
  const handleSave = () => {
    // Create a copy of the task with all updated fields
    const updatedTask = { 
      ...editedTask,
      // Make sure innerNodes are properly updated
      innerNodes: editedTask.innerNodes.map(node => ({
        ...node,
        data: {
          ...node.data
        }
      }))
    };
    
    // Set the display property to include description
    updatedTask.display = {
      name: updatedTask.name,
      description: updatedTask.description
    };
    
    // Find the email node and set its value as the assignTeam
    const emailNode = updatedTask.innerNodes.find(node => 
      node.data && node.data.nodeType === 'email');
    
    if (emailNode) {
      updatedTask.assignTeam = emailNode.data.fields || '';
    }
    
    // Find the status node and set its value as the status
    const statusNode = updatedTask.innerNodes.find(node => 
      node.data && node.data.nodeType === 'status');
    
    if (statusNode) {
      updatedTask.status = statusNode.data.fields || 'Not Assigned';
    }
    
    onSave(updatedTask);
  };
  
  if (!task) return null;
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Task</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            autoFocus
            name="name"
            label="Task Name"
            type="text"
            fullWidth
            variant="outlined"
            value={editedTask.name || ''}
            onChange={handleChange}
          />
          
          <TextField
            name="description"
            label="Task Description"
            type="text"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={editedTask.description || ''}
            onChange={handleChange}
          />
          
          {editedTask.innerNodes && editedTask.innerNodes.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ mb: 1 }}>Task Components</Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {editedTask.innerNodes.map((node, index) => (
                  <Paper key={node.id} elevation={1} sx={{ p: 2 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                      {node.data.label || `Component ${index + 1}`}
                    </Typography>
                    
                    {node.data.nodeType === 'status' ? (
                      <FormControl fullWidth>
                        <InputLabel id={`status-label-${index}`}>Status</InputLabel>
                        <Select
                          labelId={`status-label-${index}`}
                          value={node.data.fields || 'Not Assigned'}
                          label="Status"
                          onChange={(e) => handleInnerNodeChange(index, e.target.value)}
                        >
                          {statusOptions.map(option => (
                            <MenuItem key={option} value={option}>{option}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    ) : (
                      <TextField
                        fullWidth
                        label={node.data.nodeType || 'Value'}
                        value={node.data.fields || ''}
                        onChange={(e) => handleInnerNodeChange(index, e.target.value)}
                        variant="outlined"
                        multiline={node.data.nodeType === 'textarea'}
                        rows={node.data.nodeType === 'textarea' ? 3 : 1}
                      />
                    )}
                    
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      Type: {node.data.nodeType}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskEditDialog;