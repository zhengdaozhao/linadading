import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Button 
} from '@mui/material';

const StepEditDialog = ({ open, onClose, step, onSave }) => {
  const [editedStep, setEditedStep] = useState({ ...step });
  
  const handleChange = (e) => {
    setEditedStep({
      ...editedStep,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSave = () => {
    onSave(editedStep);
  };
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Step</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="label"
          label="Step Name"
          type="text"
          fullWidth
          variant="outlined"
          value={editedStep.label || ''}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default StepEditDialog;
