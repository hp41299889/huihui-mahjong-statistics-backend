import { EEndType, EWind } from "@apis/record";
import { EDeskType, IRound } from "@apis/round";

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

export interface IHistory {
    [key: string]: IHistoryRound[];
};

export interface IHistoryRound {
    uid: string;
    createdAt: Date;
    deskType: EDeskType;
    base: number;
    point: number;
    east: IPlayerScore;
    south: IPlayerScore;
    west: IPlayerScore;
    north: IPlayerScore;
    records: IAddRecord[];
    venue: IAddRecord[];
};

export interface IPlayerStatistics {
    id: number;
    name: string;
    createdAt?: Date;
    winds: {
        [key: string]: IWindStatistics;
        east: IWindStatistics;
        south: IWindStatistics;
        west: IWindStatistics;
        north: IWindStatistics;
    };
};

export interface IWindStatistics {
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