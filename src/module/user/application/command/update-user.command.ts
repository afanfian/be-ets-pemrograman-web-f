import {
    AggregateId,
    ApplicationError,
    ICommandHandler,
} from "../../../../shared/abstract";
import { UserEntity, UserProps } from "../../domain/entity";
import { IUserRepository } from "../../domain/repository";
import { IPasswordService } from "../../domain/service";
import { StatusCodes } from "http-status-codes";

export interface UpdateUserCommand {
    id: AggregateId;
    nama?: string;
    email?: string;
    password?: string;
}

export class UpdateUserCommandHandler
    implements ICommandHandler<UpdateUserCommand, void>
{
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly passwordService: IPasswordService,
    ) {}

    async execute(command: UpdateUserCommand): Promise<void> {
        try {
            const userData = new UserEntity<UserProps>(command as UserProps);
            if (userData.getPassword() !== undefined) {
                userData.setHashedPassword(this.passwordService);
            }
            await this.userRepository.updateUser(userData);
        } catch (error) {
            const appErr = error as ApplicationError;
            throw new ApplicationError(
                appErr.code ?? StatusCodes.INTERNAL_SERVER_ERROR,
                appErr.message ?? (error as Error).message,
            );
        }
    }
}
