// // import { useDrop } from 'react-dnd'
// // import { useCallback } from 'react'
// // import  { ReactFlow,
// //   addEdge, 
// //   Background, 
// //   Controls, 
// //   useNodesState, 
// //   useEdgesState 
// // } from '@xyflow/react'
// // import '@xyflow/react/dist/style.css'
// // // import { Hancdle } from 'reactflow';
// // import CustomNode  from './CustomNode'

// // const nodeTypes = {
// //   manager: CustomNode ,
// //   customer: CustomNode ,
// //   custom: CustomNode, // Add this for drag and drop functionality
// // }

// // const initialNodes = [
// //   {
// //     id: 'manager-1',
// //     type: 'manager',
// //     position: { x: 100, y: 50 },
// //     data: {
// //       label: 'Step 1',
// //       nodeType: 'manager',
// //       fields: [
// //         {
// //           id: 'email',
// //           type: 'email',
// //           label: '工作邮箱',
// //           required: true
// //         }
// //       ]
// //     }
// //   }
// // ]

// // // export default function FlowCanvas() {
// // //   return (
// // //     <div className="canvas-container" style={{ flex: 1 }}>
// // //       <ReactFlow
// // //         nodeTypes={nodeTypes}
// // //         nodes={initialNodes}
// // //         fitView
// // //       >
// // //         <Controls />
// // //       </ReactFlow>
// // //     </div>
// // //   )
// // // }
// // export default function FlowCanvas() {
// //   const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
// //   const [edges, setEdges, onEdgesChange] = useEdgesState([]);

// //   const onConnect = useCallback(
// //     (params) => setEdges((eds) => addEdge(params, eds)),
// //     [setEdges]
// //   );

// //   // Generate a unique ID for new nodes
// //   const getId = () => `node_${Date.now()}`;  // Use timestamp for truly unique IDs

// //   // Set up the drop target
// //   const [{ isOver }, drop] = useDrop(() => ({
// //     accept: 'FIELD',
// //     drop: (item, monitor) => {
// //       const position = monitor.getClientOffset();
// //       // Get canvas element position to calculate relative position
// //       const canvasElement = document.getElementById('flow-canvas');
// //       if (!canvasElement) return;
// //       const canvasRect = canvasElement.getBoundingClientRect();
      
// //       // Create a new node at the drop position
// //       const newNode = {
// //         id: getId(),
// //         type: 'custom',
// //         position: { 
// //           x: position.x - canvasRect.left - 75, // Adjust for node width/2
// //           y: position.y - canvasRect.top - 20   // Adjust for node height/2
// //         },
// //         // data: { 
// //         //   label: `${item.type} node`,
// //         //   nodeType: item.type 
// //         // }
// //         data: { 
// //           label: `${item.type} Field`,
// //           nodeType: item.type,
// //           fields: [
// //             {
// //               id: `${item.type}-${Date.now()}`,
// //               type: item.type,
// //               label: item.label || `${item.type} Field`,
// //               required: false
// //             }
// //           ] }
// //       };
// //       // Add the new node without replacing existing ones
// //       setNodes((nds) => [...nds, newNode]);
// //     },
// //     collect: (monitor) => ({
// //       isOver: !!monitor.isOver(),
// //     }),
// //   }));

// //   return (
// //     <div 
// //       id="flow-canvas"
// //       ref={drop} 
// //       style={{ 
// //         width: '100%', 
// //         height: '600px',
// //         border: isOver ? '2px dashed #1a192b' : '1px solid #eee',
// //         borderRadius: '4px'
// //       }}
// //     >
// //       <ReactFlow
// //         nodes={nodes}
// //         edges={edges}
// //         onNodesChange={onNodesChange}
// //         onEdgesChange={onEdgesChange}
// //         onConnect={onConnect}
// //         nodeTypes={nodeTypes}
// //         fitView
// //       >
// //         <Controls />
// //         <Background variant="dots" gap={12} size={1} />
// //       </ReactFlow>
// //     </div>
// //   );
// // }


// import { useDrop } from 'react-dnd'
// import React, { useCallback, useState, useEffect } from 'react'
// import { ReactFlow,
//   addEdge, 
//   Background, 
//   Controls, 
//   useNodesState, 
//   useEdgesState,
//   Panel
// } from '@xyflow/react'
// import '@xyflow/react/dist/style.css'
// import { Modal, Form, Input, Switch, Button, Popconfirm } from 'antd'
// import CustomNode from './CustomNode'

