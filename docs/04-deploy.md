## 🚀 Deploy na Shard Cloud

A Shard Cloud oferece hospedagem moderna e confiável para seus projetos Node.js. Siga este guia para fazer deploy da sua API em minutos.

### 📋 Pré-requisitos

- Conta na [Shard Cloud](https://shardcloud.app)
- Projeto funcionando localmente
- Arquivo `.shardcloud` configurado
- Banco PostgreSQL (pode usar o da Shard Cloud)

## 🔧 Configuração do projeto

### 1. Criar arquivo `.shardcloud`

Crie um arquivo `.shardcloud` na raiz do projeto:

```bash
DISPLAY_NAME=Tasks API
MAIN=src/index.js
MEMORY=1024
VERSION=recommended
SUBDOMAIN=tasks-api
CUSTOM_COMMAND=npm install && npm run migrate && npm run seed && npm start
DESCRIPTION=API REST para gerenciamento de tarefas com Fastify e PostgreSQL
```

### 2. Configurar variáveis de ambiente

Configure as variáveis no dashboard da Shard Cloud:

```env
# Database - REQUIRED
DATABASE=postgres://user:password@host:port/database?ssl=true

# Server
PORT=80
APP_SECRET=your-secret-key-change-in-production

# Task configuration
MAX_TASKS_PER_PAGE=50
```

## 📦 Preparação para deploy

### 1. Testar localmente

```bash
# Instalar dependências
npm install

# Executar migrações
npm run migrate

# Popular banco com dados de exemplo
npm run seed

# Iniciar aplicação
npm start
```

### 2. Verificar funcionamento

```bash
# Testar health endpoint
curl http://localhost/health

# Testar API
curl http://localhost/api/v1/tasks
```

## 🚀 Deploy na Shard Cloud

### Método 1: Upload direto (Recomendado)

1. **Acesse o Dashboard**
   - Vá para [Shard Cloud Dashboard](https://shardcloud.app/dash)
   - Faça login na sua conta

2. **Criar nova aplicação**
   - Clique em **"New app"**
   - Selecione **"Upload"**

3. **Preparar arquivos**
   - Zip toda a pasta do projeto (incluindo `.shardcloud`)
   - Certifique-se de que o `package.json` está incluído

4. **Upload e deploy**
   - Arraste o arquivo ZIP ou clique para selecionar
   - Aguarde o processamento (alguns minutos)
   - Sua aplicação estará disponível em `https://tasks-api.shardweb.app`

### Método 2: Deploy via Git

1. **Conectar repositório**
   - No dashboard, clique em **"New app"**
   - Selecione **"Git Repository"**
   - Conecte seu repositório GitHub/GitLab

2. **Configurar build**
   - **Build command:** `npm install && npm run migrate && npm run seed`
   - **Start command:** `npm start`
   - **Node version:** `20` (recomendado)

3. **Deploy automático**
   - Cada push na branch principal fará deploy automático
   - Configure webhooks se necessário

## 🗄️ Banco de dados

### Usar PostgreSQL da Shard Cloud

1. **Criar banco**
   - Vá para [Databases Dashboard](https://shardcloud.app/dash/databases)
   - Clique em **"New Database"**
   - Selecione **PostgreSQL**
   - Escolha a quantidade de RAM

2. **Configurar conexão**
   - Copie a string de conexão do dashboard
   - Configure como variável `DATABASE` na aplicação
   - Exemplo: `postgres://user:pass@host:port/db?ssl=true`

3. **Executar migrações**
   - As migrações Prisma são executadas automaticamente na inicialização
   - Verifique logs para confirmar sucesso

### Banco externo

Se preferir usar banco externo:

```env
DATABASE=postgres://user:password@external-host:5432/database?ssl=true
```

## 🌐 Configurações avançadas

### Subdomínio personalizado

No arquivo `.shardcloud`:

```bash
SUBDOMAIN=minha-api
```

Sua aplicação ficará disponível em: `https://minha-api.shardweb.app`

### Domínio personalizado

1. **Configurar DNS**
   - Adicione um registro CNAME apontando para `tasks-api.shardweb.app`
   - Ou configure A record com o IP fornecido

2. **Ativar no dashboard**
   - Vá para configurações da aplicação
   - Adicione seu domínio personalizado
   - Configure certificado SSL (automático)

### Variáveis de ambiente

Configure variáveis sensíveis no dashboard:

1. Acesse configurações da aplicação
2. Vá para **"Environment Variables"**
3. Adicione suas variáveis:
   ```
   DATABASE=postgres://user:pass@host:port/db?ssl=true
   APP_SECRET=sua-chave-secreta-super-segura
   PORT=80
   ```

## 🔍 Monitoramento e logs

### Logs da aplicação

- Acesse o dashboard da aplicação
- Vá para a aba **"Logs"**
- Monitore erros e performance em tempo real

### Métricas

- **Uptime:** Monitoramento automático
- **Performance:** Métricas de resposta
- **Tráfego:** Estatísticas de acesso
- **Database:** Monitoramento de conexões

### Health checks

A aplicação inclui endpoints de monitoramento:

- `GET /health` - Status geral da API
- `GET /api/v1/tasks` - Lista de tarefas
- `POST /api/v1/tasks` - Criar nova tarefa

## 🔒 Segurança

### HTTPS automático

- Todos os deploys na Shard Cloud incluem HTTPS automático
- Certificados SSL gerenciados automaticamente
- Renovação automática

### Validação de dados

A aplicação usa Zod para validação:

- Validação automática de entrada
- Schemas tipados para TypeScript
- Mensagens de erro padronizadas

## 🚦 CI/CD com GitHub Actions

Crie `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Shard Cloud

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run migrations
        run: npm run migrate
        env:
          DATABASE: ${{ secrets.DATABASE_URL }}
      
      - name: Deploy to Shard Cloud
        run: |
          # Zip project
          zip -r deploy.zip . -x "node_modules/*" "*.git*"
          
          # Upload to Shard Cloud (configure API token)
          curl -X POST \
            -H "Authorization: Bearer ${{ secrets.SHARD_TOKEN }}" \
            -F "file=@deploy.zip" \
            https://api.shardcloud.app/deploy
```

## 🐛 Troubleshooting

### Build falha

```bash
# Limpar cache npm
npm cache clean --force

# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install

# Verificar dependências
npm audit
```

### Aplicação não inicia

1. Verifique logs no dashboard
2. Confirme se `ENTRYPOINT` está correto
3. Teste localmente com `npm start`

### Erro de conexão com banco

1. Verifique string de conexão `DATABASE`
2. Confirme se banco está acessível
3. Teste conexão localmente

### Erro de migração Prisma

```bash
# Resetar banco localmente
npx prisma db push --force-reset

# Executar migrações
npm run migrate

# Gerar cliente Prisma
npx prisma generate
```

## ✅ Checklist de deploy

- [ ] Arquivo `.shardcloud` configurado
- [ ] Dependências instaladas (`npm install`)
- [ ] Migrações executadas (`npm run migrate`)
- [ ] Banco PostgreSQL configurado
- [ ] Variáveis de ambiente configuradas
- [ ] Projeto zipado ou conectado ao Git
- [ ] Deploy realizado no dashboard
- [ ] Aplicação acessível via URL
- [ ] Health endpoint funcionando (`/health`)
- [ ] API endpoints testados (`/api/v1/tasks`)
- [ ] HTTPS ativo
- [ ] Logs monitorados

## 🎉 Sucesso!

Sua API está no ar na Shard Cloud! 

### Próximos passos:

1. **Teste completo:** Verifique todos os endpoints
2. **Documentação:** Configure Swagger se necessário
3. **Monitoramento:** Configure alertas de uptime
4. **Backup:** Configure backup do banco de dados
5. **Otimização:** Monitore métricas e otimize performance

### URLs importantes:

- **Dashboard:** https://shardcloud.app/dash
- **Documentação:** https://docs.shardcloud.app/quickstart
- **Suporte:** https://shardcloud.app/support

---

**Precisa de ajuda?** Consulte a [documentação oficial da Shard Cloud](https://docs.shardcloud.app/quickstart) ou entre em contato com o suporte.