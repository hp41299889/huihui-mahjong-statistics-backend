import { Router } from "express";

import round from './round.service';

const {
    postOne,
    getLast
} = round;

const router = Router();

router.route('/')
    .get(getLast);

router.route('/')
    .post(postOne);

export default router;