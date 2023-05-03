import { Router } from "express";

import {
    postOneToCurrentRoound,
    deleteLastToCurrentRound
} from './record.service';


const router = Router();

router.route('/')
// .get(getRecords);

router.route('/:roundUid')
    .post(postOneToCurrentRoound)
    .delete(deleteLastToCurrentRound)

export default router;