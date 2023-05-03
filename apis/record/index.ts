import { Record } from "./record.entity";
import { EEndType, EWind } from "./record.enum";
import { IRecord, ICreateOneRecordDto } from "./record.interface";
import recordModel from "./record.model";
import recordRouter from "./record.route";
import { windList } from "./record.service";

export {
    //entity
    Record,

    //model
    recordModel,

    //enum
    EEndType,
    EWind,

    //interface
    IRecord,
    ICreateOneRecordDto,

    //router
    recordRouter,

    //orther
    windList
};