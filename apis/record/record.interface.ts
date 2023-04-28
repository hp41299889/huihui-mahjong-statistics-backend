import { IPlayer } from "@apis/player";
import { IRound } from "@apis/round";
import { EWind, EEndType } from "./record.enum";

//entity
export interface IRecord {
    //generate
    uid: string;
    createdAt: Date;
    //column
    circle: EWind;
    dealer: EWind;
    dealerCount: number;
    endType: EEndType;
    point: number;
    //relation
    winner: IPlayer;
    losers: IPlayer[];
    round: IRound;
};

//service
export interface IPostOne {
    winner: string;
    loser: string[];
    endType: EEndType;
    point: number;
};

//model
export interface ICreateOneRecordDto {
    winner: IPlayer;
    losers: IPlayer[];
    circle: EWind;
    dealer: EWind;
    dealerCount: number;
    endType: EEndType;
    point: number;
    round: IRound;
};