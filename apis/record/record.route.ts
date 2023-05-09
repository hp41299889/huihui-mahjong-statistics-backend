import { Router } from "express";

import {
    postOneToCurrentRoound,
    deleteLastToCurrentRound
} from './record.service';


const router = Router();

router.route('/')
    .post(postOneToCurrentRoound)
    .delete(deleteLastToCurrentRound)

export default router;