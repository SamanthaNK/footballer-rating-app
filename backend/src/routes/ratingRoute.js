import { Router } from 'express';
import {
    submitRating,
    updateRating,
    deleteRating,
} from '../controllers/ratingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', protect, submitRating);
router.put('/:id', protect, updateRating);
router.delete('/:id', protect, deleteRating);

export default router;