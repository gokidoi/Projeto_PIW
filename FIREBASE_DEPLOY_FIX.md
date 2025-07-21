# Como corrigir o Firebase Hosting mostrando página padrão

## Problema
Seu Firebase Hosting está funcionando, mas mostra "Welcome Firebase Hosting Setup Complete" em vez do seu app React.

## Solução Rápida

### 1. Fazer build do projeto React
```bash
npm run build
```

### 2. Configurar Firebase Hosting corretamente
```bash
# Se ainda não configurou o hosting
firebase init hosting

# Quando perguntar:
# ? What do you want to use as your public directory? 
# Responda: build

# ? Configure as a single-page app (rewrite all urls to /index.html)?
# Responda: y (Yes)

# ? Set up automatic builds and deploys with GitHub?
# Responda: n (No, por enquanto)
```

### 3. Deploy correto
```bash
# Build primeiro
npm run build

# Deploy
firebase deploy --only hosting
```

## Se já configurou antes

### Verificar firebase.json
Crie ou edite o arquivo `firebase.json` na raiz do projeto:

```json
{
  "hosting": {
    "public": "build",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### Deploy novamente
```bash
npm run build
firebase deploy --only hosting
```

## Comandos completos para resolver

Execute esses comandos na ordem:

```bash
# 1. Build do projeto
npm run build

# 2. Verificar se a pasta build foi criada
dir build

# 3. Deploy
firebase deploy --only hosting
```

## Verificar se funcionou

1. Aguarde alguns minutos
2. Acesse seu domínio Firebase
3. Deve aparecer sua aplicação React em vez da página de boas-vindas

## Se ainda não funcionar

### Verificar logs
```bash
firebase hosting:channel:list
firebase serve --only hosting
```

### Verificar configuração
```bash
# Ver configuração atual
firebase list
firebase use --list
```

## Domínio do seu projeto
Seu site deve estar em:
`https://inventario-8b388.web.app`
ou
`https://inventario-8b388.firebaseapp.com`
