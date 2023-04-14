import { IPlayer } from "@apis/player/player.interface";
import { IRecord } from "@apis/record/record.interface";

export interface IRecordLoser {
    uid: string;
    player: IPlayer;
    record: IRecord;
};

export interface ICreateOneLoserByPlayerDto {
    player: IPlayer;
    record: IRecord;
}