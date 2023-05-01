import { EEndType, EWind } from "@apis/record";
import { IRound } from "@apis/round";

export interface ICurrentRound {
    round: IRound;
    records: IAddRecord[];
    players: {
        [key: string]: IPlayerStatistics;
        east: IPlayerStatistics;
        south: IPlayerStatistics;
        west: IPlayerStatistics;
        north: IPlayerStatistics;
    };
    circle: EWind;
    dealer: EWind;
    dealerCount: number;
    venue: string[];
};

export interface IAddRecord {
    winner: string;
    losers: string[];
    endType: EEndType;
    point: number;
    createdAt: Date;
};

export interface IStatistics {
    [key: string]: IPlayerStatistics;
};

interface IPlayerStatistics {
    id: number;
    name: string;
    win?: number;
    lose?: number;
    selfDrawn?: number;
    draw?: number;
    beSelfDrawn?: number;
    fake?: number;
    amount?: number;
};