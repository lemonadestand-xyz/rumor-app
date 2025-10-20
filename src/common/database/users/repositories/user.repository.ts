import {
  Inject,
  Injectable,
  InternalServerErrorException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { BaseRepository, IQueryOptions } from '../../base.repository';
import { DATABASE_CONNECTION } from '../../database.consts';
import { DataSource } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import bcrypt from 'bcryptjs';
import { SignUpDataCreateModel } from 'src/auth/models/signup-create.model';

@Injectable()
export class UsersRepository extends BaseRepository {
  constructor(
    @Inject(DATABASE_CONNECTION) dataSource: DataSource,
    // private readonly uploadStorageService: UploadStorageService,
  ) {
    super(dataSource);
  }

  async findByEmail(
    email: string,
    options?: IQueryOptions,
  ): Promise<UserEntity | null> {
    const { entityManager } = this.parseOptions(options);
    const repository = entityManager?.getRepository<UserEntity>(UserEntity);
    if (!email) return null;
    const user = await repository?.findOne({ where: { email } });
    return user ?? null;
  }

  private async _getById(
    id: string,
    options?: IQueryOptions,
  ): Promise<UserEntity | null> {
    const { entityManager } = this.parseOptions(options);
    const repository = entityManager?.getRepository<UserEntity>(UserEntity);

    if (!id) {
      throw new InternalServerErrorException('User ID is required');
    }
    const user = await repository?.findOne({
      where: { id },
    });
    return user ?? null;
  }

  private ensurePassword(data: SignUpDataCreateModel): string {
    // If you later add a password field to DTO/model, prefer it; otherwise generate one
    const length = 12;
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    const specials = '!@#$%^&*()-_=+[]{};:,.<>/?';

    const pick = (chars: string) =>
      chars[Math.floor(Math.random() * chars.length)];

    const mandatory = [pick(lower), pick(upper), pick(nums), pick(specials)];
    const all = lower + upper + nums + specials;
    const remaining = Array.from({ length: length - mandatory.length }, () =>
      pick(all),
    );
    const combined = [...mandatory, ...remaining];
    // shuffle
    for (let i = combined.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [combined[i], combined[j]] = [combined[j], combined[i]];
    }
    return combined.join('');
  }

  async getById(
    id: string,
    options?: IQueryOptions,
  ): Promise<UserEntity | null> {
    const user = await this._getById(id, options);
    return user ?? null;
  }

  async create(
    data: SignUpDataCreateModel,
    options?: IQueryOptions,
  ): Promise<UserEntity> {
    const { entityManager } = this.parseOptions(options);
    if (!entityManager) {
      throw new InternalServerErrorException('Entity manager not available');
    }
    const repository = entityManager.getRepository(UserEntity);

    if (data.email) {
      const existingByEmail = await repository.findOne({
        where: { email: data.email },
      });
      if (existingByEmail) {
        throw new ConflictException('Account with this email already exists');
      }
    }

    if (data.phoneNumber) {
      const existingByPhone = await repository.findOne({
        where: { phoneNumber: data.phoneNumber },
      });
      if (existingByPhone) {
        throw new ConflictException(
          'Account with this phone number already exists',
        );
      }
    }

    // Generate strong random password if not provided
    const plainPassword = this.ensurePassword(data);
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(plainPassword, salt);

    const entity = repository.create({
      firstName: data.firstName,
      lastName: data.lastName,
      companyName: data.companyName,
      email: data.email ?? undefined,
      phoneNumber: data.phoneNumber ?? undefined,
      callingCode: data.callingCode ?? undefined,
      countryCode: data.countryCode ?? undefined,
      eventsPerYear: data.eventsPerYear,
      website: data.website ?? undefined,
      referredBy: data.referredBy ?? undefined,
      verificationLinkGeneratedAt: new Date(),
      passwordHash,
      // roles, status use entity defaults
    });

    return repository.save(entity);
  }

  async update(
    id: string,
    updates: Partial<UserEntity>,
    options?: IQueryOptions,
  ): Promise<UserEntity> {
    const { entityManager } = this.parseOptions(options);
    if (!entityManager)
      throw new InternalServerErrorException('Entity manager not available');
    const repository = entityManager.getRepository(UserEntity);

    const user = await repository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    // Merge updates
    Object.assign(user, updates);

    try {
      const savedUser = await repository.save(user);
      return savedUser;
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to update user: ${error?.message || 'Unknown error'}`,
      );
    }
  }

  async getByEmail(
    email: string,
    options?: IQueryOptions,
  ): Promise<UserEntity> {
    const user = await this.findByEmail(email, options);
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }
}
