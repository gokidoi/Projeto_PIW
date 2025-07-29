# 📁 Estrutura Detalhada de Arquivos - Sistema de Inventário de Suplementos

## 🎯 Visão Geral

Este documento detalha a função e conteúdo de cada arquivo importante no projeto **Excelência Fitness**, explicando como cada componente contribui para a construção do sistema completo.

---

## 📂 Estrutura Raiz do Projeto

### **package.json**
```json
{
  "name": "inventario",
  "version": "0.1.0",
  "dependencies": {
    "react": "^19.1.0",
    "firebase": "^12.0.0",
    "@mui/material": "^7.2.0"
  }
}
```
**Função:** Define todas as dependências do projeto, scripts de build e metadados da aplicação.

### **public/index.html**
**Função:** Template HTML principal que serve como entrada da aplicação React. Contém o `<div id="root">` onde toda a aplicação é renderizada.

---

## 🚀 Arquivos de Entrada (src/)

### **src/index.js**
```javascript
// Ponto de entrada da aplicação
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
```
**Função:** Arquivo de inicialização que renderiza o componente App no DOM.

### **src/App.js**
```javascript
// Roteamento principal e estrutura da aplicação
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { InventoryProvider } from './contexts/InventoryContext';
import { StoreProvider } from './contexts/StoreContext';

function App() {
  return (
    <AuthProvider>
      <InventoryProvider>
        <StoreProvider>
          <Router>
            <Routes>
              {/* Definição de todas as rotas */}
            </Routes>
          </Router>
        </StoreProvider>
      </InventoryProvider>
    </AuthProvider>
  );
}
```
**Função:** Componente raiz que define:
- Estrutura de roteamento da aplicação
- Providers de contexto global
- Layout base da aplicação

### **src/App.css**
**Função:** Estilos globais da aplicação, incluindo reset CSS e estilos base.

---

## 🔐 Sistema de Autenticação

### **src/contexts/AuthContext.js**
```javascript
// Gerenciamento global de autenticação
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Integração com Firebase Auth
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    return await signInWithPopup(auth, provider);
  };

  // Monitoramento de estado de autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Sincronização com Firestore
        await setDoc(doc(db, 'users', user.uid), {
          displayName: user.displayName,
          email: user.email
        }, { merge: true });
      }
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);
};
```
**Função:** 
- Gerencia estado global de autenticação
- Integração com Google OAuth
- Sincronização automática com Firestore
- Persistência de sessão

### **src/components/Login.js**
```javascript
// Interface de login com Google
const Login = () => {
  const { signInWithGoogle } = useAuth();
  
  return (
    <Container maxWidth="sm">
      <Paper elevation={3}>
        <Typography variant="h4">Excelência Fitness</Typography>
        <Button 
          variant="contained"
          onClick={signInWithGoogle}
          startIcon={<GoogleIcon />}
        >
          Entrar com Google
        </Button>
      </Paper>
    </Container>
  );
};
```
**Função:**
- Interface de login elegante
- Botão de autenticação Google
- Design responsivo com Material-UI

### **src/components/ProtectedRoute.js**
```javascript
// Proteção de rotas que requerem autenticação
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <CircularProgress />;
  if (!user) return <Navigate to="/login" replace />;
  
  return children;
};
```
**Função:**
- Protege rotas administrativas
- Redirecionamento automático para login
- Loading state durante verificação

---

## 🏪 Sistema de Inventário Administrativo

