# 📋 Sistema de Inventário de Suplementos - Documentação Completa

## 🎯 Visão Geral

Este é um sistema web completo de inventário de suplementos para academia, desenvolvido em React.js com Firebase como backend. O sistema permite gerenciar estoque, calcular lucros, gerar relatórios e monitorar vencimentos de produtos.

**🔗 Sistema Online**: https://inventario-8b388.web.app

---

## 🛠️ Tecnologias Utilizadas

### **Frontend**
- **React.js 19.1.0**: Biblioteca principal para interface
- **React Hooks**: useState, useEffect, useContext para gerenciamento de estado
- **React Router DOM 7.7.0**: Navegação entre páginas
- **Material-UI 7.2.0**: Framework de design Google Material
- **React Hook Form 7.60.0**: Gerenciamento de formulários
- **Axios 1.10.0**: Cliente HTTP para requisições

### **Backend & Banco de Dados**
- **Firebase Authentication**: Login com Google
- **Cloud Firestore**: Banco de dados NoSQL em tempo real
- **Firebase Hosting**: Hospedagem do site

### **UI/UX**
- **Material-UI Data Grid**: Tabelas avançadas com paginação e filtros
- **Material-UI Icons**: Ícones consistentes
- **Emotion**: CSS-in-JS para estilização

---

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Header.js       # Barra de navegação
│   ├── Login.js        # Tela de login
│   ├── ProtectedRoute.js # Proteção de rotas
│   └── SupplementForm.js # Formulário de suplementos
├── contexts/           # Gerenciamento de estado global
│   ├── AuthContext.js  # Contexto de autenticação
│   └── InventoryContext.js # Contexto do inventário
├── pages/              # Páginas principais
│   ├── Dashboard.js    # Painel principal
│   ├── Inventory.js    # Gerenciamento de estoque
│   └── Reports.js      # Relatórios e análises
├── services/           # Configurações externas
│   └── firebase.js     # Configuração Firebase
└── App.js              # Componente principal
```

---

## ⚙️ Funcionalidades Principais

### 🔐 **1. Autenticação**
- **Login com Google**: Integração OAuth2
- **Proteção de rotas**: Apenas usuários autenticados
- **Gerenciamento de sessão**: Persistência automática
- **Logout seguro**: Limpeza de dados

```javascript
// Exemplo de uso
const { user, signInWithGoogle, logout } = useAuth();
```

### 📦 **2. CRUD de Suplementos**
Operações completas de Create, Read, Update, Delete:

#### **Campos do Suplemento:**
```javascript
{
  id: string,                    // ID único
  nome: string,                  // Nome do produto
  categoria: string,             // Proteína, Creatina, etc.
  marca: string,                 // Marca fabricante
  quantidade: number,            // Quantidade em estoque
  unidade: string,               // kg, g, unidades, ml
  precoCompra: number,           // Preço de aquisição
  precoVenda: number,            // Preço de venda
  dataCompra: Date,              // Data da compra
  dataVencimento: Date,          // Data de validade
  fornecedor: string,            // Nome do fornecedor
  descricao: string,             // Observações
  estoqueMinimo: number,         // Limite para alerta
  ativo: boolean,                // Status do produto
  userId: string,                // ID do usuário (privacidade)
  createdAt: Date,               // Data de criação
  updatedAt: Date                // Última modificação
}
```

### 📊 **3. Dashboard Inteligente**

#### **Cards de Estatísticas:**
- **Total de Itens**: Contador de suplementos
- **Valor de Compra**: Investimento total no estoque
- **Valor de Venda**: Receita potencial
- **Lucro Potencial**: Diferença entre venda e compra
- **Ticket Médio**: Custo médio por item

#### **Alertas Automáticos:**
- 🟨 **Estoque Baixo**: Produtos abaixo do limite mínimo
- 🟥 **Vencimento Próximo**: Itens vencendo em 30 dias
- 📊 **Análise de Lucratividade**: Margem de lucro com alertas

#### **Análise Financeira:**
```javascript
// Cálculos implementados
Lucro Unitário = Preço Venda - Preço Compra
Lucro Total = (Preço Venda - Preço Compra) × Quantidade
Margem de Lucro = ((Valor Venda - Valor Compra) / Valor Compra) × 100%
```

### 🏪 **4. Gerenciamento de Inventário**

#### **Lista Inteligente:**
- **Tabela interativa**: Paginação, ordenação, filtros
- **Busca avançada**: Por nome, marca ou categoria
- **Filtro por categoria**: Dropdown dinâmico
- **Indicadores visuais**: 
  - 🟨 Linha amarela = Estoque baixo
  - 🟥 Linha vermelha = Vencendo em breve

#### **Operações:**
- ➕ **Adicionar**: Formulário completo validado
- ✏️ **Editar**: Modificação inline
- 🗑️ **Deletar**: Confirmação de segurança
- 🔍 **Visualizar**: Detalhes completos

### 📈 **5. Sistema de Relatórios**

#### **Tipos de Relatório:**
1. **Geral**: Todos os produtos com análise financeira
2. **Por Categoria**: Agrupamento e estatísticas
3. **Estoque Baixo**: Produtos precisando reposição
4. **Próximos ao Vencimento**: Gestão de validade

#### **Filtros Avançados:**
- **Por categoria**: Proteína, Creatina, Vitaminas, etc.
- **Por data**: Compras a partir de data específica
- **Combinação**: Múltiplos filtros simultâneos

#### **Exportação:**
- **CSV Completo**: Todas as colunas financeiras
- **Impressão**: Layout otimizado
- **Dados inclusos**: Lucros, margens, totais

### 🔍 **6. Recursos Adicionais**

#### **Gestão de Estoque:**
```javascript
// Alertas automáticos
if (quantidade <= estoqueMinimo) {
  // Exibe alerta de estoque baixo
}

