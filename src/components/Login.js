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
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%'
          }}
        >
          <Typography component="h1" variant="h4" gutterBottom>
            Sistema de Inventário
          </Typography>
          
          <Typography variant="h6" color="textSecondary" gutterBottom>
            Suplementos de Academia
          </Typography>

          <Box mt={4} mb={2}>
            <Typography variant="body2" color="textSecondary" align="center">
              Faça login com sua conta Google para acessar o sistema
            </Typography>
          </Box>

          {(error || loginError) && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
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
              mt: 2,
              mb: 2,
              height: 48,
              backgroundColor: '#4285f4',
              '&:hover': {
                backgroundColor: '#357ae8',
              }
            }}
          >
            {loading ? 'Entrando...' : 'Entrar com Google'}
          </Button>

          <Typography variant="caption" color="textSecondary" align="center">
            Ao fazer login, você concorda com os termos de uso do sistema
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
