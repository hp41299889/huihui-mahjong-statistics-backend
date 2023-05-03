import { Player } from "./player.entity";
import playerModel from "./player.model";
import playerRouter from './player.route';
import { IPlayer, ICreateOnePlayerDto } from "./player.interface";

export {
    //entity
    Player,

    //model
    playerModel,

    //interface
    ICreateOnePlayerDto,
    IPlayer,

    //router
    playerRouter
};