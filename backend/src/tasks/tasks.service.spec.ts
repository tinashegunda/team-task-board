import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { TasksService } from './tasks.service';

jest.mock('../prisma/prisma.service', () => ({
  PrismaService: class PrismaService {},
}));

const assignee = {
  id: 'user_ada',
  name: 'Ada Lovelace',
  email: 'ada@example.com',
};

const task = {
  id: 'task_1',
  title: 'Write board copy',
  description: 'Draft labels',
  status: 'TODO' as const,
  assigneeId: assignee.id,
  assignee,
};

describe('TasksService', () => {
  let service: TasksService;
  const prisma = {
    user: {
      findUnique: jest.fn(),
    },
    task: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [TasksService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get(TasksService);
  });

  describe('create', () => {
    it('creates a task when the assignee exists', async () => {
      prisma.user.findUnique.mockResolvedValue(assignee);
      prisma.task.create.mockResolvedValue(task);

      await expect(
        service.create({
          title: task.title,
          description: task.description,
          assigneeId: assignee.id,
        }),
      ).resolves.toEqual(task);

      expect(prisma.task.create).toHaveBeenCalledWith({
        data: {
          title: task.title,
          description: task.description,
          assigneeId: assignee.id,
        },
        include: { assignee: true },
      });
    });

    it('throws when the assignee is missing', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.create({ title: task.title, assigneeId: 'missing' }),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(prisma.task.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('lists tasks filtered by status and assignee', async () => {
      prisma.task.findMany.mockResolvedValue([task]);

      await expect(
        service.findAll({ status: 'TODO', assigneeId: assignee.id }),
      ).resolves.toEqual([task]);

      expect(prisma.task.findMany).toHaveBeenCalledWith({
        where: { status: 'TODO', assigneeId: assignee.id },
        include: { assignee: true },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('updateStatus', () => {
    it('updates status when the task exists', async () => {
      const updated = { ...task, status: 'DONE' as const };
      prisma.task.findUnique.mockResolvedValue(task);
      prisma.task.update.mockResolvedValue(updated);

      await expect(
        service.updateStatus(task.id, { status: 'DONE' }),
      ).resolves.toEqual(updated);
    });

    it('throws when the task is missing', async () => {
      prisma.task.findUnique.mockResolvedValue(null);

      await expect(
        service.updateStatus('missing', { status: 'DONE' }),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(prisma.task.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('deletes when the task exists', async () => {
      prisma.task.findUnique.mockResolvedValue(task);
      prisma.task.delete.mockResolvedValue(task);

      await expect(service.remove(task.id)).resolves.toBeUndefined();
      expect(prisma.task.delete).toHaveBeenCalledWith({ where: { id: task.id } });
    });

    it('throws when the task is missing', async () => {
      prisma.task.findUnique.mockResolvedValue(null);

      await expect(service.remove('missing')).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(prisma.task.delete).not.toHaveBeenCalled();
    });
  });
});
