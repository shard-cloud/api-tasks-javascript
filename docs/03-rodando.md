## 🚀 Desenvolvimento Local

### Pré-requisitos

```bash
# Verificar versões
node --version  # v20+
npm --version   # v10+
docker --version # 20+ (opcional)
```

### Setup Inicial

```bash
# 1. Copiar .env
cp .env.example .env

# 2. Configurar DATABASE no .env
# DATABASE=postgres://user:pass@localhost:5432/tasks_db

# 3. Instalar dependências
npm install

# 4. Gerar Prisma Client
npx prisma generate

# 5. Sincronizar schema com banco
npx prisma db push

# 6. Rodar seed
npm run seed

# 7. Iniciar servidor (porta 80)
npm run dev

```

### Verificar se está funcionando

```bash
# Health check
curl http://localhost:80/health

# Listar tasks
curl http://localhost:80/tasks
```

### Iniciar Servidor

```bash
# Modo desenvolvimento (hot-reload)
npm run dev

# Ou usar Makefile
make dev
```

Servidor rodando em **http://localhost:80**

### Logs Esperados

```
[10:30:00] INFO: Server listening on http://0.0.0.0:80
[10:30:00] INFO: Environment: development
[10:30:01] INFO: Database connected
```

## 🐳 Com Docker Compose

### Subir Tudo

```bash
# Subir banco + API
docker-compose up -d

# Ver logs
docker-compose logs -f api

# Status
docker-compose ps
```

### Migrations e Seed (Docker)

```bash
# Aplicar migrations
docker-compose exec api npm run migrate

# Rodar seed
docker-compose exec api npm run seed

# Prisma Studio
docker-compose exec api npm run studio
```

### Parar

```bash
# Parar containers
docker-compose down

# Parar e remover volumes
docker-compose down -v
```

## 🧪 Testando Endpoints

### Health Check

```bash
curl http://localhost:80/health

# Resposta esperada:
# {
#   "status": "ok",
#   "timestamp": "2025-01-15T10:30:00.000Z",
#   "uptime": 123.45,
#   "database": "connected"
# }
```

### Listar Tarefas

```bash
# Todas as tarefas (paginado)
curl http://localhost:80/tasks

# Com filtros
curl "http://localhost:80/tasks?status=pending&page=1&limit=5"

# Com busca
curl "http://localhost:80/tasks?search=reunião"
```

### Criar Tarefa

```bash
curl -X POST http://localhost:80/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Minha nova tarefa",
    "description": "Descrição detalhada"
  }'

# Resposta (201 Created):
# {
#   "data": {
#     "id": "uuid",
#     "title": "Minha nova tarefa",
#     "description": "Descrição detalhada",
#     "status": "pending",
#     "createdAt": "2025-01-15T10:30:00.000Z",
#     "updatedAt": "2025-01-15T10:30:00.000Z"
#   }
# }
```

### Buscar por ID

```bash
curl http://localhost:80/tasks/{id}
```

### Atualizar Tarefa

```bash
# Atualização completa (PUT)
curl -X PUT http://localhost:80/tasks/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Título atualizado",
    "description": "Nova descrição",
    "status": "completed"
  }'

# Atualização parcial (PATCH)
curl -X PATCH http://localhost:80/tasks/{id} \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'
```

### Marcar como Completa

```bash
curl -X PATCH http://localhost:80/tasks/{id}/complete
```

### Deletar Tarefa

```bash
curl -X DELETE http://localhost:80/tasks/{id}

# Resposta: 204 No Content
```

## 🧪 Testes Automatizados

### Rodar Todos os Testes

```bash
npm test

# Com coverage
npm run test:coverage
```

### Testes Disponíveis

- ✅ Health check endpoint
- ✅ GET /tasks (lista)
- ✅ POST /tasks (criar)
- ✅ Validação de dados
- ✅ Filtros por status
- ✅ GET /tasks/:id (404)
- ✅ DELETE /tasks/:id

### Output Esperado

```
✔ Health check endpoint should return OK (50ms)
✔ GET /tasks should return tasks list (30ms)
✔ POST /tasks should create a new task (45ms)
✔ POST /tasks without title should fail (20ms)
✔ GET /tasks with status filter should work (35ms)
✔ GET /tasks/:id with invalid ID should return 404 (15ms)
✔ DELETE /tasks/:id should delete task (40ms)

7 tests passed (235ms)
```

## 📊 Prisma Studio

Interface visual para gerenciar dados:

```bash
# Local
npm run studio

# Docker
docker-compose exec api npm run studio
```

Acesse: **http://localhost:5555**

## 🔍 Debug e Troubleshooting

### Ver Queries SQL

Editar `.env`:

```env
DATABASE_URL=...
DEBUG=prisma:query
```

Ou via código (`src/index.js`):

```javascript
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
```

### Verificar Conexão do Banco

```bash
# Testar conexão
npx prisma db pull

# Ver schema atual
npx prisma db pull --print
```

### Resetar Banco (⚠️ apaga tudo)

```bash
npm run migrate:reset
```

### Verificar Porta em Uso

```bash
# Linux/Mac
lsof -i :80

# Windows
netstat -ano | findstr :80
```

## 📈 Performance Testing

### Simples (cURL)

```bash
# Medir latência
time curl http://localhost:80/health
```

### com Apache Bench

```bash
# 1000 requests, 10 concurrent
ab -n 1000 -c 10 http://localhost:80/health
```

### com Artillery

```bash
npm install -g artillery

# Criar config.yml
artillery quick --count 100 --num 10 http://localhost:80/tasks

# Resultados esperados:
# - p95 latency: < 50ms
# - Requests/sec: > 1000
```

## 🔄 Hot Reload

O servidor usa `--watch` do Node.js:

- Alterações em `src/**/*.js` recarregam automaticamente
- Não precisa reiniciar manualmente
- Logs mostram "Restarting..."

## 🎯 Checklist de Validação

Antes de considerar pronto:

- [ ] `npm install` sem erros
- [ ] `npm run migrate` aplica migrations
- [ ] `npm run seed` popula dados
- [ ] `npm run dev` inicia servidor
- [ ] `curl /health` retorna status ok
- [ ] `curl /tasks` retorna lista de tarefas
- [ ] `npm test` passa todos os testes
- [ ] Prisma Studio abre e mostra dados
- [ ] Docker Compose sobe corretamente
- [ ] Logs estruturados aparecem

## 🚀 Próximos passos

Continue para [Deploy](./04-deploy.md) para colocar em produção.

