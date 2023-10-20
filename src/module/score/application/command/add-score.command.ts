import { ApplicationError, ICommandHandler } from "../../../../shared/abstract";
import { ScoreEntity, ScoreProps } from "../../domain/entity";
import { IScoreRepository } from "../../domain/repository";
import { StatusCodes } from "http-status-codes";

export interface AddScoreCommand {
    nama: string;
    score: string;
}

export class AddScoreCommandHandler
    implements ICommandHandler<AddScoreCommand, void>
{
    constructor(private readonly scoreRepository: IScoreRepository) {}

    async execute(command: AddScoreCommand): Promise<void> {
        try {
            const scoreData = new ScoreEntity<ScoreProps>(
                command as ScoreProps,
            );
            await this.scoreRepository.addScore(scoreData);
        } catch (error) {
            const appErr = error as ApplicationError;
            throw new ApplicationError(
                appErr.code ?? StatusCodes.INTERNAL_SERVER_ERROR,
                appErr.message ?? (error as Error).message,
            );
        }
    }
}
