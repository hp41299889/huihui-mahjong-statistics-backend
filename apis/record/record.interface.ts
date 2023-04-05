import { EWind, EEndType } from "./record.enum";
// import { IRound } from "@apis/round/round.interface";
import { IRound } from "../round/round.interface";

//entity
export interface IRecord {
    //generate
    uid: string;
    createdAt: Date;
    //column
    winner: EWind;
    loser: EWind[];
    circle: EWind;
    dealer: EWind;
    dealerCount: number;
    endType: EEndType;
    point: number;
    //relation
    round: IRound;
    // updatedAt: Date;
};

//service
export interface IPostOne {
    winner: EWind;
    loser: EWind[];
    circle: EWind;
    dealer: EWind;
    dealerCount: number;
    endType: EEndType;
    point: number;
};

//model
export interface ICreateOneRecordDto {
    winner: EWind;
    loser: EWind[];
    circle: EWind;
    dealer: EWind;
    dealerCount: number;
    endType: EEndType;
    point: number;
    round: IRound;
};