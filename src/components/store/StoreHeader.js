// StoreHeader.js
import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Box,
  Button,
  Menu,
  MenuItem
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  Store as StoreIcon,
  Menu as MenuIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useStore } from '../../contexts/StoreContext';

const StoreHeader = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { setCartOpen, getCartItemsCount } = useStore();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCartOpen = () => {
    setCartOpen(true);
  };

  const handleAdminAccess = () => {
    navigate('/admin/dashboard');
    handleMenuClose();
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

  return (
    <AppBar position="static" sx={{ background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)' }}>
      <Toolbar>
        <StoreIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Loja de Suplementos
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Botões de navegação da loja */}
          <Button 
            color="inherit" 
            onClick={() => navigate('/store')}
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            Produtos
          </Button>
          
          <Button 
            color="inherit" 
            onClick={() => navigate('/store/categories')}
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            Categorias
          </Button>

          {/* Carrinho de compras */}
          <IconButton 
            color="inherit" 
            onClick={handleCartOpen}
            sx={{ mr: 1 }}
          >
            <Badge badgeContent={getCartItemsCount()} color="error">
              <CartIcon />
            </Badge>
          </IconButton>

          {/* Menu do usuário */}
          {user && (
            <>
              <IconButton
                color="inherit"
                onClick={handleMenuOpen}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem disabled>
                  <Typography variant="body2">
                    {user.displayName || user.email}
                  </Typography>
                </MenuItem>
                <MenuItem onClick={handleAdminAccess}>
                  <AdminIcon sx={{ mr: 1 }} />
                  Área Administrativa
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}

          {/* Botão de login se não estiver logado */}
          {!user && (
            <Button 
              color="inherit" 
              onClick={() => navigate('/login')}
              variant="outlined"
              sx={{ borderColor: 'white', color: 'white' }}
            >
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default StoreHeader;
