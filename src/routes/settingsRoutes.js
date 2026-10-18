import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { getAccounts, toggleAccount } from '../controllers/settingsController.js';

const router = Router();
router.get('/accounts', protect, getAccounts);
router.patch('/accounts/:id/toggle', protect, toggleAccount);
export default router;
