import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  Panel, 
  useNodesState, 
  useEdgesState, 
  addEdge,
  MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Box, Button, Typography, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';

import WorkflowSidebar from '../components/workflow/WorkflowSidebar';
import StepNode from '../components/nodes/StepNode';
import BranchNode from '../components/workflow/BranchNode';
import TaskEditDialog from '../components/nodes/TaskEditDialog';
import workflowService from '../services/workflowService';
import templateService from '../services/templateService';
import '../components/workflow/workflow.css';
// import { useTaskCounter } from '../context/TaskCounterContext';

// Node types registration
const nodeTypes = {
  step: StepNode,
  branch: BranchNode,
};


const WorkflowCreation = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [templates, setTemplates] = useState([]);
  const [workflows, setWorkflows] = useState([]);
  const [stepCounter, setStepCounter] = useState(1);
  const [taskCounters, setTaskCounters] = useState({});
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [workflowName, setWorkflowName] = useState('New Workflow');

// 20250403 Add this state variable
  const [globalTaskCounter, setGlobalTaskCounter] = useState(1);
  // Use the context instead
  // const { taskCounter, incrementTaskCounter, setCounter } = useTaskCounter();
  
  const reactFlowWrapper = useRef(null);
  const reactFlowInstance = useRef(null);
  
  // Load templates and workflows
  useEffect(() => {
    const fetchData = async () => {
      try {
        const templatesData = await templateService.getAllTemplates();
        setTemplates(templatesData);
        
        const workflowsData = await workflowService.getAllWorkflows();
        setWorkflows(workflowsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, []);
  
  const onConnect = useCallback((params) => {
    // Create edge with default marker
    const newEdge = {
      ...params,
      id: `e-${uuidv4()}`,
      // type: 'smoothstep',
      animated: true,
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    };
    setEdges((eds) => addEdge(newEdge, eds));
  }, [setEdges]);

  const onInit = useCallback((instance) => {
    reactFlowInstance.current = instance;
  }, []);
  
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);
  
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const dataStr = event.dataTransfer.getData('text/plain');
      
      if (!dataStr || !reactFlowInstance.current) {
        return;
      }
      
      try {
        const data = JSON.parse(dataStr);
        const position = reactFlowInstance.current.screenToFlowPosition({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });
        
        let newNode;
        
        if (data.type === 'step') {
          // Create a new step node
          const stepId = `step-${uuidv4()}`;
          const stepLabel = `STEP ${stepCounter}`;
          
          newNode = {
            id: stepId,
            type: 'step',
            position,
            data: {
              label: stepLabel,
              tasks: [],
              onStepUpdate: handleStepUpdate,
              onTaskClick: handleTaskClick,
              onTaskReorder: handleTaskReorder,
              // 2025/4/3
              globalTaskCounter: globalTaskCounter,
              updateGlobalTaskCounter: updateGlobalTaskCounter
            },
          };
          console.log('New Node drop method is set');
          setStepCounter(prev => prev + 1);
          
          // Initialize task counter for this step
          // setTaskCounters(prev => ({
          //   ...prev,
          //   [stepId]: 1
          // }));
        } else if (data.type === 'branch') {
          // Create a new branch node
          newNode = {
            id: `branch-${uuidv4()}`,
            type: 'branch',
            position,
            data: {
              label: 'Branch',
              condition: '',
              onBranchUpdate: handleBranchUpdate
            },
          };
        } 
        else if (data.type === 'workflow') {
          // Load an existing workflow
          loadWorkflow(data.item);
          return;
        }
        
        if (newNode) {
          console.log('New Node is created',newNode);
          setNodes((nds) => nds.concat(newNode));
        }
      } catch (error) {
        console.error('Error processing drop:', error);
      }
    },
    [reactFlowInstance, stepCounter, globalTaskCounter]
  );
  
  const handleStepUpdate = (stepId, updatedStep) => {
    // updateGlobalTaskCounter(globalTaskCounter+1);
    setNodes(nodes => 
      nodes.map(node => 
        node.id === stepId 
          ? { 
              ...node, 
              data: { 
                ...node.data, 
                ...updatedStep,
                onStepUpdate: node.data.onStepUpdate,
                onTaskClick: node.data.onTaskClick,
                onTaskReorder: node.data.onTaskReorder,
                onDropTemplate: node.data.onDropTemplate,
                // 2025/4/3
                // globalTaskCounter: globalTaskCounter,
                // updateGlobalTaskCounter: node.data.updateGlobalTaskCounter
              } 
            } 
          : node
      )
    );
  };
  
  const handleBranchUpdate = (branchId, updatedBranch) => {
    setNodes(nodes => 
      nodes.map(node => 
        node.id === branchId 
          ? { 
              ...node, 
              data: { 
                ...node.data, 
                ...updatedBranch,
                onBranchUpdate: node.data.onBranchUpdate
              } 
            } 
          : node
      )
    );
  };
  
  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setTaskDialogOpen(true);
  };
  
  const handleTaskUpdate = (updatedTask) => {
    // Find the step that contains this task
    const stepNode = nodes.find(node => 
      node.type === 'step' && 
      node.data.tasks && 
      node.data.tasks.some(t => t.id === updatedTask.id)
    );
    
    if (stepNode) {
      // Update the task in the step's tasks array
      const updatedTasks = stepNode.data.tasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      );
      
      // Update the node with the new tasks array
      handleStepUpdate(stepNode.id, { tasks: updatedTasks });
    }
    
    setTaskDialogOpen(false);
    setSelectedTask(null);
  };
  const deleteWorkflow = async (workflowId) => {
    try {
      await workflowService.deleteWorkflow(workflowId);
      console.log(`Workflow ${workflowId} deleted successfully`);

      // Refresh workflows list
      const workflowsData = await workflowService.getAllWorkflows();
      setWorkflows(workflowsData);
    } catch (error) {
      console.error('Error deleting workflow:', error);
    }
  };
  // 2025/4/3 Add this function to update the global task counter
  const updateGlobalTaskCounter = (taskCount) => {
    setGlobalTaskCounter(taskCount)
  // Update all step nodes with the new counter value
  setNodes(nodes => 
    nodes.map(node => 
      node.type === 'step' 
        ? { 
            ...node, 
            data: { 
              ...node.data, 
              globalTaskCounter: taskCount
            } 
          } 
        : node
    )
  );
  }

  // const handleDropTemplateIntoStep = (template, stepId) => {
  //   // Find the step node
  //   console.log('Dropped template into step:', template, stepId);
  //   const stepNode = nodes.find(node => node.id === stepId);
    
  //   if (!stepNode) return;
    
  //   // Get the current task counter for this step
  //   const taskCounter = taskCounters[stepId] || 1;
  //   // console.log('Task counter for step', stepId, ':', taskCounter);
    
  //   // Create a new task from the template
  //   const newTask = {
  //     id: `task-${uuidv4()}`,
  //     name: `Task ${taskCounter}`,
  //     stepId: stepId,
  //     templateId: template.id,
  //     innerNodes: template.innerNodes ? [...template.innerNodes] : [],
  //     createdAt: new Date().toISOString(),
  //     updatedAt: new Date().toISOString()
  //   };
    
  //   // Add the task to the step's tasks array
  //   const updatedTasks = [...(stepNode.data.tasks || []), newTask];
    
  //   // Update the step node
  //   handleStepUpdate(stepId, { tasks: updatedTasks });
    
  //   // Increment the task counter for this step
  //   setTaskCounters(prev => ({
  //     ...prev,
  //     [stepId]: prev[stepId] + 1 || 2
  //   }));
  // };
  
  const handleTaskReorder = (stepId, sourceIndex, targetIndex) => {
    // Find the step node
    const stepNode = nodes.find(node => node.id === stepId);
    
    if (!stepNode || !stepNode.data.tasks) return;
    
    // Create a copy of the tasks array
    const updatedTasks = [...stepNode.data.tasks];
    
    // Remove the task from the source index
    const [movedTask] = updatedTasks.splice(sourceIndex, 1);
    
    // Insert the task at the target index
    updatedTasks.splice(targetIndex, 0, movedTask);
    
    // Update the task names based on their new order
    const renamedTasks = updatedTasks.map((task, index) => ({
      ...task,
      name: `Task ${index + 1}`
    }));
    
    // Update the step node
    handleStepUpdate(stepId, { tasks: renamedTasks });
  };
  
  const loadWorkflow = (workflow) => {
    if (!workflow || !workflow.id) return;
    
    // Clear current workflow
    setNodes([]);
    setEdges([]);
    
    // Set workflow details
    setWorkflowName(workflow.name || 'New Workflow');
    // setWorkflowDescription(workflow.description || '');
    
    // Create nodes from steps
    const newNodes = [];
    const newEdges = [];
    let maxStepNumber = 0;
    
    // Add step nodes
    if (workflow.steps && workflow.steps.length > 0) {
      workflow.steps.forEach(step => {
        // Extract step number from label if possible
        const stepNumberMatch = step.label && step.label.match(/STEP (\d+)/);
        if (stepNumberMatch && stepNumberMatch[1]) {
          const stepNumber = parseInt(stepNumberMatch[1], 10);
          if (stepNumber > maxStepNumber) {
            maxStepNumber = stepNumber;
          }
        }
        
        // Process tasks for this step
        const tasks = step.tasks || [];
        let maxTaskNumber = 0;
        
        // Update task counters based on task names
        tasks.forEach(task => {
          const taskNumberMatch = task.name && task.name.match(/Task (\d+)/);
          if (taskNumberMatch && taskNumberMatch[1]) {
            const taskNumber = parseInt(taskNumberMatch[1], 10);
            if (taskNumber > maxTaskNumber) {
              maxTaskNumber = taskNumber;
            }
          }
        });
        
        // Create step node
        newNodes.push({
          id: step.id,
          type: 'step',
          position: step.position || { x: 0, y: 0 },
          data: {
            label: step.label,
            tasks: tasks,
            onStepUpdate: handleStepUpdate,
            onTaskClick: handleTaskClick,
            onTaskReorder: handleTaskReorder,
            // 2025/4/3 add for task counter golbalization
            globalTaskCounter: globalTaskCounter,
            updateGlobalTaskCounter: updateGlobalTaskCounter
          }
        });
        
        // Update task counter for this step
        setTaskCounters(prev => ({
          ...prev,
          [step.id]: maxTaskNumber + 1
        }));

        // Create edges based on connections
        if (step.nextStep) {
          newEdges.push({
            id: `e-${step.id}-${step.nextStep}`,
            source: step.id,
            target: step.nextStep,
            animated: true
        })}
      });
    }
    
    // Add branch nodes
    if (workflow.branches && workflow.branches.length > 0) {
      workflow.branches.forEach(branch => {
        newNodes.push({
          id: branch.id,
          type: 'branch',
          position: branch.position || { x: 0, y: 0 },
          data: {
            label: branch.label || 'Branch',
            condition: branch.condition || '',
            onBranchUpdate: handleBranchUpdate
          }
        });

        if (branch.upperStep) {
          newEdges.push({
            id: `e-${branch.upperStep}-${branch.id}`,
            source: branch.upperStep,
            target: branch.id,
            animated: true
          });
        }
        
        if (branch.nextStep) {
          newEdges.push({
            id: `e-${branch.id}-${branch.nextStep}`,
            source: branch.id,
            target: branch.nextStep,
            sourceHandle: 'bottom',
            animated: true
          });
        }
        
        if (branch.rightStep) {
          newEdges.push({
            id: `e-${branch.id}-${branch.rightStep}`,
            source: branch.id,
            target: branch.rightStep,
            sourceHandle: 'right',
            animated: true
          });
        }
      });
    }
    // Update state
    setNodes(newNodes);
    setEdges(newEdges);
    setStepCounter(maxStepNumber + 1);
  };
  
  const handleSaveWorkflow = () => {
    setSaveDialogOpen(true);
  };
  
  const saveWorkflow = async () => {
    // try {
    //   // Prepare workflow data
    //   const workflowData = {
    //     name: workflowName,
    //     // description: workflowDescription,
    //     steps: nodes
    //       .filter(node => node.type === 'step')
    //       .map(node => ({
    //         id: node.id,
    //         label: node.data.label,
    //         position: { x: node.position.x, y: node.position.y },
    //         tasks: node.data.tasks || []
    //       })),
    //     branches: nodes
    //       .filter(node => node.type === 'branch')
    //       .map(node => ({
    //         id: node.id,
    //         label: node.data.label || 'Branch',
    //         condition: node.data.condition || '',
    //         position: { x: node.position.x, y: node.position.y }
    //       })),
    //     edges: edges.map(edge => ({
    //       id: edge.id,
    //       source: edge.source,
    //       target: edge.target
    //     }))
    //   };
      
    //   // Save workflow
    //   const savedWorkflow = await workflowService.saveWorkflow(workflowData);
    //   console.log('Workflow saved:', savedWorkflow);
      
    //   // Close dialog
    //   setSaveDialogOpen(false);
      
    //   // Refresh workflows list
    //   const workflowsData = await workflowService.getAllWorkflows();
    //   setWorkflows(workflowsData);
    // } catch (error) {
    //   console.error('Error saving workflow:', error);
    // }
    if (!workflowName.trim()) {
      alert('Please enter a workflow name');
      return;
    }
    
    try {
      // Extract steps and branches from nodes
      const steps = [];
      const branches = [];
      
      nodes.forEach(node => {
        // Get node position for restoring layout
        const nodePosition = { x: node.position.x, y: node.position.y };
        
        if (node.type === 'step') {
          // Process step nodes
          const step = {
            id: node.id,
            label: node.data.label,
            templateId: node.data.templateId,
            templateName: node.data.templateName,
            innerNodes: node.data.innerNodes,
            assignTo: node.data.assignTo || '',
            status: node.data.status || 'PENDING',
            position: nodePosition,
            tasks: node.data.tasks || [],
            upperStep: null,
            nextStep: null
          };
          steps.push(step);
        } else if (node.type === 'branch') {
          // Process branch nodes
          const branch = {
            id: node.id,
            label: node.data.label,
            condition: node.data.condition,
            position: nodePosition,
            upperStep: null,
            nextStep: null,
            rightStep: null
          };
          branches.push(branch);
        }
      });
      
      // Process connections from edges
      edges.forEach(edge => {
        const sourceNode = nodes.find(n => n.id === edge.source);
        const targetNode = nodes.find(n => n.id === edge.target);
        
        if (sourceNode && targetNode) {
          if (sourceNode.type === 'step') {
            // Step to any node
            const step = steps.find(s => s.id === sourceNode.id);
            if (step) {
              step.nextStep = targetNode.id;
            }
          } else if (sourceNode.type === 'branch') {
            // Branch to any node
            const branch = branches.find(b => b.id === sourceNode.id);
            if (branch) {
              if (edge.sourceHandle === 'bottom') {
                branch.nextStep = targetNode.id;
              } else if (edge.sourceHandle === 'right') {
                branch.rightStep = targetNode.id;
              } else {
                branch.nextStep = targetNode.id;
              }
            }
          }
          
          if (targetNode.type === 'step') {
            // Any node to step
            const step = steps.find(s => s.id === targetNode.id);
            if (step) {
              step.upperStep = sourceNode.id;
            }
          } else if (targetNode.type === 'branch') {
            // Any node to branch
            const branch = branches.find(b => b.id === targetNode.id);
            if (branch) {
              branch.upperStep = sourceNode.id;
            }
          }
        }
      });
      
      // Create workflow object
      const workflow = {
        name: workflowName,
        status: 'ACTIVE',
        steps: steps,
        branches: branches
      };
      
      // Save to backend
      const savedWorkflow = await workflowService.saveWorkflow(workflow);
      console.log('Workflow saved:', savedWorkflow);
      
      // Update workflows list
      const updatedWorkflows = await workflowService.getAllWorkflows();
      setWorkflows(updatedWorkflows);
      
      // Close dialog
      setSaveDialogOpen(false);
      setWorkflowName('');
      
      // alert('Workflow saved successfully!');
    } catch (error) {
      console.error('Error saving workflow:', error);
      alert('Error saving workflow. Please try again.');
    }


  };
  
  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
      <WorkflowSidebar 
        templates={templates} 
        workflows={workflows} 
        onSaveClick={handleSaveWorkflow} 
        onDeleteWorkflow={deleteWorkflow} // Pass the delete function as a prop
      />
      
      <Box sx={{ flexGrow: 1, height: '100%' }} ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={onInit}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          // nodesDraggable={!isDraggingTask} // 当正在拖动任务时禁用节点拖动  
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </Box>
      
      {/* Task Edit Dialog */}
      <TaskEditDialog
        open={taskDialogOpen}
        onClose={() => setTaskDialogOpen(false)}
        task={selectedTask}
        onSave={handleTaskUpdate}
      />
      
      {/* Save Workflow Dialog */}
      <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)}>
        <DialogTitle>Save Workflow</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1, minWidth: '400px' }}>
            <TextField
              autoFocus
              label="Workflow Name"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              fullWidth
            />
            {/* <TextField
              label="Description"
              value={workflowDescription}
              onChange={(e) => setWorkflowDescription(e.target.value)}
              multiline
              rows={4}
              fullWidth
            /> */}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
          <Button onClick={saveWorkflow} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WorkflowCreation;
