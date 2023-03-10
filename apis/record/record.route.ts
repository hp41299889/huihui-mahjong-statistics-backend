import { Router } from "express";
import {
    createRecord,
    getRecords
} from './record';


const router = Router();

router.route('/')
    .get(getRecords);

router.route('/:playerName')
    .post(createRecord)

export default router;