### **src/contexts/InventoryContext.js**
```javascript
// Gerenciamento completo do inventário
export const InventoryProvider = ({ children }) => {
  const [supplements, setSupplements] = useState([]);
  const [sales, setSales] = useState([]);
  const { user } = useAuth();

  // CRUD de Suplementos
  const addSupplement = async (supplementData) => {
    const docRef = await addDoc(collection(db, 'supplements'), {
      ...supplementData,
      userId: user.uid,
      fornecedor: user.email, // Auto-população
      createdAt: new Date()
    });
  };

  // Sistema de Vendas
  const registerSale = async (saleData) => {
    await addDoc(collection(db, 'sales'), {
      ...saleData,
      userId: user.uid,
      timestamp: new Date()
    });
    
    // Atualização automática de estoque
    await updateSupplement(saleData.supplementId, {
      quantidade: currentQuantity - saleData.quantidade
    });
  };

  // Analytics em tempo real
  const getStatistics = () => {
    return {
      totalProducts: supplements.length,
      totalValue: supplements.reduce((sum, s) => sum + s.precoVenda, 0),
      lowStock: supplements.filter(s => s.quantidade <= s.estoqueMinimo),
      salesRevenue: sales.reduce((sum, s) => sum + s.valorTotal, 0)
    };
  };
};
```
**Função:**
- CRUD completo de produtos
- Sistema integrado de vendas
- Cálculos automáticos de métricas
- Sincronização tempo real com Firestore

### **src/pages/Dashboard.js**
```javascript
// Dashboard administrativo com métricas
const Dashboard = () => {
  const { supplements, sales, getStatistics } = useInventory();
  const [stats, setStats] = useState({});

  useEffect(() => {
    setStats(getStatistics());
  }, [supplements, sales]);

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        {/* Cards de Métricas */}
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard 
            title="Total de Produtos"
            value={stats.totalProducts}
            icon={<InventoryIcon />}
            color="primary"
          />
        </Grid>
        
        {/* Gráficos e Alertas */}
        <Grid item xs={12} md={8}>
          <LowStockAlerts items={stats.lowStock} />
        </Grid>
      </Grid>
    </Container>
  );
};
```
**Função:**
- Exibição de métricas em tempo real
- Alertas de estoque baixo
- Interface responsiva
- Cards informativos com Material-UI

### **src/pages/Inventory.js**
```javascript
// Gestão completa do inventário
const Inventory = () => {
  const { supplements, deleteSupplement } = useInventory();
  const [selectedSupplement, setSelectedSupplement] = useState(null);

  // Colunas responsivas para DataGrid
  const getResponsiveColumns = () => {
    if (isMobile) return mobileColumns;
    if (isTablet) return tabletColumns;
    return desktopColumns;
  };

  const mobileColumns = [
    { field: 'nome', headerName: 'Produto', flex: 1 },
    { field: 'quantidade', headerName: 'Qtd', width: 80 },
    { 
      field: 'actions', 
      headerName: 'Ações', 
      width: 120,
      renderCell: (params) => (
        <ActionButtons 
          onEdit={() => setSelectedSupplement(params.row)}
          onDelete={() => handleDelete(params.row.id)}
        />
      )
    }
  ];

  return (
    <Container maxWidth="xl">
      <DataGrid
        rows={supplements}
        columns={getResponsiveColumns()}
        pageSize={25}
        checkboxSelection
        disableSelectionOnClick
      />
      
      {/* Modal de Edição */}
      <SupplementForm 
        supplement={selectedSupplement}
        onClose={() => setSelectedSupplement(null)}
      />
    </Container>
  );
};
```
**Função:**
- DataGrid avançado com dados dos produtos
- CRUD visual completo
- Responsividade por breakpoints
- Modais de edição integrados

### **src/components/SupplementForm.js**
```javascript
// Formulário de criação/edição de produtos
const SupplementForm = ({ supplement, onClose }) => {
  const { addSupplement, updateSupplement } = useInventory();
  const { user } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: supplement || {
      fornecedor: user?.email || '' // Auto-população
    }
  });

  const onSubmit = async (data) => {
    try {
      if (supplement) {
        await updateSupplement(supplement.id, data);
      } else {
        await addSupplement(data);
      }
      onClose();
    } catch (error) {
      console.error('Erro ao salvar:', error);
    }
  };

  return (
    <Dialog open={!!supplement || isOpen} onClose={onClose}>
      <DialogTitle>
        {supplement ? 'Editar Produto' : 'Novo Produto'}
      </DialogTitle>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <TextField
            {...register('nome', { required: 'Nome é obrigatório' })}
            label="Nome do Produto"
            error={!!errors.nome}
            helperText={errors.nome?.message}
            fullWidth
            margin="normal"
          />
          
          {/* Outros campos do formulário */}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained">
            {supplement ? 'Atualizar' : 'Criar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
```
**Função:**
- Formulário validado com React Hook Form
- Modo criação e edição
- Auto-população de campos
- Validação em tempo real

