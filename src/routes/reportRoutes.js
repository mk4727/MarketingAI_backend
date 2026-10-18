import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { getReports, getReport } from '../controllers/reportController.js';

const router = Router();
router.get('/', protect, getReports);
router.get('/:id', protect, getReport);
export default router;
