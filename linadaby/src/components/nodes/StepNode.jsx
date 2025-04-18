import React, { useState, useCallback, useRef } from 'react';
import { Handle } from '@xyflow/react';
import { Box, Typography, IconButton, Paper, Divider, Tooltip } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { v4 as uuidv4 } from 'uuid';
import StepEditDialog from './StepEditDialog';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const StepNode = ({ data, id }) => {
  const [open, setOpen] = useState(false);
  const [draggedTaskIndex, setDraggedTaskIndex] = useState(null);
  const [dragOverTaskIndex, setDragOverTaskIndex] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Function to extract assignTeam and status from innerNodes
  const getTaskDetails = (task) => {
    let assignTeam = '';
    let status = 'Not Assigned';

    if (task.innerNodes && task.innerNodes.length > 0) {
      // Find email field in innerNodes
      const emailNode = task.innerNodes.find(node =>
        node.data && node.data.field === 'email');
      if (emailNode && emailNode.data) {
        assignTeam = emailNode.data.fields || '';
      }

      // Find status field in innerNodes
      const statusNode = task.innerNodes.find(node =>
        node.data && node.data.field === 'status');
      if (statusNode && statusNode.data) {
        status = statusNode.data.fields || 'Not Assigned';
      }
    }

    return { assignTeam, status };
  };

  // 阻止StepNode的拖动
  const handleNodeDragStart = (event) => {
    // 如果正在拖动任务，则阻止StepNode的拖动
    console.log('node drag start 1');
    if (isDraggingTask.current) {
      console.log('node drag start inner1');
      event.stopPropagation();
      event.preventDefault();
    }
  };

  // Handle task drag over
  const handleTaskDragOver = (event, index) => {
    event.preventDefault();
    event.stopPropagation();

    // 只有当拖动到不同的任务上时才更新
    if (draggedTaskIndex !== null && dragOverTaskIndex !== index) {
      setDragOverTaskIndex(index);
    }

    // 设置放置效果
    event.dataTransfer.dropEffect = 'move';
  };

  // Handle task drag end
  const handleTaskDragEnd = (event) => {
    // 重置拖动状态
    setDraggedTaskIndex(null);
    setDragOverTaskIndex(null);
  };

  // Handle drag over for the task container
  const handleContainerDragOver = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle template drops into the container
  const handleContainerDrop = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();

    // 检查是否是模板拖放
    try {
      const textData = event.dataTransfer.getData('text/plain');
      if (textData) {
        const dragData = JSON.parse(textData);
        console.log('Drop in StepNode:', dragData);

        if (dragData.type === 'template') {
          console.log('Template dropped into step:', id);

          // 处理模板拖放
          const currentTasks = data.tasks || [];
          // Calculate next task number based on existing tasks
          const taskNumber = data.globalTaskCounter || 1;

          // 从模板创建新任务
          const newTask = {
            id: `task-${uuidv4()}`,
            name: `Task ${taskNumber}`,
            description: '',
            stepId: id,
            assignTeam: '',
            status: 'Not Assigned',
            templateId: dragData.item.id,
            innerNodes: dragData.item.innerNodes ? [...dragData.item.innerNodes] : [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          console.log('Created new task:', newTask);

          // 将任务添加到步骤的任务数组中
          const updatedTasks = [...currentTasks, newTask];

          // 使用onStepUpdate更新步骤
          if (data.onStepUpdate) {
            data.onStepUpdate(id, { tasks: updatedTasks });
            console.log('Step updated with new task');
          } else {
            console.error('onStepUpdate function not available');
          }
          // Update global task counter
          data.updateGlobalTaskCounter(taskNumber + 1);
        }
      }
    } catch (error) {
      console.error('Error processing template drop:', error);
    }
  }, [id, data]);

  // Function to get the status icon
  const getStatusIcon = (status) => {
    let icon = null;
    let tooltipTitle = '';

    switch (status) {
      case 'Active':
        icon = <div style={{ backgroundColor: 'red', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'red' }}>◉</div>;
        tooltipTitle = 'Active';
        break;
      case 'Waiting':
        icon = <div style={{ backgroundColor: 'blue', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'blue' }}>◉</div>;
        tooltipTitle = 'Waiting';
        break;
      case 'Completed':
        icon = <div style={{ backgroundColor: 'green', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'green' }}>◉</div>;
        tooltipTitle = 'Completed';
        break;
      case 'Skipped':
        icon = <div style={{ backgroundColor: 'lightgray', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'lightgray' }}>◉</div>;
        tooltipTitle = 'Skipped';
        break;
      default:
        icon = null;
        tooltipTitle = '';
    }

    return (
      <Tooltip title={tooltipTitle}>
        {icon}
      </Tooltip>
    );
  };

  return (
    <>
      <Paper
        elevation={3}
        sx={{
          p: 2,
          minWidth: 300,
          minHeight: 150,
          bgcolor: '#f5f5f5',
          border: '1px solid #ccc',
          position: 'relative'
        }}
        onDragStart={handleNodeDragStart}
      >
        <Handle type="target" position="top" />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">{data.label || 'STEP'}</Typography>
          {getStatusIcon(data.status)} {/* Display status icon */}
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Box
          sx={{
            minHeight: '100px',
            bgcolor: '#fff',
            borderRadius: 1,
            p: 1,
            border: '1px dashed #ccc'
          }}
          onDragOver={handleContainerDragOver}
          onDrop={handleContainerDrop}
        >
          {data.tasks && data.tasks.length > 0 ? (
            data.tasks.map((task, index) => {
              const { assignTeam, status } = getTaskDetails(task);

              // 确定此任务是否正在被拖动或被拖动到
              const isDragging = index === draggedTaskIndex;
              const isDragOver = index === dragOverTaskIndex;

              return (
                <Box
                  key={task.id || index}
                  sx={{
                    p: 1,
                    mb: 1,
                    bgcolor: isDragOver ? '#bbdefb' : (isDragging ? '#e0e0e0' : '#e8f5e9'),
                    borderRadius: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'grab',
                    opacity: isDragging ? 0.5 : 1,
                    '&:hover': { bgcolor: '#c8e6c9' },
                    transition: 'background-color 0.2s, opacity 0.2s'
                  }}
                  onClick={(e) => {
                    // 防止点击事件冒泡到StepNode
                    e.stopPropagation();
                    data.onTaskClick && data.onTaskClick(task);
                  }}
                  draggable={true}
                  onDragStart={(e) => handleTaskDragStart(e, task, index)}
                  onDragOver={(e) => handleTaskDragOver(e, index)}
                  onDragEnd={handleTaskDragEnd}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <DragIndicatorIcon
                      sx={{
                        mr: 1,
                        color: 'gray',
                        fontSize: '1rem',
                        cursor: 'grab'
                      }}
                      onMouseDown={(e) => {
                        // 确保拖动图标被点击时不会触发StepNode的拖动
                        e.stopPropagation();
                      }}
                    />
                    <Typography variant="subtitle1">
                      {task.name || `Task ${index + 1}`}
                      {task.description && (
                        <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                          - {task.description}
                        </Typography>
                      )}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'left', mt: 1 }}>
                    <PersonIcon sx={{ mr: 1, color: 'gray', fontSize: '1rem' }} />
                    <Typography variant="body2" color="red">
                      {task.assignTeam || 'None'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'left', mt: 1 }}>
                    <CheckCircleIcon sx={{ mr: 1, color: 'gray', fontSize: '1rem' }} />
                    <Typography variant="body2" color="text.secondary">
                      {task.status || 'Not Assigned'}
                    </Typography>
                  </Box>
                </Box>
              );
            })
          ) : (
            <Typography variant="body2" sx={{ color: 'text.secondary', p: 1, textAlign: 'center' }}>
              Drag and drop templates here
            </Typography>
          )}
        </Box>

        <Handle type="source" position="bottom" />
      </Paper>

      <StepEditDialog
        open={open}
        onClose={handleClose}
        step={data}
        onSave={(updatedStep) => {
          data.onStepUpdate && data.onStepUpdate(id, updatedStep);
          handleClose();
        }}
      />
    </>
  );
};

export default StepNode;