// src/App.jsx
import React from 'react';
import { useState, useCallback, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Outlet, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Layout, Menu, Button } from 'antd';
import TemplateDesign from './pages/TemplateDesign';
import WorkflowCreation from './pages/WorkflowCreation';
import TaskAssignment from './pages/TaskAssignment';
import TaskProcessing from './pages/TaskProcessing';
import Login from './components/Login';
import Signup from './components/Signup';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const { Header, Content } = Layout;

// 布局组件
const RootLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth(); // Use the logout function from AuthContext

  const handleMenuClick = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true }); // Redirect to login page after logout
  };

  const menuItems = [
    {
      key: '/template-design',
      // label: '任务模板设计',
      label: 'Task Template Design',
      onClick: () => handleMenuClick('/template-design')
    },
    {
      key: '/workflow-creation',
      // label: '工作流程做成',
      label: 'Workflow Generation',
      onClick: () => handleMenuClick('/workflow-creation')
    },
    {
      key: '/task-assignment',
      // label: '任务分配与追踪',
      label: 'Task Assign & Track',
      onClick: () => handleMenuClick('/task-assignment')
    },
    {
      key: '/task-processing',
      // label: '任务处理',
      label: 'Task Process',
      onClick: () => handleMenuClick('/task-processing')
    },
    // {
    //   key: 'logout',
    //   label: 'Logout',
    //   onClick: handleLogout,
    //   style: { float: 'right' } // Position the logout item on the right
    // }
  ];

  const selectedKeys = [location.pathname];

  return (
    <DndProvider backend={HTML5Backend}>
      <Layout>
        {/* <Header  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Menu 
            theme="dark" 
            mode="horizontal" 
            selectedKeys={selectedKeys}
            items={menuItems}
            // style={{ flex: 1 }}
          />
          <Menu 
            theme="dark" 
            mode="horizontal"
            selectable={false}
            // style={{ flex: 0 }}
          >
            <Menu.Item key="logout" onClick={handleLogout}>
              Logout
            </Menu.Item>
          </Menu>
        </Header> */}
        <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="logo" />
          <Menu 
            theme="dark" 
            mode="horizontal" 
            selectedKeys={selectedKeys}
            items={menuItems}
            style={{ flex: 1 }}
          />
          <Button 
            type="text" 
            onClick={handleLogout}
            style={{ color: 'white' }}
          >
            Logout
          </Button>
        </Header>
        <Content style={{ padding: '0 50px', marginTop: 15 }}>
          <Outlet />
        </Content>
      </Layout>
    </DndProvider>
  );
};

// 创建一个认证上下文
const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // 在组件挂载时检查登录状态
  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
  }, []);

  const login = useCallback(() => {
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('zpddyzUser');
    setIsLoggedIn(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);

// 修改Login组件以使用AuthContext
const LoginWrapper = () => {
  const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // 如果已登录，直接重定向到首页
  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <Login onLogin={() => {
    login();
    navigate('/', { replace: true });
  }} />;
};

// 修改ProtectedRoute组件
const ProtectedRouteWrapper = ({ children }) => {
  const { isLoggedIn } = useAuth();
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
};

const AppRouter = () => {
  const { isLoggedIn } = useAuth();

  const router = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,
      children: [
        {
          path: 'template-design',
          element: <ProtectedRouteWrapper><TemplateDesign /></ProtectedRouteWrapper>,
        },
        {
          path: 'workflow-creation',
          element: <ProtectedRouteWrapper><WorkflowCreation /></ProtectedRouteWrapper>,
        },
        {
          path: 'task-assignment',
          element: <ProtectedRouteWrapper><TaskAssignment /></ProtectedRouteWrapper>,
        },
        {
          path: 'task-processing',
          element: <ProtectedRouteWrapper><TaskProcessing /></ProtectedRouteWrapper>,
        },
        {
          path: 'task-processing/:stepId',
          element: <ProtectedRouteWrapper><TaskProcessing /></ProtectedRouteWrapper>,
        },
        {
          path: '',
          element: <ProtectedRouteWrapper><TemplateDesign /></ProtectedRouteWrapper>,
        },
      ],
    },
    {
      path: '/login',
      element: <LoginWrapper />,
    },
    {
      path: '/signup',
      element: <Signup onSignup={() => {
        localStorage.setItem('isLoggedIn', 'true');
        return <Navigate to="/" replace />;
      }} />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;