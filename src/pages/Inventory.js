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
  MenuItem
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Warning as WarningIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { useInventory } from '../contexts/InventoryContext';
import SupplementForm from '../components/SupplementForm';

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

  const columns = [
    {
      field: 'nome',
      headerName: 'Nome',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" fontWeight="bold">
            {params.value}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {params.row.marca}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'categoria',
      headerName: 'Categoria',
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color="primary"
          variant="outlined"
        />
      ),
    },
    {
      field: 'quantidade',
      headerName: 'Quantidade',
      width: 120,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2">
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
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2">
          R$ {params.value?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </Typography>
      ),
    },
    {
      field: 'dataVencimento',
      headerName: 'Vencimento',
      width: 120,
      renderCell: (params) => {
        if (!params.value) return '-';
        
        const expDate = new Date(params.value.seconds * 1000);
        const today = new Date();
        const daysUntilExpiry = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
        
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2">
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
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Editar">
            <IconButton
              size="small"
              onClick={() => handleEdit(params.row)}
              color="primary"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Deletar">
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

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Inventário de Suplementos
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddNew}
          size="large"
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
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
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
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Filtrar por categoria</InputLabel>
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                label="Filtrar por categoria"
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
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('');
              }}
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
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          sx={{
            minHeight: 400,
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
        />
      </Paper>

      {/* Formulário de Suplemento */}
      <SupplementForm
        open={formOpen}
        onClose={handleCloseForm}
        supplement={editingSupplement}
      />
    </Container>
  );
};

export default Inventory;
