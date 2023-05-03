import { Router } from "express";

import {
    postOne,
    getLatest,
    postResetCurrentRound,
} from './round.service';

const router = Router();

router.route('/')
    .get(getLatest)
    .post(postOne);

router.route('/reset')
    .post(postResetCurrentRound)

export default router;