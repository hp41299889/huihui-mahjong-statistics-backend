import { Round } from "./round.entity";
import { EDeskType } from "./round.enum";
import { IRound, ICreateOneRoundDto, ICurrentRound, IPostOne } from "./round.interface";
import roundRouter from "./round.route";
import { currentRound } from "./round.service";

export {
    Round,
    EDeskType,
    ICreateOneRoundDto,
    IPostOne,
    ICurrentRound,
    IRound,
    currentRound
};

export default roundRouter;