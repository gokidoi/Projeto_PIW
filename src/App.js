// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { InventoryProvider } from './contexts/InventoryContext';
import { StoreProvider } from './contexts/StoreContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminHeader from './components/admin/AdminHeader';
import StoreHeader from './components/store/StoreHeader';
import ShoppingCart from './components/store/ShoppingCart';
import Login from './components/Login';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Reports from './pages/Reports';
import StorePage from './pages/store/StorePage';
import LandingPage from './pages/LandingPage';
import './App.css';

// Tema personalizado do Material-UI
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
});

// Componente de Layout Admin
const AdminLayout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AdminHeader />
      <Box component="main" sx={{ flexGrow: 1, backgroundColor: '#f5f5f5', paddingBottom: 4 }}>
        {children}
      </Box>
    </Box>
  );
};

// Componente de Layout da Loja
const StoreLayout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <StoreHeader />
      <Box component="main" sx={{ flexGrow: 1, backgroundColor: '#fafafa', paddingBottom: 4 }}>
        {children}
      </Box>
      <ShoppingCart />
    </Box>
  );
};

// Componente de roteamento principal
const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Rota de Login */}
      <Route 
        path="/login" 
        element={user ? <Navigate to="/" replace /> : <Login />} 
      />
      
      {/* Landing Page */}
      <Route path="/" element={<LandingPage />} />
      
      {/* Rotas da Loja (Públicas - podem ser acessadas sem login) */}
      <Route path="/store" element={
        <StoreProvider>
          <StoreLayout>
            <StorePage />
          </StoreLayout>
        </StoreProvider>
      } />
      
      {/* Rotas Administrativas (Protegidas) */}
      <Route path="/admin/*" element={
        <ProtectedRoute>
          <InventoryProvider>
            <Routes>
              <Route path="dashboard" element={
                <AdminLayout>
                  <Dashboard />
                </AdminLayout>
              } />
              <Route path="inventory" element={
                <AdminLayout>
                  <Inventory />
                </AdminLayout>
              } />
              <Route path="reports" element={
                <AdminLayout>
                  <Reports />
                </AdminLayout>
              } />
              <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
            </Routes>
          </InventoryProvider>
        </ProtectedRoute>
      } />
      
      {/* Redirecionamentos */}
      <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/inventory" element={<Navigate to="/admin/inventory" replace />} />
      <Route path="/reports" element={<Navigate to="/admin/reports" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box 
        sx={{ 
          width: '100%',
          minHeight: '100vh',
          margin: 0,
          padding: 0,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <AuthProvider>
          <Router>
            <AppRoutes />
          </Router>
        </AuthProvider>
      </Box>
    </ThemeProvider>
  );
}

export default App;
