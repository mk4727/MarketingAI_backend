import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { syncGoogleAds, syncMetaAds, syncShopify, syncAll } from '../controllers/integrationController.js';

const router = Router();
router.post('/sync/google-ads', protect, syncGoogleAds);
router.post('/sync/meta-ads', protect, syncMetaAds);
router.post('/sync/shopify', protect, syncShopify);
router.post('/sync/all', protect, syncAll);
export default router;
