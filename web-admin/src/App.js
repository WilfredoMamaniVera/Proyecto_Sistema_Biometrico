import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import DashboardPage from './pages/DashboardPage';
import EmployeesPage from './pages/EmpleadosPage';
import AsistenciPage from './pages/AsistenciaPage';
import ReportesPage from './pages/ReportesPage';
import ConfiguracionPage from './pages/ConfiguracionPage';
import AuthPage from './pages/AuthPage';

const App = () => {
  const [cookies] = useCookies(['token', 'personaInfo', 'usuarioInfo']);

  const isAuthenticated = () => {
    return cookies.token && cookies.personaInfo && cookies.usuarioInfo;
  };

  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
      return <Navigate to="/auth" replace />;
    }
    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={
            isAuthenticated() ? (
              <Navigate to="/inicio" replace />
            ) : (
              <Navigate to="/auth" replace />
            )
          } 
        />

        <Route 
          path="/auth" 
          element={
            isAuthenticated() ? (
              <Navigate to="/inicio" replace />
            ) : (
              <AuthPage />
            )
          } 
        />

        <Route 
          path="/inicio" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/empleados" 
          element={
            <ProtectedRoute>
              <EmployeesPage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/asistencias" 
          element={
            <ProtectedRoute>
              <AsistenciPage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/reportes" 
          element={
            <ProtectedRoute>
              <ReportesPage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/configuracion" 
          element={
            <ProtectedRoute>
              <ConfiguracionPage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="*" 
          element={
            <Navigate to="/" replace />
          } 
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;