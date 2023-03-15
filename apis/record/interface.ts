import { WindEnum, EndEnum } from "../../entities/record"

export {
    IRecord
};

interface IRecord {
    winner?: WindEnum;
    loser?: WindEnum[] | WindEnum;
    dealer: WindEnum;
    dealerCount: number;
    circle: WindEnum;
    endType: EndEnum;
    point?: number;
};