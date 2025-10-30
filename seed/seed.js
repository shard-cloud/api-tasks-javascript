import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const seedTasks = [
  {
    title: 'Configurar ambiente de desenvolvimento',
    description: 'Instalar Node.js, Docker e ferramentas essenciais',
    status: 'completed',
  },
  {
    title: 'Estudar Fastify framework',
    description: 'Ler documentação oficial e criar projeto exemplo',
    status: 'completed',
  },
  {
    title: 'Implementar autenticação JWT',
    description: 'Adicionar sistema de login com tokens JWT',
    status: 'pending',
  },
  {
    title: 'Escrever testes unitários',
    description: 'Cobrir 80% do código com testes automatizados',
    status: 'pending',
  },
  {
    title: 'Configurar CI/CD no GitHub Actions',
    description: 'Automatizar build, testes e deploy',
    status: 'pending',
  },
  {
    title: 'Documentar API com Swagger',
    description: 'Criar documentação interativa dos endpoints',
    status: 'pending',
  },
  {
    title: 'Otimizar queries do banco',
    description: 'Adicionar índices e melhorar performance',
    status: 'pending',
  },
  {
    title: 'Implementar rate limiting',
    description: 'Proteger API contra abuso',
    status: 'pending',
  },
  {
    title: 'Configurar monitoramento',
    description: 'Adicionar logs estruturados e alertas',
    status: 'completed',
  },
  {
    title: 'Deploy em produção',
    description: 'Subir aplicação em ambiente produtivo',
    status: 'pending',
  },
];

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.task.deleteMany();
  console.log('✓ Cleared existing tasks');

  // Create tasks
  for (const task of seedTasks) {
    await prisma.task.create({ data: task });
  }

  console.log(`✓ Created ${seedTasks.length} tasks`);
  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

