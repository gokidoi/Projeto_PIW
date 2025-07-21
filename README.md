# 💊 Sistema de Inventário de Suplementos

Um sistema web completo para gerenciamento de inventário de suplementos para academias, desenvolvido com React.js e Firebase.

## 🌐 Demo Online
**🔗 Acesse o sistema:** https://inventario-8b388.web.app

## ✨ Funcionalidades

### 🔐 Autenticação
- Login seguro com Google
- Proteção de rotas
- Dados privados por usuário

### 📦 Gestão de Inventário
- **CRUD completo** de suplementos
- **Categorização** por tipo (Proteína, Creatina, Vitaminas, etc.)
- **Controle de estoque** com alertas automáticos
- **Gestão de vencimentos** com notificações
- **Múltiplas unidades** (kg, g, ml, unidades, cápsulas)

### 💰 Análise Financeira
- **Cálculo de lucros** automático
- **Margem de lucratividade** por produto
- **Valor total do inventário**
- **Receita potencial** estimada
- **Alertas inteligentes** para precificação

### 📊 Dashboard Inteligente
- **Estatísticas em tempo real**
- **Alertas de estoque baixo**
- **Produtos vencendo em 30 dias**
- **Análise de categorias**
- **Indicadores de performance**

### 📈 Relatórios Avançados
- **Relatórios customizáveis** por categoria e data
- **Exportação para CSV** com dados completos
- **Análise de lucratividade** detalhada
- **Filtros inteligentes**

## 🛠️ Tecnologias

### Frontend
- **React.js 19** - Interface moderna
- **Material-UI 7** - Design System Google
- **React Router DOM** - Navegação SPA
- **React Hook Form** - Formulários validados
- **Axios** - Cliente HTTP

### Backend
- **Firebase Authentication** - Login OAuth2
- **Cloud Firestore** - Banco NoSQL em tempo real
- **Firebase Hosting** - CDN global

### Ferramentas
- **Create React App** - Boilerplate
- **Material-UI Data Grid** - Tabelas avançadas
- **Context API** - Gerenciamento de estado

## 🚀 Como Executar

### Pré-requisitos
- Node.js 16+
- npm ou yarn
- Conta Firebase

### Instalação

1. **Clone o repositório**
```bash
git clone <seu-repositorio>
cd inventario
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o Firebase**
   - Crie um projeto no [Firebase Console](https://console.firebase.google.com)
   - Ative Authentication (Google Sign-In)
   - Ative Firestore Database
   - Copie as configurações em `src/services/firebase.js`

4. **Execute o projeto**
```bash
npm start
```

5. **Acesse**: http://localhost:3000

### Deploy
```bash
# Build de produção
npm run build

# Deploy no Firebase (se configurado)
firebase deploy --only hosting
```

## 📋 Estrutura de Dados

```javascript
// Estrutura de um suplemento
{
  id: "uuid",
  nome: "Whey Protein",
  categoria: "Proteína",
  marca: "Optimum Nutrition", 
  quantidade: 2.5,
  unidade: "kg",
  precoCompra: 150.00,
  precoVenda: 200.00,
  dataCompra: "2025-01-15",
  dataVencimento: "2026-01-15",
  fornecedor: "Distribuidora XYZ",
  descricao: "Whey concentrado sabor chocolate",
  estoqueMinimo: 1,
  ativo: true,
  userId: "user-id"
}
```

## 🔒 Segurança

- **Autenticação obrigatória** via Google OAuth2
- **Dados isolados por usuário** (cada usuário só vê seus dados)
- **Regras de segurança** no Firestore
- **Validação client-side e server-side**

## 📱 Interface

### Desktop
- Layout responsivo com sidebar
- Tabelas com paginação e filtros
- Dashboards com gráficos

### Mobile
- Design mobile-first
- Menu adaptável
- Touch-friendly

## 🎯 Casos de Uso

- **Academias**: Controle de suplementos vendidos
- **Lojas de nutrição**: Gestão completa de estoque  
- **Personal trainers**: Acompanhamento de produtos
- **Distribuidoras**: Análise de lucratividade

## 📊 Métricas e Alertas

### Alertas Automáticos
- 🟨 **Estoque baixo**: Quando quantidade ≤ estoque mínimo
- 🟥 **Vencimento próximo**: Produtos vencendo em 30 dias
- ⚠️ **Margem negativa**: Preço de venda < preço de compra

### Cálculos Automáticos
- **Lucro unitário**: `Preço Venda - Preço Compra`
- **Lucro total**: `Lucro Unitário × Quantidade`
- **Margem de lucro**: `(Lucro ÷ Preço Compra) × 100%`

## 🔄 Atualizações Futuras

- [ ] Gráficos de tendências
- [ ] Relatórios em PDF
- [ ] Integração com código de barras
- [ ] App mobile nativo
- [ ] Multi-loja/usuários
- [ ] Integração com fornecedores

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🆘 Suporte

Para suporte, abra uma issue ou entre em contato.

---

**Desenvolvido com ❤️ usando React.js e Firebase**
