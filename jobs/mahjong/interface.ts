import { EEndType, EWind } from "@apis/record";
import { IRound } from "@apis/round";

export interface ICurrentRound {
    status: string;
    round?: IRound;
    records?: IAddRecord[];
    players?: {
        [key: string]: IPlayerStatistics;
        east?: IPlayerStatistics;
        south?: IPlayerStatistics;
        west?: IPlayerStatistics;
        north?: IPlayerStatistics;
    };
    circle?: EWind;
    dealer?: EWind;
    dealerCount?: number;
    venue?: IAddRecord[];
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

export interface IStatistics {
    [key: string]: IPlayerStatistics;
};

interface IPlayerStatistics {
    id?: number;
    name?: string;
    win?: number;
    lose?: number;
    selfDrawn?: number;
    draw?: number;
    beSelfDrawn?: number;
    fake?: number;
    amount?: number;
};