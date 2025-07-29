// LandingPage.js
import React, { useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton
} from '@mui/material';
import {
  Store as StoreIcon,
  AdminPanelSettings as AdminIcon,
  ShoppingCart as CartIcon,
  Analytics as AnalyticsIcon,
  Security as SecurityIcon,
  Devices as DevicesIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Inventory as InventoryIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts';
import { useStore } from '../contexts';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { products } = useStore();
  const [currentItemIndex, setCurrentItemIndex] = useState(0);

  // Pegar os 4 primeiros produtos da loja
  const carouselProducts = products.slice(0, 4);

  // Funções de navegação do carrossel
  const nextItem = () => {
    setCurrentItemIndex((prev) => 
      prev === carouselProducts.length - 1 ? 0 : prev + 1
    );
  };

  const prevItem = () => {
    setCurrentItemIndex((prev) => 
      prev === 0 ? carouselProducts.length - 1 : prev - 1
    );
  };

  const currentProduct = carouselProducts[currentItemIndex];

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
          {/* Conteúdo centralizado */}
          <Box 
            sx={{ 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}
          >
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom 
              fontWeight="bold"
              sx={{
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                mb: 2
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
                mb: 2
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
                maxWidth: '700px',
                mb: 4
              }}
            >
              Gerencie seu inventário e publique produtos no marketplace. 
              Uma solução completa que combina gestão administrativa avançada 
              com uma loja online moderna para seus clientes.
            </Typography>
            
            {/* Carrossel principal centralizado */}
            {carouselProducts.length > 0 && (
              <Card
                sx={{
                  background: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 4,
                  overflow: 'hidden',
                  height: { xs: '200px', md: '220px' },
                  position: 'relative',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  width: '100%',
                  maxWidth: { xs: '100%', md: '700px' },
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 16px 50px rgba(0,0,0,0.2)'
                  }
                }}
              >
                <Box sx={{ 
                  position: 'absolute',
                  top: { xs: 8, sm: 12 },
                  left: { xs: 12, sm: 20 },
                  right: { xs: 12, sm: 'auto' },
                  zIndex: 2,
                  display: 'flex',
                  justifyContent: { xs: 'center', sm: 'flex-start' }
                }}>
                  <Chip
                    label="Produto em Destaque"
                    size={window.innerWidth < 600 ? "small" : "medium"}
                    sx={{ 
                      backgroundColor: 'primary.main',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: { xs: '0.75rem', sm: '0.85rem' },
                      px: { xs: 1.5, sm: 2 },
                      py: 0.5
                    }}
                  />
                </Box>

                {/* Botões de navegação */}
                {carouselProducts.length > 1 && (
                  <>
                    <IconButton
                      size="medium"
                      onClick={prevItem}
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: { xs: 8, sm: 12 },
                        transform: 'translateY(-50%)',
                        zIndex: 3,
                        backgroundColor: 'rgba(255,255,255,0.95)',
                        color: 'primary.main',
                        width: { xs: 36, sm: 40 },
                        height: { xs: 36, sm: 40 },
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        '&:hover': { 
                          backgroundColor: 'white',
                          transform: 'translateY(-50%) scale(1.1)',
                          boxShadow: '0 6px 20px rgba(0,0,0,0.2)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <ChevronLeftIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
                    </IconButton>
                    <IconButton
                      size="medium"
                      onClick={nextItem}
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        right: { xs: 8, sm: 12 },
                        transform: 'translateY(-50%)',
                        zIndex: 3,
                        backgroundColor: 'rgba(255,255,255,0.95)',
                        color: 'primary.main',
                        width: { xs: 36, sm: 40 },
                        height: { xs: 36, sm: 40 },
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        '&:hover': { 
                          backgroundColor: 'white',
                          transform: 'translateY(-50%) scale(1.1)',
                          boxShadow: '0 6px 20px rgba(0,0,0,0.2)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <ChevronRightIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
                    </IconButton>
                  </>
                )}

                <Box sx={{ 
                  display: 'flex',
                  height: '100%',
                  p: { xs: 2, md: 3 },
                  pt: { xs: 3, md: 4.5 }
                }}>
                  {/* Imagem do produto */}
                  <Box sx={{ 
                    width: { xs: '40%', md: '35%' },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pr: { xs: 2, md: 3 }
                  }}>
                    {currentProduct?.imagemUrl ? (
                      <Box
                        sx={{
                          width: '100%',
                          maxWidth: { xs: 100, md: 130 },
                          height: { xs: 100, md: 130 },
                          borderRadius: 3,
                          overflow: 'hidden',
                          border: '3px solid rgba(0,0,0,0.1)',
                          boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                          transition: 'transform 0.3s ease',
                          '&:hover': {
                            transform: 'scale(1.05)'
                          }
                        }}
                      >
                        <Box
                          component="img"
                          src={currentProduct.imagemUrl}
                          alt={currentProduct.nome}
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <Box
                          sx={{
                            width: '100%',
                            height: '100%',
                            backgroundColor: '#f5f5f5',
                            display: 'none',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'text.secondary'
                          }}
                        >
                          <InventoryIcon sx={{ fontSize: { xs: 40, md: 50 } }} />
                        </Box>
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          width: '100%',
                          maxWidth: { xs: 100, md: 130 },
                          height: { xs: 100, md: 130 },
                          borderRadius: 3,
                          backgroundColor: '#f5f5f5',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '3px solid rgba(0,0,0,0.1)',
                          boxShadow: '0 6px 20px rgba(0,0,0,0.15)'
                        }}
                      >
                        <InventoryIcon sx={{ fontSize: { xs: 40, md: 50 }, color: 'text.secondary' }} />
                      </Box>
                    )}
                  </Box>

                  {/* Informações do produto */}
                  <Box sx={{ 
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    minHeight: 0
                  }}>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        fontWeight: 700,
                        fontSize: { xs: '1.4rem', md: '1.6rem' },
                        mb: 1.5,
                        color: 'text.primary',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        lineHeight: 1.2
                      }}
                    >
                      {currentProduct?.nome}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: 'text.secondary',
                        mb: 2.5,
                        fontSize: { xs: '0.95rem', md: '1rem' },
                        fontWeight: 500
                      }}
                    >
                      {currentProduct?.marca} • {currentProduct?.categoria}
                    </Typography>
                    {currentProduct?.fornecedor && (
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          mb: 2,
                          fontSize: { xs: '0.85rem', md: '0.9rem' }
                        }}
                      >
                        Vendedor:{' '}
                        <Box
                          component="a"
                          href={`mailto:${currentProduct.fornecedor}`}
                          sx={{
                            color: 'primary.main',
                            textDecoration: 'none',
                            fontWeight: 600,
                            '&:hover': {
                              textDecoration: 'underline'
                            }
                          }}
                        >
                          {currentProduct.fornecedor}
                        </Box>
                      </Typography>
                    )}
                    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                      <Chip
                        label={`R$ ${currentProduct?.precoVenda?.toFixed(2)}`}
                        size="medium"
                        sx={{ 
                          backgroundColor: '#e8f5e8',
                          color: '#2e7d32',
                          fontWeight: 700,
                          fontSize: { xs: '0.85rem', md: '0.9rem' },
                          px: 2,
                          py: 1
                        }}
                      />
                      <Chip
                        label={`${currentProduct?.quantidade} ${currentProduct?.unidade}`}
                        size="medium"
                        sx={{ 
                          backgroundColor: '#e3f2fd',
                          color: '#1565c0',
                          fontWeight: 700,
                          fontSize: { xs: '0.85rem', md: '0.9rem' },
                          px: 2,
                          py: 1
                        }}
                      />
                    </Box>
                  </Box>
                </Box>

                {/* Indicadores de paginação */}
                {carouselProducts.length > 1 && (
                  <Box sx={{ 
                    position: 'absolute',
                    bottom: { xs: 8, sm: 12 },
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: { xs: 0.5, sm: 1 },
                    zIndex: 2
                  }}>
                    {carouselProducts.map((_, index) => (
                      <Box
                        key={index}
                        sx={{
                          width: { xs: 10, sm: 12 },
                          height: { xs: 10, sm: 12 },
                          borderRadius: '50%',
                          backgroundColor: index === currentItemIndex 
                            ? 'primary.main' 
                            : 'rgba(0,0,0,0.25)',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          boxShadow: index === currentItemIndex 
                            ? '0 0 0 2px rgba(25, 118, 210, 0.2)' 
                            : 'none',
                          '&:hover': {
                            backgroundColor: index === currentItemIndex 
                              ? 'primary.main' 
                              : 'rgba(0,0,0,0.4)',
                            transform: 'scale(1.3)'
                          }
                        }}
                        onClick={() => setCurrentItemIndex(index)}
                      />
                    ))}
                  </Box>
                )}
              </Card>
            )}
          </Box>
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
