import { PartialType } from '@nestjs/swagger';
import { CreateEventInviteDto } from './create-event-invite.dto';

export class UpdateEventInviteDto extends PartialType(CreateEventInviteDto) {}
