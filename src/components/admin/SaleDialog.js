// SaleDialog.js
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  InputAdornment
} from '@mui/material';
import { useInventory } from '../../contexts';

const SaleDialog = ({ open, onClose, supplement }) => {
  const { registerSale } = useInventory();
  const [quantidadeVenda, setQuantidadeVenda] = useState('');
  const [valorVenda, setValorVenda] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setQuantidadeVenda('');
    setValorVenda('');
    setError('');
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!quantidadeVenda || !valorVenda) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }

    const quantidade = parseFloat(quantidadeVenda);
    const valor = parseFloat(valorVenda);

    if (quantidade <= 0) {
      setError('Quantidade deve ser maior que zero');
      return;
    }

    if (valor <= 0) {
      setError('Valor da venda deve ser maior que zero');
      return;
    }

    if (quantidade > supplement.quantidade) {
      setError(`Quantidade não pode ser maior que o estoque disponível (${supplement.quantidade} ${supplement.unidade})`);
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      await registerSale(supplement.id, quantidade, valor);
      
      // Fechar modal e limpar campos
      handleClose();
      
      // Feedback de sucesso será mostrado pelo componente pai
    } catch (error) {
      setError(error.message || 'Erro ao registrar venda');
    } finally {
      setLoading(false);
    }
  };

  if (!supplement) return null;

  const quantidadeNumero = parseFloat(quantidadeVenda || 0);
  const valorVendaNumero = parseFloat(valorVenda || 0);
  const valorSugeridoTotal = (supplement.precoVenda || 0) * quantidadeNumero;
  const custoTotal = (supplement.precoCompra || 0) * quantidadeNumero;
  const lucroEstimado = valorVendaNumero - custoTotal;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Registrar Venda - {supplement.nome}
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Informações do produto */}
          <Box sx={{ mb: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              {supplement.nome}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Marca:</strong> {supplement.marca} | <strong>Categoria:</strong> {supplement.categoria}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Estoque disponível:</strong> {supplement.quantidade} {supplement.unidade}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Preço de compra:</strong> R$ {(supplement.precoCompra || 0).toFixed(2)}
            </Typography>
            {supplement.precoVenda && (
              <Typography variant="body2" color="text.secondary">
                <strong>Preço de venda sugerido:</strong> R$ {supplement.precoVenda.toFixed(2)}
              </Typography>
            )}
          </Box>

          {/* Campos de entrada */}
          <TextField
            label="Quantidade vendida"
            type="number"
            fullWidth
            margin="normal"
            value={quantidadeVenda}
            onChange={(e) => setQuantidadeVenda(e.target.value)}
            InputProps={{
              endAdornment: <InputAdornment position="end">{supplement.unidade}</InputAdornment>,
            }}
            inputProps={{ 
              min: 0, 
              max: supplement.quantidade,
              step: supplement.unidade === 'unidades' ? 1 : 0.1
            }}
            required
            helperText={`Máximo: ${supplement.quantidade} ${supplement.unidade}`}
          />

          <TextField
            label="Valor total da venda"
            type="number"
            fullWidth
            margin="normal"
            value={valorVenda}
            onChange={(e) => setValorVenda(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start">R$</InputAdornment>,
            }}
            inputProps={{ 
              min: 0,
              step: 0.01
            }}
            required
            helperText={quantidadeVenda && supplement.precoVenda ? 
              `Valor sugerido: R$ ${valorSugeridoTotal.toFixed(2)}` : ''}
          />

          {/* Cálculos em tempo real */}
          {quantidadeVenda && valorVenda && quantidadeNumero > 0 && valorVendaNumero > 0 && (
            <Box sx={{ mt: 2, p: 2, backgroundColor: '#e3f2fd', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Resumo da Venda:
              </Typography>
              <Typography variant="body2">
                <strong>Quantidade:</strong> {quantidadeVenda} {supplement.unidade}
              </Typography>
              <Typography variant="body2">
                <strong>Valor total:</strong> R$ {valorVendaNumero.toFixed(2)}
              </Typography>
              <Typography variant="body2">
                <strong>Valor unitário:</strong> R$ {(valorVendaNumero / quantidadeNumero).toFixed(2)}
              </Typography>
              <Typography variant="body2">
                <strong>Custo total:</strong> R$ {custoTotal.toFixed(2)}
              </Typography>
              <Typography 
                variant="body2" 
                color={lucroEstimado > 0 ? 'success.main' : lucroEstimado < 0 ? 'error.main' : 'text.secondary'}
                fontWeight="bold"
              >
                <strong>Lucro estimado:</strong> R$ {lucroEstimado.toFixed(2)}
                {lucroEstimado > 0 && ' (✓ Lucro)'}
                {lucroEstimado < 0 && ' (⚠ Prejuízo)'}
                {lucroEstimado === 0 && ' (= Sem lucro/prejuízo)'}
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading || !quantidadeVenda || !valorVenda}
          >
            {loading ? 'Registrando...' : 'Registrar Venda'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SaleDialog;