if (diasParaVencimento <= 30) {
  // Exibe alerta de vencimento
}
```

#### **Categorização:**
- Proteína, Creatina, Vitaminas, Minerais
- Pré-treino, Aminoácidos, Queimador de Gordura
- Carboidratos, Outros (personalizável)

#### **Unidades de Medida:**
- kg, g (sólidos)
- ml, l (líquidos)  
- unidades, cápsulas, comprimidos (contáveis)

---

## 🔧 Arquitetura Técnica

### **Gerenciamento de Estado**
Utiliza **Context API** para estado global:

```javascript
// AuthContext: Gerencia autenticação
const { user, loading, signInWithGoogle, logout } = useAuth();

// InventoryContext: Gerencia inventário
const { 
  supplements, 
  addSupplement, 
  updateSupplement, 
  deleteSupplement,
  getTotalProfit 
} = useInventory();
```

### **Roteamento Protegido**
```javascript
// Exemplo de proteção
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

### **Validação de Formulários**
```javascript
// React Hook Form com validação
const { control, handleSubmit, formState: { errors } } = useForm();

// Validações implementadas
rules={{ 
  required: 'Campo obrigatório',
  min: { value: 0, message: 'Valor deve ser positivo' }
}}
```

### **Banco de Dados**
**Firestore Rules** para segurança:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /supplements/{document} {
      // Cada usuário só acessa seus dados
      allow read, write: if request.auth.uid == resource.data.userId;
    }
  }
}
```

---

## 🎨 Interface e UX

### **Design System**
- **Material Design 3**: Consistência visual
- **Responsivo**: Mobile-first design
- **Cores semânticas**: Verde (lucro), Vermelho (prejuízo), Amarelo (alerta)
- **Tipografia**: Roboto font family

### **Componentes Reutilizáveis**
```javascript
// Card de estatística
<StatCard
  title="Lucro Potencial"
  value="R$ 1.250,00"
  color="success"
  icon={<ProfitIcon />}
/>
```

### **Feedback Visual**
- **Loading states**: Spinners durante requisições
- **Alertas contextuais**: Success, warning, error
- **Confirmações**: Modais para ações destrutivas
- **Notificações**: Toast messages para feedback

---

## 🚀 Deploy e Hospedagem

### **Firebase Hosting**
```bash
# Build de produção
npm run build

# Deploy
firebase deploy --only hosting
```

### **Configuração Automática**
```json
// firebase.json
{
  "hosting": {
    "public": "build",
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

---

## 🔒 Segurança

### **Autenticação**
- **OAuth 2.0**: Google Sign-In
- **JWT Tokens**: Gerenciamento automático pelo Firebase
- **Session Management**: Persistência segura

### **Autorização**
- **User-based data**: Cada usuário só vê seus dados
- **Firestore Rules**: Validação no servidor
- **Client-side protection**: Rotas protegidas

### **Validação**
- **Input sanitization**: Prevenção de XSS
- **Type checking**: Validação de tipos
- **Business rules**: Regras de negócio validadas

---

## 📱 Responsividade

### **Breakpoints Material-UI**
```javascript
// Grid responsivo
<Grid item xs={12} sm={6} md={3}>
  // Adapta automaticamente
</Grid>

// sx props para responsividade
sx={{
  display: { xs: 'block', md: 'flex' },
  fontSize: { xs: '1rem', md: '1.2rem' }
}}
```

---

## 🔄 Fluxo de Dados

### **1. Autenticação**
```
Login → Firebase Auth → Context Update → Route Protection
```

### **2. CRUD Operations**
```
User Action → Form Validation → Firestore → Context Update → UI Refresh
```

### **3. Cálculos**
```
Data Change → Computed Properties → Dashboard Update → Visual Feedback
```

---

## 🎯 Benefícios do Sistema

### **Para o Negócio:**
- ✅ **Controle total do estoque**
- ✅ **Análise de lucratividade em tempo real**
- ✅ **Prevenção de perdas por vencimento**
- ✅ **Otimização de compras**
- ✅ **Relatórios para tomada de decisão**

### **Para o Usuário:**
- ✅ **Interface intuitiva**
- ✅ **Acesso de qualquer lugar**
- ✅ **Dados sempre sincronizados**
- ✅ **Alertas automáticos**
- ✅ **Exportação de dados**

### **Técnicos:**
- ✅ **Escalável**: Firebase auto-scaling
- ✅ **Seguro**: Regras de acesso robustas
- ✅ **Rápido**: CDN global
- ✅ **Confiável**: Uptime 99.9%
- ✅ **Manutenível**: Código bem estruturado

---

## 📈 Possíveis Melhorias Futuras

1. **Notificações Push**: Alertas no celular
2. **Dashboard Analytics**: Gráficos e tendências
3. **Integração com APIs**: Fornecedores automáticos
4. **App Mobile**: React Native
5. **Multi-loja**: Suporte a múltiplas unidades
6. **Código de Barras**: Scanner integrado
7. **Relatórios Avançados**: PDF personalizados

---

Este sistema representa uma solução completa e profissional para gestão de inventário, combinando tecnologias modernas com uma experiência de usuário excepcional. 🚀
