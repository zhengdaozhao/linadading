import React, { useState, useCallback, useRef } from 'react';
import { Handle } from '@xyflow/react';
import { Box, Typography, IconButton, Paper, Divider } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { v4 as uuidv4 } from 'uuid';
import StepEditDialog from './StepEditDialog';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const StepNode = ({ data, id}) => {
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
        assignTeam = emailNode.data.value || '';
      }
      
      // Find status field in innerNodes
      const statusNode = task.innerNodes.find(node => 
        node.data && node.data.field === 'status');
      if (statusNode && statusNode.data) {
        status = statusNode.data.value || 'Not Assigned';
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
  
  // // Handle task drag start
  // const handleTaskDragStart = (event, task, index) => {
  //   // 通知 WorkflowCreation 组件正在拖动任务
  //   console.log('task drag start 1');
  //   setTaskDraggingState(true);
    
  //   // 阻止事件冒泡
  //   event.stopPropagation();
    
  //   // 设置拖动数据
  //   setDraggedTaskIndex(index);
  //   // 标记正在拖动任务
  //   isDraggingTask.current = true;
    
  //   // 强制阻止事件冒泡，防止StepNode被拖动
  //   event.stopPropagation();
    
  //   // 设置拖动数据
  //   setDraggedTaskIndex(index);
    
  //   // 设置拖动数据（用于外部拖放，内部重排序不使用）
  //   const dragData = {
  //     taskId: task.id,
  //     stepId: id,
  //     index: index,
  //     type: 'task-reorder' // 添加类型标识
  //   };
  //   event.dataTransfer.setData('application/json', JSON.stringify(dragData));
    
  //   // 设置拖动图像（可选）
  //   const dragElement = event.currentTarget;
  //   if (dragElement) {
  //     event.dataTransfer.setDragImage(dragElement, 20, 20);
  //   }
    
  //   console.log('Task drag started:', index);
  // };
  
  // Handle task drag over
  const handleTaskDragOver = (event, index) => {
    // // 确保是任务拖动
    // if (!isDraggingTask.current) return;
    
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
    // // 通知 WorkflowCreation 组件任务拖动结束
    // setTaskDraggingState(false);
    
    // 重置拖动状态
    setDraggedTaskIndex(null);
    setDragOverTaskIndex(null);
  };
  
  // // Handle task drop for reordering
  // const handleTaskDrop = (event, dropIndex) => {
    
  //   event.preventDefault();
  //   event.stopPropagation();
    
  //   console.log('Task dropped at index:', dropIndex, 'from index:', draggedTaskIndex);
    
  //   // 如果有有效的拖动操作
  //   if (draggedTaskIndex !== null && draggedTaskIndex !== dropIndex) {
  //     // 重新排序任务
  //     const tasks = [...(data.tasks || [])];
  //     const draggedTask = tasks[draggedTaskIndex];
      
  //     // 移除拖动的任务
  //     tasks.splice(draggedTaskIndex, 1);
      
  //     // 在新位置插入
  //     tasks.splice(dropIndex, 0, draggedTask);
      
  //     // 使用onStepUpdate更新步骤
  //     if (data.onStepUpdate) {
  //       data.onStepUpdate(id, { tasks: tasks });
  //       console.log('Reordered tasks:', tasks.map(t => t.name || t.id));
  //     }
  //   }
    
  //   // 通知 WorkflowCreation 组件任务拖动结束
  //   setTaskDraggingState(false);
  //   setDraggedTaskIndex(null);
  //   setDragOverTaskIndex(null);
  // };
  
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
          data.updateGlobalTaskCounter(taskNumber+1);
        }
      }
    } catch (error) {
      console.error('Error processing template drop:', error);
    }
  }, [id, data]);
  
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
          <IconButton size="small" onClick={handleOpen}>
            <EditIcon fontSize="small" />
          </IconButton>
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
                  onDrop={(e) => handleTaskDrop(e, index)}
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
                    <PersonIcon  sx={{ mr: 1, color: 'gray', fontSize: '1rem'}} />
                    <Typography variant="body2" color="red">
                      {task.assignTeam || 'None'}
                    </Typography>
                  </Box>
                  <Box  sx={{ display: 'flex', justifyContent: 'left', mt: 1 }}>
                    <CheckCircleIcon  sx={{ mr: 1, color: 'gray', fontSize: '1rem'}} />
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
