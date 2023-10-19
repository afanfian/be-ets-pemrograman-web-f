import { Sequelize } from "sequelize";
import { appConfig } from ".";
import { logger } from "../shared/util";
const dbConfig = appConfig.get("/pgDatabase");

export class PostgresDatabase {
    private dbUri: string;
    dbConn: Sequelize;

    constructor() {
        this.dbUri = dbConfig.uri;

        this.dbConn = new Sequelize(this.dbUri, {
            dialect: "postgres",
            dialectOptions: {
                ssl: appConfig.get("/appEnv") === "production",
                sslmode: "require",
            },
            define: {
                underscored: true,
                version: true,
                defaultScope: {
                    attributes: {
                        exclude: ["version", "createdAt", "updatedAt"],
                    },
                    raw: true,
                },
            },
            pool: {
                max: dbConfig.connPool.max,
                min: dbConfig.connPool.min,
                acquire: 30000,
                idle: 10000,
            },
            logging: (msg) => logger.info(msg),
        });

        this.dbConn
            .authenticate()
            .then(() => {
                logger.info("database connected");
            })
            .catch((error) => {
                logger.error(`unable to connect to the database: ${error}`);
            });

        this.dbConn
            .sync({ alter: true })
            .then(() => {
                logger.info("database synced");
            })
            .catch((error) => {
                logger.error(`unable to sync database: ${error}`);
            });
    }

    disconnect() {
        this.dbConn.close();
        logger.info("database disconnected");
    }
}
