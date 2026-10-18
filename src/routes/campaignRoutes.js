import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { getCampaigns, getCampaignKeywords } from '../controllers/campaignController.js';

const router = Router();
router.get('/', protect, getCampaigns);
router.get('/keywords', protect, getCampaignKeywords);
export default router;
