# API de Tarefas (Tasks API)

API REST completa para gerenciamento de tarefas com Fastify, Prisma e PostgreSQL. CRUD completo, filtros, paginação e healthcheck.

## 🎯 Características

- ✅ CRUD completo de tarefas
- ✅ Filtros por status (pending/completed)
- ✅ Paginação de resultados
- ✅ Validação de dados (Zod)
- ✅ PostgreSQL com Prisma ORM
- ✅ Migrations e seeds
- ✅ Docker e Docker Compose
- ✅ Health check endpoint
- ✅ CORS configurado
- ✅ Logs estruturados

## 📋 Requisitos

- Node.js 20+
- PostgreSQL 14+ (ou use Docker Compose)
- Docker (opcional)

## 🚀 Como rodar

### Com Docker Compose (Recomendado)

```bash
# Clonar e acessar pasta
cd api-tasks-javascript

# Copiar .env
cp .env.example .env

# Subir banco e aplicação
docker-compose up -d

# Rodar migrations
docker-compose exec api npm run migrate

# Rodar seed
docker-compose exec api npm run seed

# Acesse: http://localhost:80/health
```

### Sem Docker

```bash
# Copiar .env e configurar DATABASE
cp .env.example .env

# Instalar dependências
npm install

# Gerar cliente Prisma
npx prisma generate

# Sincronizar schema com banco
npx prisma db push

# Rodar seed
npm run seed

# Iniciar servidor (porta 80)
npm run dev

# Acesse: http://localhost:80/health
```

## 📦 Scripts

- `npm run dev` – Servidor de desenvolvimento (com hot-reload)
- `npm start` – Servidor de produção
- `npm run migrate` – Aplicar migrations
- `npm run migrate:dev` – Criar nova migration
- `npm run seed` – Popular banco com dados de exemplo
- `npm test` – Executar testes
- `npm run lint` – Linter (ESLint)
- `npm run format` – Formatar código (Prettier)

## 🔗 Endpoints

### Health Check
```
GET /health
```

### Tarefas

```
GET    /tasks              # Listar todas (com paginação e filtros)
GET    /tasks/:id          # Buscar por ID
POST   /tasks              # Criar nova
PUT    /tasks/:id          # Atualizar completa
PATCH  /tasks/:id          # Atualizar parcial
DELETE /tasks/:id          # Deletar
PATCH  /tasks/:id/complete # Marcar como completa
```

### Exemplos de uso

**Criar tarefa:**
```bash
curl -X POST http://localhost:80/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Minha tarefa","description":"Descrição"}'
```

**Listar com filtros:**
```bash
# Apenas pendentes
GET /tasks?status=pending

# Paginação
GET /tasks?page=1&limit=10

# Busca por título
GET /tasks?search=reunião
```

## 📂 Estrutura

```
api-tasks-javascript/
├── prisma/
│   ├── schema.prisma      # Schema do banco
│   └── migrations/        # Migrations
├── src/
│   ├── index.js           # Entry point
│   ├── routes/            # Rotas da API
│   ├── controllers/       # Lógica de negócio
│   ├── validators/        # Schemas de validação
│   └── lib/               # Utilitários
├── seed/
│   └── seed.js            # Dados iniciais
├── tests/
│   └── smoke.test.js      # Testes básicos
└── docs/                  # Documentação detalhada
```

## 🗄️ Banco de dados

### Modelo de Task

```prisma
model Task {
  id          String   @id @default(uuid())
  title       String
  description String?
  status      String   @default("pending")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Conexão

A aplicação lê a string de conexão da variável `DATABASE`:

```env
DATABASE=postgres://user:password@localhost:5432/tasks_db
```

## 🐳 Docker

### Build

```bash
docker build -t api-tasks-javascript .
```

### Run

```bash
docker run -p 80:80 \
  -e DATABASE=postgresql://user:pass@host:5432/db \
  api-tasks-javascript
```

## 📊 Logs

A aplicação usa logs estruturados (JSON em produção):

```json
{
  "level": "info",
  "msg": "Server listening on http://0.0.0.0:80",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

## 🧪 Testes

```bash
# Rodar todos os testes
npm test

# Com coverage
npm run test:coverage
```

## 📄 Licença

MIT

---