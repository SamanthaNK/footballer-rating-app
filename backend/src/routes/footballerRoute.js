import { Router } from 'express';
import {
    getFootballers,
    searchFootballers,
    getFootballerById,
} from '../controllers/footballerController.js';

const router = Router();

router.get('/search', searchFootballers);
router.get('/', getFootballers);
router.get('/:id', getFootballerById);

export default router;