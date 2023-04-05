import { IPlayer } from '../player/player.interface';
import { IRecord } from '../record/record.interface';
import { EWind } from '../record/record.enum';
import { EDeskType } from "./round.enum";
//entity
export interface IRound {
    //generate
    uid: string;
    createdAt: Date;
    //column
    deskType: EDeskType;
    base: number;
    point: number;
    //relation
    east: IPlayer;
    south: IPlayer;
    west: IPlayer;
    north: IPlayer;
    records: IRecord[];
    // updatedAt: Date;
};

export interface ICurrentRound {
    roundUid: string;
    deskType: EDeskType;
    base: number;
    point: number;
    players: {
        east: IPlayer
        south: IPlayer
        west: IPlayer
        north: IPlayer
    };
    circle: EWind;
    dealer: EWind;
    dealerCount: number;
};

//service
export interface IPostOne {
    deskType: EDeskType;
    base: number;
    point: number;
    east: string;
    south: string;
    west: string;
    north: string;
};

//model
export interface ICreateOneRoundDto {
    deskType: EDeskType;
    base: number;
    point: number;
    east: IPlayer;
    south: IPlayer;
    west: IPlayer;
    north: IPlayer;
};