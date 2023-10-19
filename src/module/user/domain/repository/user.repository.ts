import { AggregateId } from "../../../../shared/abstract";
import { UserEntity, UserProps } from "../entity";

export interface IUserRepository {
    addUser(userData: UserEntity<UserProps>): Promise<void>;
    updateUser(userData: UserEntity<UserProps>): Promise<void>;
    updateUserLoginTime(userId: AggregateId, updateTime?: Date): Promise<void>;
    deleteUser(userId: AggregateId): Promise<void>;
}
