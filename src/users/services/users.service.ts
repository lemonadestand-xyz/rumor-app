import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { UsersRepository } from "../../common/database/users/repositories/user.repository";
import { UserReadModel } from "../models/user-read.model";
import { Logger } from "nestjs-pino";

@Injectable()
export class UsersService {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly logger: Logger,
    ) { }

    async getUserById(userId: string): Promise<UserReadModel> {
        try {
            const user = await this.usersRepository.getById(userId);

            if (!user) {
                throw new NotFoundException(`User with ID ${userId} not found`);
            }
            return UserReadModel.fromEntity(user);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('User fetching failed', {
                cause: new Error(`Error verifying user: ${error?.message}`),
            });
        }
    }

    async update(
        userId: string,
        payload: Partial<{ isProfileCreated: boolean }>,
    ): Promise<{ id: string; message: string }> {
        try {
            const user = await this.usersRepository.getById(userId);
            if (!user) {
                throw new NotFoundException(`User with ID ${userId} not found`);
            }
            await this.usersRepository.update(userId, payload);
            return { id: userId, message: 'User updated successfully' };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('User update failed', {
                cause: new Error(`Error updating user: ${error?.message}`),
            });
        }
    }
}