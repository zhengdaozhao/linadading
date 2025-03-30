// src/pages/WorkflowCreation.js
// import React from 'react';

// const WorkflowCreation = () => {
//   return <div>工作流程做成页面</div>;
// };

// export default WorkflowCreation;


import React, { useState, useEffect, useRef, useCallback } from 'react';
import {ReactFlow,  
  ReactFlowProvider, 
  addEdge, 
  useNodesState, 
  useEdgesState,
  useReactFlow,
  Controls,
  Background,
  Panel
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Box, Grid, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import WorkflowSidebar from '../components/workflow/WorkflowSidebar';
import StepNode from '../components/workflow/StepNode';
import BranchNode from '../components/workflow/BranchNode';
import workflowService from '../services/workflowService';
import templateService from '../services/templateService';
import { v4 as uuidv4 } from 'uuid';
import '../components/workflow/workflow.css';

// Custom node types
const nodeTypes = {
  stepNode: StepNode,
  branchNode: BranchNode,
};

// This is the main component that needs to be wrapped with ReactFlowProvider
const WorkflowCreationContent = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  // const [reactFlowInstance, setReactFlowInstance] = useState(null);
  // Use the hook to get the instance
  // const { project, getViewport } = useReactFlow();
  const reactFlowInstance = useReactFlow();
  const [templates, setTemplates] = useState([]);
  const [workflows, setWorkflows] = useState([]);
  const [stepCounter, setStepCounter] = useState(1);
  const [branchCounter, setBranchCounter] = useState(1);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [workflowName, setWorkflowName] = useState('');

  // Load templates and workflows on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const templatesData = await templateService.getAllTemplates();
        console.log('Templates fetched:', templatesData);
        setTemplates(templatesData);
        
        const workflowsData = await workflowService.getAllWorkflows();
        console.log('Workflows fetched:', workflowsData);
        setWorkflows(workflowsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, []);

  // Handle connections between nodes
  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge({ ...params, animated: true }, eds));
  }, [setEdges]);

  // // Setup when flow is loaded
  // const onInit = useCallback((reactFlowInstance) => {
  //   console.log('ReactFlow initialized', reactFlowInstance);
  //   setReactFlowInstance(reactFlowInstance);
  // }, []);

  // Handle drag over event
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle drop event
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      
      // Add debugging
      console.log('Drop event triggered');
      
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      
      // Check what data is available in the dataTransfer
      console.log('Available types:', event.dataTransfer.types);
      
      const type = event.dataTransfer.getData('application/reactflow/type');
      console.log('Type retrieved:', type);
      
      // Get the item data
      const itemData = event.dataTransfer.getData('application/reactflow/item');
      console.log('Item data retrieved:', itemData);
      
      try {
        // Get the raw data string
        const dataStr = event.dataTransfer.getData('text/plain');
        console.log('Raw data from drop event:', dataStr);
        
        // Check if we have valid data
        if (!dataStr) {
          console.log('No data found in drop event');
          return;
        }
        
        // Try to parse the JSON data
        let data;
        try {
          data = JSON.parse(dataStr);
        } catch (parseError) {
          console.error('Error parsing JSON:', parseError);
          console.log('Invalid JSON string:', dataStr);
          return;
        }
        
        // Extract type and item
        const type = data?.type;
        const item = data?.item;
        
        console.log('Parsed data:', { type, item });
        
        if (!type || !item) {
          console.log('Missing type or item in parsed data');
          return;
        }

        // Calculate position using the screenToFlowPosition method
        const position = reactFlowInstance.screenToFlowPosition({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top
        });
        
        console.log('Calculated position:', position);
        
        // Create the node based on type
        let newNode = null;
        
        if (type === 'template') {
          // Create a step node from template
          newNode = {
            id: `step-${uuidv4()}`,
            type: 'stepNode',
            position,
            data: { 
              label: `STEP ${stepCounter}`,
              templateId: item.id,
              templateName: item.label || 'Unnamed Template',
              nodeType: item.nodeType || 'container',
              innerNodes: item.innerNodes || [],
              assignTo: '',
              status: 'PENDING'
            },
          };
          setStepCounter(prev => prev + 1);
        } 
        else if (type === 'branch') {
          // Create a branch node
          newNode = {
            id: `branch-${uuidv4()}`,
            type: 'branchNode',
            position,
            data: { 
              label: `条件 ${branchCounter}`,
              condition: 'true',
            },
          };
          setBranchCounter(prev => prev + 1);
        }
        else if (type === 'workflow') {
          // Load an existing workflow
          loadWorkflow(item);
          return;
        }

        if (newNode) {
          console.log('Adding new node:', newNode);
          setNodes((nds) => nds.concat(newNode));
        }
      } catch (error) {
        console.error('Error processing dropped item:', error);
      }
    },
    [reactFlowInstance, stepCounter, branchCounter]
  );

  // Load an existing workflow
  const loadWorkflow = async (workflow) => {
    try {
      const workflowData = await workflowService.getWorkflowById(workflow.id);
      
      // Process steps and branches to create nodes
      const newNodes = [];
      const newEdges = [];
      
      // Process steps
      workflowData.steps.forEach(step => {
        newNodes.push({
          id: step.id,
          type: 'stepNode',
          position: step.position || { x: 100, y: 100 + newNodes.length * 100 },
          data: {
            label: step.label,
            templateId: step.templateId,
            templateName: step.templateName,
            innerNodes: step.innerNodes || [],
            assignTo: step.assignTo,
            status: step.status
          }
        });
        
        // Create edges if nextStep exists
        if (step.nextStep) {
          newEdges.push({
            id: `e-${step.id}-${step.nextStep}`,
            source: step.id,
            target: step.nextStep,
            animated: true
          });
        }
      });
      
      // Process branches
      workflowData.branches.forEach(branch => {
        newNodes.push({
          id: branch.id,
          type: 'branchNode',
          position: branch.position || { x: 300, y: 100 + newNodes.length * 100 },
          data: {
            label: branch.label,
            condition: branch.condition
          }
        });
        
        // Create edges for branch connections
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
      
      // Update state with new nodes and edges
      setNodes(newNodes);
      setEdges(newEdges);
      
      // Update counters
      const maxStepNumber = Math.max(...workflowData.steps.map(s => {
        const match = s.label.match(/STEP (\d+)/);
        return match ? parseInt(match[1]) : 0;
      }), 0);
      
      const maxBranchNumber = Math.max(...workflowData.branches.map(b => {
        const match = b.label.match(/条件 (\d+)/);
        return match ? parseInt(match[1]) : 0;
      }), 0);
      
      setStepCounter(maxStepNumber + 1);
      setBranchCounter(maxBranchNumber + 1);
      
    } catch (error) {
      console.error('Error loading workflow:', error);
    }
  };

  // Save the current workflow
  const saveWorkflow = async () => {
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
        
        if (node.type === 'stepNode') {
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
            upperStep: null,
            nextStep: null
          };
          steps.push(step);
        } else if (node.type === 'branchNode') {
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
          if (sourceNode.type === 'stepNode') {
            // Step to any node
            const step = steps.find(s => s.id === sourceNode.id);
            if (step) {
              step.nextStep = targetNode.id;
            }
          } else if (sourceNode.type === 'branchNode') {
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
          
          if (targetNode.type === 'stepNode') {
            // Any node to step
            const step = steps.find(s => s.id === targetNode.id);
            if (step) {
              step.upperStep = sourceNode.id;
            }
          } else if (targetNode.type === 'branchNode') {
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
      
      alert('Workflow saved successfully!');
    } catch (error) {
      console.error('Error saving workflow:', error);
      alert('Error saving workflow. Please try again.');
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex' }}>
      {/* Left Sidebar */}
      <Box sx={{ width: '300px', height: '100%', borderRight: '1px solid #ddd' }}>
        <WorkflowSidebar 
          templates={templates} 
          workflows={workflows} 
          onSaveClick={() => setSaveDialogOpen(true)} 
        />
      </Box>
      
      {/* Right Canvas */}
      <Box 
        ref={reactFlowWrapper} 
        sx={{ 
            flexGrow: 1, 
            height: '100%',
            position: 'relative', // Add this
            overflow: 'hidden',   // Add this
            '& .react-flow': { 
              background: '#f8f8f8',
              width: '100%',      // Add this
              height: '100%'      // Add this
            }
          }}
        >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          // onInit={onInit}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          fitView
          deleteKeyCode="Delete"  // Add this
          snapToGrid={true}       // Add this
          snapGrid={[15, 15]}     // Add this
        >
          <Controls />
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
      </Box>
      
      {/* Save Workflow Dialog */}
      <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)}>
        <DialogTitle>Save Workflow</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Workflow Name"
            type="text"
            fullWidth
            variant="outlined"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
          <Button onClick={saveWorkflow} variant="contained" color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Wrap the main component with ReactFlowProvider
const WorkflowCreation = () => {
  return (
    <Box sx={{ 
      height: 'calc(100vh - 64px)', // Adjust this if your header height is different
      width: '100%',
      // display: 'flex',
      // flexDirection: 'column'
    }}>
      <ReactFlowProvider>
        <WorkflowCreationContent />
      </ReactFlowProvider>
    </Box>
  );
};

export default WorkflowCreation;
