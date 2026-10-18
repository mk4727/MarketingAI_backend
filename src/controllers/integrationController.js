import { getGoogleAdsCampaigns, getGoogleAdsKeywords } from '../services/googleAdsService.js';
import { getMetaAdsCampaigns } from '../services/metaAdsService.js';
import { getShopifyProducts, getShopifyOrders } from '../services/shopifyService.js';
import Campaign from '../models/Campaign.js';
import Alert from '../models/Alert.js';

export async function syncGoogleAds(req, res) {
  const campaigns = await getGoogleAdsCampaigns();
  if (!campaigns) {
    return res.json({ synced: false, message: 'Google Ads not configured or connection failed' });
  }

  for (const c of campaigns) {
    await Campaign.findOneAndUpdate(
      { userId: req.user._id, _id: c._id },
      { ...c, userId: req.user._id },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  res.json({ synced: true, count: campaigns.length });
}

export async function syncMetaAds(req, res) {
  const campaigns = await getMetaAdsCampaigns();
  if (!campaigns) {
    return res.json({ synced: false, message: 'Meta Ads not configured or connection failed' });
  }

  for (const c of campaigns) {
    await Campaign.findOneAndUpdate(
      { userId: req.user._id, _id: c._id },
      { ...c, userId: req.user._id },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  res.json({ synced: true, count: campaigns.length });
}

export async function syncShopify(req, res) {
  const [products, orders] = await Promise.all([getShopifyProducts(), getShopifyOrders()]);
  if (!products && !orders) {
    return res.json({ synced: false, message: 'Shopify not configured or connection failed' });
  }

  res.json({
    synced: true,
    products: products?.length || 0,
    revenue: orders?.totalRevenue || 0,
    orders: orders?.totalOrders || 0,
  });
}

export async function syncAll(req, res) {
  const [googleCampaigns, metaCampaigns] = await Promise.all([
    getGoogleAdsCampaigns(),
    getMetaAdsCampaigns(),
  ]);

  let syncedCount = 0;

  if (googleCampaigns) {
    for (const c of googleCampaigns) {
      await Campaign.findOneAndUpdate(
        { userId: req.user._id, _id: c._id },
        { ...c, userId: req.user._id },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      syncedCount++;
    }
  }

  if (metaCampaigns) {
    for (const c of metaCampaigns) {
      await Campaign.findOneAndUpdate(
        { userId: req.user._id, _id: c._id },
        { ...c, userId: req.user._id },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      syncedCount++;
    }
  }

  res.json({ synced: true, count: syncedCount });
}
