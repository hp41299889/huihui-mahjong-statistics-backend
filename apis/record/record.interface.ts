import { IPlayer } from "@apis/player";
import { IRound } from "@apis/round";
import { EWind, EEndType } from "./record.enum";

//entity
export interface IRecord {
    //generate
    uid: string;
    createdAt: Date;
    //column
    endType: EEndType;
    point: number;
    //relation
    winner: IPlayer;
    round: IRound;
    losers: IPlayer[];
};

//service

//model
export interface ICreateOneRecordDto {
    winner: IPlayer;
    losers: IPlayer[];
    endType: EEndType;
    point: number;
    createdAt: Date;
    round: IRound;
};