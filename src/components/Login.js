// Login.js
import React, { useState } from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const { signInWithGoogle, loading, error } = useAuth();
  const [loginError, setLoginError] = useState('');

  const handleGoogleSignIn = async () => {
    try {
      setLoginError('');
      console.log('Login button clicked');
      await signInWithGoogle();
    } catch (error) {
      console.error('Login error in component:', error);
      if (error.code === 'auth/configuration-not-found') {
        setLoginError(
          'Erro de configuração do Firebase. Verifique se o Google Sign-In está habilitado no Console do Firebase e se as APIs necessárias estão ativas.'
        );
      } else {
        setLoginError('Erro ao fazer login. Tente novamente.');
      }
    }
  };

  return (
    <Container 
      component="main" 
      maxWidth="sm"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: { xs: 2, sm: 3 }
      }}
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={6}
          sx={{
            padding: { xs: 3, sm: 4 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: '400px',
            borderRadius: 2,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          }}
        >
          {/* Logo/Título */}
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h3" color="white" fontWeight="bold">
              E
            </Typography>
          </Box>

          <Typography 
            component="h1" 
            variant="h4" 
            gutterBottom
            sx={{
              fontWeight: 700,
              color: 'primary.main',
              textAlign: 'center'
            }}
          >
            Excelência Fitness
          </Typography>
          
          <Typography 
            variant="h6" 
            color="textSecondary" 
            gutterBottom
            sx={{
              textAlign: 'center',
              mb: 3
            }}
          >
            Marketplace de Suplementos
          </Typography>

          <Typography 
            variant="body2" 
            color="textSecondary" 
            align="center"
            sx={{ mb: 3, lineHeight: 1.6 }}
          >
            Gerencie seu inventário e publique produtos no marketplace. 
            Faça login com sua conta Google para começar.
          </Typography>

          {(error || loginError) && (
            <Alert 
              severity="error" 
              sx={{ 
                width: '100%', 
                mb: 2,
                borderRadius: 1,
                fontSize: '0.875rem'
              }}
            >
              {error || loginError}
            </Alert>
          )}

          <Button
            variant="contained"
            fullWidth
            startIcon={loading ? <CircularProgress size={20} /> : <GoogleIcon />}
            onClick={handleGoogleSignIn}
            disabled={loading}
            sx={{
              mt: 1,
              mb: 3,
              height: 56,
              fontSize: '1rem',
              fontWeight: 600,
              backgroundColor: '#4285f4',
              borderRadius: 2,
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#357ae8',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(66, 133, 244, 0.3)',
              },
              '&:disabled': {
                backgroundColor: '#ccc',
              },
              transition: 'all 0.2s ease-in-out'
            }}
          >
            {loading ? 'Entrando...' : 'Entrar com Google'}
          </Button>

          <Typography 
            variant="caption" 
            color="textSecondary" 
            align="center"
            sx={{ 
              fontSize: '0.75rem',
              lineHeight: 1.4,
              maxWidth: '300px'
            }}
          >
            Ao fazer login, você concorda com nossos termos de uso e política de privacidade
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
