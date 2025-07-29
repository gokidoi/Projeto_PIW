// StorePage.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Snackbar,
  Alert,
  InputAdornment
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { useStore } from '../../contexts';
import { getUserInfo } from '../../services/userService';
import LogoHeader from '../../assets/logo_PRETA.png';

const StorePage = () => {
  const {
    products,
    loading,
    addToCart,
    getCategories,
    searchProducts,
    filterProductsByCategory
  } = useStore();

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [addedProduct, setAddedProduct] = useState('');

  // Atualizar produtos filtrados quando mudarem os filtros
  useEffect(() => {
    let filtered = products;
    
    // Aplicar filtro de categoria
    if (selectedCategory && selectedCategory !== 'Todas') {
      filtered = filterProductsByCategory(selectedCategory);
    }
    
    // Aplicar busca por texto
    if (searchTerm) {
      filtered = searchProducts(searchTerm);
    }
    
    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, searchProducts, filterProductsByCategory]);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    setAddedProduct(product.nome);
    setSnackbarOpen(true);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const getStockStatus = (quantidade, estoqueMinimo) => {
    if (quantidade === 0) return { label: 'Sem estoque', color: 'error' };
    if (quantidade <= estoqueMinimo) return { label: 'Pouco estoque', color: 'warning' };
    return { label: 'Disponível', color: 'success' };
  };

  const isExpiringSoon = (dataVencimento) => {
    if (!dataVencimento) return false;
    const today = new Date();
    const expDate = new Date(dataVencimento);
    const diffTime = expDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  const ProductCard = ({ product }) => {
    const stockStatus = getStockStatus(product.quantidade, product.estoqueMinimo || 0);
    const expiring = isExpiringSoon(product.dataVencimento);
    const [supplierInfo, setSupplierInfo] = useState(null);

    // Buscar informações do fornecedor
    useEffect(() => {
      const fetchSupplierInfo = async () => {
        if (product.userId) {
          const info = await getUserInfo(product.userId);
          setSupplierInfo(info);
        }
      };
      fetchSupplierInfo();
    }, [product.userId]);

    return (
      <Card 
        sx={{ 
          height: 480, // Altura fixa para uniformidade
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.2s, box-shadow 0.2s',
          maxWidth: 350, // Largura máxima
          mx: 'auto', // Centralizar o card
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 4
          }
        }}
      >
        <CardMedia
          component="div"
          sx={{
            height: 180, // Altura fixa da imagem
            background: product.imagemUrl 
              ? 'transparent' 
              : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {product.imagemUrl ? (
            <Box
              component="img"
              src={product.imagemUrl}
              alt={product.nome}
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
          ) : null}
          
          {/* Fallback quando não há imagem ou erro ao carregar */}
          <Box
            sx={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              display: product.imagemUrl ? 'none' : 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Typography variant="h4" color="white" sx={{ textAlign: 'center', p: 2 }}>
              {product.nome.charAt(0).toUpperCase()}
            </Typography>
          </Box>
          
          {/* Badge de categoria */}
          <Chip
            label={product.categoria}
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              backgroundColor: 'rgba(255,255,255,0.9)'
            }}
          />
          
          {/* Badge de vencimento */}
          {expiring && (
            <Chip
              label="Vence em breve"
              size="small"
              color="warning"
              sx={{
                position: 'absolute',
                top: 8,
                right: 8
              }}
            />
          )}
        </CardMedia>

        <CardContent sx={{ 
          flexGrow: 1, 
          display: 'flex',
          flexDirection: 'column',
          p: 2,
          pb: 1,
          minHeight: 240 // Altura mínima para o conteúdo
        }}>
          <Typography 
            gutterBottom 
            variant="h6" 
            component="h2" 
            sx={{ 
              fontSize: '1rem',
              fontWeight: 600,
              lineHeight: 1.2,
              height: '2.4em', // Altura fixa para 2 linhas
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              mb: 1
            }}
          >
            {product.nome}
          </Typography>
          
          <Typography 
            variant="body2" 
            color="text.secondary" 
            gutterBottom
            sx={{ mb: 1, fontSize: '0.875rem' }}
          >
            {product.marca}
          </Typography>

          {/* Informações do Fornecedor */}
          {supplierInfo && (
            <Box sx={{ mb: 1, p: 1, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.75rem' }}>
                📍 {supplierInfo.displayName || 'Fornecedor'}
              </Typography>
              {product.fornecedor && (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.75rem' }}>
                  🏢 {product.fornecedor}
                </Typography>
              )}
            </Box>
          )}
          
          <Box
            sx={{
              height: '3em', // Altura fixa para a área de descrição
              mb: 2,
              flexGrow: 1,
              overflow: 'hidden',
              '&:hover': {
                overflow: 'visible'
              }
            }}
          >
            <Typography 
              variant="body2" 
              paragraph 
              sx={{ 
                fontSize: '0.875rem',
                lineHeight: 1.5,
                maxHeight: '3em',
                overflow: 'auto',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  maxHeight: '6em', // Expande para mostrar mais texto no hover
                  backgroundColor: 'rgba(0, 0, 0, 0.02)',
                  borderRadius: 1,
                  p: 1,
                  zIndex: 10,
                  position: 'relative',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#1976d2 #f1f1f1',
                  '&::-webkit-scrollbar': {
                    width: '4px'
                  },
                  '&::-webkit-scrollbar-track': {
                    background: '#f1f1f1',
                    borderRadius: '2px'
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: '#1976d2',
                    borderRadius: '2px'
                  },
                  '&::-webkit-scrollbar-thumb:hover': {
                    background: '#1565c0'
                  }
                }
              }}
              title={product.descricao || 'Produto de qualidade para sua suplementação.'}
            >
              {product.descricao || 'Produto de qualidade para sua suplementação.'}
            </Typography>
          </Box>
          
          <Box sx={{ mt: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="h6" color="primary.main" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                {formatPrice(product.precoVenda)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                por {product.unidade}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Chip
                label={stockStatus.label}
                color={stockStatus.color}
                size="small"
                sx={{ fontSize: '0.75rem' }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                {product.quantidade} {product.unidade}
              </Typography>
            </Box>
          </Box>
        </CardContent>

        <CardActions sx={{ p: 2, pt: 0, height: 60, alignItems: 'center' }}>
          <Button
            variant="contained"
            fullWidth
            startIcon={<CartIcon />}
            onClick={() => handleAddToCart(product)}
            disabled={product.quantidade === 0}
            sx={{ 
              height: 40,
              fontSize: '0.875rem',
              fontWeight: 600
            }}
          >
            {product.quantidade === 0 ? 'Sem Estoque' : 'Adicionar ao Carrinho'}
          </Button>
        </CardActions>
      </Card>
    );
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" align="center">
          Carregando produtos...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4, px: { xs: 2, sm: 3 } }}>
      {/* Cabeçalho da loja */}
      <Box sx={{ mb: 4 }}>
         <Box
          component="img"
          src={LogoHeader}
          alt="Loja de Suplementos"
          sx={{
            height: '80px',
            display: 'block',
            margin: '0 auto',
            mb: 2
          }}
        />
        <Typography variant="h6" color="text.secondary" align="center">
          Os melhores suplementos para seus objetivos
        </Typography>
      </Box>

      {/* Filtros */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Categoria</InputLabel>
              <Select
                value={selectedCategory}
                label="Categoria"
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <MenuItem value="Todas">Todas as categorias</MenuItem>
                {getCategories().map(category => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography variant="body2" color="text.secondary" align="center">
              {filteredProducts.length} produtos encontrados
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Grid de produtos */}
      {filteredProducts.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" gutterBottom>
            Nenhum produto encontrado
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Tente ajustar os filtros ou a busca
          </Typography>
        </Box>
      ) : (
        <Grid 
          container 
          spacing={3} 
          sx={{ 
            justifyContent: { xs: 'center', sm: 'flex-start' },
            '& .MuiGrid-item': {
              display: 'flex',
              justifyContent: 'center'
            }
          }}
        >
          {filteredProducts.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4} xl={3}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Snackbar de confirmação */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          {addedProduct} adicionado ao carrinho!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default StorePage;
