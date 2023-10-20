import { Sequelize } from "sequelize";
import { ScoreEntity, ScoreProps } from "../../../domain/entity";
import { IScoreRepository } from "../../../domain/repository";
import { StatusCodes } from "http-status-codes";
import { AggregateId, ApplicationError } from "../../../../../shared/abstract";

export class ScoreRepository implements IScoreRepository {
    constructor(private readonly dbConn: Sequelize) {}

    async addScore(scoreData: ScoreEntity<ScoreProps>): Promise<void> {
        try {
            await this.dbConn.models["score"].create(scoreData as any);
        } catch (error) {
            const appErr = error as ApplicationError;
            throw new ApplicationError(
                appErr.code ?? StatusCodes.INTERNAL_SERVER_ERROR,
                appErr.message ?? (error as Error).message,
            );
        }
    }

    async updateScore(scoreData: ScoreEntity<ScoreProps>): Promise<void> {
        try {
            await this.dbConn.models["score"].update(scoreData, {
                where: { id: scoreData.id },
            });
        } catch (error) {
            const appErr = error as ApplicationError;
            throw new ApplicationError(
                appErr.code ?? StatusCodes.INTERNAL_SERVER_ERROR,
                appErr.message ?? (error as Error).message,
            );
        }
    }

    async updateScoreLoginTime(
        scoreId: AggregateId,
        updateTime?: Date | undefined,
    ): Promise<void> {
        try {
            await this.dbConn.models["score"].update(
                { login_at: updateTime ?? null },
                { where: { id: scoreId } },
            );
        } catch (error) {
            const appErr = error as ApplicationError;
            throw new ApplicationError(
                appErr.code ?? StatusCodes.INTERNAL_SERVER_ERROR,
                appErr.message ?? (error as Error).message,
            );
        }
    }

    async deleteScore(scoreId: AggregateId): Promise<void> {
        try {
            await this.dbConn.models["score"].destroy({
                where: { id: scoreId },
            });
        } catch (error) {
            const appErr = error as ApplicationError;
            throw new ApplicationError(
                appErr.code ?? StatusCodes.INTERNAL_SERVER_ERROR,
                appErr.message ?? (error as Error).message,
            );
        }
    }
}
