import { playerRouter } from './player';
import { recordRouter } from './record';
import { roundRouter } from './round';

const routes = {
    player: playerRouter,
    record: recordRouter,
    round: roundRouter
};

export {
    routes,
};