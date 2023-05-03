import { Router } from "express";

import {
    postOne,
    getAll,
    getPlayerStatistics
} from "./player.service";

const router = Router();

router.route('/statistics')
    .get(getPlayerStatistics);

router.route('/')
    .post(postOne)
    .get(getAll);

export default router;