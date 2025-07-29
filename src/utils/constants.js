// src/utils/constants.js
// Constantes da aplicação

// Categorias de produtos
export const PRODUCT_CATEGORIES = [
  'Proteína',
  'Creatina', 
  'Vitaminas',
  'Aminoácidos',
  'Pré-treino',
  'Termogênico',
  'Carboidratos',
  'Outros'
];

// Unidades de medida
export const UNITS = [
  'kg',
  'g', 
  'ml',
  'l',
  'unidades',
  'cápsulas',
  'comprimidos'
];

// Status de produtos
export const PRODUCT_STATUS = {
  ACTIVE: 'ativo',
  INACTIVE: 'inativo',
  PUBLISHED: 'publicado',
  DRAFT: 'rascunho'
};

// Tipos de relatório
export const REPORT_TYPES = {
  SALES: 'sales',
  INVENTORY: 'inventory',
  PROFITABILITY: 'profitability',
  LOW_STOCK: 'lowStock'
};

// Configurações de paginação
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 25,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100]
};

// Rotas da aplicação
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    INVENTORY: '/admin/inventory', 
    REPORTS: '/admin/reports'
  },
  STORE: {
    HOME: '/store',
    PRODUCT: '/store/product'
  }
};

// Configurações de validação
export const VALIDATION = {
  MIN_PRODUCT_NAME_LENGTH: 3,
  MAX_PRODUCT_NAME_LENGTH: 100,
  MIN_DESCRIPTION_LENGTH: 10,
  MAX_DESCRIPTION_LENGTH: 500,
  MIN_PRICE: 0.01,
  MAX_PRICE: 9999.99,
  MIN_QUANTITY: 0,
  MAX_QUANTITY: 999999
};
