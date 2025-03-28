// 




import React from 'react';
import { Handle, Position } from '@xyflow/react';
import './CustomNode.css';

const CustomNode = ({ id, data, selected, isConnectable }) => {
  return (
    <div className={`custom-node ${selected ? 'selected' : ''}`}>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      
      <div className="node-header">
        <h4>{data.label}</h4>
        <span className="node-type">{data.nodeType}</span>
      </div>

      <div className="fields-container">
        {data.fields?.map((field) => (
          <div key={field.id} className="field-item">
            <div className="field-label">
              {field.label} {field.required && <span className="required">*</span>}
            </div>
            <div className="field-preview">
              {renderFieldPreview(field.type)}
            </div>
          </div>
        ))}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
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
    default:
      return <div className="input-preview">Field</div>;
  }
}

export default CustomNode;