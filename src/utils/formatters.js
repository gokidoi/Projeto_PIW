// src/utils/formatters.js
// Utilitários de formatação

export const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
};

export const formatQuantity = (quantity, unit) => {
  return `${quantity} ${unit}`;
};

export const calculateMargin = (salePrice, costPrice) => {
  if (costPrice === 0) return 0;
  return ((salePrice - costPrice) / salePrice * 100).toFixed(2);
};
