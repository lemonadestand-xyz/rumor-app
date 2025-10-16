import { PartialType } from '@nestjs/swagger';
import { CreateMemberProfileDto } from './create-member-profile.dto';

export class UpdateMemberProfileDto extends PartialType(
  CreateMemberProfileDto,
) {}
