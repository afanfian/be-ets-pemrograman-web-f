import express, { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { Sequelize } from "sequelize";
import { UserModel } from "../domain/entity";
import { UserRepository } from "../infrastructure/storage/repository";
import { UserQueryHandler } from "../infrastructure/storage/query";
import { UserController } from "./controller";
import { middlewareAuthentication } from "../../../shared/middleware";

export const setUserRoutes = (dbConn: Sequelize): Router => {
    dbConn.models["user"] = UserModel;
    const userRepository = new UserRepository(dbConn);
    const userQuery = new UserQueryHandler(dbConn);
    const userController = new UserController(userRepository, userQuery);
    const userRouter = express.Router();

    userRouter.post(
        "/login",
        expressAsyncHandler(userController.login.bind(userController)),
    );

    userRouter.post(
        "/register",
        expressAsyncHandler(userController.registerUser.bind(userController)),
    );

    userRouter.use(middlewareAuthentication);

    userRouter.post(
        "/logout",
        expressAsyncHandler(userController.logout.bind(userController)),
    );

    userRouter.get(
        "/profile",
        expressAsyncHandler(
            userController.viewUserProfile.bind(userController),
        ),
    );

    userRouter.get(
        "",
        expressAsyncHandler(userController.viewAllUsers.bind(userController)),
    );

    userRouter.put(
        "/:id",
        expressAsyncHandler(userController.updateUser.bind(userController)),
    );

    userRouter.delete(
        "/:id",
        expressAsyncHandler(userController.deleteUser.bind(userController)),
    );

    return userRouter;
};
