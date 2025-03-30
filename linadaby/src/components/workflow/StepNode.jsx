import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Box, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, List, ListItem, ListItemText } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';

const StepNode = ({ data, isConnectable }) => {
  const [open, setOpen] = useState(false);
  const [selectedInnerNode, setSelectedInnerNode] = useState(null);
  const [innerNodeDialogOpen, setInnerNodeDialogOpen] = useState(false);
  const [assignTo, setAssignTo] = useState(data.assignTo || '');

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInnerNodeClick = (innerNode) => {
    setSelectedInnerNode(innerNode);
    setInnerNodeDialogOpen(true);
  };

  const handleInnerNodeDialogClose = () => {
    setInnerNodeDialogOpen(false);
    setSelectedInnerNode(null);
  };

  const handleAssignToChange = (e) => {
    setAssignTo(e.target.value);
    data.assignTo = e.target.value;
  };

  return (
    <>
      <Box
        sx={{
          padding: '10px',
          borderRadius: '5px',
          background: '#fff',
          border: '1px solid #ddd',
          width: '200px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
          position: 'relative',
        }}
      >
        <Handle
          type="target"
          position={Position.Top}
          isConnectable={isConnectable}
          style={{ background: '#555' }}
        />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            {data.label}
          </Typography>
          <IconButton size="small" onClick={handleOpen}>
            <EditIcon fontSize="small" />
          </IconButton>
        </Box>
        
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
          Template: {data.templateName}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <PersonIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {assignTo ? `Assigned to: ${assignTo}` : 'Not assigned'}
          </Typography>
        </Box>
        
        <Handle
          type="source"
          position={Position.Bottom}
          id="bottom"
          isConnectable={isConnectable}
          style={{ background: '#555' }}
        />
      </Box>

      {/* Step Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Step: {data.label}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            id="assignTo"
            label="Assign To"
            type="text"
            fullWidth
            variant="outlined"
            value={assignTo}
            onChange={handleAssignToChange}
            sx={{ mb: 2 }}
          />
          
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>Inner Nodes:</Typography>
          <List sx={{ maxHeight: '300px', overflow: 'auto', border: '1px solid #eee', borderRadius: '4px' }}>
            {data.innerNodes && data.innerNodes.length > 0 ? (
              data.innerNodes.map((innerNode, index) => (
                <ListItem 
                  key={innerNode.id || index} 
                  divider 
                  button 
                  onClick={() => handleInnerNodeClick(innerNode)}
                >
                  <ListItemText 
                    primary={innerNode.data?.label || `Node ${index + 1}`} 
                    secondary={innerNode.data?.description || 'No description'}
                  />
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="No inner nodes available" />
              </ListItem>
            )}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Inner Node Edit Dialog */}
      {selectedInnerNode && (
        <Dialog open={innerNodeDialogOpen} onClose={handleInnerNodeDialogClose} maxWidth="sm" fullWidth>
          <DialogTitle>Edit Inner Node</DialogTitle>
          <DialogContent>
            <Typography variant="subtitle1">
              {selectedInnerNode.data?.label || 'Node Details'}
            </Typography>
            
            {/* Additional inner node properties can be displayed here */}
            {selectedInnerNode.data && Object.entries(selectedInnerNode.data)
                .filter(([key]) => key !== 'label')
                .map(([key, value]) => (
                <Box key={key} sx={{ mt: 2 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {key}:
                    </Typography>
                    <Typography variant="body2">
                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                    </Typography>
                </Box>
                ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleInnerNodeDialogClose}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default StepNode;
