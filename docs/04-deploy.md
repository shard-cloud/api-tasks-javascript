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
CUSTOM_COMMAND=npm install && npm start
DESCRIPTION=API REST para gerenciamento de tarefas com Fastify e PostgreSQL
```

**Nota:** Migrations são aplicadas automaticamente ao iniciar a aplicação.

### 2. Configurar variáveis de ambiente

Configure as variáveis no dashboard da Shard Cloud:

```env
# Database (obrigatório)
DATABASE=postgresql://user:password@host:port/database?ssl=true

# Server (opcional)
PORT=80
NODE_ENV=production
```

## 📦 Preparação para deploy

### 1. Testar localmente

```bash
# Instalar dependências
npm install

# Iniciar aplicação (migrations automáticas ✨)
npm run dev

# (Opcional) Popular com dados de exemplo
npm run seed
```

### 2. Verificar funcionamento

```bash
# Testar health endpoint
curl http://localhost:80/health

# Testar API
curl http://localhost:80/tasks
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
   - **Build command:** `npm install`
   - **Start command:** `npm start`
   - **Node version:** `20` (recomendado)
   
   **Nota:** Migrations são aplicadas automaticamente ao iniciar.

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

3. **Migrations automáticas**
   - As migrações são executadas automaticamente ao iniciar a aplicação
   - Verifique os logs para confirmar: `✅ Database tables created successfully`
   - Não é necessário rodar comandos manuais

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
   DATABASE=postgresql://user:pass@host:port/db?ssl=true
   PORT=80
   NODE_ENV=production
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

- `GET /health` - Status geral da API e conexão com banco
- `GET /tasks` - Lista de tarefas
- `POST /tasks` - Criar nova tarefa

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
      
      - name: Run tests
        run: npm test
      
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

### Migrations não aplicadas

```bash
# Aplicar migrations manualmente (se necessário)
npm run migrate

# Verificar status
npx prisma migrate status

# Gerar cliente Prisma
npx prisma generate
```

**Nota:** Em produção, as migrations são aplicadas automaticamente ao iniciar a aplicação via Dockerfile.

## ✅ Checklist de deploy

- [ ] Arquivo `.shardcloud` configurado
- [ ] Dependências instaladas (`npm install`)
- [ ] Banco PostgreSQL configurado
- [ ] Variável `DATABASE` configurada
- [ ] Projeto testado localmente (`npm run dev`)
- [ ] Projeto zipado ou conectado ao Git
- [ ] Deploy realizado no dashboard
- [ ] Aplicação acessível via URL
- [ ] Health endpoint funcionando (`GET /health`)
- [ ] API endpoints testados (`GET /tasks`, `POST /tasks`)
- [ ] Logs mostram "Database tables created successfully" (primeira execução)
- [ ] HTTPS ativo automaticamente
- [ ] Logs monitorados no dashboard

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