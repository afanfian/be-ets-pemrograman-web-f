import { DataTypes } from "sequelize";
import { PostgresDatabase } from "../../../../config";
import { AggregateId, AggregateRoot } from "../../../../shared/abstract";

const pgDbConn = new PostgresDatabase().dbConn;

export interface ScoreProps {
    id?: AggregateId;
    nama?: string;
    score?: string;
}

export class ScoreEntity<TProps extends ScoreProps> extends AggregateRoot {
    private nama?: string;
    private score?: string;

    constructor(props: TProps) {
        super(props.id);
        ({ nama: this.nama, score: this.score } = props);
    }

    getNama(): string | undefined {
        return this.nama;
    }
    getScore(): string | undefined {
        return this.score;
    }
}

export const ScoreModel = pgDbConn.define(
    "score",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        nama: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        score: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: "scores",
        indexes: [{ unique: true, fields: ["nama"] }],
    },
);