### **src/components/SaleDialog.js**
```javascript
// Modal para registro de vendas
const SaleDialog = ({ open, onClose, supplement }) => {
  const { registerSale } = useInventory();
  const [saleData, setSaleData] = useState({
    quantidade: 1,
    valorUnitario: supplement?.precoVenda || 0
  });

  const handleSubmit = async () => {
    const valorTotal = saleData.quantidade * saleData.valorUnitario;
    const lucro = valorTotal - (saleData.quantidade * supplement.precoCompra);
    
    await registerSale({
      supplementId: supplement.id,
      supplementName: supplement.nome,
      ...saleData,
      valorTotal,
      lucro,
      margemLucro: (lucro / valorTotal) * 100
    });
    
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Registrar Venda - {supplement?.nome}</DialogTitle>
      
      <DialogContent>
        <TextField
          label="Quantidade Vendida"
          type="number"
          value={saleData.quantidade}
          onChange={(e) => setSaleData({
            ...saleData,
            quantidade: parseInt(e.target.value)
          })}
          fullWidth
          margin="normal"
        />
        
        <Typography variant="h6">
          Total: R$ {(saleData.quantidade * saleData.valorUnitario).toFixed(2)}
        </Typography>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained">
          Registrar Venda
        </Button>
      </DialogActions>
    </Dialog>
  );
};
```
**Função:**
- Interface para registro de vendas
- Cálculo automático de valores
- Atualização de estoque
- Métricas de lucratividade

### **src/pages/Reports.js**
```javascript
// Sistema avançado de relatórios
const Reports = () => {
  const { sales, supplements } = useInventory();
  const [reportType, setReportType] = useState('sales');
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    end: new Date()
  });

  const generateSalesReport = () => {
    return sales
      .filter(sale => {
        const saleDate = new Date(sale.timestamp.seconds * 1000);
        return saleDate >= dateRange.start && saleDate <= dateRange.end;
      })
      .map(sale => ({
        ...sale,
        data: new Date(sale.timestamp.seconds * 1000).toLocaleDateString(),
        lucro: sale.valorTotal - (sale.quantidade * getProductCost(sale.supplementId)),
        margemLucro: ((sale.valorTotal - sale.custoTotal) / sale.valorTotal * 100).toFixed(2)
      }));
  };

  const reportTypes = {
    sales: 'Relatório de Vendas',
    inventory: 'Relatório de Estoque',
    profitability: 'Análise de Lucratividade'
  };

  return (
    <Container maxWidth="xl">
      <Paper elevation={3}>
        <Box p={3}>
          {/* Filtros */}
          <Grid container spacing={2} mb={3}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <Select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                >
                  {Object.entries(reportTypes).map(([key, label]) => (
                    <MenuItem key={key} value={key}>{label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* DataGrid com dados do relatório */}
          <DataGrid
            rows={getReportData()}
            columns={getReportColumns()}
            pageSize={25}
            autoHeight
            checkboxSelection
          />
        </Box>
      </Paper>
    </Container>
  );
};
```
**Função:**
- Múltiplos tipos de relatórios
- Filtros por data e categoria
- Cálculos de lucratividade
- Exportação de dados
- Interface responsiva

---

## 🛒 Sistema de E-commerce (Loja)

