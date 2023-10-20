import {
    AggregateId,
    ApplicationError,
    ICommandHandler,
} from "../../../../shared/abstract";
import { ScoreEntity, ScoreProps } from "../../domain/entity";
import { IScoreRepository } from "../../domain/repository";
import { StatusCodes } from "http-status-codes";

export interface UpdateScoreCommand {
    id: AggregateId;
    nama?: string;
    score?: number;
}

export class UpdateScoreCommandHandler
    implements ICommandHandler<UpdateScoreCommand, void>
{
    constructor(private readonly scoreRepository: IScoreRepository) {}

    async execute(command: UpdateScoreCommand): Promise<void> {
        try {
            const scoreData = new ScoreEntity<ScoreProps>(
                command as ScoreProps,
            );
            await this.scoreRepository.updateScore(scoreData);
        } catch (error) {
            const appErr = error as ApplicationError;
            throw new ApplicationError(
                appErr.code ?? StatusCodes.INTERNAL_SERVER_ERROR,
                appErr.message ?? (error as Error).message,
            );
        }
    }
}
