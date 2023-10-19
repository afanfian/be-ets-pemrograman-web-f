import { Sequelize } from "sequelize";
import { IUserQueryHandler } from "../../../application/query";
import { StatusCodes } from "http-status-codes";
import { AggregateId, ApplicationError } from "../../../../../shared/abstract";
import { UserProps } from "../../../domain/entity";
import { logger } from "../../../../../shared/util";

export class UserQueryHandler implements IUserQueryHandler {
    constructor(private readonly dbConn: Sequelize) {}

    async getAllUsers(): Promise<UserProps[]> {
        try {
            const users = await this.dbConn.models["user"].findAll({
                attributes: { exclude: ["password"] },
            });
            return users.map((user): UserProps => {
                return user as UserProps;
            });
        } catch (error) {
            const appErr = error as ApplicationError;
            throw new ApplicationError(
                appErr.code ?? StatusCodes.INTERNAL_SERVER_ERROR,
                appErr.message ?? (error as Error).message,
            );
        }
    }

    async getUserById(userId: AggregateId): Promise<UserProps | null> {
        try {
            const user = await this.dbConn.models["user"].findByPk(userId, {
                attributes: { exclude: ["password"] },
            });
            if (!user) {
                logger.error("user is not registered");
                throw new ApplicationError(
                    StatusCodes.NOT_FOUND,
                    "user tidak terdaftar",
                );
            }
            return user as UserProps;
        } catch (error) {
            const appErr = error as ApplicationError;
            throw new ApplicationError(
                appErr.code ?? StatusCodes.INTERNAL_SERVER_ERROR,
                appErr.message ?? (error as Error).message,
            );
        }
    }

    async getUserByEmail(email: string): Promise<UserProps | null> {
        try {
            const user = await this.dbConn.models["user"].findOne({
                where: { email: email },
            });
            return (user as UserProps) ?? null;
        } catch (error) {
            const appErr = error as ApplicationError;
            throw new ApplicationError(
                appErr.code ?? StatusCodes.INTERNAL_SERVER_ERROR,
                appErr.message ?? (error as Error).message,
            );
        }
    }
}
