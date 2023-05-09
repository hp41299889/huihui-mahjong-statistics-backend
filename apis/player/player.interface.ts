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