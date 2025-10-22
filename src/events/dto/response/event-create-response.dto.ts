import { ApiProperty } from '@nestjs/swagger';
import { IPublic } from 'src/common/utils/public.type';

export class EventCreateResponseDto {
    static fromModel(model: {id: string, message: string}): IPublic<EventCreateResponseDto> {
        return {
            id: model.id,
            message: model.message,            
        };
    }

    @ApiProperty({ description: 'Event unique identifier' })
    id: string;
   
    @ApiProperty({ description: 'Event unique identifier' })
    message: string;
}
