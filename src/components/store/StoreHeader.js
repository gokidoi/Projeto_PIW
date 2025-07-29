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
  MenuItem,
  Avatar,
  Divider
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  Store as StoreIcon,
  Menu as MenuIcon,
  AdminPanelSettings as AdminIcon,
  Home as HomeIcon,
  ExitToApp as LogoutIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts';
import { useStore } from '../../contexts';
import Logo from '../../assets/logo_BRANCA.png';

const StoreHeader = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { setCartOpen, getCartItemsCount } = useStore();
  const [mobileMenuAnchor, setMobileMenuAnchor] = React.useState(null);

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handleCartOpen = () => {
    setCartOpen(true);
  };

  const handleAdminAccess = () => {
    navigate('/admin/dashboard');
    handleMobileMenuClose();
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

  return (
    <AppBar position="static" sx={{ background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)' }}>
      <Toolbar>
        {/* Menu único para mobile */}
        <IconButton
          color="inherit"
          onClick={handleMobileMenuOpen}
          sx={{ display: { xs: 'block', sm: 'none' }, mr: 1 }}
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

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1, justifyContent: 'flex-end' }}>
          {/* Botão para voltar à home */}
          <IconButton
            color="inherit"
            onClick={() => navigate('/')}
            title="Voltar à página inicial"
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            <HomeIcon />
          </IconButton>

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

          {/* Avatar do usuário para desktop */}
          {user ? (
            <IconButton
              color="inherit"
              onClick={handleMobileMenuOpen}
              sx={{ display: { xs: 'none', sm: 'block' } }}
            >
              <Avatar
                src={user?.photoURL}
                alt={user?.displayName}
                sx={{ width: 32, height: 32 }}
              >
                {user?.displayName?.charAt(0)}
              </Avatar>
            </IconButton>
          ) : (
            <Button 
              color="inherit" 
              onClick={() => navigate('/login')}
              variant="outlined"
              sx={{ 
                borderColor: 'white', 
                color: 'white',
                display: { xs: 'none', sm: 'block' }
              }}
            >
              Login
            </Button>
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
          <MenuItem onClick={() => { navigate('/store'); handleMobileMenuClose(); }}>
            <StoreIcon sx={{ mr: 1 }} />
            Produtos
          </MenuItem>
          <MenuItem onClick={() => { setCartOpen(true); handleMobileMenuClose(); }}>
            <Badge badgeContent={getCartItemsCount()} color="error">
              <CartIcon sx={{ mr: 1 }} />
            </Badge>
            Carrinho
          </MenuItem>

          {/* Opções específicas para usuários logados */}
          {user ? (
            <>
              <Divider />
              <MenuItem onClick={() => { handleAdminAccess(); handleMobileMenuClose(); }}>
                <AdminIcon sx={{ mr: 1 }} />
                Área Administrativa
              </MenuItem>
              <MenuItem onClick={() => { handleLogout(); handleMobileMenuClose(); }}>
                <LogoutIcon sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </>
          ) : (
            <>
              <Divider />
              <MenuItem onClick={() => { navigate('/login'); handleMobileMenuClose(); }}>
                <PersonIcon sx={{ mr: 1 }} />
                Login
              </MenuItem>
            </>
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default StoreHeader;
