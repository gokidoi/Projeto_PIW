// AdminHeader.js
import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  Assessment as ReportsIcon,
  Store as StoreIcon,
  AccountCircle as AccountIcon,
  ExitToApp as LogoutIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
    handleMenuClose();
  };

  const handleStoreAccess = () => {
    navigate('/store');
    handleMenuClose();
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navButtons = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: <DashboardIcon /> },
    { label: 'Inventário', path: '/admin/inventory', icon: <InventoryIcon /> },
    { label: 'Relatórios', path: '/admin/reports', icon: <ReportsIcon /> }
  ];

  return (
    <AppBar position="static" sx={{ background: 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ mr: 4 }}>
          🔧 Admin - Inventário
        </Typography>

        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          {navButtons.map((button) => (
            <Button
              key={button.path}
              color="inherit"
              startIcon={button.icon}
              onClick={() => navigate(button.path)}
              sx={{
                mr: 2,
                backgroundColor: isActive(button.path) ? 'rgba(255,255,255,0.2)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              {button.label}
            </Button>
          ))}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Botão para acessar a loja */}
          <Button
            color="inherit"
            startIcon={<StoreIcon />}
            onClick={handleStoreAccess}
            sx={{ mr: 2 }}
          >
            Ver Loja
          </Button>

          {/* Menu do usuário */}
          {user && (
            <>
              <IconButton
                color="inherit"
                onClick={handleMenuOpen}
              >
                <AccountIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem disabled>
                  <Typography variant="body2">
                    👤 {user.displayName || user.email}
                  </Typography>
                </MenuItem>
                <MenuItem onClick={handleStoreAccess}>
                  <StoreIcon sx={{ mr: 1 }} />
                  Acessar Loja
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AdminHeader;
