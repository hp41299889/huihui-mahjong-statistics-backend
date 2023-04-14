import { Record } from "./record.entity";
import { RecordLoser } from "./recordLoser/recordLoser.entity";
import { EEndType, EWind } from "./record.enum";
import { IRecord, IRecordLoser, ICreateOneRecordDto, IPostOne } from "./record.interface";
import recordModel from "./record.model";
import recordRouter from "./record.route";
import { windList } from "./record.service";

export {
    Record,
    RecordLoser,
    EEndType,
    EWind,
    IRecord,
    IRecordLoser,
    ICreateOneRecordDto,
    IPostOne,
    recordModel,
    windList
};

export default recordRouter;