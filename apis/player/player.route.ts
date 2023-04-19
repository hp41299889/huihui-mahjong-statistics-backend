import { Router } from "express";

import {
    postOne,
    getOneByName,
    getAll
} from "./player.service";

const router = Router();

router.route('/:name')
    .get(getOneByName);

router.route('/')
    .post(postOne)
    .get(getAll);

export default router;