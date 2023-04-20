import { Router } from "express";

import {
    postOne
} from './record.service';


const router = Router();

router.route('/')
// .get(getRecords);

router.route('/:roundUid')
    .post(postOne)

export default router;