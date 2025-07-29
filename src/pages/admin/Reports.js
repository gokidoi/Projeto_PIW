// Reports.js - Versão Responsiva
import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Card,
  CardContent,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  Alert
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  Download as DownloadIcon,
  Print as PrintIcon
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { useInventory } from '../../contexts';

const ReportCard = ({ title, value, subtitle, color = 'primary' }) => (
  <Card sx={{ 
    height: { xs: 120, sm: 140 },
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  }}>
    <CardContent sx={{ 
      textAlign: 'center',
      p: { xs: 1.5, sm: 2 },
      '&:last-child': { pb: { xs: 1.5, sm: 2 } }
    }}>
      <Typography 
        variant="h4" 
        color={`${color}.main`}
        sx={{ 
          fontWeight: 'bold',
          fontSize: { xs: '1.5rem', sm: '2rem' },
          mb: 1
        }}
      >
        {value}
      </Typography>
      <Typography 
        variant="h6" 
        gutterBottom
        sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
      >
        {title}
      </Typography>
      <Typography 
        variant="body2" 
        color="textSecondary"
        sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
      >
        {subtitle}
      </Typography>
    </CardContent>
  </Card>
);

const Reports = () => {
  const { 
    supplements, 
    loading, 
    error, 
    getLowStockSupplements, 
    getExpiringSoon, 
    getSupplementsByCategory 
  } = useInventory();

  const [reportType, setReportType] = useState('geral');
  const [dateFilter, setDateFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const lowStockItems = getLowStockSupplements();
  const expiringSoonItems = getExpiringSoon();
  const categories = getSupplementsByCategory();

  // Filtrar suplementos baseado nos filtros
  const getFilteredSupplements = () => {
    let filtered = supplements;

    if (categoryFilter) {
      filtered = filtered.filter(s => s.categoria === categoryFilter);
    }

    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      filtered = filtered.filter(s => {
        if (!s.dataCompra) return false;
        const purchaseDate = new Date(s.dataCompra.seconds * 1000);
        return purchaseDate >= filterDate;
      });
    }

    return filtered;
  };

  const filteredSupplements = getFilteredSupplements();

  // Calcular métricas
  const totalValue = filteredSupplements.reduce((sum, s) => sum + (s.precoCompra * s.quantidade), 0);
  const totalItems = filteredSupplements.reduce((sum, s) => sum + s.quantidade, 0);
  const totalProfit = filteredSupplements.reduce((sum, s) => 
    sum + ((s.precoVenda || 0) - s.precoCompra) * s.quantidade, 0);

  // Função para exportar dados (simulação)
  const exportToCSV = () => {
    const csvContent = [
      [
        'Nome', 'Categoria', 'Marca', 'Quantidade', 'Unidade', 
        'Preço Compra', 'Preço Venda', 'Lucro Unitário', 'Valor Total Compra', 
        'Valor Total Venda', 'Lucro Total', 'Data Compra', 'Data Vencimento'
      ],
      ...filteredSupplements.map(s => [
        s.nome,
        s.categoria,
        s.marca,
        s.quantidade,
        s.unidade,
        s.precoCompra,
        s.precoVenda || 0,
        (s.precoVenda || 0) - s.precoCompra,
        s.precoCompra * s.quantidade,
        (s.precoVenda || 0) * s.quantidade,
        ((s.precoVenda || 0) - s.precoCompra) * s.quantidade,
        s.dataCompra ? new Date(s.dataCompra.seconds * 1000).toLocaleDateString('pt-BR') : '',
        s.dataVencimento ? new Date(s.dataVencimento.seconds * 1000).toLocaleDateString('pt-BR') : ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio_inventario_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const printReport = () => {
    window.print();
  };

  // Colunas responsivas para DataGrid
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
          field: 'precoCompra',
          headerName: 'Valor',
          width: 100,
          renderCell: (params) => (
            <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
              R$ {params.value?.toFixed(2)}
            </Typography>
          ),
        },
      ];
    }

    return [
      {
        field: 'nome',
        headerName: 'Nome',
        flex: 1,
        minWidth: isTablet ? 150 : 200,
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
          <Typography variant="body2" sx={{ fontSize: isTablet ? '0.8rem' : '0.875rem' }}>
            {params.value} {params.row.unidade}
          </Typography>
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
        field: 'precoVenda',
        headerName: 'Preço Venda',
        width: isTablet ? 100 : 120,
        renderCell: (params) => (
          <Typography variant="body2" sx={{ fontSize: isTablet ? '0.8rem' : '0.875rem' }}>
            R$ {(params.value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </Typography>
        ),
      },
      {
        field: 'lucroUnitario',
        headerName: 'Lucro Unit.',
        width: isTablet ? 100 : 120,
        renderCell: (params) => {
          const profit = (params.row.precoVenda || 0) - params.row.precoCompra;
          return (
            <Typography 
              variant="body2" 
              color={profit >= 0 ? 'success.main' : 'error.main'}
              sx={{ fontSize: isTablet ? '0.8rem' : '0.875rem' }}
            >
              R$ {profit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </Typography>
          );
        },
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
      {/* Cabeçalho */}
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
          sx={{
            fontWeight: 600,
            color: 'primary.main',
            fontSize: { xs: '1.75rem', sm: '2.125rem' },
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <AssessmentIcon sx={{ fontSize: { xs: '1.75rem', sm: '2.125rem' } }} />
          Relatórios do Inventário
        </Typography>
        <Box sx={{ 
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1, sm: 2 },
          width: { xs: '100%', sm: 'auto' }
        }}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={exportToCSV}
            sx={{ 
              minWidth: { xs: '100%', sm: 'auto' },
              fontSize: { xs: '0.8rem', sm: '0.875rem' }
            }}
            size={window.innerWidth < 600 ? "small" : "medium"}
          >
            Exportar CSV
          </Button>
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={printReport}
            sx={{ 
              minWidth: { xs: '100%', sm: 'auto' },
              fontSize: { xs: '0.8rem', sm: '0.875rem' }
            }}
            size={window.innerWidth < 600 ? "small" : "medium"}
          >
            Imprimir
          </Button>
        </Box>
      </Box>

      {/* Filtros */}
      <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
        <Grid container spacing={{ xs: 2, sm: 3 }} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel size={window.innerWidth < 600 ? "small" : "normal"}>
                Tipo de Relatório
              </InputLabel>
              <Select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                label="Tipo de Relatório"
                size={window.innerWidth < 600 ? "small" : "medium"}
              >
                <MenuItem value="geral">Relatório Geral</MenuItem>
                <MenuItem value="categoria">Por Categoria</MenuItem>
                <MenuItem value="estoque">Estoque Baixo</MenuItem>
                <MenuItem value="vencimento">Próximos ao Vencimento</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel size={window.innerWidth < 600 ? "small" : "normal"}>
                Filtrar por Categoria
              </InputLabel>
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                label="Filtrar por Categoria"
                size={window.innerWidth < 600 ? "small" : "medium"}
              >
                <MenuItem value="">Todas as categorias</MenuItem>
                {Object.keys(categories).map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              type="date"
              label="Data Inicial"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              InputLabelProps={{ shrink: true }}
              size={window.innerWidth < 600 ? "small" : "medium"}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Cards de Métricas */}
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <ReportCard
            title="Total de Itens"
            value={filteredSupplements.length}
            subtitle="Suplementos no inventário"
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <ReportCard
            title="Quantidade Total"
            value={totalItems}
            subtitle="Unidades em estoque"
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <ReportCard
            title="Valor Investido"
            value={`R$ ${totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            subtitle="Capital em estoque"
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <ReportCard
            title="Lucro Potencial"
            value={`R$ ${totalProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            subtitle="Margem de lucro total"
            color={totalProfit >= 0 ? "success" : "error"}
          />
        </Grid>
      </Grid>

      {/* Alertas condicionais */}
      {lowStockItems.length > 0 && (
        <Alert severity="warning" sx={{ mb: 2, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
          <strong>{lowStockItems.length}</strong> item(s) com estoque baixo necessitam reposição
        </Alert>
      )}

      {expiringSoonItems.length > 0 && (
        <Alert severity="error" sx={{ mb: 2, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
          <strong>{expiringSoonItems.length}</strong> item(s) vencendo nos próximos 30 dias
        </Alert>
      )}

      {/* Tabela de Dados */}
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
          }}
          disableRowSelectionOnClick
          autoHeight={window.innerWidth < 600}
        />
      </Paper>
    </Container>
  );
};

export default Reports;
