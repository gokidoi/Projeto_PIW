// Dashboard.js
import React, { useState, useEffect } from 'react';
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
  VisibilityOff as PrivateIcon,
  PointOfSale as SalesIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material';
import { useInventory } from '../../contexts';

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
    getSupplementsByCategory,
    getSalesMetrics
  } = useInventory();

  const [salesData, setSalesData] = useState({
    totalVendas: 0,
    valorTotalVendido: 0,
    lucroRealVendas: 0,
    vendasDetalhadas: []
  });

  // Buscar métricas de vendas
  useEffect(() => {
    const loadSalesMetrics = async () => {
      try {
        const metrics = await getSalesMetrics();
        setSalesData(metrics);
      } catch (error) {
        console.error('Erro ao carregar métricas de vendas:', error);
      }
    };

    if (supplements.length > 0) {
      loadSalesMetrics();
    }
  }, [supplements, getSalesMetrics]);

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
    <Card sx={{ 
      height: { xs: 'auto', sm: '100%' },
      minHeight: { xs: '120px', sm: '140px' },
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }}>
      <CardContent sx={{
        textAlign: 'center',
        p: { xs: 2, sm: 3 },
        '&:last-child': { pb: { xs: 2, sm: 3 } }
      }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" flexDirection={{ xs: 'column', sm: 'row' }}>
          <Box sx={{ order: { xs: 2, sm: 1 }, textAlign: { xs: 'center', sm: 'left' }, width: '100%' }}>
            <Typography 
              color="textSecondary" 
              gutterBottom 
              variant="h6"
              sx={{ 
                fontSize: { xs: '0.9rem', sm: '1rem' },
                fontWeight: 500,
                mb: { xs: 1, sm: 1.5 }
              }}
            >
              {title}
            </Typography>
            <Typography 
              variant="h4" 
              color={`${color}.main`}
              sx={{
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                fontWeight: 'bold',
                mb: { xs: 0.5, sm: 1 },
                lineHeight: 1.2
              }}
            >
              {value}
            </Typography>
            {subtitle && (
              <Typography 
                variant="body2" 
                color="textSecondary"
                sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.85rem' },
                  lineHeight: 1.3
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box 
            color={`${color}.main`} 
            sx={{ 
              order: { xs: 1, sm: 2 },
              mb: { xs: 1, sm: 0 },
              display: { xs: 'none', sm: 'block' }
            }}
          >
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
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total de Itens"
            value={supplements.length}
            icon={<InventoryIcon sx={{ fontSize: { xs: 30, sm: 40 } }} />}
            color="primary"
            subtitle="Suplementos cadastrados"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Valor de Compra"
            value={`R$ ${totalCostValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            icon={<MoneyIcon sx={{ fontSize: { xs: 30, sm: 40 } }} />}
            color="info"
            subtitle="Investimento total"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Valor de Venda"
            value={`R$ ${totalSaleValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            icon={<TrendingUpIcon sx={{ fontSize: { xs: 30, sm: 40 } }} />}
            color="success"
            subtitle="Receita potencial"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Lucro Potencial"
            value={`R$ ${totalProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            icon={<ProfitIcon sx={{ fontSize: { xs: 30, sm: 40 } }} />}
            color={totalProfit >= 0 ? "success" : "error"}
            subtitle={`Margem: ${profitMargin.toFixed(1)}%`}
          />
        </Grid>
      </Grid>

      {/* Cards de Alertas */}
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Estoque Baixo"
            value={lowStockItems.length}
            icon={<WarningIcon sx={{ fontSize: { xs: 30, sm: 40 } }} />}
            color="warning"
            subtitle="Itens com estoque baixo"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Vencendo em 30 dias"
            value={expiringSoonItems.length}
            icon={<ScheduleIcon sx={{ fontSize: { xs: 30, sm: 40 } }} />}
            color="error"
            subtitle="Itens próximos do vencimento"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Publicados na Loja"
            value={publishedItems.length}
            icon={<StoreIcon sx={{ fontSize: { xs: 30, sm: 40 } }} />}
            color="info"
            subtitle="Visíveis para clientes"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Apenas no Estoque"
            value={unpublishedItems.length}
            icon={<PrivateIcon sx={{ fontSize: { xs: 30, sm: 40 } }} />}
            color="secondary"
            subtitle="Não visíveis na loja"
          />
        </Grid>
      </Grid>

      {/* Cards de Informações Adicionais */}
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Categorias"
            value={Object.keys(categories).length}
            icon={<CategoryIcon sx={{ fontSize: { xs: 30, sm: 40 } }} />}
            color="secondary"
            subtitle="Diferentes categorias"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Ticket Médio"
            value={supplements.length > 0 ? 
              `R$ ${(totalCostValue / supplements.length).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 
              'R$ 0,00'
            }
            icon={<TrendingUpIcon sx={{ fontSize: { xs: 30, sm: 40 } }} />}
            color="info"
            subtitle="Custo médio por item"
          />
        </Grid>

        <Grid item xs={12} sm={12} md={4}>
          <StatCard
            title="Margem de Lucro"
            value={`${profitMargin.toFixed(1)}%`}
            icon={<ProfitIcon sx={{ fontSize: { xs: 30, sm: 40 } }} />}
            color={profitMargin >= 0 ? "success" : "error"}
            subtitle="Margem média"
          />
        </Grid>
      </Grid>

      {/* Cards de Métricas de Vendas */}
      <Typography 
        variant="h5" 
        gutterBottom 
        sx={{ mt: 4, mb: 2, fontWeight: 600, color: 'primary.main' }}
      >
        📊 Métricas de Vendas
      </Typography>
      
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total de Vendas"
            value={salesData.totalVendas}
            icon={<SalesIcon sx={{ fontSize: { xs: 30, sm: 40 } }} />}
            color="success"
            subtitle="Vendas realizadas"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Valor Vendido"
            value={`R$ ${salesData.valorTotalVendido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            icon={<ReceiptIcon sx={{ fontSize: { xs: 30, sm: 40 } }} />}
            color="success"
            subtitle="Receita real"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Lucro Real"
            value={`R$ ${salesData.lucroRealVendas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            icon={<ProfitIcon sx={{ fontSize: { xs: 30, sm: 40 } }} />}
            color={salesData.lucroRealVendas >= 0 ? "success" : "error"}
            subtitle="Lucro das vendas"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Ticket Médio Vendas"
            value={salesData.totalVendas > 0 ? 
              `R$ ${(salesData.valorTotalVendido / salesData.totalVendas).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 
              'R$ 0,00'
            }
            icon={<TrendingUpIcon sx={{ fontSize: { xs: 30, sm: 40 } }} />}
            color="info"
            subtitle="Valor médio por venda"
          />
        </Grid>
      </Grid>

      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {/* Alertas de Estoque Baixo */}
        <Grid item xs={12} lg={6}>
          <Paper sx={{ 
            p: { xs: 2, sm: 3 }, 
            height: { xs: 350, sm: 400 }, 
            overflow: 'auto' 
          }}>
            <Typography 
              variant="h6" 
              gutterBottom 
              color="warning.main"
              sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
            >
              <WarningIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Estoque Baixo
            </Typography>
            
            {lowStockItems.length === 0 ? (
              <Typography color="textSecondary">
                Nenhum item com estoque baixo 👍
              </Typography>
            ) : (
              <List sx={{ p: 0 }}>
                {lowStockItems.map((item) => (
                  <ListItem key={item.id} divider sx={{ px: 0 }}>
                    <ListItemIcon>
                      <WarningIcon color="warning" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                          {item.nome}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                            Estoque atual: {item.quantidade} {item.unidade}
                          </Typography>
                          <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
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
        <Grid item xs={12} lg={6}>
          <Paper sx={{ 
            p: { xs: 2, sm: 3 }, 
            height: { xs: 350, sm: 400 }, 
            overflow: 'auto' 
          }}>
            <Typography 
              variant="h6" 
              gutterBottom 
              color="error.main"
              sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
            >
              <ScheduleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Vencendo em 30 dias
            </Typography>
            
            {expiringSoonItems.length === 0 ? (
              <Typography color="textSecondary">
                Nenhum item vencendo nos próximos 30 dias 👍
              </Typography>
            ) : (
              <List sx={{ p: 0 }}>
                {expiringSoonItems.map((item) => (
                  <ListItem key={item.id} divider sx={{ px: 0 }}>
                    <ListItemIcon>
                      <ScheduleIcon color="error" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                          {item.nome}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                            Vencimento: {new Date(item.dataVencimento.seconds * 1000).toLocaleDateString('pt-BR')}
                          </Typography>
                          <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
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
        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
            >
              <CategoryIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Distribuição por Categoria
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: { xs: 0.5, sm: 1 }, 
              mt: 2 
            }}>
              {Object.entries(categories).map(([category, items]) => (
                <Chip
                  key={category}
                  label={`${category} (${items.length})`}
                  color="primary"
                  variant="outlined"
                  size={window.innerWidth < 600 ? "small" : "medium"}
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
        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography 
              variant="h6" 
              gutterBottom 
              color="success.main"
              sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
            >
              <ProfitIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Análise de Lucratividade
            </Typography>
            
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography 
                    variant="body2" 
                    color="textSecondary"
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                  >
                    Investimento Total:
                  </Typography>
                  <Typography 
                    variant="h6" 
                    color="info.main"
                    sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                  >
                    R$ {totalCostValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography 
                    variant="body2" 
                    color="textSecondary"
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                  >
                    Receita Potencial:
                  </Typography>
                  <Typography 
                    variant="h6" 
                    color="success.main"
                    sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                  >
                    R$ {totalSaleValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography 
                    variant="body2" 
                    color="textSecondary"
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                  >
                    Lucro Potencial:
                  </Typography>
                  <Typography 
                    variant="h6" 
                    color={totalProfit >= 0 ? "success.main" : "error.main"}
                    sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                  >
                    R$ {totalProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography 
                    variant="body2" 
                    color="textSecondary"
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                  >
                    Margem de Lucro:
                  </Typography>
                  <Typography 
                    variant="h6" 
                    color={profitMargin >= 0 ? "success.main" : "error.main"}
                    sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                  >
                    {profitMargin.toFixed(1)}%
                  </Typography>
                </Grid>
              </Grid>
              
              {totalProfit < 0 && (
                <Alert severity="warning" sx={{ mt: 2, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  Atenção: Seus preços de venda estão abaixo do custo. 
                  Revise a precificação para garantir lucratividade.
                </Alert>
              )}
              
              {profitMargin > 0 && profitMargin < 20 && (
                <Alert severity="info" sx={{ mt: 2, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  Margem de lucro baixa. Considere revisar os preços de venda 
                  para aumentar a rentabilidade.
                </Alert>
              )}
              
              {profitMargin >= 30 && (
                <Alert severity="success" sx={{ mt: 2, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
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
