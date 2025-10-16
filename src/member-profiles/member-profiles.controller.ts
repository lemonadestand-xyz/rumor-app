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
import { MemberProfilesService } from './member-profiles.service';
import { CreateMemberProfileDto } from './dto/create-member-profile.dto';
import { UpdateMemberProfileDto } from './dto/update-member-profile.dto';
import { QueryMemberProfileDto } from './dto/query-member-profile.dto';
import { MemberProfile } from './domain/member-profile';
import { AuthGuard } from '@nestjs/passport';
import { infinityPagination } from '../utils/infinity-pagination';

@ApiTags('Member Profiles')
@Controller({
  path: 'member-profiles',
  version: '1',
})
export class MemberProfilesController {
  constructor(private readonly memberProfilesService: MemberProfilesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create member profile' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Member profile created successfully',
    type: MemberProfile,
  })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createMemberProfileDto: CreateMemberProfileDto,
    @Request() req,
  ): Promise<MemberProfile> {
    const profileData = {
      ...createMemberProfileDto,
      user: { id: req.user.id },
    };
    return this.memberProfilesService.create(profileData);
  }

  @Get()
  @ApiOperation({ summary: 'Get all member profiles' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of member profiles',
  })
  async findAll(@Query() query: QueryMemberProfileDto) {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 10;

    return infinityPagination(
      await this.memberProfilesService.findAll({
        page,
        limit,
      }),
      { page, limit },
    );
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get member profile by user ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Member profile details',
    type: MemberProfile,
  })
  findByUserId(@Param('userId') userId: string): Promise<MemberProfile | null> {
    return this.memberProfilesService.findByUserId(+userId);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my member profile' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Member profile details',
    type: MemberProfile,
  })
  findMyProfile(@Request() req): Promise<MemberProfile | null> {
    return this.memberProfilesService.findByUserId(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get member profile by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Member profile details',
    type: MemberProfile,
  })
  findOne(@Param('id') id: string): Promise<MemberProfile> {
    return this.memberProfilesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update member profile' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Member profile updated successfully',
    type: MemberProfile,
  })
  update(
    @Param('id') id: string,
    @Body() updateMemberProfileDto: UpdateMemberProfileDto,
  ): Promise<MemberProfile> {
    return this.memberProfilesService.update(id, updateMemberProfileDto);
  }

  @Patch(':id/approve')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Approve member from waitlist' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Member approved successfully',
    type: MemberProfile,
  })
  approve(@Param('id') id: string, @Request() req): Promise<MemberProfile> {
    return this.memberProfilesService.approveMember(id, req.user.id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete member profile' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Member profile deleted successfully',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.memberProfilesService.remove(id);
  }
}
