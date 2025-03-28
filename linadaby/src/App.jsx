// src/App.js
import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import TemplateDesign from './pages/TemplateDesign';
import WorkflowCreation from './pages/WorkflowCreation';
import TaskAssignment from './pages/TaskAssignment';
import TaskProcessing from './pages/TaskProcessing';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'


const { Header, Content } = Layout;

// 布局组件
const RootLayout = () => {
  const navigate = useNavigate(); // 使用 useNavigate 钩子
  const location = useLocation(); // 使用 useLocation 钩子获取当前路径

  // 处理菜单点击事件
  const handleMenuClick = (path) => {
    navigate(path); // 使用 navigate 跳转到指定路径
  };

  // Define menu items using the recommended items prop format
  const menuItems = [
    {
      key: '/template-design',
      label: '任务模板设计',
      onClick: () => navigate('/template-design')
    },
    {
      key: '/workflow-creation',
      label: '工作流程做成',
      onClick: () => navigate('/workflow-creation')
    },
    {
      key: '/task-assignment',
      label: '任务分配与追踪',
      onClick: () => navigate('/task-assignment')
    },
    {
      key: '/task-processing',
      label: '任务处理',
      onClick: () => navigate('/task-processing')
    }
  ];

  // 根据当前路径设置选中的菜单项
  const selectedKeys = [location.pathname];

  return (
    <DndProvider backend={HTML5Backend}>
    <Layout>
      <Header>
        <Menu 
            theme="dark" 
            mode="horizontal" 
            selectedKeys={selectedKeys}
            items={menuItems} // Use items prop instead of children
          />
      </Header>
      <Content style={{ padding: '0 50px', marginTop: 64 }}>
        <Outlet /> {/* 这里是子路由渲染的位置 */}
      </Content>
    </Layout>
      </DndProvider>
  );
};

// 路由配置
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: '/template-design',
        element: <TemplateDesign />,
      },
      {
        path: '/workflow-creation',
        element: <WorkflowCreation />,
      },
      {
        path: '/task-assignment',
        element: <TaskAssignment />,
      },
      {
        path: '/task-processing',
        element: <TaskProcessing />,
      },
      {
        path: '/',
        element: <TemplateDesign />, // 默认页面
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;