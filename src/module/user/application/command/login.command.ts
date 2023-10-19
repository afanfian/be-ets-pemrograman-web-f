import { ApplicationError, ICommandHandler } from "../../../../shared/abstract";
import { logger } from "../../../../shared/util";
import { UserEntity, UserProps } from "../../domain/entity";
import { IUserRepository } from "../../domain/repository";
import { IPasswordService } from "../../domain/service";
import { StatusCodes } from "http-status-codes";
import { ITokenService } from "../service";

export interface LoginCommand {
    email: string;
    password: string;
    user: UserProps;
}

export class LoginCommandHandler
    implements ICommandHandler<LoginCommand, string>
{
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly passwordService: IPasswordService,
        private readonly tokenService: ITokenService,
    ) {}

    async execute(command: LoginCommand): Promise<string> {
        const { password, user } = command;
        try {
            const userData = new UserEntity<UserProps>(user);
            if (
                !(await userData.matchPassword(this.passwordService, password))
            ) {
                logger.error("wrong password input");
                throw new ApplicationError(
                    StatusCodes.BAD_REQUEST,
                    "input password salah",
                );
            }
            await this.userRepository.updateUserLoginTime(
                userData.id,
                new Date(),
            );
            const token = await this.tokenService.generateToken(
                userData.id,
                userData.getNama()!,
            );
            return token;
        } catch (error) {
            const appErr = error as ApplicationError;
            throw new ApplicationError(
                appErr.code ?? StatusCodes.INTERNAL_SERVER_ERROR,
                appErr.message ?? (error as Error).message,
            );
        }
    }
}
