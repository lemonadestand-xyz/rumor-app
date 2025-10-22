import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../database.consts';
import { BaseRepository, IQueryOptions } from '../../base.repository';
import { DataSource } from 'typeorm';
import { UserProfileCreateModel } from '../../../../user-profile/models/user-profile-create.model';
import { UserProfileEntity } from '../entities/user-profile.entity';

@Injectable()
export class UserProfileRepository extends BaseRepository {
  constructor(
    @Inject(DATABASE_CONNECTION) dataSource: DataSource,
  ) {
    super(dataSource);
  }

  async create(
    model: UserProfileCreateModel,
    options?: IQueryOptions,
  ): Promise<{ id: string; message: string }> {
    const { entityManager } = this.parseOptions(options);
    if (!entityManager) {
      throw new InternalServerErrorException('Entity manager not available');
    }

    const repository = entityManager.getRepository(UserProfileEntity);

    const entity = repository.create({
      instagramLink: model.instagramLink,
      tiktokLink: model.tiktokLink,
      linkedinLink: model.linkedinLink,
      youtubeLink: model.youtubeLink,
      facebookLink: model.facebookLink,
      xLink: model.xLink,
      bio: model.bio,
      photoId: model.photoId,
      userId: model.userId,
    });

    const result = await repository.save(entity);

    return {
      id: result.id,
      message: 'User profile created successfully',
    };
  }
}
