import { DeskType } from "../../entities/round";

export {
    IRound
};

interface IRound {
    deskType: DeskType;
    base: number;
    point: number;
    eastId: number;
    southId: number;
    westId: number;
    northId: number;
};