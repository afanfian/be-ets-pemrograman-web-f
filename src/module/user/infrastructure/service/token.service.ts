import jwt from "jsonwebtoken";
import { appConfig } from "../../../../config";
import { ITokenService } from "../../application/service";
import { AggregateId } from "../../../../shared/abstract";
const token = appConfig.get("/token");

export class TokenService implements ITokenService {
    constructor() {}

    async generateToken(userId: AggregateId, name: string): Promise<string> {
        return jwt.sign({ id_user: userId, nama: name }, token.secretKey, {
            expiresIn: "4h",
            issuer: token.issuer,
        });
    }
}
