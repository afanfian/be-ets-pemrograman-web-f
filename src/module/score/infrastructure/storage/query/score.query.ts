import { Sequelize } from "sequelize";
import { IScoreQueryHandler } from "../../../application/query";
import { StatusCodes } from "http-status-codes";
import { AggregateId, ApplicationError } from "../../../../../shared/abstract";
import { ScoreProps } from "../../../domain/entity";
import { logger } from "../../../../../shared/util";

export class ScoreQueryHandler implements IScoreQueryHandler {
    constructor(private readonly dbConn: Sequelize) {}

    async getAllScores(): Promise<ScoreProps[]> {
        try {
            const scores = await this.dbConn.models["score"].findAll({
                attributes: { exclude: ["password"] },
            });
            return scores.map((score): ScoreProps => {
                return score as ScoreProps;
            });
        } catch (error) {
            const appErr = error as ApplicationError;
            throw new ApplicationError(
                appErr.code ?? StatusCodes.INTERNAL_SERVER_ERROR,
                appErr.message ?? (error as Error).message,
            );
        }
    }

    async getScoreById(scoreId: AggregateId): Promise<ScoreProps | null> {
        try {
            const score = await this.dbConn.models["score"].findByPk(scoreId, {
                attributes: { exclude: ["password"] },
            });
            if (!score) {
                logger.error("score is not registered");
                throw new ApplicationError(
                    StatusCodes.NOT_FOUND,
                    "score tidak terdaftar",
                );
            }
            return score as ScoreProps;
        } catch (error) {
            const appErr = error as ApplicationError;
            throw new ApplicationError(
                appErr.code ?? StatusCodes.INTERNAL_SERVER_ERROR,
                appErr.message ?? (error as Error).message,
            );
        }
    }

    async getScoreByNama(nama: string): Promise<ScoreProps | null> {
        try {
            const score = await this.dbConn.models["score"].findOne({
                where: { nama: nama },
            });
            return (score as ScoreProps) ?? null;
        } catch (error) {
            const appErr = error as ApplicationError;
            throw new ApplicationError(
                appErr.code ?? StatusCodes.INTERNAL_SERVER_ERROR,
                appErr.message ?? (error as Error).message,
            );
        }
    }
}
