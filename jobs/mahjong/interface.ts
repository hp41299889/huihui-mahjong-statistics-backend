import { EEndType, EWind } from "@apis/record";
import { IRound } from "@apis/round";

export interface ICurrentRound {
    status: string;
    round: IRound;
    records: IAddRecord[];
    players: IPlayers;
    circle: EWind;
    dealer: EWind;
    dealerCount: number;
    venue: IAddRecord[];
};

export interface IPlayers {
    [key: string]: IPlayerScore;
    east: IPlayerScore;
    south: IPlayerScore;
    west: IPlayerScore;
    north: IPlayerScore;
};

export interface IAddRecord {
    circle: EWind;
    dealer: EWind;
    dealerCount: number;
    winner: string;
    losers: string[];
    endType: EEndType;
    point: number;
    createdAt: Date;
};

export interface IPlayerScore {
    id: number;
    name: string;
    win: number;
    lose: number;
    selfDrawn: number;
    draw: number;
    beSelfDrawn: number;
    fake: number;
    amount: number;
};

export interface IStatistics {
    [key: string]: IPlayerStatistics;
};

export interface IPlayerStatistics {
    id: number;
    name: string;
    createdAt?: Date;
    winds: {
        [key: string]: IWindStatistics;
    };
};

interface IWindStatistics {
    round: number;
    record: number;
    win: number;
    lose: number;
    selfDrawn: number;
    draw: number;
    beSelfDrawn: number;
    fake: number;
    amount: number;
};