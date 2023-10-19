import {
    AggregateId,
    ApplicationError,
    ICommandHandler,
} from "../../../../shared/abstract";
import { IUserRepository } from "../../domain/repository";
import { StatusCodes } from "http-status-codes";

export interface LogoutCommand {
    id: AggregateId;
}

export class LogoutCommandHandler
    implements ICommandHandler<LogoutCommand, void>
{
    constructor(private readonly userRepository: IUserRepository) {}

    async execute(command: LogoutCommand): Promise<void> {
        const { id } = command;
        try {
            await this.userRepository.updateUserLoginTime(id);
        } catch (error) {
            const appErr = error as ApplicationError;
            throw new ApplicationError(
                appErr.code ?? StatusCodes.INTERNAL_SERVER_ERROR,
                appErr.message ?? (error as Error).message,
            );
        }
    }
}
