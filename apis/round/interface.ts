import { EDeskType, EWind, IPlayer } from "@postgres/entities/index";

export {
    ICurrentRound
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