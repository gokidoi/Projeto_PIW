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
import { useStore } from '../../contexts/StoreContext';
import { getUserInfo } from '../../services/userService';

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
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 3
          }
        }}
      >
        <CardMedia
          component="div"
          sx={{
            height: 200,
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}
        >
          <Typography variant="h4" color="white" sx={{ textAlign: 'center', p: 2 }}>
            {product.nome.charAt(0).toUpperCase()}
          </Typography>
          
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

        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h6" component="h2" noWrap>
            {product.nome}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {product.marca}
          </Typography>

          {/* Informações do Fornecedor */}
          {supplierInfo && (
            <Box sx={{ mb: 1, p: 1, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                📍 Fornecedor: {supplierInfo.displayName || 'Fornecedor'}
              </Typography>
              {product.fornecedor && (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  🏢 {product.fornecedor}
                </Typography>
              )}
            </Box>
          )}
          
          <Typography variant="body2" paragraph sx={{ height: 40, overflow: 'hidden' }}>
            {product.descricao || 'Produto de qualidade para sua suplementação.'}
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6" color="primary.main" sx={{ fontWeight: 'bold' }}>
              {formatPrice(product.precoVenda)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              por {product.unidade}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Chip
              label={stockStatus.label}
              color={stockStatus.color}
              size="small"
            />
            <Typography variant="body2" color="text.secondary">
              {product.quantidade} {product.unidade} disponível
            </Typography>
          </Box>
        </CardContent>

        <CardActions sx={{ p: 2, pt: 0 }}>
          <Button
            variant="contained"
            fullWidth
            startIcon={<CartIcon />}
            onClick={() => handleAddToCart(product)}
            disabled={product.quantidade === 0}
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Cabeçalho da loja */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Loja de Suplementos
        </Typography>
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
        <Grid container spacing={3}>
          {filteredProducts.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
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
