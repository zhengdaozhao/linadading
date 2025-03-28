// src/pages/TemplateDesign.js
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import FlowCanvas from './subComponents/FlowCanvas';
import Sidebar from './subComponents/Sidebar';
// import './TemplateDesign.css';

const TemplateDesign = () => {
//   return <div>任务模板设计页面</div>;
return (
    <DndProvider backend={HTML5Backend}>
      <div className="app-container">
        {/* <Sidebar /> */}
        <FlowCanvas />
      </div>
    </DndProvider> )

};

export default TemplateDesign;