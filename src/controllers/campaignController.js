import Campaign from '../models/Campaign.js';
import { getGoogleAdsCampaigns, getGoogleAdsKeywords } from '../services/googleAdsService.js';
import { getMetaAdsCampaigns } from '../services/metaAdsService.js';

export async function getCampaigns(req, res) {
  const { platform } = req.query;
  const filter = { userId: req.user._id };
  if (platform) filter.platform = platform;

  const [dbCampaigns, liveData] = await Promise.all([
    Campaign.find(filter).sort({ spend: -1 }).lean(),
    platform === 'google-ads' ? getGoogleAdsCampaigns() :
    platform === 'meta-ads' ? getMetaAdsCampaigns() : null,
  ]);

  if (liveData && liveData.length > 0) {
    return res.json(liveData);
  }

  res.json(dbCampaigns);
}

export async function getCampaignKeywords(req, res) {
  const { platform } = req.query;
  const filter = { userId: req.user._id };
  if (platform) filter.platform = platform;

  const [dbCampaigns, liveKeywords] = await Promise.all([
    Campaign.find(filter),
    platform === 'google-ads' ? getGoogleAdsKeywords() : null,
  ]);

  if (liveKeywords && liveKeywords.length > 0) {
    return res.json(liveKeywords);
  }

  const keywords = dbCampaigns.flatMap(c => c.keywords || []);
  res.json(keywords);
}
