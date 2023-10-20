import { AggregateId } from "../../../../shared/abstract";
import { ScoreEntity, ScoreProps } from "../entity";

export interface IScoreRepository {
    addScore(scoreData: ScoreEntity<ScoreProps>): Promise<void>;
    updateScore(scoreData: ScoreEntity<ScoreProps>): Promise<void>;
    updateScoreLoginTime(
        scoreId: AggregateId,
        updateTime?: Date,
    ): Promise<void>;
    deleteScore(scoreId: AggregateId): Promise<void>;
}
