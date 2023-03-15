import { Router } from "express";

import {
    createRecord,
    getRecords
} from './record';


const router = Router();

router.route('/')
    .get(getRecords);

router.route('/:roundUid')
    .post(createRecord)

export default router;