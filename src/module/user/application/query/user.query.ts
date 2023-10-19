import { AggregateId } from "../../../../shared/abstract";
import { UserProps } from "../../domain/entity";

export interface IUserQueryHandler {
    getAllUsers(): Promise<UserProps[]>;
    getUserById(userId: AggregateId): Promise<UserProps | null>;
    getUserByEmail(email: string): Promise<UserProps | null>;
}
