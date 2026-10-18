import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { chat, getChatHistory } from '../controllers/aiController.js';

const router = Router();
router.post('/chat', protect, chat);
router.get('/history', protect, getChatHistory);
export default router;
