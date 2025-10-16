import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  HttpCode,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { HostProfilesService } from './host-profiles.service';
import { CreateHostProfileDto } from './dto/create-host-profile.dto';
import { UpdateHostProfileDto } from './dto/update-host-profile.dto';
import { QueryHostProfileDto } from './dto/query-host-profile.dto';
import { HostProfile, HostTier } from './domain/host-profile';
import { AuthGuard } from '@nestjs/passport';
import { infinityPagination } from '../utils/infinity-pagination';

@ApiTags('Host Profiles')
@Controller({
  path: 'host-profiles',
  version: '1',
})
export class HostProfilesController {
  constructor(private readonly hostProfilesService: HostProfilesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create host profile' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Host profile created successfully',
    type: HostProfile,
  })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createHostProfileDto: CreateHostProfileDto,
    @Request() req,
  ): Promise<HostProfile> {
    return this.hostProfilesService.create({
      ...createHostProfileDto,
      user: { id: req.user.id },
    } as any);
  }

  @Get()
  @ApiOperation({ summary: 'Get all host profiles' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of host profiles',
  })
  async findAll(@Query() query: QueryHostProfileDto) {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 10;

    return infinityPagination(
      await this.hostProfilesService.findAll({
        page,
        limit,
      }),
      { page, limit },
    );
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get host profile by user ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Host profile details',
    type: HostProfile,
  })
  findByUser(@Param('userId') userId: string): Promise<HostProfile | null> {
    return this.hostProfilesService.findByUserId(+userId);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my host profile' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Current user host profile',
    type: HostProfile,
  })
  findMyProfile(@Request() req): Promise<HostProfile | null> {
    return this.hostProfilesService.findByUserId(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get host profile by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Host profile details',
    type: HostProfile,
  })
  findOne(@Param('id') id: string): Promise<HostProfile> {
    return this.hostProfilesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update host profile' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Host profile updated successfully',
    type: HostProfile,
  })
  update(
    @Param('id') id: string,
    @Body() updateHostProfileDto: UpdateHostProfileDto,
  ): Promise<HostProfile> {
    return this.hostProfilesService.update(id, updateHostProfileDto);
  }

  @Patch(':id/tier')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update host tier' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Host tier updated successfully',
    type: HostProfile,
  })
  updateTier(
    @Param('id') id: string,
    @Body('tier') tier: HostTier,
  ): Promise<HostProfile> {
    return this.hostProfilesService.updateTier(id, tier);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete host profile' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Host profile deleted successfully',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.hostProfilesService.remove(id);
  }
}
