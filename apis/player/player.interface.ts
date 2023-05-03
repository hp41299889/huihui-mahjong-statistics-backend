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