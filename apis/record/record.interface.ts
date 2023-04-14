import { IPlayer } from "@apis/player/player.interface";
import { IRound } from "@apis/round/round.interface";
import { IRecordLoser } from "./recordLoser/recordLoser.interface";
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
    loser: IRecordLoser[];
    round: IRound;
    // updatedAt: Date;
};

//service
export interface IPostOne {
    winner: string;
    loser: string[];
    circle: EWind;
    dealer: EWind;
    dealerCount: number;
    endType: EEndType;
    point: number;
};

//model
export interface ICreateOneRecordDto {
    winner: IPlayer;
    circle: EWind;
    dealer: EWind;
    dealerCount: number;
    endType: EEndType;
    point: number;
    round: IRound;
};