### **src/contexts/StoreContext.js**
```javascript
// Gerenciamento da loja e carrinho
export const StoreProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  // Busca produtos publicados
  useEffect(() => {
    const fetchProducts = async () => {
      const q = query(
        collection(db, 'supplements'),
        where('publicado', '==', true),
        where('ativo', '==', true)
      );
      const querySnapshot = await getDocs(q);
      const productsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productsData);
    };
    
    fetchProducts();
  }, []);

  // Funções do carrinho
  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
    setCartOpen(true);
  };

  // Filtros e busca
  const searchProducts = (term) => {
    return products.filter(product =>
      product.nome.toLowerCase().includes(term.toLowerCase()) ||
      product.categoria.toLowerCase().includes(term.toLowerCase())
    );
  };

  const filterProductsByCategory = (category) => {
    return products.filter(product => product.categoria === category);
  };
};
```
**Função:**
- Gestão de produtos da loja
- Sistema de carrinho de compras
- Funcionalidades de busca e filtro
- Estado global do e-commerce

### **src/pages/store/StorePage.js**
```javascript
// Interface principal da loja
const StorePage = () => {
  const { products, addToCart, searchProducts, filterProductsByCategory } = useStore();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  // Sistema de filtros combinados
  useEffect(() => {
    let filtered = products;
    
    if (selectedCategory !== 'Todas') {
      filtered = filterProductsByCategory(selectedCategory);
    }
    
    if (searchTerm) {
      filtered = searchProducts(searchTerm);
    }
    
    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory]);

  return (
    <Container maxWidth="xl">
      {/* Cabeçalho da loja */}
      <StoreHeader />
      
      {/* Filtros */}
      <Box mb={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon />
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <MenuItem value="Todas">Todas as Categorias</MenuItem>
                <MenuItem value="Proteína">Proteína</MenuItem>
                <MenuItem value="Creatina">Creatina</MenuItem>
                <MenuItem value="Vitaminas">Vitaminas</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Grid de produtos */}
      <Grid container spacing={3}>
        {filteredProducts.map(product => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <ProductCard 
              product={product}
              onAddToCart={(quantity) => addToCart(product, quantity)}
            />
          </Grid>
        ))}
      </Grid>
      
      {/* Carrinho lateral */}
      <ShoppingCart />
    </Container>
  );
};
```
**Função:**
- Interface de navegação de produtos
- Sistema de busca e filtros
- Grid responsivo de produtos
- Integração com carrinho

### **src/components/store/ProductCard.js**
```javascript
// Card individual de produto
const ProductCard = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [expanded, setExpanded] = useState(false);

  return (
    <Card elevation={3}>
      <CardMedia
        component="img"
        height="200"
        image={product.imagemUrl || '/placeholder-product.jpg'}
        alt={product.nome}
      />
      
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {product.nome}
        </Typography>
        
        <Chip 
          label={product.categoria}
          color="primary"
          size="small"
        />
        
        <Typography variant="body2" color="textSecondary">
          Marca: {product.marca}
        </Typography>
        
        {/* Descrição com scroll */}
        <Box
          sx={{
            maxHeight: expanded ? 'none' : '60px',
            overflow: 'hidden',
            transition: 'max-height 0.3s ease',
            '&:hover': {
              maxHeight: '120px',
              overflowY: 'auto'
            }
          }}
        >
          <Typography variant="body2">
            {product.descricao}
          </Typography>
        </Box>
        
        <Typography variant="h5" color="primary" mt={2}>
          R$ {product.precoVenda.toFixed(2)}
        </Typography>
        
        <Box display="flex" alignItems="center" mt={2}>
          <TextField
            type="number"
            size="small"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
            inputProps={{ min: 1 }}
            sx={{ width: 80, mr: 2 }}
          />
          
          <Button
            variant="contained"
            onClick={() => onAddToCart(quantity)}
            startIcon={<AddShoppingCartIcon />}
            fullWidth
          >
            Adicionar
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};
```
**Função:**
- Exibição visual de produtos
- Seleção de quantidade
- Botão de adicionar ao carrinho
- Descrição expansível com hover

