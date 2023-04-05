// import { IRound } from "@apis/round/round.interface";
import { IRound } from '../round/round.interface';

//entity
export interface IPlayer {
    id: number;
    name: string;
    rounds: IRound[];
    winners: IPlayer;
    // losers: IRecordLoser[];
    createdAt: Date;
    // updatedAt: Date;
};

//model
export interface ICreateOnePlayerDto {
    name: string;
};