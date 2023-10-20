import {
    AggregateId,
    ApplicationError,
    ICommandHandler,
} from "../../../../shared/abstract";
import { IScoreRepository } from "../../domain/repository";
import { StatusCodes } from "http-status-codes";

export interface DeleteScoreCommand {
    id: AggregateId;
}

export class DeleteScoreCommandHandler
    implements ICommandHandler<DeleteScoreCommand, void>
{
    constructor(private readonly scoreRepository: IScoreRepository) {}
    async execute(command: DeleteScoreCommand): Promise<void> {
        const { id } = command;
        try {
            await this.scoreRepository.deleteScore(id);
        } catch (error) {
            const appErr = error as ApplicationError;
            throw new ApplicationError(
                appErr.code ?? StatusCodes.INTERNAL_SERVER_ERROR,
                appErr.message ?? (error as Error).message,
            );
        }
    }
}