// const nodeTypes = {
//   manager: CustomNode,
//   customer: CustomNode,
//   custom: CustomNode,
// }

// const initialNodes = [
//   {
//     id: 'manager-1',
//     type: 'manager',
//     position: { x: 100, y: 50 },
//     data: {
//       label: 'Step 1',
//       nodeType: 'manager',
//       fields: [
//         {
//           id: 'email',
//           type: 'email',
//           label: '工作邮箱',
//           required: true
//         }
//       ]
//     }
//   }
// ]

// // Property Panel Component
// const PropertyPanel = ({ selectedNode, onUpdate, onDelete, onClose }) => {
//   const [form] = Form.useForm();
  
//   // Set initial form values when selected node changes
//   React.useEffect(() => {
//     if (selectedNode) {
//       form.setFieldsValue({
//         label: selectedNode.data.label,
//         ...selectedNode.data.fields.reduce((acc, field) => ({
//           ...acc,
//           [`field_${field.id}_label`]: field.label,
//           [`field_${field.id}_required`]: field.required
//         }), {})
//       });
//     }
//   }, [selectedNode, form]);

//   const handleSubmit = (values) => {
//     const updatedFields = selectedNode.data.fields.map(field => ({
//       ...field,
//       label: values[`field_${field.id}_label`],
//       required: values[`field_${field.id}_required`] || false
//     }));

//     onUpdate({
//       ...selectedNode,
//       data: {
//         ...selectedNode.data,
//         label: values.label,
//         fields: updatedFields
//       }
//     });
    
//     onClose();
//   };

//   if (!selectedNode) return null;

//   return (
//     <Modal
//       title="Edit Node Properties"
//       open={!!selectedNode}
//       onCancel={onClose}
//       footer={null}
//     >
//       <Form form={form} layout="vertical" onFinish={handleSubmit}>
//         <Form.Item name="label" label="Node Label" rules={[{ required: true }]}>
//           <Input />
//         </Form.Item>
        
//         <div style={{ marginBottom: 16 }}>
//           <h4>Fields</h4>
//           {selectedNode.data.fields.map(field => (
//             <div key={field.id} style={{ marginBottom: 16, padding: 8, border: '1px solid #f0f0f0' }}>
//               <Form.Item name={`field_${field.id}_label`} label="Field Label" rules={[{ required: true }]}>
//                 <Input />
//               </Form.Item>
//               <Form.Item name={`field_${field.id}_required`} label="Required" valuePropName="checked">
//                 <Switch />
//               </Form.Item>
//             </div>
//           ))}
//         </div>
        
//         <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//           <Popconfirm
//             title="Delete this node?"
//             onConfirm={() => onDelete(selectedNode.id)}
//             okText="Yes"
//             cancelText="No"
//           >
//             <Button danger>Delete</Button>
//           </Popconfirm>
//           <div>
//             <Button style={{ marginRight: 8 }} onClick={onClose}>
//               Cancel
//             </Button>
//             <Button type="primary" htmlType="submit">
//               Save
//             </Button>
//           </div>
//         </div>
//       </Form>
//     </Modal>
//   );
// };

// export default function FlowCanvas() {
//   const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
//   const [edges, setEdges, onEdgesChange] = useEdgesState([]);
//   const [selectedNode, setSelectedNode] = useState(null);

//   const onConnect = useCallback(
//     (params) => setEdges((eds) => addEdge(params, eds)),
//     [setEdges]
//   );

//   // Generate a unique ID for new nodes
//   const getId = () => `node_${Date.now()}`;

//   // Handle node selection
//   const onNodeClick = useCallback((event, node) => {
//     setSelectedNode(node);
//   }, []);

//   // Update node properties
//   const handleUpdateNode = useCallback((updatedNode) => {
//     setNodes((nds) => 
//       nds.map((node) => (node.id === updatedNode.id ? updatedNode : node))
//     );
//   }, [setNodes]);

//   // Delete node
//   const handleDeleteNode = useCallback((nodeId) => {
//     setNodes((nds) => nds.filter((node) => node.id !== nodeId));
//     setSelectedNode(null);
//   }, [setNodes]);

//   // Close property panel
//   const handleClosePanel = useCallback(() => {
//     setSelectedNode(null);
//   }, []);

//   // Set up the drop target
//   const [{ isOver }, drop] = useDrop(() => ({
//     accept: 'FIELD',
//     drop: (item, monitor) => {
//       const position = monitor.getClientOffset();
//       // Get canvas element position to calculate relative position
//       const canvasElement = document.getElementById('flow-canvas');
//       if (!canvasElement) return;
//       const canvasRect = canvasElement.getBoundingClientRect();
      
