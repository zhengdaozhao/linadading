import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Box, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const BranchNode = ({ data, isConnectable, id }) => {
  const [open, setOpen] = useState(false);
  const [condition, setCondition] = useState(data.condition || 'true');

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleSave = () => {
    data.condition = condition; // Save the condition to the data object
    handleClose(); // Close the dialog
  };

  const handleConditionChange = (e) => {
    setCondition(e.target.value);
    // data.condition = e.target.value;
  };
  const handleDelete = () => {
    if (data.onDelete && id) {
      data.onDelete(id);
      setOpen(false);
    }
  };

  return (
    <>
      <Box
        sx={{
          width: '100px',
          height: '100px',
          transform: 'rotate(45deg)',
          background: '#c8e6c9',
          border: '1px solid #ddd',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
          position: 'relative',
        }}
      >
        <Box sx={{ transform: 'rotate(-45deg)', width: '100%', textAlign: 'center' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            {data.label}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }} style={{color:'red'}}>
            {condition}
          </Typography>
          <IconButton size="small" onClick={handleOpen} sx={{ mt: 1 }}>
            <EditIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Top handle (input) */}
        <Handle
          type="target"
          position={Position.Top}
          isConnectable={isConnectable}
          style={{ 
            background: '#555',
            transform: 'rotate(-45deg) translateY(-50%)',
            top: 0,
            left: 0
          }}
        />

        {/* Bottom handle (true output) */}
        <Handle
          type="source"
          position={Position.Bottom}
          id="bottom"
          isConnectable={isConnectable}
          style={{ 
            background: '#555',
            transform: 'rotate(-45deg) translateY(50%)',
            bottom: 0,
            left: 0
          }}
        />

        {/* Right handle (false output) */}
        <Handle
          type="source"
          position={Position.Right}
          id="right"
          isConnectable={isConnectable}
          style={{ 
            background: '#555',
            transform: 'rotate(-45deg) translateX(50%)',
            right: 0,
            top: 0
          }}
        />
      </Box>

      {/* Condition Edit Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Condition</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="condition"
            label="Condition Expression"
            type="text"
            fullWidth
            variant="outlined"
            value={condition}
            onChange={handleConditionChange}
            // helperText="Enter a condition expression (e.g., 'status === \"APPROVED\"')"
            helperText="Enter a condition expression"
          />
        </DialogContent>
        <DialogActions>
          <Button 
            startIcon={<DeleteIcon />} 
            color="error" 
            onClick={handleDelete}
            sx={{ marginRight: 'auto' }}
          >
            Delete
          </Button>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BranchNode;

