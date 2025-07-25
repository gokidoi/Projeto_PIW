// Header.js
import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import {
  ExitToApp as LogoutIcon,
  Person as PersonIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
    handleClose();
  };



  return (
    <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              bgcolor: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 1,
            }}
          >
            <Typography variant="h6" color="primary.main" fontWeight="bold">
              E
            </Typography>
          </Box>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 600,
              display: { xs: 'none', sm: 'block' }
            }}
          >
            Excelência Fitness
          </Typography>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: { xs: 1, sm: 2 },
          flexGrow: 1,
          justifyContent: { xs: 'center', sm: 'flex-start' }
        }}>
          <Button
            color="inherit"
            onClick={() => navigate('/dashboard')}
            sx={{ 
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
              px: { xs: 1, sm: 2 }
            }}
          >
            Dashboard
          </Button>
          
          <Button
            color="inherit"
            onClick={() => navigate('/inventory')}
            sx={{ 
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
              px: { xs: 1, sm: 2 }
            }}
          >
            Inventário
          </Button>
          
          <Button
            color="inherit"
            onClick={() => navigate('/reports')}
            sx={{ 
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
              px: { xs: 1, sm: 2 }
            }}
          >
            Relatórios
          </Button>

          <Button
            color="inherit"
            onClick={() => navigate('/store')}
            sx={{ 
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
              px: { xs: 1, sm: 2 }
            }}
          >
            Loja
          </Button>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <Avatar
              src={user?.photoURL}
              alt={user?.displayName}
              sx={{ width: 32, height: 32 }}
            >
              {user?.displayName?.charAt(0)}
            </Avatar>
          </IconButton>
          
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={open}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>
              <PersonIcon sx={{ mr: 1 }} />
              <Box>
                <Typography variant="body2" fontWeight="bold">
                  {user?.displayName}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {user?.email}
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 1 }} />
              Sair
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
