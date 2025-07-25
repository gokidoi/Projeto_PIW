# Copilot Instructions para Sistema de Inventário de Suplementos

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Contexto do Projeto
Este é um sistema web de inventário de suplementos para academia desenvolvido em React.js com as seguintes características:

### Tecnologias Utilizadas
- **Frontend**: React.js com hooks (useState, useEffect, useContext)
- **Autenticação**: Firebase Authentication (Google Login)
- **HTTP Client**: Axios para requisições
- **Roteamento**: React Router DOM
- **UI Framework**: Material-UI (@mui/material)
- **Formulários**: React Hook Form
- **Relatórios**: Componentes personalizados com Material-UI Data Grid

### Estrutura do Sistema
- **CRUD completo** para suplementos (Criar, Ler, Atualizar, Deletar)
- **Autenticação Google** obrigatória
- **Sistema de relatórios** com filtros e exportação
- **Dashboard** com estatísticas do inventário
- **Gerenciamento de estoque** com alertas de baixo estoque

### Padrões de Código
- Use **componentes funcionais** com hooks
- Implemente **custom hooks** para lógica reutilizável
- Use **Context API** para gerenciamento de estado global
- Siga as **convenções do Material-UI** para consistência visual
- Implemente **tratamento de erros** adequado
- Use **TypeScript-like comments** para melhor documentação

### Estrutura de Dados do Suplemento
```javascript
{
  id: string,
  nome: string,
  categoria: string, // Proteína, Creatina, Vitaminas, etc.
  marca: string,
  quantidade: number,
  unidade: string, // kg, g, unidades, ml
  precoCompra: number,
  precoVenda: number,
  dataCompra: Date,
  dataVencimento: Date,
  fornecedor: string,
  descricao: string,
  estoqueMinimo: number,
  ativo: boolean
}
```
