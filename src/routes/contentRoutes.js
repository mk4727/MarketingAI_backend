import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { isAdmin } from '../middleware/admin.js';
import { getContent, updateContent } from '../controllers/contentController.js';

const router = Router();
router.get('/', getContent);
router.put('/', protect, isAdmin, updateContent);
export default router;
