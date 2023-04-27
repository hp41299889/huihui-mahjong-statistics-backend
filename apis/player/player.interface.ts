import { IRound } from '@apis/round';

//entity
export interface IPlayer {
    //generate
    id: number;
    createdAt: Date;
    //column
    name: string;
    //relation
    rounds: IRound[];
    winner: IPlayer;
};

//service
interface IStatistics {
    rounds: number;
    records: number;
    win: number;
    lose: number;
    selfDrawn: number;
    beselfDrawn: number;
    draw: number;
    fake: number;
    amount: number;
};

export interface IPlayerStatistics {
    [key: string]: IStatistics;
    east: IStatistics;
    south: IStatistics;
    west: IStatistics;
    north: IStatistics;
};

//model
export interface ICreateOnePlayerDto {
    name: string;
};

export interface IUpdateOnePlayerDto {
    win: number;
    lose: number;
    beSelfDrawn: number;
    draw: number;
    fake: number;
    amount: number;
};