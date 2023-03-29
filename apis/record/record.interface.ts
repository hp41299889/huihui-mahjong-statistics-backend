import { EWind, EEndType } from "./record.enum";
import { IRound } from "@apis/round/round.interface";

//entity
interface IRecord {
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
interface IPostOne {
    winner: EWind;
    loser: EWind[];
    circle: EWind;
    dealer: EWind;
    dealerCount: number;
    endType: EEndType;
    point: number;
};

//model
interface ICreateOneRecordDto {
    winner: EWind;
    loser: EWind[];
    circle: EWind;
    dealer: EWind;
    dealerCount: number;
    endType: EEndType;
    point: number;
    round: IRound;
};

export {
    IPostOne,
    IRecord,
    ICreateOneRecordDto
}