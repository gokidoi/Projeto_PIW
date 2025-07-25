// Dashboard.js
import React from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  Category as CategoryIcon,
  Schedule as ScheduleIcon,
  AttachMoney as MoneyIcon,
  ShowChart as ProfitIcon,
  Store as StoreIcon,
  VisibilityOff as PrivateIcon
} from '@mui/icons-material';
import { useInventory } from '../contexts/InventoryContext';

const Dashboard = () => {
  const { 
    supplements, 
    error, 
    getLowStockSupplements, 
    getExpiringSoon, 
    getTotalValue,
    getTotalSaleValue,
    getTotalProfit,
    getProfitMargin,
    getSupplementsByCategory 
  } = useInventory();

  const lowStockItems = getLowStockSupplements();
  const expiringSoonItems = getExpiringSoon();
  const totalCostValue = getTotalValue();
  const totalSaleValue = getTotalSaleValue();
  const totalProfit = getTotalProfit();
  const profitMargin = getProfitMargin();
  const categories = getSupplementsByCategory();
  
  // Novos cálculos para produtos publicados
  const publishedItems = supplements.filter(s => s.publicado === true);
  const unpublishedItems = supplements.filter(s => !s.publicado);

  const StatCard = ({ title, value, icon, color = 'primary', subtitle }) => (
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
          Dashboard - Excelência Fitness
        </Typography>
      </Box>

      {/* Cards de Estatísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total de Itens"
            value={supplements.length}
            icon={<InventoryIcon sx={{ fontSize: 40 }} />}
            color="primary"
            subtitle="Suplementos cadastrados"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Valor de Compra"
            value={`R$ ${totalCostValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            icon={<MoneyIcon sx={{ fontSize: 40 }} />}
            color="info"
            subtitle="Investimento total"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Valor de Venda"
            value={`R$ ${totalSaleValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            icon={<TrendingUpIcon sx={{ fontSize: 40 }} />}
            color="success"
            subtitle="Receita potencial"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Lucro Potencial"
            value={`R$ ${totalProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            icon={<ProfitIcon sx={{ fontSize: 40 }} />}
            color={totalProfit >= 0 ? "success" : "error"}
            subtitle={`Margem: ${profitMargin.toFixed(1)}%`}
          />
        </Grid>
      </Grid>

      {/* Cards de Alertas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Estoque Baixo"
            value={lowStockItems.length}
            icon={<WarningIcon sx={{ fontSize: 40 }} />}
            color="warning"
            subtitle="Itens com estoque baixo"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Vencendo em 30 dias"
            value={expiringSoonItems.length}
            icon={<ScheduleIcon sx={{ fontSize: 40 }} />}
            color="error"
            subtitle="Itens próximos do vencimento"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Publicados na Loja"
            value={publishedItems.length}
            icon={<StoreIcon sx={{ fontSize: 40 }} />}
            color="info"
            subtitle="Visíveis para clientes"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Apenas no Estoque"
            value={unpublishedItems.length}
            icon={<PrivateIcon sx={{ fontSize: 40 }} />}
            color="secondary"
            subtitle="Não visíveis na loja"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Categorias"
            value={Object.keys(categories).length}
            icon={<CategoryIcon sx={{ fontSize: 40 }} />}
            color="secondary"
            subtitle="Diferentes categorias"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Ticket Médio"
            value={supplements.length > 0 ? 
              `R$ ${(totalCostValue / supplements.length).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 
              'R$ 0,00'
            }
            icon={<TrendingUpIcon sx={{ fontSize: 40 }} />}
            color="info"
            subtitle="Custo médio por item"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Alertas de Estoque Baixo */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 400, overflow: 'auto' }}>
            <Typography variant="h6" gutterBottom color="warning.main">
              <WarningIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Estoque Baixo
            </Typography>
            
            {lowStockItems.length === 0 ? (
              <Typography color="textSecondary">
                Nenhum item com estoque baixo 👍
              </Typography>
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
                        <Box>
                          <Typography variant="body2">
                            Estoque atual: {item.quantidade} {item.unidade}
                          </Typography>
                          <Typography variant="body2">
                            Estoque mínimo: {item.estoqueMinimo} {item.unidade}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        {/* Itens Vencendo */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 400, overflow: 'auto' }}>
            <Typography variant="h6" gutterBottom color="error.main">
              <ScheduleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Vencendo em 30 dias
            </Typography>
            
            {expiringSoonItems.length === 0 ? (
              <Typography color="textSecondary">
                Nenhum item vencendo nos próximos 30 dias 👍
              </Typography>
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
                        <Box>
                          <Typography variant="body2">
                            Vencimento: {new Date(item.dataVencimento.seconds * 1000).toLocaleDateString('pt-BR')}
                          </Typography>
                          <Typography variant="body2">
                            Quantidade: {item.quantidade} {item.unidade}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        {/* Distribuição por Categoria */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              <CategoryIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Distribuição por Categoria
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
              {Object.entries(categories).map(([category, items]) => (
                <Chip
                  key={category}
                  label={`${category} (${items.length})`}
                  color="primary"
                  variant="outlined"
                  sx={{ mb: 1 }}
                />
              ))}
            </Box>

            {Object.keys(categories).length === 0 && (
              <Typography color="textSecondary">
                Nenhum suplemento cadastrado ainda
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Análise de Lucratividade */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom color="success.main">
              <ProfitIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Análise de Lucratividade
            </Typography>
            
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Investimento Total:
                  </Typography>
                  <Typography variant="h6" color="info.main">
                    R$ {totalCostValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Receita Potencial:
                  </Typography>
                  <Typography variant="h6" color="success.main">
                    R$ {totalSaleValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Lucro Potencial:
                  </Typography>
                  <Typography 
                    variant="h6" 
                    color={totalProfit >= 0 ? "success.main" : "error.main"}
                  >
                    R$ {totalProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Margem de Lucro:
                  </Typography>
                  <Typography 
                    variant="h6" 
                    color={profitMargin >= 0 ? "success.main" : "error.main"}
                  >
                    {profitMargin.toFixed(1)}%
                  </Typography>
                </Grid>
              </Grid>
              
              {totalProfit < 0 && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  Atenção: Seus preços de venda estão abaixo do custo. 
                  Revise a precificação para garantir lucratividade.
                </Alert>
              )}
              
              {profitMargin > 0 && profitMargin < 20 && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Margem de lucro baixa. Considere revisar os preços de venda 
                  para aumentar a rentabilidade.
                </Alert>
              )}
              
              {profitMargin >= 30 && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  Excelente margem de lucro! Seu negócio está bem estruturado.
                </Alert>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
