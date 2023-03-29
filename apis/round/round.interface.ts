import { EDeskType } from "./round.enum";
import { EWind } from "@apis/record/record.enum";
import { IPlayer } from "@apis/player/player.interface";
import { IRecord } from "@apis/record/record.interface";

//entity
interface IRound {
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

interface ICurrentRound {
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
interface IPostOne {
    deskType: EDeskType;
    base: number;
    point: number;
    east: string;
    south: string;
    west: string;
    north: string;
};

//model
interface ICreateOneRoundDto {
    deskType: EDeskType;
    base: number;
    point: number;
    east: IPlayer;
    south: IPlayer;
    west: IPlayer;
    north: IPlayer;
};

export {
    IRound,
    ICurrentRound,
    ICreateOneRoundDto,
    IPostOne
};