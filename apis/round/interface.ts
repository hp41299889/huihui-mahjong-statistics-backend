import { DeskType } from "../../databases/entities/round";

export {
    IRound
};

interface IRound {
    deskType: DeskType;
    base: number;
    point: number;
    eastName: string;
    southName: string;
    westName: string;
    northName: string;
};