import { LoadEnvs } from "../shared/util";
import confidence from "confidence";

LoadEnvs();

// set all app configs from env file
export const appConfig = new confidence.Store({
    serverPort: process.env.SERVER_PORT ?? 8080,
    appEnv: process.env.APP_ENV ?? "production",
    pgDatabase: {
        uri:
            `postgres://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}` ??
            "postgres://username:password@localhost:5432/db_name",
        connPool: {
            max: process.env.MAX_CONNECTION_POOL ?? 100,
            min: process.env.MIN_CONNECTION_POOL ?? 1,
        },
    },
    token: {
        secretKey: process.env.JWT_SECRET_KEY,
        issuer: process.env.JWT_ISSUER,
    },
    imagekit: {
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
        urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    },
});
