// LandingPage.js
import React from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip
} from '@mui/material';
import {
  Store as StoreIcon,
  AdminPanelSettings as AdminIcon,
  ShoppingCart as CartIcon,
  Analytics as AnalyticsIcon,
  Security as SecurityIcon,
  Devices as DevicesIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: <StoreIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Loja Online',
      description: 'Navegue pelos produtos disponíveis e faça seus pedidos de forma fácil e rápida.',
      action: 'Acessar Loja',
      path: '/store',
      color: 'primary'
    },
    {
      icon: <AdminIcon sx={{ fontSize: 40, color: 'secondary.main' }} />,
      title: 'Área Administrativa',
      description: 'Gerencie o inventário, analise vendas e controle o estoque completo.',
      action: 'Área Admin',
      path: '/admin/dashboard',
      color: 'secondary',
      protected: true
    }
  ];

  const systemFeatures = [
    {
      icon: <CartIcon />,
      title: 'Carrinho Inteligente',
      description: 'Sistema de carrinho com cálculos automáticos e finalização por email'
    },
    {
      icon: <AnalyticsIcon />,
      title: 'Relatórios Completos',
      description: 'Análises de lucratividade, controle de estoque e alertas automáticos'
    },
    {
      icon: <SecurityIcon />,
      title: 'Segurança',
      description: 'Autenticação Google e dados protegidos por usuário'
    },
    {
      icon: <DevicesIcon />,
      title: 'Responsivo',
      description: 'Funciona perfeitamente em computadores, tablets e celulares'
    }
  ];

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        backgroundColor: '#fafafa',
        width: '100%',
        margin: 0,
        padding: 0,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: { xs: 6, md: 8 },
          flex: '0 0 auto'
        }}
      >
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography 
                variant="h2" 
                component="h1" 
                gutterBottom 
                fontWeight="bold"
                sx={{
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                  textAlign: { xs: 'center', md: 'left' }
                }}
              >
                Excelência Fitness
              </Typography>
              <Typography 
                variant="h5" 
                paragraph 
                sx={{ 
                  opacity: 0.9,
                  fontSize: { xs: '1.2rem', sm: '1.3rem', md: '1.5rem' },
                  textAlign: { xs: 'center', md: 'left' }
                }}
              >
                Marketplace de Suplementos Premium
              </Typography>
              <Typography 
                variant="body1" 
                paragraph 
                sx={{ 
                  opacity: 0.8,
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  textAlign: { xs: 'center', md: 'left' },
                  maxWidth: { xs: '100%', md: '90%' }
                }}
              >
                Gerencie seu inventário e publique produtos no marketplace. 
                Uma solução completa que combina gestão administrativa avançada 
                com uma loja online moderna para seus clientes.
              </Typography>
              
              <Box 
                sx={{ 
                  mt: 4,
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: { xs: 'center', md: 'flex-start' },
                  alignItems: 'center',
                  gap: 2
                }}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/store')}
                  sx={{
                    backgroundColor: 'white',
                    color: 'primary.main',
                    minWidth: { xs: '100%', sm: 'auto' },
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                    '&:hover': { 
                      backgroundColor: '#f5f5f5',
                      transform: 'translateY(-2px)'
                    }
                  }}
                  startIcon={<StoreIcon />}
                >
                  Explorar Loja
                </Button>
                
                {user && (
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/admin/dashboard')}
                    sx={{
                      borderColor: 'white',
                      color: 'white',
                      minWidth: { xs: '100%', sm: 'auto' },
                      px: 4,
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        borderColor: 'white',
                        transform: 'translateY(-2px)'
                      }
                    }}
                    startIcon={<AdminIcon />}
                  >
                    Área Admin
                  </Button>
                )}
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  textAlign: 'center',
                  p: { xs: 3, sm: 4 },
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: 2,
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: '200px'
                }}
              >
                <Typography variant="h4" gutterBottom>
                  🏆 Excelência Fitness
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
                  Marketplace de Suplementos Premium
                </Typography>
                <Chip
                  label="✅ Sistema Profissional"
                  sx={{ backgroundColor: 'rgba(76, 175, 80, 0.8)', color: 'white' }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Seções do Sistema */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 }, px: { xs: 2, sm: 3 } }}>
        <Typography 
          variant="h3" 
          align="center" 
          gutterBottom
          sx={{
            fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
            fontWeight: 600,
            color: 'primary.main'
          }}
        >
          Escolha sua Área
        </Typography>
        <Typography 
          variant="h6" 
          align="center" 
          color="text.secondary" 
          paragraph
          sx={{
            fontSize: { xs: '1rem', sm: '1.1rem' },
            maxWidth: '600px',
            mx: 'auto',
            mb: 4
          }}
        >
          Acesse a loja para comprar ou a área administrativa para gerenciar
        </Typography>

        <Grid container spacing={4} justifyContent="center" alignItems="stretch">
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={5} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  maxWidth: '400px',
                  mx: 'auto',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: { xs: 3, sm: 4 } }}>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h4" component="h2" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    {feature.description}
                  </Typography>
                  {feature.protected && (
                    <Chip
                      label="🔒 Requer Login"
                      size="small"
                      color="warning"
                      sx={{ mb: 2 }}
                    />
                  )}
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                  <Button
                    variant="contained"
                    color={feature.color}
                    size="large"
                    onClick={() => {
                      if (feature.protected && !user) {
                        navigate('/login');
                      } else {
                        navigate(feature.path);
                      }
                    }}
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 600,
                      minWidth: '160px'
                    }}
                  >
                    {feature.action}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Funcionalidades do Sistema */}
      <Box sx={{ backgroundColor: 'white', py: { xs: 6, md: 8 } }}>
        <Container 
          maxWidth="lg" 
          sx={{ 
            px: { xs: 2, sm: 3 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          <Typography 
            variant="h4" 
            align="center" 
            gutterBottom
            sx={{
              fontSize: { xs: '1.6rem', sm: '2rem', md: '2.2rem' },
              fontWeight: 600,
              color: 'primary.main',
              mb: 2
            }}
          >
            Funcionalidades do Sistema
          </Typography>
          <Typography 
            variant="body1" 
            align="center" 
            color="text.secondary" 
            paragraph
            sx={{ 
              mb: 5, 
              maxWidth: '600px', 
              mx: 'auto',
              fontSize: { xs: '0.95rem', sm: '1rem' },
              lineHeight: 1.6
            }}
          >
            Tudo que você precisa para gerenciar seu negócio de suplementos
          </Typography>

          <Grid container spacing={4} justifyContent="center" alignItems="stretch">
            {systemFeatures.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box 
                  sx={{ 
                    textAlign: 'center',
                    p: { xs: 2, sm: 3 },
                    borderRadius: 2,
                    backgroundColor: '#f8f9fa',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '200px',
                    transition: 'transform 0.3s',
                    mx: 'auto',
                    maxWidth: '280px',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      backgroundColor: '#e9ecef'
                    }
                  }}
                >
                  <Box sx={{ mb: 2, color: 'primary.main', display: 'flex', justifyContent: 'center' }}>
                    {React.cloneElement(feature.icon, { sx: { fontSize: 40 } })}
                  </Box>
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    fontWeight={600}
                    sx={{ textAlign: 'center', mb: 1 }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      textAlign: 'center',
                      lineHeight: 1.6,
                      maxWidth: '100%'
                    }}
                  >
                    {feature.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
