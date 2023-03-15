import { Router } from "express";

import {
    createPlayer,
    getPlayers
} from './player';


const router = Router();

router.route('/')
    .post(createPlayer)
    .get(getPlayers);

export default router;