//       // Create a new node at the drop position
//       const newNode = {
//         id: getId(),
//         type: 'custom',
//         position: { 
//           x: position.x - canvasRect.left - 75,
//           y: position.y - canvasRect.top - 20
//         },
//         data: { 
//           label: `${item.type} Field`,
//           nodeType: item.type,
//           fields: [
//             {
//               id: `${item.type}-${Date.now()}`,
//               type: item.type,
//               label: item.label || `${item.type} Field`,
//               required: false
//             }
//           ]
//         }
//       };
      
//       setNodes((nds) => [...nds, newNode]);
//     },
//     collect: (monitor) => ({
//       isOver: !!monitor.isOver(),
//     }),
//   }));

//   return (
//     <div 
//       id="flow-canvas"
//       ref={drop} 
//       style={{ 
//         width: '100%', 
//         height: '600px',
//         border: isOver ? '2px dashed #1a192b' : '1px solid #eee',
//         borderRadius: '4px',
//         position: 'relative'
//       }}
//     >
//       <ReactFlow
//         nodes={nodes}
//         edges={edges}
//         onNodesChange={onNodesChange}
//         onEdgesChange={onEdgesChange}
//         onConnect={onConnect}
//         onNodeClick={onNodeClick}
//         nodeTypes={nodeTypes}
//         fitView
//       >
//         <Controls />
//         <Background variant="dots" gap={12} size={1} />
//       </ReactFlow>
      
//       <PropertyPanel
//         selectedNode={selectedNode}
//         onUpdate={handleUpdateNode}
//         onDelete={handleDeleteNode}
//         onClose={handleClosePanel}
//       />
//     </div>
//   );
// }


import { useDrop } from 'react-dnd';
import React, { useCallback, useState, useEffect } from 'react';
import { 
  ReactFlow,
  addEdge, 
  Background, 
  Controls, 
  useNodesState, 
  useEdgesState,
  Panel
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Modal, Form,Select, Input, Switch, Button, Popconfirm, message } from 'antd';
import CustomNode from './CustomNode';
import ContainerNode from './ContainerNode';
import Sidebar from './Sidebar';
import './FlowCanvas.css';
import TemplateService from '../../services/TemplateService';
import StatusNode from './StatusNode';

// Define node types
const nodeTypes = {
  manager: CustomNode,
  customer: CustomNode,
  custom: CustomNode,
  container: ContainerNode,
  status: StatusNode // Add this line
};

// const initialNodes = [
//   {
//     id: 'manager-1',
//     type: 'manager',
//     position: { x: 100, y: 50 },
//     data: {
//       label: 'Step 1',
//       nodeType: 'manager',
//       fields: [
//         {
//           id: 'email',
//           type: 'email',
//           label: '工作邮箱',
//           required: true
//         }
//       ]
//     }
//   }
// ];

