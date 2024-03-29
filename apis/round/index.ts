import { Round } from "./round.entity";
import { EDeskType, ERoundStatus } from "./round.enum";
import { IRound, ICreateOneRoundDto, ICurrentRound, IPostOne } from "./round.interface";
import roundRouter from "./round.route";
import roundModel from "./round.model";

export {
    //entity
    Round,

    //model
    roundModel,

    //enum
    EDeskType,
    ERoundStatus,

    //interface
    ICreateOneRoundDto,
    IPostOne,
    ICurrentRound,
    IRound,

    //router
    roundRouter,
};