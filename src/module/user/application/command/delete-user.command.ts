import { AggregateId, ApplicationError, ICommandHandler } from "../../../../shared/abstract";
import { IUserRepository } from "../../domain/repository";
import { StatusCodes } from "http-status-codes";

export interface DeleteUserCommand {
    id: AggregateId;
}

export class DeleteUserCommandHandler
    implements ICommandHandler<DeleteUserCommand, void>
{
    constructor(private readonly userRepository: IUserRepository) {}

    async execute(command: DeleteUserCommand): Promise<void> {
        const { id } = command;
        try {
            await this.userRepository.deleteUser(id);
        } catch (error) {
            const appErr = error as ApplicationError;
            throw new ApplicationError(
                appErr.code ?? StatusCodes.INTERNAL_SERVER_ERROR,
                appErr.message ?? (error as Error).message,
            );
        }
    }
}
