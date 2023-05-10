import { Router } from "express";

import {
    postOne,
    getPlayerStatistics,
    getAll,
} from "./player.service";

const router = Router();

router.route('/statistics')
    .get(getPlayerStatistics);

router.route('/')
    .get(getAll)
    .post(postOne);

export default router;