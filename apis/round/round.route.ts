import { Router } from "express";

import round from './round';

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