// 




import React from 'react';
import { useDrag } from 'react-dnd';
import { Button, Spin, Tooltip } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import './Sidebar.css';

const DraggableItem = ({ type, label }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'FIELD',
    item: { type, label },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`sidebar-item ${isDragging ? 'dragging' : ''}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {label}
    </div>
  );
};

// const TemplateItem = ({ template, onDragStart }) => {
//   const [{ isDragging }, drag] = useDrag(() => ({
//     type: 'FIELD',
//     item: { templateId: template.id, label: template.label },
//     collect: (monitor) => ({
//       isDragging: !!monitor.isDragging(),
//     }),
//   }));

//   return (
//     <div
//       ref={drag}
//       className={`sidebar-item template-item ${isDragging ? 'dragging' : ''}`}
//       style={{ opacity: isDragging ? 0.5 : 1 }}
//     >
//       {template.label}
//     </div>
//   );
// };
const TemplateItem = ({ template, onDragStart, onDelete }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'FIELD',
    item: { 
      templateId: template.id,
      type: 'template'
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }));

  return (
    <div 
      ref={drag}
      className={`sidebar-item template-item ${isDragging ? 'dragging' : ''}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className="template-label">{template.label}</div>
      <Tooltip title="Delete template">
        <Button 
          type="text" 
          danger 
          icon={<DeleteOutlined />} 
          onClick={(e) => {
            e.stopPropagation();
            onDelete(template.id);
          }}
          size="small"
        />
      </Tooltip>
    </div>
  );
};

// const Sidebar = ({ savedTemplates }) => {
//   return (
//     <div className="sidebar">
//       <h3>Field Types</h3>
//       <DraggableItem type="container" label="Container" />
//       <DraggableItem type="text" label="Text Field" />
//       <DraggableItem type="email" label="Email Field" />
//       <DraggableItem type="checkbox" label="Checkbox" />
//       <DraggableItem type="number" label="Number Field" />
//       <DraggableItem type="date" label="Date Field" />
      
//       {savedTemplates && savedTemplates.length > 0 && (
//         <>
//           <h3>Saved Templates</h3>
//           {savedTemplates.map(template => (
//             <TemplateItem key={template.id} template={template} />
//           ))}
//         </>
//       )}
//     </div>
//   );
// };
const Sidebar = ({ savedTemplates, onDeleteTemplate, isLoading }) => {
  return (
    <div className="sidebar">
      <h3>Field Types</h3>
      <div className="sidebar-section">
        <DraggableItem type="text" label="Text Field" />
        <DraggableItem type="email" label="Email Field" />
        <DraggableItem type="number" label="Number Field" />
        <DraggableItem type="status" label="Status" /> {/* Add this line */}
        <DraggableItem type="checkbox" label="Checkbox" />
        <DraggableItem type="date" label="Date Picker" />
      </div>
      
      <h3>Containers</h3>
      <div className="sidebar-section">
        <DraggableItem type="container" label="Container" />
      </div>
      
      <h3>Saved Templates</h3>
      <div className="sidebar-section templates-section">
        {isLoading ? (
          <Spin size="small" />
        ) : savedTemplates && savedTemplates.length > 0 ? (
          savedTemplates.map(template => (
            <TemplateItem 
              key={template.id} 
              template={template} 
              onDelete={onDeleteTemplate}
            />
          ))
        ) : (
          <div className="no-templates">No saved templates</div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;