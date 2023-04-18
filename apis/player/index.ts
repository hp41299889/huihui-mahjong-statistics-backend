import { Player } from "./player.entity";
import playerModel from "./player.model";
import playerRouter from './player.route';
import { IPlayer, ICreateOnePlayerDto } from "./player.interface";

export {
    Player,
    ICreateOnePlayerDto,
    IPlayer,
    playerModel,
};

export default playerRouter;