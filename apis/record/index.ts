import { Record } from "./record.entity";
import { EEndType, EWind } from "./record.enum";
import { IRecord, ICreateOneRecordDto, IPostOne } from "./record.interface";
import recordModel from "./record.model";
import recordRouter from "./record.route";
import { windList } from "./record.service";

export {
    Record,
    EEndType,
    EWind,
    IRecord,
    ICreateOneRecordDto,
    IPostOne,
    recordModel,
    windList
};

export default recordRouter;