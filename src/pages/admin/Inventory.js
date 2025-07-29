// Inventory.js
import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Grid,
  Paper,
  Alert,
  Chip,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
  PointOfSale as SaleIcon
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { useInventory } from '../../contexts';
import SupplementForm from '../../components/admin/SupplementForm';
import SaleDialog from '../../components/admin/SaleDialog';

const Inventory = () => {
  const { 
    supplements, 
    loading, 
    error, 
    deleteSupplement,
    getLowStockSupplements,
    getExpiringSoon
  } = useInventory();
  
  const [formOpen, setFormOpen] = useState(false);
  const [editingSupplement, setEditingSupplement] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // Estados para registro de vendas
  const [saleDialogOpen, setSaleDialogOpen] = useState(false);
  const [selectedSupplementForSale, setSelectedSupplementForSale] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const lowStockItems = getLowStockSupplements();
  const expiringSoonItems = getExpiringSoon();

  // Filtrar suplementos baseado na busca e categoria
  const filteredSupplements = supplements.filter(supplement => {
    const matchesSearch = supplement.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplement.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplement.categoria.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === '' || supplement.categoria === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // Obter categorias únicas
  const categories = [...new Set(supplements.map(s => s.categoria))];

  const handleEdit = (supplement) => {
    setEditingSupplement(supplement);
    setFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar este suplemento?')) {
      try {
        setDeleteLoading(true);
        await deleteSupplement(id);
      } catch (error) {
        console.error('Erro ao deletar:', error);
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  const handleAddNew = () => {
    setEditingSupplement(null);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingSupplement(null);
  };

  const handleSale = (supplement) => {
    setSelectedSupplementForSale(supplement);
    setSaleDialogOpen(true);
  };

  const handleCloseSaleDialog = () => {
    setSaleDialogOpen(false);
    setSelectedSupplementForSale(null);
    setSuccessMessage('Venda registrada com sucesso!');
  };

  const getRowClassName = (params) => {
    const supplement = params.row;
    
    // Verificar se está com estoque baixo
    if (supplement.quantidade <= (supplement.estoqueMinimo || 0)) {
      return 'low-stock-row';
    }
    
    // Verificar se está vencendo em 30 dias
    if (supplement.dataVencimento) {
      const today = new Date();
      const expDate = new Date(supplement.dataVencimento.seconds * 1000);
      const daysUntilExpiry = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
      
      if (daysUntilExpiry <= 30 && daysUntilExpiry > 0) {
        return 'expiring-soon-row';
      }
    }
    
    return '';
  };

  // Colunas responsivas baseadas no tamanho da tela
  const getResponsiveColumns = () => {
    const isMobile = window.innerWidth < 600;
    const isTablet = window.innerWidth < 900;

    if (isMobile) {
      return [
        {
          field: 'nome',
          headerName: 'Produto',
          flex: 1,
          minWidth: 180,
          renderCell: (params) => (
            <Box sx={{ py: 1 }}>
              <Typography variant="body2" fontWeight="bold" sx={{ fontSize: '0.75rem' }}>
                {params.value}
              </Typography>
              <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.65rem' }}>
                {params.row.marca}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                <Chip
                  label={params.row.categoria}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ fontSize: '0.6rem', height: 20 }}
                />
                {params.row.quantidade <= (params.row.estoqueMinimo || 0) && (
                  <WarningIcon color="warning" sx={{ ml: 0.5, fontSize: 14 }} />
                )}
              </Box>
            </Box>
          ),
        },
        {
          field: 'quantidade',
          headerName: 'Qtd',
          width: 80,
          renderCell: (params) => (
            <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
              {params.value}
            </Typography>
          ),
        },
        {
          field: 'actions',
          headerName: 'Ações',
          width: 120,
          sortable: false,
          renderCell: (params) => (
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <IconButton
                size="small"
                onClick={() => handleSale(params.row)}
                color="success"
                sx={{ p: 0.5 }}
              >
                <SaleIcon sx={{ fontSize: 16 }} />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => handleEdit(params.row)}
                color="primary"
                sx={{ p: 0.5 }}
              >
                <EditIcon sx={{ fontSize: 16 }} />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => handleDelete(params.row.id)}
                color="error"
                sx={{ p: 0.5 }}
              >
                <DeleteIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>
          ),
        },
      ];
    }

    return [
      {
        field: 'nome',
        headerName: 'Nome',
        flex: 1,
        minWidth: isTablet ? 160 : 200,
        renderCell: (params) => (
          <Box>
            <Typography variant="body2" fontWeight="bold" sx={{ fontSize: isTablet ? '0.8rem' : '0.875rem' }}>
              {params.value}
            </Typography>
            <Typography variant="caption" color="textSecondary" sx={{ fontSize: isTablet ? '0.7rem' : '0.75rem' }}>
              {params.row.marca}
            </Typography>
          </Box>
        ),
      },
      {
        field: 'categoria',
        headerName: 'Categoria',
        width: isTablet ? 110 : 130,
        renderCell: (params) => (
          <Chip
            label={params.value}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ fontSize: isTablet ? '0.7rem' : '0.75rem' }}
          />
        ),
      },
      {
        field: 'quantidade',
        headerName: 'Quantidade',
        width: isTablet ? 100 : 120,
        renderCell: (params) => (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ fontSize: isTablet ? '0.8rem' : '0.875rem' }}>
              {params.value} {params.row.unidade}
            </Typography>
            {params.row.quantidade <= (params.row.estoqueMinimo || 0) && (
              <Tooltip title="Estoque baixo">
                <WarningIcon color="warning" sx={{ ml: 1, fontSize: 16 }} />
              </Tooltip>
            )}
          </Box>
        ),
      },
      {
        field: 'precoCompra',
        headerName: 'Preço Compra',
        width: isTablet ? 100 : 120,
        renderCell: (params) => (
          <Typography variant="body2" sx={{ fontSize: isTablet ? '0.8rem' : '0.875rem' }}>
            R$ {params.value?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </Typography>
        ),
      },
      {
        field: 'dataVencimento',
        headerName: 'Vencimento',
        width: isTablet ? 100 : 120,
        renderCell: (params) => {
          if (!params.value) return '-';
          
          const expDate = new Date(params.value.seconds * 1000);
          const today = new Date();
          const daysUntilExpiry = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));

          return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ fontSize: isTablet ? '0.8rem' : '0.875rem' }}>
                {expDate.toLocaleDateString('pt-BR')}
              </Typography>
              {daysUntilExpiry <= 30 && daysUntilExpiry > 0 && (
                <Tooltip title={`Vence em ${daysUntilExpiry} dias`}>
                  <ScheduleIcon color="error" sx={{ ml: 1, fontSize: 16 }} />
                </Tooltip>
              )}
            </Box>
          );
        },
      },
      {
        field: 'actions',
        headerName: 'Ações',
        width: isTablet ? 120 : 140,
        sortable: false,
        renderCell: (params) => (
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="Registrar Venda">
              <IconButton
                size="small"
                onClick={() => handleSale(params.row)}
                color="success"
              >
                <SaleIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Editar">
              <IconButton
                size="small"
                onClick={() => handleEdit(params.row)}
                color="primary"
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Excluir">
              <IconButton
                size="small"
                onClick={() => handleDelete(params.row.id)}
                color="error"
                disabled={deleteLoading}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ];
  };

  const columns = getResponsiveColumns();

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' },
        mb: 4,
        gap: { xs: 2, sm: 0 }
      }}>
        <Typography 
          variant="h4" 
          gutterBottom
          sx={{
            fontWeight: 600,
            color: 'primary.main',
            fontSize: { xs: '1.75rem', sm: '2.125rem' }
          }}
        >
          Inventário de Suplementos
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddNew}
          size="large"
          sx={{
            minWidth: { xs: '100%', sm: 'auto' },
            height: 48,
            fontWeight: 600,
          }}
        >
          Adicionar Suplemento
        </Button>
      </Box>

      {/* Alertas */}
      {(lowStockItems.length > 0 || expiringSoonItems.length > 0) && (
        <Box sx={{ mb: 3 }}>
          {lowStockItems.length > 0 && (
            <Alert severity="warning" sx={{ mb: 1 }}>
              <strong>{lowStockItems.length}</strong> item(s) com estoque baixo
            </Alert>
          )}
          {expiringSoonItems.length > 0 && (
            <Alert severity="error">
              <strong>{expiringSoonItems.length}</strong> item(s) vencendo nos próximos 30 dias
            </Alert>
          )}
        </Box>
      )}

      {/* Filtros */}
      <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
        <Grid container spacing={{ xs: 2, sm: 3 }} alignItems="center">
          <Grid item xs={12} sm={6} md={5}>
            <TextField
              fullWidth
              label="Buscar suplementos"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
              }}
              placeholder="Nome, marca ou categoria..."
              size={window.innerWidth < 600 ? "small" : "medium"}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel size={window.innerWidth < 600 ? "small" : "normal"}>
                Filtrar por categoria
              </InputLabel>
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                label="Filtrar por categoria"
                size={window.innerWidth < 600 ? "small" : "medium"}
              >
                <MenuItem value="">Todas as categorias</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('');
              }}
              size={window.innerWidth < 600 ? "small" : "medium"}
              sx={{ height: { xs: 40, sm: 56 } }}
            >
              Limpar
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabela de Suplementos */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <DataGrid
          rows={filteredSupplements}
          columns={columns}
          loading={loading}
          pageSizeOptions={[5, 10, 25]}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: window.innerWidth < 600 ? 5 : 10 },
            },
          }}
          sx={{
            minHeight: { xs: 350, sm: 400 },
            '& .MuiDataGrid-main': {
              overflow: 'auto',
            },
            '& .MuiDataGrid-cell': {
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              padding: { xs: '4px 8px', sm: '8px 16px' },
            },
            '& .MuiDataGrid-columnHeader': {
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              fontWeight: 600,
            },
            '& .low-stock-row': {
              backgroundColor: '#fff3cd',
              '&:hover': {
                backgroundColor: '#ffecb3',
              },
            },
            '& .expiring-soon-row': {
              backgroundColor: '#f8d7da',
              '&:hover': {
                backgroundColor: '#f5c6cb',
              },
            },
          }}
          getRowClassName={getRowClassName}
          disableRowSelectionOnClick
          autoHeight={window.innerWidth < 600}
        />
      </Paper>

      {/* Formulário de Suplemento */}
      <SupplementForm
        open={formOpen}
        onClose={handleCloseForm}
        supplement={editingSupplement}
      />

      {/* Diálogo de Registro de Venda */}
      <SaleDialog
        open={saleDialogOpen}
        onClose={handleCloseSaleDialog}
        supplement={selectedSupplementForSale}
      />

      {/* Snackbar para feedback de sucesso */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSuccessMessage('')} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Inventory;
