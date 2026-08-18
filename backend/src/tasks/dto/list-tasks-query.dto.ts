import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Status } from '../../../generated/prisma/enums';

export class ListTasksQueryDto {
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @IsOptional()
  @IsString()
  assigneeId?: string;
}
