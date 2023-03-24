import { Router } from "express";

import record from './record';

const {
    postOne
} = record;

const router = Router();

router.route('/')
// .get(getRecords);

router.route('/:roundUid')
    .post(postOne)

export default router;