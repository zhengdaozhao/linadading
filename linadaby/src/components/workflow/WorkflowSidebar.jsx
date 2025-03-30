import React from 'react';
import { Box, Typography, List, ListItem, Divider, Button } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

const WorkflowSidebar = ({ templates, workflows, onSaveClick }) => {
    const onDragStart = (event, type, item) => {
        try {
          // Create a clean copy of the item
          const cleanItem = { ...item };
          
          // Set the data with proper JSON stringification
          const data = {
            type: type,
            item: cleanItem
          };
          
          const jsonString = JSON.stringify(data);
          console.log('Drag started with data:', jsonString);
          
          // Set the data transfer with the correct format
          event.dataTransfer.setData('text/plain', jsonString);
          event.dataTransfer.effectAllowed = 'move';
        } catch (error) {
          console.error('Error in onDragStart:', error);
        }
      };
  return (
    <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Workflow Components</Typography>
      
      {/* Templates Section */}
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 1 }}>Saved Templates</Typography>
      <List>
        {templates && templates.length > 0 ? (
          templates.map((template) => (
            <ListItem 
              key={template.id}
              sx={{
                border: '1px solid #ddd',
                borderRadius: '4px',
                mb: 1,
                cursor: 'grab',
                '&:hover': { backgroundColor: '#f5f5f5' }
              }}
              draggable
              onDragStart={(event) => onDragStart(event, 'template', template)}
            >
              <DragIndicatorIcon sx={{ mr: 1, color: 'gray' }} />
              <Typography>{template.label || 'Unnamed Template'}</Typography>
            </ListItem>
          ))
        ) : (
          <Typography variant="body2" sx={{ color: 'text.secondary', p: 1 }}>
            No templates available
          </Typography>
        )}
      </List>
      
      <Divider sx={{ my: 2 }} />
      
      {/* Branch Component */}
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Branch</Typography>
      <List>
        <ListItem 
          sx={{
            border: '1px solid #ddd',
            borderRadius: '4px',
            mb: 1,
            cursor: 'grab',
            '&:hover': { backgroundColor: '#f5f5f5' }
          }}
          draggable
          onDragStart={(event) => onDragStart(event, 'branch', { id: 'branch-template' })}
        >
          <DragIndicatorIcon sx={{ mr: 1, color: 'gray' }} />
          <Typography>Condition Branch</Typography>
        </ListItem>
      </List>
      
      <Divider sx={{ my: 2 }} />
      
      {/* Saved Workflows Section */}
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Saved Workflows</Typography>
      <List sx={{ flexGrow: 1, overflowY: 'auto' }}>
        {workflows.length > 0 ? (
          workflows.map((workflow) => (
            <ListItem 
              key={workflow.id}
              sx={{
                border: '1px solid #ddd',
                borderRadius: '4px',
                mb: 1,
                cursor: 'grab',
                '&:hover': { backgroundColor: '#f5f5f5' }
              }}
              draggable
              onDragStart={(event) => onDragStart(event, 'workflow', workflow)}
            >
              <DragIndicatorIcon sx={{ mr: 1, color: 'gray' }} />
              <Typography>{workflow.name}</Typography>
            </ListItem>
          ))
        ) : (
          <Typography variant="body2" sx={{ color: 'text.secondary', p: 1 }}>
            No saved workflows
          </Typography>
        )}
      </List>
      
      {/* Save Button */}
      <Button 
        variant="contained" 
        color="primary" 
        fullWidth 
        sx={{ mt: 2 }}
        onClick={onSaveClick}
      >
        Save Workflow
      </Button>
    </Box>
  );
};

export default WorkflowSidebar;
