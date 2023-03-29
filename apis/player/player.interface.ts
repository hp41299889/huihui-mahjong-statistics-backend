import { IRound } from "@apis/round/round.interface";

//entity
interface IPlayer {
    id: number;
    name: string;
    rounds: IRound[];
    winners: IPlayer;
    // losers: IRecordLoser[];
    createdAt: Date;
    // updatedAt: Date;
};

//model
interface ICreateOnePlayerDto {
    name: string;
};

export {
    IPlayer,
    ICreateOnePlayerDto
}