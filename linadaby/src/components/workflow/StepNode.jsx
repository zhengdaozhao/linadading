import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Box, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, List, ListItem, ListItemText, ListItemButton, MenuItem } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import DeleteIcon from '@mui/icons-material/Delete';
import WatchLaterIcon from '@mui/icons-material/WatchLater';

const StepNode = ({ data, isConnectable, id }) => {
  const [open, setOpen] = useState(false);
  const [selectedInnerNode, setSelectedInnerNode] = useState(null);
  const [innerNodeDialogOpen, setInnerNodeDialogOpen] = useState(false);
  const [assignTo, setAssignTo] = useState(data.assignTo || '');
  const [status, setStatus] = useState(data.status || 'Pending');
  const [innerNodeData, setInnerNodeData] = useState({});

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    const emailFields = findEmailInnerNodeFields();
    const statusFields = findStatusInnerNodeFields();
    setAssignTo(emailFields);
    setStatus(statusFields);
  };

  const handleInnerNodeClick = (innerNode) => {
    setSelectedInnerNode(innerNode);
    setInnerNodeData({ ...innerNode.data });
    setInnerNodeDialogOpen(true);
  };

  const handleInnerNodeDialogClose = () => {
    if (selectedInnerNode) {
      selectedInnerNode.data = innerNodeData;
    }
    setInnerNodeDialogOpen(false);
    setSelectedInnerNode(null);
    setInnerNodeData({});
  };

  const handleInnerNodeDataChange = (key, value) => {
    setInnerNodeData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleDelete = () => {
    console.log("Delete button clicked", id, data);
    if (data.onDelete) {
      data.onDelete(id);
      setOpen(false);
    } else {
      console.error("onDelete function is not provided in data props");
    }
  };

  const findEmailInnerNodeFields = () => {
    if (data.innerNodes) {
      const emailNode = data.innerNodes.find(node => node.data.nodeType === 'email');
      return emailNode ? emailNode.data.fields : '';
    }
    return '';
  };

  const findStatusInnerNodeFields = () => {
    if (data.innerNodes) {
      const statusNode = data.innerNodes.find(node => node.data.nodeType === 'status');
      return statusNode ? statusNode.data.fields : 'Pending';
    }
    return 'Pending';
  };

  return (
    <>
      <Box
        sx={{
          padding: '10px',
          borderRadius: '5px',
          background: '#ffbf00',
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
            负责人: <span style={{ color: 'blue' }}>{assignTo ? assignTo : 'Not assigned'}</span>
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <WatchLaterIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
          <Typography
            variant="body2"
            sx={{
              color: status === 'Pending' || status === 'Canceled' ? 'red' : status === 'Approved' ? 'green' : 'text.secondary',
              // mt: 1,
            }}
          >
            {status}
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
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>Inner Nodes:</Typography>
          <List sx={{ maxHeight: '300px', overflow: 'auto', border: '1px solid #eee', borderRadius: '4px' }}>
            {data.innerNodes && data.innerNodes.length > 0 ? (
              data.innerNodes.map((innerNode, index) => (
                <ListItem 
                  key={innerNode.id || index} 
                  divider 
                  disablePadding
                >
                  <ListItemButton onClick={() => handleInnerNodeClick(innerNode)}>
                    <ListItemText 
                      primary={innerNode.data?.label || `Node ${index + 1}`} 
                      secondary={innerNode.data?.fields || 'No fields'}
                    />
                  </ListItemButton>
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="No inner nodes available" />
              </ListItem>
            )}
          </List>
          <Button variant="contained" color="primary" onClick={handleClose} sx={{ mt: 2 }}>
            Close
          </Button>
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
        </DialogActions>
      </Dialog>

      {/* Inner Node Edit Dialog */}
      {selectedInnerNode && (
        <Dialog open={innerNodeDialogOpen} onClose={handleInnerNodeDialogClose} maxWidth="sm" fullWidth>
          <DialogTitle>Edit Inner Node</DialogTitle>
          <DialogContent>
            <Typography variant="subtitle1">
              {innerNodeData.label || 'Node Details'}
            </Typography>
            
            {/* Additional inner node properties can be displayed here */}
            {Object.entries(innerNodeData)
                .filter(([key]) => key !== 'label')
                .map(([key, value]) => (
                <Box key={key} sx={{ mt: 2 }}>
                  {key === 'nodeType' ? (
                    <TextField
                      label={key}
                      value={value}
                      fullWidth
                      variant="outlined"
                      sx={{ mb: 2 }}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  ) : key === 'fields' && innerNodeData.nodeType === 'status' ? (
                    <TextField
                      select
                      label={key}
                      value={value}
                      onChange={(e) => handleInnerNodeDataChange(key, e.target.value)}
                      fullWidth
                      variant="outlined"
                      sx={{ mb: 2 }}
                    >
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="Approved">Approved</MenuItem>
                      <MenuItem value="Canceled">Canceled</MenuItem>
                    </TextField>
                  ) : (
                    <TextField
                      label={key}
                      value={value}
                      onChange={(e) => handleInnerNodeDataChange(key, e.target.value)}
                      fullWidth
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />
                  )}
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