// Property Panel Component
const PropertyPanel = ({ selectedNode, onUpdate, onDelete, onClose }) => {
  const [form] = Form.useForm();
  
  React.useEffect(() => {
    if (selectedNode) {
      if (selectedNode.type === 'container') {
        form.setFieldsValue({
          label: selectedNode.data.label
        });
      } else {
        form.setFieldsValue({
          label: selectedNode.data.label,
          // ...selectedNode.data.fields?.reduce((acc, field) => ({
          //   ...acc,
          //   [`field_${field.id}_label`]: field.label,
          //   [`field_${field.id}_required`]: field.required
          // }), {})
          fields:selectedNode.data.fields
        });
      }
    }
  }, [selectedNode, form]);

  const handleSubmit = (values) => {
    if (selectedNode.type === 'container') {
      onUpdate({
        ...selectedNode,
        data: {
          ...selectedNode.data,
          label: values.label
        }
      });
    } else {
      // const updatedFields = selectedNode.data.fields?.map(field => ({
      //   ...field,
      //   label: values[`field_${field.id}_label`],
      //   required: values[`field_${field.id}_required`] || false
      // }));

      onUpdate({
        ...selectedNode,
        data: {
          ...selectedNode.data,
          label: values.label,
          // fields: updatedFields
          fields: values.fields
        }
      });
    }
    
    onClose();
  };

  if (!selectedNode) return null;

  return (
    <Modal
      title="Edit Node Properties"
      open={!!selectedNode}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item name="label" label="Node Label" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        
        {/* {selectedNode.type !== 'container' && selectedNode.data.fields && ( */}
        {selectedNode.type !== 'container'  && (
          <div style={{ marginBottom: 16 }}>
            {/* <h4>Fields</h4> */}
            {selectedNode.type === 'status' ? (
              <Form.Item name='fields' label="Default Status">
                <Select style={{ width: 120 }}>
                  <Select.Option value="Pending">Pending</Select.Option>
                  <Select.Option value="Approved">Approved</Select.Option>
                  <Select.Option value="Canceled">Canceled</Select.Option>
                </Select>
              </Form.Item>
            ) : selectedNode.type === 'checkbox' ? (
              <Form.Item name='fields' label="Node Checkbox" valuePropName="checked">
                <Switch />
              </Form.Item>
            ) : (
              <Form.Item name='fields' label="Node fields" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            )}
          </div>
        )}
        
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Popconfirm
            title="Delete this node?"
            onConfirm={() => onDelete(selectedNode.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
          <div>
            <Button style={{ marginRight: 8 }} onClick={onClose}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default function FlowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [savedTemplates, setSavedTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [containerCount, setContainerCount] = useState(0);
  // Load templates from backend when component mounts
  useEffect(() => {
    const fetchTemplates = async () => {
      setIsLoading(true);
      try {
        const templates = await TemplateService.getAllTemplates();
        setSavedTemplates(templates);
      } catch (error) {
        message.error('Failed to load templates from server');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTemplates();
  }, []);


  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Generate a unique ID for new nodes
  const getId = () => `node_${Date.now()}`;

  // Handle node selection
  const onNodeClick = useCallback((event, node) => {
    // //20250326 Ignore clicks on the 'Save as Template' button
    if (event.target.className=='save-container') {
      return;
    }
    setSelectedNode(node);
  }, []);

  // // Update node properties
  // const handleUpdateNode = useCallback((updatedNode) => {
  //   setNodes((nds) => 
  //     nds.map((node) => (node.id === updatedNode.id ? updatedNode : node))
  //   );
  // }, [setNodes]);
  
// Update the handleUpdateNode function to handle inner nodes
const handleUpdateNode = useCallback((updatedNode) => {
  setNodes((nds) => {
    // Check if this is an inner node (ID starts with 'inner_')
    if (updatedNode.id.startsWith('inner_')) {
      // Find the container that contains this inner node
      return nds.map(node => {
        if (node.type === 'container' && node.data.innerNodes) {
          // Check if this container has the inner node
          const innerNodeIndex = node.data.innerNodes.findIndex(
            innerNode => innerNode.id === updatedNode.id
          );
          
          if (innerNodeIndex >= 0) {
            // Update the inner node in the container
            const updatedInnerNodes = [...node.data.innerNodes];
            updatedInnerNodes[innerNodeIndex] = updatedNode;
            
            return {
              ...node,
              data: {
                ...node.data,
                innerNodes: updatedInnerNodes
              }
            };
          }
        }
        return node;
      });
    } else {
      // Regular node update
      return nds.map((node) => (node.id === updatedNode.id ? updatedNode : node));
    }
  });
}, [setNodes]);

  // Delete node
  const handleDeleteNode = useCallback((nodeId) => {
    setNodes((nds) => {
    // Check if this is an inner node (ID starts with 'inner_')
      if (nodeId.startsWith('inner_')) {
        return nds.map(node => {
          if (node.type === 'container' && node.data.innerNodes) {
            return {
              ...node,
              data: {
                ...node.data,
                innerNodes: node.data.innerNodes.filter(innerNode => innerNode.id !== nodeId)
              }
            };
          }
          return node;
        });
      } else {
      // First, find if this is a container node
      const containerNode = nds.find(n => n.id === nodeId && n.type === 'container');
      
      // If it's a container, also remove all inner nodes
      if (containerNode && containerNode.data.innerNodes) {
        const innerNodeIds = containerNode.data.innerNodes.map(n => n.id);
        return nds.filter(n => n.id !== nodeId && !innerNodeIds.includes(n.id));
      }
      
      // Otherwise just remove the node
      return nds.filter(n => n.id !== nodeId);
    }});
    setSelectedNode(null);
  }, [setNodes]);

  // Close property panel
  const handleClosePanel = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // Handle dropping a node into a container
  const handleDropToContainer = useCallback((containerId, item, monitor) => {
    const position = monitor.getClientOffset();
    
    // Create a new inner node
    const newInnerNode = {
      id: `inner_${getId()}`,
      // type: 'custom',
      type: item.type === 'status' ? 'status' : 'custom',
      data: { 
        // label: item.label || `${item.type} Field`,
        // nodeType: item.type,
        label: `${item.type}基础组件`,
        nodeType: item.type,
        // fields: [
        //   {
        //     id: `${item.type}-${Date.now()}`,
        //     type: item.type,
        //     label: item.label || `${item.type} Field`,
        //     required: false
        //   }
        // ]
        fields:item.type === 'status' ? 'Pending' : ''
      }
    };
    
    // Update the container node to include this inner node
    setNodes(nds => 
      nds.map(node => {
        if (node.id === containerId) {
          return {
            ...node,
            data: {
              ...node.data,
              innerNodes: [...(node.data.innerNodes || []), newInnerNode]
            }
          };
        }
        return node;
      })
    );
  }, [setNodes]);

  // Save container as template
  // const handleSaveContainer = useCallback((containerId) => {
  //   const containerNode = nodes.find(n => n.id === containerId);
  //   if (containerNode && containerNode.data.innerNodes) {
  //     const newTemplate = {
  //       id: `template_${Date.now()}`,
  //       label: `${containerNode.data.label} Template`,
  //       nodeType: 'container',
  //       innerNodes: containerNode.data.innerNodes
  //     };
      
  //     setSavedTemplates(prev => [...prev, newTemplate]);
  //     message.success(`Template "${newTemplate.label}" saved successfully!`);
  //   }
  // }, [nodes]);
  // const handleSaveContainer = useCallback(async (containerId) => {
  //   const containerNode = nodes.find(n => n.id === containerId);
  //   if (containerNode && containerNode.data.innerNodes) {
  //     setIsLoading(true);
      
  //     try {
  //       const newTemplate = {
  //         label: `${containerNode.data.label} Template`,
  //         nodeType: 'container',
  //         innerNodes: containerNode.data.innerNodes,
  //         createdAt: new Date().toISOString()
  //       };
        
  //       // Save to backendT
  //       const savedTemplate = await TemplateService.saveTemplate(newTemplate);
        
  //       // Update local state with the saved template (including server-generated ID)
  //       setSavedTemplates(prev => [...prev, savedTemplate]);
  //       message.success(`Template "${savedTemplate.label}" saved successfully!`);
  //     } catch (error) {
  //       message.error('Failed to save template to server');
  //       console.error('Error saving template:', error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }
  // }, [nodes]);

  // 20250326 change for cannot save template
  const handleSaveContainer = useCallback(async (containerId) => {
    setNodes(currentNodes => {
      const containerNode = currentNodes.find(n => n.id === containerId);
      if (containerNode && containerNode.data.innerNodes) {
        setIsLoading(true);
        
        const newTemplate = {
          label: `${containerNode.data.label}`,
          nodeType: 'container',
          // innerNodes: containerNode.data.innerNodes,
          innerNodes: containerNode.data.innerNodes.map(innerNode => ({
            id: innerNode.id,
            data: {
                  label: innerNode.data.label,
                  nodeType: innerNode.data.nodeType,
                  fields: innerNode.data.fields // Ensure fields are set
                }
              })),
          createdAt: new Date().toISOString()
        };
        
        // Save to backend
        TemplateService.saveTemplate(newTemplate)
          .then(savedTemplate => {
            // Update local state with the saved template (including server-generated ID)
            // setSavedTemplates(prev => [...prev, savedTemplate]);
            setSavedTemplates(prev => {
              // Check if the template already exists to prevent duplicates
              if (!prev.some(t => t.id === savedTemplate.id)) {
                return [...prev, savedTemplate];
              }
              return prev;
            });
            message.success(`Template "${savedTemplate.label}" saved successfully!`);
            // Remove the container from the canvas
            setNodes(nodes => nodes.filter(node => node.id !== containerId));
          })
          .catch(error => {
            message.error('Failed to save template to server');
            console.error('Error saving template:', error);
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
      return currentNodes; // Return the current nodes state unchanged
    });
  }, []);

  // Delete template
  const handleDeleteTemplate = useCallback(async (templateId) => {
    try {
      setIsLoading(true);
      await TemplateService.deleteTemplate(templateId);
      setSavedTemplates(prev => prev.filter(t => t.id !== templateId));
      message.success('Template deleted successfully');
    } catch (error) {
      message.error('Failed to delete template');
      console.error('Error deleting template:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);


  // Set up the drop target for the canvas
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'FIELD',
    drop: (item, monitor) => {
      // Check if dropped on a child component that handles the drop
      if (monitor.didDrop()) {
        return;
      }
      
      const position = monitor.getClientOffset();
      const canvasElement = document.getElementById('flow-canvas');
      if (!canvasElement) return;
      const canvasRect = canvasElement.getBoundingClientRect();
      
      // Create a new node based on the item type
      let newNode;
      
      if (item.type === 'container') {
        // Increment the container count
        setContainerCount(prevCount => prevCount + 1);
        // Create a container node
        newNode = {
          id: getId(),
          type: 'container',
          position: { 
            x: position.x - canvasRect.left - 150,
            y: position.y - canvasRect.top - 100
          },
          data: { 
            label: `Task模板-${containerCount + 1}`,
            nodeType: 'container',
            innerNodes: [],
            onDropToContainer: handleDropToContainer,
            onSaveContainer: handleSaveContainer,
            onSelectInnerNode: handleSelectInnerNode // Add this line
          }
        };
      } else if (item.templateId) {
        // Create a node from a saved template
        const template = savedTemplates.find(t => t.id === item.templateId);
        if (template) {
          newNode = {
            id: getId(),
            type: 'container',
            position: { 
              x: position.x - canvasRect.left - 150,
              y: position.y - canvasRect.top - 100
            },
            data: { 
              label: template.label,
              nodeType: 'container',
              // innerNodes: template.innerNodes,
              // 20250327 change to solve template re-render on canvas
              innerNodes: template.innerNodes.map(innerNode => ({
                ...innerNode,
                id: `inner_${getId()}` // Ensure unique IDs for inner nodes
              })),
              onDropToContainer: handleDropToContainer,
              onSaveContainer: handleSaveContainer,
              onSelectInnerNode: handleSelectInnerNode // Add this line
            }
          };
        }
      } else {
        // Create a regular field node
        newNode = {
          id: getId(),
          type: 'custom',
          position: { 
            x: position.x - canvasRect.left - 75,
            y: position.y - canvasRect.top - 20
          },
          data: { 
            label: `${item.type} Field`,
            nodeType: item.type,
            fields: [
              {
                id: `${item.type}-${Date.now()}`,
                type: item.type,
                label: item.label || `${item.type} Field`,
                required: false
              }
            ]
          }
        };
      }
      
      if (newNode) {
        setNodes((nds) => [...nds, newNode]);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver() && !monitor.didDrop(),
    }),
  }), [setNodes, savedTemplates, handleDropToContainer, handleSaveContainer,containerCount]);
  // Add this function to handle inner node selection
  const handleSelectInnerNode = useCallback((innerNode) => {
    setSelectedNode(innerNode);
  }, []);

  return (
    <div className="flow-canvas-wrapper">
      <Sidebar 
        savedTemplates={savedTemplates}
        onDeleteTemplate={handleDeleteTemplate}
        isLoading={isLoading}
       />
      
      <div 
        id="flow-canvas"
        ref={drop} 
        className={`flow-canvas ${isOver ? 'drop-target' : ''}`}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          className="react-flow__container"
        >
          <Controls />
          <Background variant="dots" gap={12} size={1} />
          <Panel position="top-right">
            {/* <Button 
              type="primary" 
              onClick={() => {
                // Save the entire flow as JSON
                const flowData = {
                  nodes,
                  edges,
                  templates: savedTemplates
                };
                
                // Create a download link for the JSON
                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(flowData, null, 2));
                const downloadAnchorNode = document.createElement('a');
                downloadAnchorNode.setAttribute("href", dataStr);
                downloadAnchorNode.setAttribute("download", "flow-template.json");
                document.body.appendChild(downloadAnchorNode);
                downloadAnchorNode.click();
                downloadAnchorNode.remove();
                
                message.success('Flow template saved successfully!');
              }}
            >
              Save Flow
            </Button> */}
          </Panel>
        </ReactFlow>
      </div>
      
      <PropertyPanel
        selectedNode={selectedNode}
        onUpdate={handleUpdateNode}
        onDelete={handleDeleteNode}
        onClose={handleClosePanel}
        // handleSaveContainer={handleSaveContainer} // Pass the handleSaveContainer method
        // setIsLoading={setIsLoading} // Pass the setIsLoading function
        // handleSelectInnerNode={handleSelectInnerNode} // Add this line
      />
    </div>
  );
}


