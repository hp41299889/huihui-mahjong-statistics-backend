import { Player, playerRouter } from './player';
import { Record, recordRouter } from './record';
import { Round, roundRouter } from './round';

const routes = {
    player: playerRouter,
    record: recordRouter,
    round: roundRouter
};

const entities = [
    Player,
    Record,
    Round
];

export {
    routes,
    entities
};