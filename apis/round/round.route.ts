import { Router } from "express";

import {
    postOne,
    getLatest,
} from './round.service';

const router = Router();

router.route('/')
    .get(getLatest)
    .post(postOne);

export default router;