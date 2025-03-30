import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Box, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const BranchNode = ({ data, isConnectable }) => {
  const [open, setOpen] = useState(false);
  const [condition, setCondition] = useState(data.condition || 'true');

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConditionChange = (e) => {
    setCondition(e.target.value);
    data.condition = e.target.value;
  };

  return (
    <>
      <Box
        sx={{
          width: '150px',
          height: '150px',
          transform: 'rotate(45deg)',
          background: '#fff',
          border: '1px solid #ddd',
          display: 'flex',
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
            left: '50%'
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
            left: '50%'
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
            top: '50%'
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
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose} variant="contained" color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BranchNode;
