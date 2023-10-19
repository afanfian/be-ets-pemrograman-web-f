import { DataTypes } from "sequelize";
import { PostgresDatabase } from "../../../../config";
import { AggregateId, AggregateRoot } from "../../../../shared/abstract";
import { IPasswordService } from "../service";

const pgDbConn = new PostgresDatabase().dbConn;

export interface UserProps {
    id?: AggregateId;
    nama?: string;
    email?: string;
    password?: string;
    login_at?: Date;
}

export class UserEntity<TProps extends UserProps> extends AggregateRoot {
    private nama?: string;
    private email?: string;
    private password?: string;
    private login_at?: Date;

    constructor(props: TProps) {
        super(props.id);
        ({
            nama: this.nama,
            email: this.email,
            password: this.password,
            login_at: this.login_at,
        } = props);
    }

    getNama(): string | undefined {
        return this.nama;
    }

    getEmail(): string | undefined {
        return this.email;
    }

    getPassword(): string | undefined {
        return this.password;
    }

    getLoginAt(): Date | undefined {
        return this.login_at;
    }

    async setHashedPassword(passwordService: IPasswordService): Promise<void> {
        this.password = await passwordService.hashPassword(this.password!);
    }

    async matchPassword(
        passwordService: IPasswordService,
        inputPassword: string,
    ): Promise<boolean> {
        return await passwordService.comparePassword(
            inputPassword,
            this.password!,
        );
    }
}

export const UserModel = pgDbConn.define(
    "user",
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
        },
        nama: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false },
        password: { type: DataTypes.STRING, allowNull: false },
        login_at: { type: DataTypes.DATE },
    },
    {
        tableName: "users",
        indexes: [{ unique: true, fields: ["email"] }],
    },
);
