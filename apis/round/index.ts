import { Round } from "./round.entity";
import { EDeskType } from "./round.enum";
import { IRound, ICreateOneRoundDto, ICurrentRound, IPostOne } from "./round.interface";
import roundRouter from "./round.route";
import roundModel from "./round.model";
import { currentRound, updateCurrentRound } from "./round.service";

export {
    //entity
    Round,
    //model
    roundModel,
    //enum
    EDeskType,
    //interface
    ICreateOneRoundDto,
    IPostOne,
    ICurrentRound,
    IRound,
    //router
    roundRouter,
    //outher
    currentRound,
    updateCurrentRound
};