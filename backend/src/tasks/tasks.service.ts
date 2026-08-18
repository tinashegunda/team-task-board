import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { ListTasksQueryDto } from './dto/list-tasks-query.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';

const includeAssignee = { assignee: true } as const;

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTaskDto) {
    await this.ensureAssigneeExists(dto.assigneeId);

    return this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description ?? '',
        assigneeId: dto.assigneeId,
      },
      include: includeAssignee,
    });
  }

  findAll(query: ListTasksQueryDto) {
    return this.prisma.task.findMany({
      where: {
        ...(query.status ? { status: query.status } : {}),
        ...(query.assigneeId ? { assigneeId: query.assigneeId } : {}),
      },
      include: includeAssignee,
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, dto: UpdateTaskStatusDto) {
    await this.ensureTaskExists(id);

    return this.prisma.task.update({
      where: { id },
      data: { status: dto.status },
      include: includeAssignee,
    });
  }

  async remove(id: string) {
    await this.ensureTaskExists(id);
    await this.prisma.task.delete({ where: { id } });
  }

  private async ensureTaskExists(id: string) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task ${id} not found`);
    }
  }

  private async ensureAssigneeExists(assigneeId: string) {
    const assignee = await this.prisma.user.findUnique({
      where: { id: assigneeId },
    });
    if (!assignee) {
      throw new NotFoundException(`Assignee ${assigneeId} not found`);
    }
  }
}
