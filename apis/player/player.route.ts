import { Router } from 'express';

import player from './player';

const {
    postOne,
    getAll,
    getOneByName
} = player;

const router = Router();

router.route('/')
    .post(postOne)
    .get(getAll);

router.route('/:name')
    .get(getOneByName);

export default router;