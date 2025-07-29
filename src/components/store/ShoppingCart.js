//ShoppingCart.js
import React, { useState } from 'react';
import {
  Drawer,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip
} from '@mui/material';
import {
  Remove as RemoveIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  ShoppingCart as CartIcon,
  Email as EmailIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useStore } from '../../contexts';
import { useAuth } from '../../contexts';
import { getUserInfo } from '../../services/userService';

const ShoppingCart = () => {
  const { user } = useAuth();
  const {
    cart,
    cartOpen,
    setCartOpen,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemsCount
  } = useStore();

  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    nome: user?.displayName || '',
    email: user?.email || '',
    telefone: '',
    observacoes: ''
  });
  const [orderSent, setOrderSent] = useState(false);

  const handleQuantityChange = (productId, newQuantity) => {
    updateCartQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
  };

  const handleProceedToOrder = () => {
    if (cart.length === 0) return;
    setOrderDialogOpen(true);
  };

  const handleInputChange = (field, value) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSendOrder = async () => {
    const orderData = {
      cliente: customerInfo,
      itens: cart,
      total: getCartTotal(),
      data: new Date().toLocaleString('pt-BR')
    };

    // Agrupar itens por fornecedor
    const itemsBySupplier = {};
    
    for (const item of orderData.itens) {
      const supplierInfo = await getUserInfo(item.userId);
      const supplierKey = item.userId;
      
      if (!itemsBySupplier[supplierKey]) {
        itemsBySupplier[supplierKey] = {
          supplier: supplierInfo,
          items: []
        };
      }
      
      itemsBySupplier[supplierKey].items.push(item);
    }

    // Enviar email individual para cada fornecedor
    for (const [, supplierGroup] of Object.entries(itemsBySupplier)) {
      const supplierEmail = supplierGroup.supplier?.email;
      
      if (!supplierEmail) {
        console.warn(`Email não encontrado para fornecedor: ${supplierGroup.supplier?.displayName || 'Desconhecido'}`);
        continue;
      }

      // Calcular total dos itens deste fornecedor
      const supplierTotal = supplierGroup.items.reduce((total, item) => {
        return total + (item.precoVenda * item.quantidadeCarrinho);
      }, 0);

      let emailBody = `NOVO PEDIDO - Marketplace de Suplementos\n\n`;
      emailBody += `Data: ${orderData.data}\n\n`;
      emailBody += `=== DADOS DO CLIENTE ===\n`;
      emailBody += `Nome: ${orderData.cliente.nome}\n`;
      emailBody += `Email: ${orderData.cliente.email}\n`;
      emailBody += `Telefone: ${orderData.cliente.telefone}\n`;
      if (orderData.cliente.observacoes) {
        emailBody += `Observações: ${orderData.cliente.observacoes}\n`;
      }
      emailBody += `\n=== SEUS PRODUTOS NO PEDIDO ===\n`;
      
      let itemIndex = 1;
      supplierGroup.items.forEach((item) => {
        emailBody += `${itemIndex}. ${item.nome}\n`;
        emailBody += `   Marca: ${item.marca}\n`;
        emailBody += `   Categoria: ${item.categoria}\n`;
        emailBody += `   Quantidade: ${item.quantidadeCarrinho} ${item.unidade}\n`;
        emailBody += `   Preço unitário: R$ ${item.precoVenda.toFixed(2)}\n`;
        emailBody += `   Subtotal: R$ ${(item.precoVenda * item.quantidadeCarrinho).toFixed(2)}\n\n`;
        itemIndex++;
      });
      
      emailBody += `=== RESUMO DESTE FORNECEDOR ===\n`;
      emailBody += `Total de itens: ${supplierGroup.items.reduce((count, item) => count + item.quantidadeCarrinho, 0)}\n`;
      emailBody += `VALOR TOTAL SEUS PRODUTOS: R$ ${supplierTotal.toFixed(2)}\n\n`;
      emailBody += `Entre em contato com o cliente para confirmar o pedido e combinar a entrega.\n\n`;
      emailBody += `Pedido gerado automaticamente pelo Marketplace de Suplementos.`;

      const subject = `Novo Pedido - ${customerInfo.nome} - R$ ${supplierTotal.toFixed(2)}`;
      const mailtoLink = `mailto:${supplierEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
      
      // Abrir cliente de email para este fornecedor
      window.open(mailtoLink);
      
      // Pequeno delay entre os emails para evitar conflitos
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Limpar carrinho e fechar diálogos
    clearCart();
    setOrderDialogOpen(false);
    setCartOpen(false);
    setOrderSent(true);
    
    // Reset do formulário
    setCustomerInfo({
      nome: user?.displayName || '',
      email: user?.email || '',
      telefone: '',
      observacoes: ''
    });

    // Ocultar mensagem de sucesso após 5 segundos
    setTimeout(() => setOrderSent(false), 5000);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <>
      {/* Drawer do Carrinho */}
      <Drawer
        anchor="right"
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        PaperProps={{
          sx: { width: { xs: '100%', sm: 400 } }
        }}
      >
        <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <IconButton 
              onClick={() => setCartOpen(false)}
              sx={{ mr: 1 }}
              size="small"
            >
              <ArrowBackIcon />
            </IconButton>
            <CartIcon sx={{ mr: 1 }} />
            <Typography variant="h6">
              Carrinho ({getCartItemsCount()})
            </Typography>
          </Box>

          {cart.length === 0 ? (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography variant="body1" color="text.secondary">
                Seu carrinho está vazio
              </Typography>
            </Box>
          ) : (
            <>
              <List sx={{ flexGrow: 1, overflow: 'auto' }}>
                {cart.map((item) => (
                  <ListItem key={item.id} divider>
                    <ListItemText
                      primary={item.nome}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {item.marca} • {item.categoria}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                            {formatPrice(item.precoVenda)} / {item.unidade}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <IconButton
                              size="small"
                              onClick={() => handleQuantityChange(item.id, item.quantidadeCarrinho - 1)}
                            >
                              <RemoveIcon />
                            </IconButton>
                            <Chip 
                              label={`${item.quantidadeCarrinho} ${item.unidade}`}
                              size="small"
                              sx={{ mx: 1 }}
                            />
                            <IconButton
                              size="small"
                              onClick={() => handleQuantityChange(item.id, item.quantidadeCarrinho + 1)}
                              disabled={item.quantidadeCarrinho >= item.quantidade}
                            >
                              <AddIcon />
                            </IconButton>
                          </Box>
                          <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 1 }}>
                            Subtotal: {formatPrice(item.precoVenda * item.quantidadeCarrinho)}
                          </Typography>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={() => handleRemoveItem(item.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>

              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ textAlign: 'center' }}>
                  Total: {formatPrice(getCartTotal())}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={clearCart}
                  color="error"
                >
                  Limpar
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleProceedToOrder}
                  startIcon={<EmailIcon />}
                >
                  Finalizar Pedido
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Drawer>

      {/* Dialog de Finalização do Pedido */}
      <Dialog
        open={orderDialogOpen}
        onClose={() => setOrderDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Finalizar Pedido</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }} color="text.secondary">
            Preencha seus dados para enviar o pedido por email:
          </Typography>
          
          <TextField
            label="Nome completo"
            fullWidth
            margin="normal"
            value={customerInfo.nome}
            onChange={(e) => handleInputChange('nome', e.target.value)}
            required
          />
          
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={customerInfo.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            required
          />
          
          <TextField
            label="Telefone"
            fullWidth
            margin="normal"
            value={customerInfo.telefone}
            onChange={(e) => handleInputChange('telefone', e.target.value)}
            placeholder="(11) 99999-9999"
          />
          
          <TextField
            label="Observações"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={customerInfo.observacoes}
            onChange={(e) => handleInputChange('observacoes', e.target.value)}
            placeholder="Observações adicionais sobre o pedido..."
          />

          <Box sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              Resumo do Pedido:
            </Typography>
            <Typography variant="body2">
              {getCartItemsCount()} itens • Total: {formatPrice(getCartTotal())}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOrderDialogOpen(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleSendOrder}
            variant="contained"
            disabled={!customerInfo.nome || !customerInfo.email}
            startIcon={<EmailIcon />}
          >
            Enviar Pedido
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alert de sucesso */}
      {orderSent && (
        <Alert 
          severity="success" 
          sx={{ 
            position: 'fixed', 
            top: 16, 
            right: 16, 
            zIndex: 9999 
          }}
        >
          Pedido enviado com sucesso! Verifique seu cliente de email.
        </Alert>
      )}
    </>
  );
};

export default ShoppingCart;
