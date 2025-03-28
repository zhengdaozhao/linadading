import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { useDrop } from 'react-dnd';
import { Button } from 'antd';
import './ContainerNode.css';

const ContainerNode = ({ id, data, selected, isConnectable }) => {
  // Set up drop target for inner nodes
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'FIELD',
    drop: (item, monitor) => {
      // Prevent event bubbling to parent drop targets
      monitor.didDrop() || data.onDropToContainer(id, item, monitor);
      return { containerId: id };
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver() && !monitor.didDrop(),
    }),
  }));
    // Add this click handler to the inner nodes
  const handleInnerNodeClick = (e, nodeData) => {
    e.stopPropagation(); // Prevent container selection
    if (data.onSelectInnerNode) {
      data.onSelectInnerNode(nodeData);
    }
  };

  const handleSaveContainer = () => {
    console.log(`Attempting to save container ${id}`);
    if (data.onSaveContainer) {
      data.onSaveContainer(id);
    } else {
      console.error('onSaveContainer is not defined');
    }
  };

  return (
    <div 
      className={`container-node ${selected ? 'selected' : ''} ${isOver ? 'drop-target' : ''}`}
      ref={drop}
    >
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="handle handle-top"
      />
      
      <div className="title">{data.label}</div>
      
      <div className="inner-nodes">
        {data.innerNodes && data.innerNodes.length > 0 ? (
          data.innerNodes.map(node => (
            <div 
                key={node.id} 
                className="inner-node"
                onClick={(e) => handleInnerNodeClick(e, node)}
                >
              {/* <div className="field-item">
                <div className="field-label">
                  {node.data.label}
                </div>
                <div className="field-preview">
                  {renderFieldPreview(node.data.nodeType)}
                </div>
              </div> */}
              <div className="field-item">
                <div className="field-label" style={{color:'red'}}>
                  {node.data?.label || 'Unnamed Field'}
                </div>
                {/* <div className="field-type">
                  {node.data?.nodeType || 'Unknown Type'}
                </div> */}
                <div className="field-details">
                  {/* {node.data.fields && node.data.fields.map(field => ( */}
                  {/* {node.data?.fields?.map(field => (
                    <div key={field.id} className="inner-field">
                      {field.label} {field.required && <span className="required">*</span>}
                    </div>
                  ))} */}
                </div>
                {node.data.fields && ( 
                  <div>
                    {node.data.fields}
                  </div>
                ) }
                {!node.data.fields && (
                  <div className="field-preview">
                    {renderFieldPreview(node.data.nodeType)}
                  </div>
                )}
             </div>

            </div>
          ))
        ) : (
          <div className="empty-container-message">
            Drag fields here
          </div>
        )}
      </div>
      
      {data.innerNodes && data.innerNodes.length > 0 && (
        <Button 
          className="save-container" 
          onClick={(e) => {
            // 20250327 tabnine tell me to add
            e.preventDefault();  // Prevent default behavior
            e.stopPropagation();  // This stops the event from bubbling up
            console.log(`志萍大腚 save container ${id}`);
            data.onSaveContainer(id);
          }}
          // onClick={handleSaveContainer}
        >
          Save as Template
        </Button>
      )}
      
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="handle handle-bottom"
      />
    </div>
  );
};

// Helper function to render a preview of different field types
function renderFieldPreview(type) {
  switch (type) {
    case 'text':
      return <div className="input-preview">Text input</div>;
    case 'email':
      return <div className="input-preview">Email input</div>;
    case 'checkbox':
      return <div className="checkbox-preview"></div>;
    case 'number':
      return <div className="input-preview">Number input</div>;
    case 'date':
      return <div className="input-preview">Date input</div>;
    case 'status':
      return <div className="input-preview">Status dropdown</div>;
    default:
      return <div className="input-preview">Field</div>;
  }
}

export default ContainerNode;