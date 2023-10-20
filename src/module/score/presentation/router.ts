import express, { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { Sequelize } from "sequelize";
import { ScoreModel } from "../domain/entity";
import { ScoreRepository } from "../infrastructure/storage/repository";
import { ScoreQueryHandler } from "../infrastructure/storage/query";
import { ScoreController } from "./controller";
import { middlewareAuthentication } from "../../../shared/middleware";

export const setScoreRoutes = (dbConn: Sequelize): void => {
    dbConn.models["score"] = ScoreModel;
    const scoreRepository = new ScoreRepository(dbConn);
    const scoreQuery = new ScoreQueryHandler(dbConn);
    const scoreController = new ScoreController(scoreRepository, scoreQuery);
    const scoreRouter = express.Router();

    scoreRouter.post(
        "/score",
        expressAsyncHandler(scoreController.addScore.bind(scoreController)),
    );

    scoreRouter.get(
        "/score",
        expressAsyncHandler(scoreController.viewAllScore.bind(scoreController)),
    );

    scoreRouter.put(
        ":id",
        expressAsyncHandler(scoreController.updateScore.bind(scoreController)),
    );

    scoreRouter.delete(
        ":id",
        expressAsyncHandler(scoreController.deleteScore.bind(scoreController)),
    );
};
