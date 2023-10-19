import { ApplicationError, ICommandHandler } from "../../../../shared/abstract";
import { UserEntity, UserProps } from "../../domain/entity";
import { IUserRepository } from "../../domain/repository";
import { IPasswordService } from "../../domain/service";
import { StatusCodes } from "http-status-codes";

export interface AddUserCommand {
    nama: string;
    email: string;
    password: string;
}

export class AddUserCommandHandler
    implements ICommandHandler<AddUserCommand, void>
{
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly passwordService: IPasswordService,
    ) {}

    async execute(command: AddUserCommand): Promise<void> {
        try {
            const newUserData = new UserEntity<UserProps>(command as UserProps);
            await newUserData.setHashedPassword(this.passwordService);
            await this.userRepository.addUser(newUserData);
        } catch (error) {
            const appErr = error as ApplicationError;
            throw new ApplicationError(
                appErr.code ?? StatusCodes.INTERNAL_SERVER_ERROR,
                appErr.message ?? (error as Error).message,
            );
        }
    }
}
