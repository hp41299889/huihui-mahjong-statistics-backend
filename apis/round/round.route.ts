import { Router } from "express";

import {
    postOne,
    getLatest,
    postResetCurrentRound,
    deleteCurrentRound,
} from './round.service';

const router = Router();

router.route('/')
    .get(getLatest)
    .post(postOne)
    .delete(deleteCurrentRound);

router.route('/reset')
    .post(postResetCurrentRound);

export default router;