import { Request, Response } from "express";
import {
    buildResponseError,
    buildResponseSuccess,
    logger,
    validate,
} from "../../../../shared/util";
import {
    loginMapper,
    addUserMapper,
    logoutMapper,
    updateUserMapper,
    deleteUserMapper,
    getUserProfileMapper,
} from "../mapper";
import { IUserRepository } from "../../domain/repository";
import {
    AddUserCommand,
    AddUserCommandHandler,
    DeleteUserCommand,
    DeleteUserCommandHandler,
    LoginCommand,
    LoginCommandHandler,
    LogoutCommand,
    LogoutCommandHandler,
    UpdateUserCommand,
    UpdateUserCommandHandler,
} from "../../application/command";
import { IUserQueryHandler } from "../../application/query";
import { ApplicationError, DefaultMessage } from "../../../../shared/abstract";
import { StatusCodes } from "http-status-codes";
import { appConfig } from "../../../../config";
import { IPasswordService } from "../../domain/service";
import { PasswordService, TokenService } from "../../infrastructure/service";
import { ITokenService } from "../../application/service";

export class UserController {
    private readonly passwordService: IPasswordService;
    private readonly tokenService: ITokenService;

    constructor(
        private readonly userRepository: IUserRepository,
        private readonly userQueryHandler: IUserQueryHandler,
    ) {
        this.passwordService = new PasswordService();
        this.tokenService = new TokenService();
    }

    async login(req: Request, res: Response): Promise<void> {
        const { body } = req;
        try {
            const validData = validate(body, loginMapper) as LoginCommand;
            const user = await this.userQueryHandler.getUserByEmail(
                validData.email,
            );
            if (!user) {
                logger.error("email is not registered");
                throw new ApplicationError(
                    StatusCodes.NOT_FOUND,
                    "email tidak terdaftar",
                );
            }
            validData.user = user;
            const loginHandler = new LoginCommandHandler(
                this.userRepository,
                this.passwordService,
                this.tokenService,
            );
            const accessToken = await loginHandler.execute(validData);
            res.cookie("access_token", accessToken, {
                expires: new Date(Date.now() + 4 * 3600 * 1000),
                maxAge: 4 * 3600 * 1000,
                httpOnly: true,
                secure: appConfig.get("/appEnv") === "production",
                sameSite: "lax",
            });
            logger.info("user has been successfully logged in");
            buildResponseSuccess(res, StatusCodes.OK, "user berhasil login", {
                access_token: accessToken,
            });
        } catch (error) {
            logger.error("user failed to login");
            const appErr = error as ApplicationError;
            buildResponseError(res, appErr.code, appErr.message);
        }
    }

    async logout(req: Request, res: Response): Promise<void> {
        const id = res.locals.id_user;
        try {
            const validData = validate({ id }, logoutMapper) as LogoutCommand;
            const logoutHandler = new LogoutCommandHandler(this.userRepository);
            await logoutHandler.execute(validData);
            res.clearCookie("access_token");
            logger.info("user has been successfully logged out");
            buildResponseSuccess(res, StatusCodes.OK, "user berhasil logout");
        } catch (error) {
            logger.error("user failed to log out");
            const appErr = error as ApplicationError;
            buildResponseError(res, appErr.code, appErr.message);
        }
    }

    async viewUserProfile(req: Request, res: Response): Promise<void> {
        const id = res.locals.id_user;
        try {
            const validData = validate({ id }, getUserProfileMapper) as {
                id: string;
            };
            const user = await this.userQueryHandler.getUserById(validData.id);
            logger.info("user data has been successfully retrieved");
            buildResponseSuccess(
                res,
                StatusCodes.OK,
                DefaultMessage.SUC_GET,
                user,
            );
        } catch (error) {
            logger.error("failed to get user profile data");
            const appErr = error as ApplicationError;
            buildResponseError(res, appErr.code, appErr.message);
        }
    }

    async registerUser(req: Request, res: Response): Promise<void> {
        const { body } = req;
        try {
            const validData = validate(body, addUserMapper) as AddUserCommand;
            if (await this.userQueryHandler.getUserByEmail(validData.email)) {
                logger.error("email has been registered");
                throw new ApplicationError(
                    StatusCodes.BAD_REQUEST,
                    "email telah terdaftar",
                );
            }
            const addUserHandler = new AddUserCommandHandler(
                this.userRepository,
                this.passwordService,
            );
            await addUserHandler.execute(validData);
            logger.info("user data has been successfully added");
            buildResponseSuccess(
                res,
                StatusCodes.CREATED,
                DefaultMessage.SUC_ADD,
            );
        } catch (error) {
            logger.error("failed to add new user data");
            const appErr = error as ApplicationError;
            buildResponseError(res, appErr.code, appErr.message);
        }
    }

    async viewAllUsers(req: Request, res: Response): Promise<void> {
        try {
            const users = await this.userQueryHandler.getAllUsers();
            logger.info("all user data has been successfully retrieved");
            buildResponseSuccess(
                res,
                StatusCodes.OK,
                DefaultMessage.SUC_AGET,
                users,
            );
        } catch (error) {
            logger.error("failed to get all user data");
            const appErr = error as ApplicationError;
            buildResponseError(res, appErr.code, appErr.message);
        }
    }

    async updateUser(req: Request, res: Response): Promise<void> {
        const { body } = req;
        body["id"] = req.params.id;
        try {
            const validData = validate(
                body,
                updateUserMapper,
            ) as UpdateUserCommand;
            await this.userQueryHandler.getUserById(validData.id);
            const updateUserHandler = new UpdateUserCommandHandler(
                this.userRepository,
                this.passwordService,
            );
            await updateUserHandler.execute(validData);
            logger.info("user data has been successfully updated");
            buildResponseSuccess(
                res,
                StatusCodes.CREATED,
                DefaultMessage.SUC_UPDT,
            );
        } catch (error) {
            logger.error("failed to update user data");
            const appErr = error as ApplicationError;
            buildResponseError(res, appErr.code, appErr.message);
        }
    }

    async deleteUser(req: Request, res: Response): Promise<void> {
        const selfId = res.locals.id_user;
        const id = req.params.id;
        try {
            const validData = validate(
                { id },
                deleteUserMapper,
            ) as DeleteUserCommand;
            const user = await this.userQueryHandler.getUserById(validData.id);
            if (validData.id == selfId) {
                logger.error(
                    "users cannot delete their own data or manager data",
                );
                throw new ApplicationError(
                    StatusCodes.FORBIDDEN,
                    "user tidak dapat menghapus data sendiri atau data manajer",
                );
            }
            const deleteUserHandler = new DeleteUserCommandHandler(
                this.userRepository,
            );
            await deleteUserHandler.execute(validData);
            logger.info("user data has been successfully removed");
            buildResponseSuccess(res, StatusCodes.OK, DefaultMessage.SUC_DEL);
        } catch (error) {
            logger.error("failed to delete user data");
            const appErr = error as ApplicationError;
            buildResponseError(res, appErr.code, appErr.message);
        }
    }
}
