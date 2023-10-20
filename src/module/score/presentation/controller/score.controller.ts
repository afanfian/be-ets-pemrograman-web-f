import { Request, Response } from "express";
import {
    buildResponseError,
    buildResponseSuccess,
    logger,
    validate,
} from "../../../../shared/util";
import {
    AddScoreMapper,
    UpdateScoreMapper,
    DeleteScoreMapper,
} from "../mapper";
import { IScoreRepository } from "../../domain/repository";
import {
    AddScoreCommand,
    AddScoreCommandHandler,
    DeleteScoreCommand,
    DeleteScoreCommandHandler,
    UpdateScoreCommand,
    UpdateScoreCommandHandler,
} from "../../application/command";
import { IScoreQueryHandler } from "../../application/query";
import { ApplicationError, DefaultMessage } from "../../../../shared/abstract";
import { StatusCodes } from "http-status-codes";

export class ScoreController {
    constructor(
        private readonly scoreRepository: IScoreRepository,
        private readonly scoreQueryHandler: IScoreQueryHandler,
    ) {}

    async addScore(req: Request, res: Response): Promise<void> {
        const { body } = req;
        try {
            const validData = validate(body, AddScoreMapper) as AddScoreCommand;
            const score = await this.scoreQueryHandler.getScoreByNama(
                validData.nama,
            );
            if (score) {
                logger.error("Nama is already exist");
                throw new ApplicationError(
                    StatusCodes.CONFLICT,
                    "Nama sudah terdaftar",
                );
            }
            const addScoreCommandHandler = new AddScoreCommandHandler(
                this.scoreRepository,
            );
            const result = await addScoreCommandHandler.execute(validData);
            buildResponseSuccess(
                res,
                StatusCodes.CREATED,
                DefaultMessage.SUC_ADD,
            );
        } catch (error) {
            logger.error("Gagal menambahkan score");
            const appErr = error as ApplicationError;
            buildResponseError(res, appErr.code, appErr.message);
        }
    }

    async viewAllScore(req: Request, res: Response): Promise<void> {
        try {
            const scores = await this.scoreQueryHandler.getAllScores();
            logger.info("Berhasil menampilkan semua score");
            buildResponseSuccess(
                res,
                StatusCodes.OK,
                DefaultMessage.SUC_AGET,
                scores,
            );
        } catch (error) {
            logger.error("Gagal menampilkan semua score");
            const appErr = error as ApplicationError;
            buildResponseError(res, appErr.code, appErr.message);
        }
    }

    async updateScore(req: Request, res: Response): Promise<void> {
        const { body } = req;
        body["id"] = req.params.id;
        try {
            const validData = validate(
                body,
                UpdateScoreMapper,
            ) as UpdateScoreCommand;
            await this.scoreQueryHandler.getScoreById(validData.id);
            const updateScoreCommandHandler = new UpdateScoreCommandHandler(
                this.scoreRepository,
            );
            await updateScoreCommandHandler.execute(validData);
            logger.info("Berhasil mengupdate score");
            buildResponseSuccess(
                res,
                StatusCodes.CREATED,
                DefaultMessage.SUC_UPDT,
            );
        } catch (error) {
            logger.error("Gagal mengupdate score");
            const appErr = error as ApplicationError;
            buildResponseError(res, appErr.code, appErr.message);
        }
    }

    async deleteScore(req: Request, res: Response): Promise<void> {
        const selfId = res.locals.id_score;
        const id = req.params.id;
        try {
            const validData = validate(
                { id },
                DeleteScoreMapper,
            ) as DeleteScoreCommand;
            await this.scoreQueryHandler.getScoreById(validData.id);
            const deleteScoreCommandHandler = new DeleteScoreCommandHandler(
                this.scoreRepository,
            );
            await deleteScoreCommandHandler.execute(validData);
            logger.info("Berhasil menghapus score");
            buildResponseSuccess(
                res,
                StatusCodes.CREATED,
                DefaultMessage.SUC_DEL,
            );
        } catch (error) {
            logger.error("Gagal menghapus score");
            const appErr = error as ApplicationError;
            buildResponseError(res, appErr.code, appErr.message);
        }
    }
}
