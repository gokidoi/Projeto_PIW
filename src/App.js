// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { AuthProvider, useAuth } from './contexts';
import { InventoryProvider } from './contexts';
import { StoreProvider } from './contexts';
import { 
  ProtectedRoute, 
  Login, 
  AdminHeader, 
  StoreHeader, 
  ShoppingCart 
} from './components';
import { 
  Dashboard, 
  Inventory, 
  Reports, 
  StorePage, 
  LandingPage 
} from './pages';
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
      <Route path="/" element={
        <StoreProvider>
          <LandingPage />
        </StoreProvider>
      } />
      
      {/* Rotas da Loja (Públicas - podem ser acessadas sem login) */}
      <Route path="/store" element={
        <StoreProvider>
          <StoreLayout>
            <StorePage />
          </StoreLayout>
        </StoreProvider>
      } />
      
      {/* Rotas Administrativas (Protegidas) */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute>
          <InventoryProvider>
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          </InventoryProvider>
        </ProtectedRoute>
      } />
      <Route path="/admin/inventory" element={
        <ProtectedRoute>
          <InventoryProvider>
            <AdminLayout>
              <Inventory />
            </AdminLayout>
          </InventoryProvider>
        </ProtectedRoute>
      } />
      <Route path="/admin/reports" element={
        <ProtectedRoute>
          <InventoryProvider>
            <AdminLayout>
              <Reports />
            </AdminLayout>
          </InventoryProvider>
        </ProtectedRoute>
      } />
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/admin/*" element={<Navigate to="/admin/dashboard" replace />} />
      
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
