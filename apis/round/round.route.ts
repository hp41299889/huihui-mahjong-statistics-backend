import { Router } from "express";

import {
    postOne,
    getLast
} from './round.service';

const router = Router();

router.route('/')
    .get(getLast);

router.route('/')
    .post(postOne);

export default router;