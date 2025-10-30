# Configuração

## 🔐 Variáveis de Ambiente

### Arquivo `.env`

Copie `.env.example` para `.env` e configure:

```env
# Database (obrigatório)
DATABASE=postgres://user:password@localhost:5432/tasks_db

# Server (opcional)
PORT=80
NODE_ENV=development

# Prisma (opcional)
# PRISMA_QUERY_ENGINE_LIBRARY=/path/to/engine
```

### Variáveis Detalhadas

#### `DATABASE` (obrigatório)

String de conexão PostgreSQL (suporta tanto `postgres://` quanto `postgresql://`):

```
postgres://USER:PASSWORD@HOST:PORT/DATABASE
```

Exemplos:

```env
# Local
DATABASE=postgres://postgres:postgres@localhost:5432/tasks_db

# Docker Compose (nome do service)
DATABASE=postgres://taskuser:taskpass@db:5432/tasks_db

# Supabase
DATABASE=postgres://user:pass@db.xxx.supabase.co:5432/postgres

# Railway
DATABASE=postgres://user:pass@containers-us-west-1.railway.app:5432/railway

# Render
DATABASE=postgres://user:pass@dpg-xxx-a.oregon-postgres.render.com/db_name

# Shard Cloud (com SSL)
DATABASE=postgres://user:pass@postgres.shardatabases.app:5432/database?ssl=true
```

#### `PORT` (opcional, padrão: 80)

Porta onde o servidor escutará:

```env
PORT=80      # Produção (padrão)
PORT=3000    # Desenvolvimento alternativo
```

#### `NODE_ENV` (opcional, padrão: development)

Ambiente de execução:

```env
NODE_ENV=development   # Logs verbosos, hot-reload
NODE_ENV=production    # Logs JSON, otimizações
NODE_ENV=test          # Para testes
```

## 🗄️ Configuração do Banco de Dados

### Opção 1: Docker Compose (Recomendado)

O `docker-compose.yml` já inclui PostgreSQL configurado:

```bash
docker-compose up -d db
```

Credenciais padrão:
- **User:** taskuser
- **Password:** taskpass
- **Database:** tasks_db
- **Port:** 5432

### Opção 2: PostgreSQL Local

Instale PostgreSQL e crie o banco:

```bash
# Criar usuário e banco
psql -U postgres
CREATE USER taskuser WITH PASSWORD 'taskpass';
CREATE DATABASE tasks_db OWNER taskuser;
GRANT ALL PRIVILEGES ON DATABASE tasks_db TO taskuser;
```

Configure `.env`:

```env
DATABASE=postgresql://taskuser:taskpass@localhost:5432/tasks_db
```

### Opção 3: PostgreSQL em Cloud

**Supabase (Grátis):**
1. Crie projeto em https://supabase.com
2. Vá em Settings > Database
3. Copie Connection String (modo "Transaction")
4. Cole no `.env`

**Railway:**
1. Crie projeto em https://railway.app
2. Adicione PostgreSQL plugin
3. Copie `DATABASE_URL`
4. Cole no `.env`

**Render:**
1. Crie PostgreSQL database em https://render.com
2. Copie External Database URL
3. Cole no `.env`

## 🔄 Migrations

### Aplicar Migrations

```bash
# Produção (aplica migrations pendentes)
npm run migrate

# Desenvolvimento (cria nova migration interativa)
npm run migrate:dev

# Reset completo (⚠️ apaga todos dados)
npm run migrate:reset
```

### Criar Nova Migration

```bash
# Edite prisma/schema.prisma
# Exemplo: adicionar campo 'priority'

npm run migrate:dev --name add-priority-field
```

### Verificar Status

```bash
# Listar migrations pendentes
npx prisma migrate status

# Ver histórico
ls -la prisma/migrations/
```

## 🌱 Seeds

### Rodar Seeds

```bash
npm run seed
```

Isso criará 10 tarefas de exemplo (mix de pending/completed).

### Customizar Seeds

Edite `seed/seed.js`:

```javascript
const seedTasks = [
  {
    title: 'Minha tarefa',
    description: 'Descrição customizada',
    status: 'pending',
  },
  // ...
];
```

## 🐳 Docker

### Docker Compose (Recomendado)

```yaml
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: taskuser
      POSTGRES_PASSWORD: taskpass
      POSTGRES_DB: tasks_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  api:
    build: .
    depends_on:
      - db
    environment:
      DATABASE: postgresql://taskuser:taskpass@db:5432/tasks_db
      PORT: 80
    ports:
      - "80:80"
```

### Build Customizado

```bash
# Build da imagem
docker build -t api-tasks .

# Run com variáveis
docker run -p 80:80 \
  -e DATABASE=postgresql://user:pass@host:5432/db \
  -e NODE_ENV=production \
  api-tasks
```

## 📊 Prisma Studio

Interface visual para gerenciar dados:

```bash
npm run studio
```

Acesse: http://localhost:5555

## 🔧 Configuração Avançada

### CORS

Editar `src/index.js`:

```javascript
await fastify.register(cors, {
  origin: ['https://meusite.com', 'https://app.meusite.com'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
});
```

### Logs

Editar `src/lib/logger.js`:

```javascript
export const logger = pino({
  level: 'debug', // trace, debug, info, warn, error, fatal
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
    },
  },
});
```

### Connection Pool

Editar `src/index.js`:

```javascript
export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE,
    },
  },
  log: ['query', 'error', 'warn'],
});
```

## 🎯 Próximos passos

Continue para [Rodando](./03-rodando.md) para executar e testar a API.

