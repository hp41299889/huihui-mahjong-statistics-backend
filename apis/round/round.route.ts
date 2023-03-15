import { Router } from "express";

import {
    createRound,
    getLastRound
} from './round';


const router = Router();

router.route('/')
    .get(getLastRound);

router.route('/')
    .post(createRound);

export default router;