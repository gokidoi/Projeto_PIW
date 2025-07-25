// Reports.js
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
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  Download as DownloadIcon,
  Print as PrintIcon
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { useInventory } from '../contexts/InventoryContext';

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
    link.href = URL.createObjectURL(blob);
    link.download = 'relatorio_inventario_completo.csv';
    link.click();
  };

  const printReport = () => {
    window.print();
  };

  const ReportCard = ({ title, value, subtitle, icon, color = 'primary' }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="h6">
              {title}
            </Typography>
            <Typography variant="h4" color={`${color}.main`}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="textSecondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box color={`${color}.main`}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const columns = [
    {
      field: 'nome',
      headerName: 'Nome',
      flex: 1,
      minWidth: 200,
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
      field: 'marca',
      headerName: 'Marca',
      width: 130,
    },
    {
      field: 'quantidade',
      headerName: 'Quantidade',
      width: 120,
      renderCell: (params) => `${params.value} ${params.row.unidade}`,
    },
    {
      field: 'precoCompra',
      headerName: 'Preço Compra',
      width: 120,
      renderCell: (params) => 
        `R$ ${params.value?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
    },
    {
      field: 'precoVenda',
      headerName: 'Preço Venda',
      width: 120,
      renderCell: (params) => 
        `R$ ${(params.value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
    },
    {
      field: 'lucroUnitario',
      headerName: 'Lucro Unit.',
      width: 120,
      renderCell: (params) => {
        const profit = (params.row.precoVenda || 0) - params.row.precoCompra;
        return (
          <Typography 
            variant="body2" 
            color={profit >= 0 ? 'success.main' : 'error.main'}
          >
            R$ {profit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </Typography>
        );
      },
    },
    {
      field: 'valorTotal',
      headerName: 'Valor Total',
      width: 120,
      renderCell: (params) => {
        const total = params.row.precoCompra * params.row.quantidade;
        return `R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
      },
    },
    {
      field: 'lucroTotal',
      headerName: 'Lucro Total',
      width: 120,
      renderCell: (params) => {
        const totalProfit = ((params.row.precoVenda || 0) - params.row.precoCompra) * params.row.quantidade;
        return (
          <Typography 
            variant="body2" 
            color={totalProfit >= 0 ? 'success.main' : 'error.main'}
            fontWeight="bold"
          >
            R$ {totalProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </Typography>
        );
      },
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
          Relatórios do Inventário
        </Typography>
        <Box sx={{ 
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          width: { xs: '100%', sm: 'auto' }
        }}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={exportToCSV}
            sx={{ minWidth: { xs: '100%', sm: 'auto' } }}
          >
            Exportar CSV
          </Button>
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={printReport}
            sx={{ minWidth: { xs: '100%', sm: 'auto' } }}
          >
            Imprimir
          </Button>
        </Box>
      </Box>

      {/* Filtros */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Tipo de Relatório</InputLabel>
              <Select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                label="Tipo de Relatório"
              >
                <MenuItem value="geral">Relatório Geral</MenuItem>
                <MenuItem value="categoria">Por Categoria</MenuItem>
                <MenuItem value="estoque">Estoque Baixo</MenuItem>
                <MenuItem value="vencimento">Próximos ao Vencimento</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Filtrar por Categoria</InputLabel>
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                label="Filtrar por Categoria"
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
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Data de Compra (a partir de)"
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Resumo Executivo */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <ReportCard
            title="Total de Itens"
            value={filteredSupplements.length}
            subtitle="Suplementos no inventário"
            icon={<AssessmentIcon sx={{ fontSize: 40 }} />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <ReportCard
            title="Valor de Compra"
            value={`R$ ${filteredSupplements.reduce((sum, s) => sum + (s.precoCompra * s.quantidade), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            subtitle="Investimento total filtrado"
            icon={<TrendingUpIcon sx={{ fontSize: 40 }} />}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <ReportCard
            title="Valor de Venda"
            value={`R$ ${filteredSupplements.reduce((sum, s) => sum + ((s.precoVenda || 0) * s.quantidade), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            subtitle="Receita potencial filtrada"
            icon={<TrendingUpIcon sx={{ fontSize: 40 }} />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <ReportCard
            title="Lucro Potencial"
            value={`R$ ${filteredSupplements.reduce((sum, s) => sum + (((s.precoVenda || 0) - s.precoCompra) * s.quantidade), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            subtitle="Lucro dos itens filtrados"
            icon={<TrendingUpIcon sx={{ fontSize: 40 }} />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <ReportCard
            title="Alertas"
            value={lowStockItems.length + expiringSoonItems.length}
            subtitle="Itens precisando atenção"
            icon={<WarningIcon sx={{ fontSize: 40 }} />}
            color="warning"
          />
        </Grid>
      </Grid>

      {/* Conteúdo baseado no tipo de relatório */}
      {reportType === 'geral' && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Relatório Geral do Inventário
          </Typography>
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
            sx={{ minHeight: 400 }}
            disableRowSelectionOnClick
          />
        </Paper>
      )}

      {reportType === 'categoria' && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Relatório por Categoria
          </Typography>
          <Grid container spacing={2}>
            {Object.entries(categories).map(([category, items]) => (
              <Grid item xs={12} md={6} key={category}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {category}
                    </Typography>
                    <Typography variant="h4" color="primary">
                      {items.length}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Valor: R$ {items.reduce((sum, item) => sum + (item.precoCompra * item.quantidade), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {reportType === 'estoque' && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom color="warning.main">
            <WarningIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Itens com Estoque Baixo
          </Typography>
          {lowStockItems.length === 0 ? (
            <Alert severity="success">
              Nenhum item com estoque baixo! 👍
            </Alert>
          ) : (
            <List>
              {lowStockItems.map((item) => (
                <ListItem key={item.id} divider>
                  <ListItemIcon>
                    <WarningIcon color="warning" />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.nome}
                    secondary={
                      <>
                        <Typography variant="body2">
                          Categoria: {item.categoria} | Marca: {item.marca}
                        </Typography>
                        <Typography variant="body2">
                          Estoque atual: {item.quantidade} {item.unidade} | 
                          Estoque mínimo: {item.estoqueMinimo} {item.unidade}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      )}

      {reportType === 'vencimento' && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom color="error.main">
            <ScheduleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Itens Próximos ao Vencimento (30 dias)
          </Typography>
          {expiringSoonItems.length === 0 ? (
            <Alert severity="success">
              Nenhum item vencendo nos próximos 30 dias! 👍
            </Alert>
          ) : (
            <List>
              {expiringSoonItems.map((item) => (
                <ListItem key={item.id} divider>
                  <ListItemIcon>
                    <ScheduleIcon color="error" />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.nome}
                    secondary={
                      <>
                        <Typography variant="body2">
                          Categoria: {item.categoria} | Marca: {item.marca}
                        </Typography>
                        <Typography variant="body2">
                          Vencimento: {new Date(item.dataVencimento.seconds * 1000).toLocaleDateString('pt-BR')} | 
                          Quantidade: {item.quantidade} {item.unidade}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      )}
    </Container>
  );
};

export default Reports;
