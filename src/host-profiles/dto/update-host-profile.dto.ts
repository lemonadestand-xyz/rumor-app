import { PartialType } from '@nestjs/swagger';
import { CreateHostProfileDto } from './create-host-profile.dto';

export class UpdateHostProfileDto extends PartialType(CreateHostProfileDto) {}
