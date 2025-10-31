## 📖 O que é este template?

API REST completa para gerenciamento de tarefas (To-Do List) construída com **Fastify**, **Prisma ORM** e **PostgreSQL**. Pronta para produção com CRUD completo, filtros, paginação, validação e Docker.

## 🎯 Casos de uso

- **Sistema de tarefas:** Aplicativo de gestão de tarefas pessoais ou em equipe
- **Backend para apps:** API para aplicativos mobile ou web
- **Aprendizado:** Exemplo de API REST com melhores práticas
- **Base para projetos:** Ponto de partida para APIs mais complexas
- **Microserviço:** Componente de sistema maior

## ✨ Características principais

### API REST Completa

- ✅ CRUD completo (Create, Read, Update, Delete)
- ✅ Filtros por status (pending/completed)
- ✅ Busca por texto (título e descrição)
- ✅ Paginação de resultados
- ✅ Ordenação por data de criação
- ✅ Marcar tarefas como completadas

### Performance e Escalabilidade

- ⚡ Fastify (framework mais rápido do Node.js)
- 🗄️ Prisma ORM (type-safe e otimizado)
- 📊 Índices no banco para queries rápidas
- 🔄 Connection pooling
- 📦 Build otimizado com Docker

### Qualidade de Código

- ✅ Validação de entrada (Zod)
- ✅ Tratamento robusto de erros
- ✅ Logs estruturados (Pino)
- ✅ ESLint + Prettier
- ✅ Testes automatizados

### DevOps

- 🐳 Docker e Docker Compose
- 🔄 Migrations automáticas
- 🌱 Seeds para desenvolvimento
- 🏥 Health check endpoint
- 📊 Logs estruturados JSON

## 🏗️ Arquitetura

```
api-tasks-javascript/
├── prisma/
│   ├── schema.prisma          # Definição do schema
│   └── migrations/            # Histórico de migrations
├── src/
│   ├── index.js               # Entry point + servidor Fastify
│   ├── routes/
│   │   └── tasks.js           # Definição de rotas
│   ├── controllers/
│   │   └── tasks.controller.js # Lógica de negócio
│   ├── validators/
│   │   └── task.validator.js  # Schemas Zod
│   └── lib/
│       └── logger.js          # Configuração de logs
├── seed/
│   └── seed.js                # Dados iniciais
├── tests/
│   └── smoke.test.js          # Testes básicos
└── docs/                      # Documentação
```

### Stack Tecnológica

- **Runtime:** Node.js 20+ (ESM)
- **Framework:** Fastify 4.x
- **ORM:** Prisma 5.x
- **Database:** PostgreSQL 14+
- **Validação:** Zod
- **Logs:** Pino
- **Tests:** Node.js Test Runner
- **Container:** Docker + Docker Compose

## 📊 Modelo de Dados

```prisma
model Task {
  id          String   @id @default(uuid())
  title       String
  description String?
  status      String   @default("pending") // pending | completed
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Campos

- **id:** UUID único gerado automaticamente
- **title:** Título da tarefa (obrigatório, max 200 chars)
- **description:** Descrição opcional (max 1000 chars)
- **status:** Estado da tarefa (pending ou completed)
- **createdAt:** Data de criação automática
- **updatedAt:** Data de última atualização automática

## 🔗 Endpoints Disponíveis

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/health` | Health check + status do banco |
| GET | `/tasks` | Listar tarefas (paginado) |
| GET | `/tasks/:id` | Buscar tarefa por ID |
| POST | `/tasks` | Criar nova tarefa |
| PUT | `/tasks/:id` | Atualizar tarefa completa |
| PATCH | `/tasks/:id` | Atualizar tarefa parcial |
| DELETE | `/tasks/:id` | Deletar tarefa |
| PATCH | `/tasks/:id/complete` | Marcar como completa |

## 🚀 Quick Start

```bash
# Clone e acesse
cd api-tasks-javascript

# Suba com Docker Compose
docker-compose up -d

# Rode migrations
docker-compose exec api npm run migrate

# Popule com dados
docker-compose exec api npm run seed

# Teste
curl http://localhost:80/health
curl http://localhost:80/tasks
```

## 📈 Performance Esperada

- **Latência:** < 10ms para queries simples
- **Throughput:** > 10k requests/segundo
- **Memória:** ~50MB em idle
- **Startup:** < 3 segundos

## 🔄 Próximos passos

Continue para [Configuração](./02-configuracao.md) para setup detalhado.

