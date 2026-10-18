import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { getAlerts, markRead, markAllRead } from '../controllers/alertController.js';

const router = Router();
router.get('/', protect, getAlerts);
router.patch('/:id/read', protect, markRead);
router.patch('/read-all', protect, markAllRead);
export default router;
