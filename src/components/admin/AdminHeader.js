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
  MenuItem,
  Avatar,
  Divider
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  Assessment as ReportsIcon,
  Store as StoreIcon,
  ExitToApp as LogoutIcon,
  Home as HomeIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts';
import Logo from '../../assets/logo_BRANCA.png';

const AdminHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileMenuAnchor, setMobileMenuAnchor] = React.useState(null);

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handleLogout = async () => {
    try {
      // Primeiro navegar para a página inicial
      navigate('/');
      // Depois fazer logout
      await logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
    handleMobileMenuClose();
  };

  const handleStoreAccess = () => {
    navigate('/store');
    handleMobileMenuClose();
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
        {/* Menu único para mobile */}
        <IconButton
          color="inherit"
          onClick={handleMobileMenuOpen}
          sx={{ display: { xs: 'block', md: 'none' }, mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        {/* Logo */}

        <img 
          src={Logo} 
          alt="Logo Marca" 
          style={{
            height: '40px',
            marginRight: '20px',
            objectFit: 'contain'
          }}
        />

        {/* Menu desktop */}
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
          {/* Botão para voltar à home */}
          <IconButton
            color="inherit"
            onClick={() => navigate('/')}
            sx={{ mr: 1, display: { xs: 'none', md: 'block' } }}
            title="Voltar à página inicial"
          >
            <HomeIcon />
          </IconButton>

          {/* Botão para acessar a loja */}
          <Button
            color="inherit"
            startIcon={<StoreIcon />}
            onClick={handleStoreAccess}
            sx={{ mr: 2, display: { xs: 'none', md: 'block' } }}
          >
            Ver Loja
          </Button>

          {/* Avatar do usuário para desktop */}
          {user && (
            <IconButton
              color="inherit"
              onClick={handleMobileMenuOpen}
              sx={{ display: { xs: 'none', md: 'block' } }}
            >
              <Avatar
                src={user?.photoURL}
                alt={user?.displayName}
                sx={{ width: 32, height: 32 }}
              >
                {user?.displayName?.charAt(0)}
              </Avatar>
            </IconButton>
          )}
        </Box>

        {/* Menu unificado (mobile e desktop) */}
        <Menu
          anchorEl={mobileMenuAnchor}
          open={Boolean(mobileMenuAnchor)}
          onClose={handleMobileMenuClose}
        >
          {/* Informações do usuário se logado */}
          {user && (
            <>
              <MenuItem disabled>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar
                    src={user?.photoURL}
                    alt={user?.displayName}
                    sx={{ width: 24, height: 24 }}
                  >
                    {user?.displayName?.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      {user?.displayName || 'Usuário'}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {user?.email}
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
              <Divider />
            </>
          )}

          {/* Opções de navegação */}
          <MenuItem onClick={() => { navigate('/'); handleMobileMenuClose(); }}>
            <HomeIcon sx={{ mr: 1 }} />
            Página Inicial
          </MenuItem>
          
          {/* Opções administrativas */}
          {navButtons.map((button) => (
            <MenuItem 
              key={button.path}
              onClick={() => { navigate(button.path); handleMobileMenuClose(); }}
              sx={{
                backgroundColor: isActive(button.path) ? 'rgba(25, 118, 210, 0.1)' : 'transparent',
              }}
            >
              {button.icon}
              <Box sx={{ ml: 1 }}>{button.label}</Box>
            </MenuItem>
          ))}
          
          <MenuItem onClick={() => { handleStoreAccess(); handleMobileMenuClose(); }}>
            <StoreIcon sx={{ mr: 1 }} />
            Ver Loja
          </MenuItem>

          {/* Logout */}
          {user && (
            <>
              <Divider />
              <MenuItem onClick={() => { handleLogout(); handleMobileMenuClose(); }}>
                <LogoutIcon sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </>
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default AdminHeader;
