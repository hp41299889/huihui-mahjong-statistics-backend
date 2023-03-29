import { Router } from 'express';

import player from './player.service';

const {
    postOne,
    getAll,
    getOneByName
} = player;

const router = Router();

router.route('/')
    .post(postOne)
    .get(getAll);

router.route('/:playerName')
    .get(getOneByName);

export default router;