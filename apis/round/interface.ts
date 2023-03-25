import { EDeskType } from "@postgres/entities/index";

export {
    IRound
};

interface IRound {
    deskType: EDeskType;
    base: number;
    point: number;
    eastName: string;
    southName: string;
    westName: string;
    northName: string;
};