### **src/components/store/ShoppingCart.js**
```javascript
// Carrinho de compras lateral
const ShoppingCart = () => {
  const { cart, cartOpen, setCartOpen, removeFromCart, updateCartQuantity, getCartTotal } = useStore();
  const { user } = useAuth();

  // Agrupamento por fornecedor para email
  const handleSendOrder = async () => {
    const itemsBySupplier = {};
    
    for (const item of cart) {
      const supplierInfo = await getUserInfo(item.userId);
      if (!itemsBySupplier[item.userId]) {
        itemsBySupplier[item.userId] = {
          supplier: supplierInfo,
          items: []
        };
      }
      itemsBySupplier[item.userId].items.push(item);
    }

    // Email individual para cada fornecedor
    Object.values(itemsBySupplier).forEach(group => {
      const emailContent = generateOrderEmail(group.items, user, group.supplier);
      const mailtoLink = `mailto:${group.supplier.email}?subject=Pedido - Excelência Fitness&body=${encodeURIComponent(emailContent)}`;
      window.open(mailtoLink);
    });

    setCart([]);
    setCartOpen(false);
  };

  return (
    <Drawer
      anchor="right"
      open={cartOpen}
      onClose={() => setCartOpen(false)}
    >
      <Box sx={{ width: 400, p: 2 }}>
        {/* Cabeçalho */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">Carrinho</Typography>
          <IconButton onClick={() => setCartOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Itens do carrinho */}
        {cart.length === 0 ? (
          <Typography color="textSecondary">Carrinho vazio</Typography>
        ) : (
          <>
            {cart.map(item => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={(quantity) => updateCartQuantity(item.id, quantity)}
                onRemove={() => removeFromCart(item.id)}
              />
            ))}

            <Divider sx={{ my: 2 }} />

            {/* Total */}
            <Typography variant="h6">
              Total: R$ {getCartTotal().toFixed(2)}
            </Typography>

            {/* Botões de ação */}
            <Box mt={2}>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => setCartOpen(false)}
                fullWidth
                sx={{ mb: 1 }}
              >
                Continuar Comprando
              </Button>
              
              <Button
                variant="contained"
                onClick={handleSendOrder}
                startIcon={<EmailIcon />}
                fullWidth
              >
                Finalizar Pedido
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  );
};
```
**Função:**
- Drawer lateral com itens do carrinho
- Gestão de quantidades
- Cálculo de totais
- Sistema de checkout por email
- Agrupamento por fornecedor

### **src/components/store/StoreHeader.js**
```javascript
// Cabeçalho unificado da loja
const StoreHeader = () => {
  const { user, logout } = useAuth();
  const { cart, setCartOpen } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    navigate('/'); // Redireciona para home antes do logout
    await logout();
  };

  return (
    <AppBar position="static" elevation={2}>
      <Toolbar>
        {/* Logo */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/store" style={{ textDecoration: 'none', color: 'inherit' }}>
            Excelência Fitness
          </Link>
        </Typography>

        {/* Desktop Menu */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
          <IconButton
            color="inherit"
            onClick={() => setCartOpen(true)}
          >
            <Badge badgeContent={cart.length} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
          
          <Avatar 
            src={user?.photoURL} 
            alt={user?.displayName}
            sx={{ ml: 2 }}
          />
          
          <Button color="inherit" onClick={handleLogout}>
            Sair
          </Button>
        </Box>

        {/* Mobile Menu */}
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton
            color="inherit"
            onClick={() => setMobileMenuOpen(true)}
          >
            <MenuIcon />
          </IconButton>
        </Box>

        {/* Mobile Drawer */}
        <Drawer
          anchor="left"
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        >
          <MobileMenuContent
            user={user}
            cart={cart}
            onCartOpen={() => setCartOpen(true)}
            onLogout={handleLogout}
            onClose={() => setMobileMenuOpen(false)}
          />
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};
```
**Função:**
- Navegação unificada da loja
- Indicador de carrinho com badge
- Menu responsivo (desktop/mobile)
- Avatar do usuário e logout

