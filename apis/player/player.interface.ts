import { IRound } from '@apis/round/round.interface';

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
    loser: any;
};

//model
export interface ICreateOnePlayerDto {
    name: string;
};