// SupplementForm.js
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
  InputAdornment,
  FormControlLabel,
  Switch,
  Typography
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useInventory } from '../../contexts';
import { useAuth } from '../../contexts';

const CATEGORIES = [
  'Proteína',
  'Creatina',
  'Vitaminas',
  'Minerais',
  'Pré-treino',
  'Aminoácidos',
  'Queimador de Gordura',
  'Carboidratos',
  'Outros'
];

const UNITS = [
  'kg',
  'g',
  'unidades',
  'ml',
  'l',
  'cápsulas',
  'comprimidos'
];

const SupplementForm = ({ open, onClose, supplement = null }) => {
  const { addSupplement, updateSupplement, loading } = useInventory();
  const { user } = useAuth();
  const [error, setError] = useState('');
  const isEditing = !!supplement;

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      nome: '',
      categoria: '',
      marca: '',
      quantidade: '',
      unidade: '',
      precoCompra: '',
      precoVenda: '',
      dataCompra: '',
      dataVencimento: '',
      fornecedor: user?.email || '',
      descricao: '',
      estoqueMinimo: '',
      ativo: true,
      publicado: false,
      imagemUrl: ''
    }
  });

  useEffect(() => {
    if (supplement) {
      reset({
        nome: supplement.nome || '',
        categoria: supplement.categoria || '',
        marca: supplement.marca || '',
        quantidade: supplement.quantidade || '',
        unidade: supplement.unidade || '',
        precoCompra: supplement.precoCompra || '',
        precoVenda: supplement.precoVenda || '',
        dataCompra: supplement.dataCompra ? new Date(supplement.dataCompra.seconds * 1000).toISOString().split('T')[0] : '',
        dataVencimento: supplement.dataVencimento ? new Date(supplement.dataVencimento.seconds * 1000).toISOString().split('T')[0] : '',
        fornecedor: supplement.fornecedor || '',
        descricao: supplement.descricao || '',
        estoqueMinimo: supplement.estoqueMinimo || '',
        ativo: supplement.ativo !== undefined ? supplement.ativo : true,
        publicado: supplement.publicado !== undefined ? supplement.publicado : false,
        imagemUrl: supplement.imagemUrl || ''
      });
    }
  }, [supplement, reset]);

  const onSubmit = async (data) => {
    try {
      setError('');
      
      // Converter strings para números onde necessário
      const formattedData = {
        ...data,
        quantidade: parseFloat(data.quantidade),
        precoCompra: parseFloat(data.precoCompra),
        precoVenda: parseFloat(data.precoVenda || 0),
        estoqueMinimo: parseFloat(data.estoqueMinimo || 0),
        dataCompra: data.dataCompra ? new Date(data.dataCompra) : null,
        dataVencimento: data.dataVencimento ? new Date(data.dataVencimento) : null
      };

      if (isEditing) {
        await updateSupplement(supplement.id, formattedData);
      } else {
        await addSupplement(formattedData);
      }

      handleClose();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleClose = () => {
    reset();
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {isEditing ? 'Editar Suplemento' : 'Adicionar Novo Suplemento'}
      </DialogTitle>
      
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Controller
                name="nome"
                control={control}
                rules={{ required: 'Nome é obrigatório' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nome do Suplemento"
                    fullWidth
                    error={!!errors.nome}
                    helperText={errors.nome?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="categoria"
                control={control}
                rules={{ required: 'Categoria é obrigatória' }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.categoria}>
                    <InputLabel>Categoria</InputLabel>
                    <Select {...field} label="Categoria">
                      {CATEGORIES.map((category) => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="marca"
                control={control}
                rules={{ required: 'Marca é obrigatória' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Marca"
                    fullWidth
                    error={!!errors.marca}
                    helperText={errors.marca?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <Controller
                name="quantidade"
                control={control}
                rules={{ 
                  required: 'Quantidade é obrigatória',
                  min: { value: 0, message: 'Quantidade deve ser positiva' }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Quantidade"
                    type="number"
                    fullWidth
                    error={!!errors.quantidade}
                    helperText={errors.quantidade?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <Controller
                name="unidade"
                control={control}
                rules={{ required: 'Unidade é obrigatória' }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.unidade}>
                    <InputLabel>Unidade</InputLabel>
                    <Select {...field} label="Unidade">
                      {UNITS.map((unit) => (
                        <MenuItem key={unit} value={unit}>
                          {unit}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="precoCompra"
                control={control}
                rules={{ 
                  required: 'Preço de compra é obrigatório',
                  min: { value: 0, message: 'Preço deve ser positivo' }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Preço de Compra"
                    type="number"
                    fullWidth
                    InputProps={{
                      startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                    }}
                    error={!!errors.precoCompra}
                    helperText={errors.precoCompra?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="precoVenda"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Preço de Venda"
                    type="number"
                    fullWidth
                    InputProps={{
                      startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="dataCompra"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Data de Compra"
                    type="date"
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="dataVencimento"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Data de Vencimento"
                    type="date"
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="fornecedor"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Fornecedor (Email)"
                    fullWidth
                    disabled
                    helperText="Preenchido automaticamente com seu email"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="estoqueMinimo"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Estoque Mínimo"
                    type="number"
                    fullWidth
                    helperText="Quantidade mínima para alerta de estoque baixo"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="descricao"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Descrição"
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Informações adicionais sobre o suplemento..."
                  />
                )}
              />
            </Grid>

            {/* Campo de URL da Imagem */}
            <Grid item xs={12}>
              <Controller
                name="imagemUrl"
                control={control}
                rules={{
                  pattern: {
                    value: /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i,
                    message: 'URL deve ser uma imagem válida (jpg, jpeg, png, gif, webp)'
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="URL da Imagem"
                    fullWidth
                    placeholder="https://exemplo.com/imagem.jpg"
                    helperText={errors.imagemUrl?.message || "Link da imagem do produto (opcional)"}
                    error={!!errors.imagemUrl}
                  />
                )}
              />
            </Grid>

            {/* Preview da Imagem */}
            {watch('imagemUrl') && (
              <Grid item xs={12}>
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Preview da Imagem:
                  </Typography>
                  <Box
                    component="img"
                    src={watch('imagemUrl')}
                    alt="Preview do produto"
                    sx={{
                      maxWidth: '200px',
                      maxHeight: '200px',
                      borderRadius: 2,
                      border: '1px solid #ddd',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </Box>
              </Grid>
            )}

            {/* Controles de Status */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="ativo"
                control={control}
                defaultValue={true}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={field.value}
                        onChange={field.onChange}
                        color="primary"
                      />
                    }
                    label="✅ Produto ativo no estoque"
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Controller
                name="publicado"
                control={control}
                defaultValue={false}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={field.value}
                        onChange={field.onChange}
                        color="secondary"
                      />
                    }
                    label="🌐 Publicar na loja (visível para clientes)"
                  />
                )}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          disabled={loading}
        >
          {loading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Adicionar')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SupplementForm;
