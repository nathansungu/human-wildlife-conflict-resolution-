import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Detections from './pages/Detections';
import Cameras from './pages/Cameras';
import Users from './pages/Users';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Subscribe from './pages/Subscribe';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute';
import LandingPage from './pages/landing';

import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { setNavigate } from './utilities/navigate';
import { useAuthStore } from './store';

function App() {
  const navigate = useNavigate();
  const { checkAuth, isLoading } = useAuthStore();

  useEffect(() => {
    setNavigate(navigate); 
    checkAuth();
  }, []);

  if (isLoading) return null;
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'rgba(30, 41, 59, 0.9)',
            color: '#F1F5F9',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#F1F5F9',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#F1F5F9',
            },
          },
        }}
      />
      
      <Routes>
        <Route path="/landing_page" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/subscribe" element={<Subscribe />} />
        <Route path="/register" element={<Register />} />
        
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="detections" element={<Detections />} />
          <Route path="cameras" element={<Cameras />} />
          <Route path="users" element={<Users />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
}

export default App;
