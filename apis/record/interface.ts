import { WindEnum, EndEnum } from "../../entities/record"

export {
    IRecord
};

interface IRecord {
    winner?: number;
    loser?: number[];
    dealer: number;
    dealerCount: number;
    circle: number;
    endType: EndEnum;
    point?: number;
};