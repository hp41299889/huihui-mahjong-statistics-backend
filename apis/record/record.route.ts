import { Router } from "express";

import {
    postOneToCurrentRoound,
    deleteLastToCurrentRoound
} from './record.service';


const router = Router();

router.route('/')
// .get(getRecords);

router.route('/:roundUid')
    .post(postOneToCurrentRoound)
    .delete(deleteLastToCurrentRoound)

export default router;