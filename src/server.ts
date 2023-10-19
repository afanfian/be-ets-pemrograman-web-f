import express, { Express, Router, Request, Response } from "express";
import { PostgresDatabase, appConfig, seedDatabase } from "./config";
import cors from "cors";
import helmet from "helmet";
import { Server } from "http";
import {
    buildResponseError,
    buildResponseSuccess,
    logger,
} from "./shared/util";
import { setUserRoutes } from "./module/user/presentation/router";

export class AppServer {
    app: Express;
    port: number;
    pgDatabase: PostgresDatabase;

    constructor() {
        this.app = express();
        this.port = appConfig.get("/serverPort");
        this.pgDatabase = new PostgresDatabase();

        // set middlewares for app
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cors());
        this.app.use(helmet());

        // set application routes
        this.app.use("/users", setUserRoutes(this.pgDatabase.dbConn));

        this.app.get("/health-check", (req: Request, res: Response) => {
            buildResponseSuccess(res, 200, "welcome to PIKTIFIN");
        });

        this.app.all("*", (req: Request, res: Response) => {
            buildResponseError(res, 404, "route tidak ditemukan");
        });

        this.pgDatabase.dbConn
            .sync({ alter: true })
            .then(() => {
                seedDatabase(this.pgDatabase.dbConn);
            })
            .catch((error) => {
                logger.error(`unable to sync database: ${error}`);
            });
    }

    gracefulShutdown(server: Server) {
        server.close(() => {
            (async () => {
                this.pgDatabase.disconnect();
                logger.info("server is closed");
                process.exit(0);
            })();
        });
    }
}
