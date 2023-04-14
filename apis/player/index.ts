import { Player } from "./player.entity";
import playerModel from "./player.model";
import playerRouter from './player.route';
import { takeWind } from "./player.service";
import { IPlayer, ICreateOnePlayerDto } from "./player.interface";

export {
    Player,
    ICreateOnePlayerDto,
    IPlayer,
    playerModel,
    takeWind
};

export default playerRouter;