import { ScoreProps } from "../../domain/entity";
import { AggregateId } from "../../../../shared/abstract";

export interface IScoreQueryHandler {
    getAllScores(): Promise<ScoreProps[]>;
    getScoreById(scoreId: AggregateId): Promise<ScoreProps | null>;
    getScoreByNama(nama: string): Promise<ScoreProps | null>;
}
