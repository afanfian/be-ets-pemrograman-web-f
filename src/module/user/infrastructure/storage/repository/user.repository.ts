import { Sequelize } from "sequelize";
import { UserEntity, UserProps } from "../../../domain/entity";
import { IUserRepository } from "../../../domain/repository";
import { StatusCodes } from "http-status-codes";
import { AggregateId, ApplicationError } from "../../../../../shared/abstract";

export class UserRepository implements IUserRepository {
    constructor(private readonly dbConn: Sequelize) {}

    async addUser(userData: UserEntity<UserProps>): Promise<void> {
        try {
            await this.dbConn.models["user"].create(userData as any);
        } catch (error) {
            const appErr = error as ApplicationError;
            throw new ApplicationError(
                appErr.code ?? StatusCodes.INTERNAL_SERVER_ERROR,
                appErr.message ?? (error as Error).message,
            );
        }
    }

    async updateUser(userData: UserEntity<UserProps>): Promise<void> {
        try {
            await this.dbConn.models["user"].update(userData, {
                where: { id: userData.id },
            });
        } catch (error) {
            const appErr = error as ApplicationError;
            throw new ApplicationError(
                appErr.code ?? StatusCodes.INTERNAL_SERVER_ERROR,
                appErr.message ?? (error as Error).message,
            );
        }
    }

    async updateUserLoginTime(
        userId: AggregateId,
        updateTime?: Date,
    ): Promise<void> {
        try {
            await this.dbConn.models["user"].update(
                { login_at: updateTime ?? null },
                { where: { id: userId } },
            );
        } catch (error) {
            const appErr = error as ApplicationError;
            throw new ApplicationError(
                appErr.code ?? StatusCodes.INTERNAL_SERVER_ERROR,
                appErr.message ?? (error as Error).message,
            );
        }
    }

    async deleteUser(userId: AggregateId): Promise<void> {
        try {
            await this.dbConn.models["user"].destroy({ where: { id: userId } });
        } catch (error) {
            const appErr = error as ApplicationError;
            throw new ApplicationError(
                appErr.code ?? StatusCodes.INTERNAL_SERVER_ERROR,
                appErr.message ?? (error as Error).message,
            );
        }
    }
}