---

## 🏢 Headers e Navegação

### **src/components/admin/AdminHeader.js**
```javascript
// Cabeçalho administrativo
const AdminHeader = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    navigate('/'); // Redireciona para home primeiro
    await logout();
  };

  const menuItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: <DashboardIcon /> },
    { label: 'Inventário', path: '/admin/inventory', icon: <InventoryIcon /> },
    { label: 'Relatórios', path: '/admin/reports', icon: <AssessmentIcon /> },
    { label: 'Loja', path: '/store', icon: <StoreIcon /> }
  ];

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Admin - Excelência Fitness
        </Typography>

        {/* Desktop Navigation */}
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          {menuItems.map((item) => (
            <Button
              key={item.path}
              color="inherit"
              component={Link}
              to={item.path}
              startIcon={item.icon}
            >
              {item.label}
            </Button>
          ))}
          
          <Button color="inherit" onClick={handleLogout}>
            Sair
          </Button>
        </Box>

        {/* Mobile Menu Button */}
        <IconButton
          sx={{ display: { xs: 'flex', md: 'none' } }}
          color="inherit"
          onClick={() => setMobileMenuOpen(true)}
        >
          <MenuIcon />
        </IconButton>

        {/* Mobile Drawer */}
        <Drawer
          anchor="left"
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        >
          <AdminMobileMenu
            menuItems={menuItems}
            user={user}
            onLogout={handleLogout}
            onClose={() => setMobileMenuOpen(false)}
          />
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};
```
**Função:**
- Navegação administrativa unificada
- Menu responsivo consolidado
- Links para todas as páginas admin
- Logout com redirecionamento correto

### **src/pages/LandingPage.js**
```javascript
// Página inicial do sistema
const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/admin/dashboard');
    }
  }, [user, navigate]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Container maxWidth="md">
        <Paper elevation={10} sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="h2" gutterBottom color="primary">
            🏋️‍♂️ Excelência Fitness
          </Typography>
          
          <Typography variant="h5" color="textSecondary" paragraph>
            Sistema Completo de Gestão de Suplementos
          </Typography>
          
          <Typography variant="body1" color="textSecondary" paragraph>
            Gerencie seu inventário, acompanhe vendas e publique produtos 
            na loja online integrada.
          </Typography>

          <Box mt={4}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/login')}
              startIcon={<LoginIcon />}
            >
              Entrar no Sistema
            </Button>
            
            <Button
              variant="outlined"
              size="large"
              sx={{ ml: 2 }}
              onClick={() => navigate('/store')}
              startIcon={<StoreIcon />}
            >
              Visitar Loja
            </Button>
          </Box>

          {/* Features */}
          <Grid container spacing={3} mt={4}>
            <Grid item xs={12} md={4}>
              <FeatureCard
                icon={<InventoryIcon />}
                title="Gestão de Inventário"
                description="CRUD completo com alertas de estoque"
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FeatureCard
                icon={<AssessmentIcon />}
                title="Relatórios Avançados"
                description="Analytics e métricas de performance"
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FeatureCard
                icon={<StoreIcon />}
                title="Loja Integrada"
                description="E-commerce com carrinho inteligente"
              />
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};
```
**Função:**
- Página de boas-vindas do sistema
- Apresentação das funcionalidades
- Navegação para login ou loja
- Design atrativo e responsivo

---

## 🔧 Serviços e Utilitários

### **src/services/firebase.js**
```javascript
// Configuração do Firebase
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
```
**Função:**
- Inicialização e configuração do Firebase
- Exportação de serviços (Auth, Firestore, Storage)
- Configuração do provider Google

