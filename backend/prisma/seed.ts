import 'dotenv/config';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../generated/prisma/client';

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? 'file:./dev.db',
});
const prisma = new PrismaClient({ adapter });

const users = [
  { id: 'user_ada', name: 'Ada Lovelace', email: 'ada@example.com' },
  { id: 'user_grace', name: 'Grace Hopper', email: 'grace@example.com' },
  { id: 'user_alan', name: 'Alan Turing', email: 'alan@example.com' },
  { id: 'user_margaret', name: 'Margaret Hamilton', email: 'margaret@example.com' },
];

const tasks = [
  {
    id: 'task_board_copy',
    title: 'Write board copy',
    description: 'Draft empty-state and filter labels.',
    status: 'TODO' as const,
    assigneeId: 'user_ada',
  },
  {
    id: 'task_api_filters',
    title: 'Add task filters',
    description: 'Filter list by status and assignee.',
    status: 'IN_PROGRESS' as const,
    assigneeId: 'user_grace',
  },
  {
    id: 'task_seed_data',
    title: 'Seed sample tasks',
    description: 'Give the UI something to render on first run.',
    status: 'DONE' as const,
    assigneeId: 'user_alan',
  },
];

async function main() {
  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: { name: user.name },
      create: user,
    });
  }

  for (const task of tasks) {
    await prisma.task.upsert({
      where: { id: task.id },
      update: {
        title: task.title,
        description: task.description,
        status: task.status,
        assigneeId: task.assigneeId,
      },
      create: task,
    });
  }

  const [userCount, taskCount] = await Promise.all([
    prisma.user.count(),
    prisma.task.count(),
  ]);
  console.log(`Seeded ${userCount} users and ${taskCount} tasks`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
