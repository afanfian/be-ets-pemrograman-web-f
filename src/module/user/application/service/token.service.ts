import { AggregateId } from "../../../../shared/abstract";

export interface ITokenService {
    generateToken(userId: AggregateId, name: string): Promise<string>;
}