### **src/services/userService.js**
```javascript
// Serviço de informações do usuário
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from './firebase';

export const getUserInfo = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      // Fallback para auth.currentUser se documento não existir
      const currentUser = auth.currentUser;
      if (currentUser && currentUser.uid === userId) {
        return {
          displayName: currentUser.displayName,
          email: currentUser.email,
          photoURL: currentUser.photoURL
        };
      }
      return null;
    }
  } catch (error) {
    console.error('Erro ao buscar informações do usuário:', error);
    return null;
  }
};
```
**Função:**
- Busca informações detalhadas do usuário
- Fallback para dados de autenticação
- Tratamento de erros robusto

### **src/hooks/useResponsive.js**
```javascript
// Hook customizado para responsividade
import { useTheme, useMediaQuery } from '@mui/material';

export const useResponsive = () => {
  const theme = useTheme();
  
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  
  return {
    isMobile,
    isTablet,
    isDesktop,
    breakpoint: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'
  };
};
```
**Função:**
- Hook reutilizável para detecção de breakpoints
- Facilita implementação responsiva
- Baseado no sistema Material-UI

---

## 📝 Arquivos de Configuração

### **.env**
```bash
# Configurações do Firebase
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```
**Função:** Armazena variáveis de ambiente sensíveis do Firebase.

### **src/index.css**
```css
/* Estilos globais */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Scrollbar customizada */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}
```
**Função:** Define estilos base globais e customizações visuais.

---

## 🎯 Estrutura de Dados

### **Modelo de Suplemento**
```javascript
{
  id: "doc_id_firestore",
  nome: "Whey Protein",
  categoria: "Proteína",
  marca: "Optimum Nutrition",
  quantidade: 50,
  unidade: "kg",
  precoCompra: 80.00,
  precoVenda: 120.00,
  dataCompra: "2025-01-15",
  dataVencimento: "2026-01-15",
  fornecedor: "fornecedor@email.com",
  descricao: "Proteína de alta qualidade...",
  estoqueMinimo: 5,
  ativo: true,
  publicado: true,
  imagemUrl: "https://storage.url/image.jpg",
  userId: "user_uid",
  createdAt: "2025-01-15T10:30:00Z"
}
```

### **Modelo de Venda**
```javascript
{
  id: "sale_id",
  supplementId: "supplement_id",
  supplementName: "Whey Protein",
  quantidade: 2,
  valorUnitario: 120.00,
  valorTotal: 240.00,
  lucro: 80.00,
  margemLucro: 33.33,
  userId: "user_uid",
  timestamp: "2025-01-15T15:45:00Z"
}
```

---

## 🔄 Fluxo de Desenvolvimento

### **1. Inicialização**
```bash
npm install    # Instala dependências
npm start      # Inicia servidor de desenvolvimento
```

### **2. Build de Produção**
```bash
npm run build  # Gera build otimizado
npm test       # Executa testes
```

### **3. Deploy**
- Build gerado na pasta `build/`
- Pronto para deploy em qualquer hosting estático
- Configuração de Firebase Hosting incluída

---

## 📊 Métricas de Qualidade

### **Performance**
- ⚡ Lazy loading de componentes
- 🔄 Memoização inteligente
- 📱 Responsividade total
- 🚀 Bundle otimizado

### **Segurança**
- 🔐 Autenticação obrigatória
- 👤 Isolamento por usuário
- 🛡️ Validação de dados
- 🔒 Proteção de rotas

### **Manutenibilidade**
- 📁 Estrutura organizada
- 🔧 Componentes reutilizáveis
- 📝 Código documentado
- 🧪 Testes implementados

---

## 🎯 Conclusão

Esta estrutura de arquivos cria um sistema completo e robusto que combina:

- ✅ **Separação clara de responsabilidades**
- ✅ **Reutilização de componentes**
- ✅ **Gerenciamento de estado eficiente**
- ✅ **Interface responsiva e moderna**
- ✅ **Integração completa com Firebase**
- ✅ **Funcionalidades de e-commerce avançadas**

Cada arquivo tem uma função específica e contribui para a construção de uma aplicação escalável, performática e fácil de manter.

---

*Documentação de estrutura gerada em 24/07/2025*
