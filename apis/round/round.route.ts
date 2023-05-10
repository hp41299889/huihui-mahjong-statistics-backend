import { Router } from "express";

import {
    postOne,
    postResetCurrentRound,
    getHistoryByDate,
    getExistDate,
    getCurrentRound,
    deleteCurrentRound,
} from './round.service';

const router = Router();

router.route('/')
    .post(postOne);

router.route('/history/existDates')
    .get(getExistDate);

router.route('/history/:date')
    .get(getHistoryByDate);

router.route('/currentRound')
    .get(getCurrentRound)
    .post(postResetCurrentRound)
    .delete(deleteCurrentRound);

export default router;