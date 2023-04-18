import { IRecord } from '@apis/record';
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
    // records: IRecord[];
};

//model
export interface ICreateOnePlayerDto {
    name: string;
};

//service
export interface IPlayerRecords {
    records: number;
    wins: number;
    loses: number;
    selfDrawn: number;
}