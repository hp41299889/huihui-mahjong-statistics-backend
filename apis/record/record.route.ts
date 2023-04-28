import { Router } from "express";

import {
    deleteLastRecord,
    postOne
} from './record.service';


const router = Router();

router.route('/')
// .get(getRecords);

router.route('/:roundUid')
    .post(postOne)
    .delete(deleteLastRecord)

export default router;