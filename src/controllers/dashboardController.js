import Campaign from '../models/Campaign.js';
import Alert from '../models/Alert.js';
import { getGoogleAdsCampaigns } from '../services/googleAdsService.js';
import { getMetaAdsCampaigns } from '../services/metaAdsService.js';
import { getShopifyOrders } from '../services/shopifyService.js';

export async function getDashboard(req, res) {
  const [dbCampaigns, googleLive, metaLive, shopifyLive] = await Promise.all([
    Campaign.find({ userId: req.user._id }).lean(),
    getGoogleAdsCampaigns(),
    getMetaAdsCampaigns(),
    getShopifyOrders(),
  ]);

  const allCampaigns = [...dbCampaigns];
  if (googleLive) {
    const existingIds = new Set(allCampaigns.map((c) => String(c._id)));
    for (const c of googleLive) {
      if (!existingIds.has(c._id)) allCampaigns.push(c);
    }
  }
  if (metaLive) {
    const existingIds = new Set(allCampaigns.map((c) => String(c._id)));
    for (const c of metaLive) {
      if (!existingIds.has(c._id)) allCampaigns.push(c);
    }
  }

  const alerts = await Alert.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(6);

  const totalSpend = allCampaigns.reduce((s, c) => s + (c.spend || 0), 0);
  const totalRevenue = allCampaigns.reduce((s, c) => s + (c.revenue || 0), 0);
  const totalOrders = shopifyLive?.totalOrders || allCampaigns.reduce((s, c) => s + (c.conversions || 0), 0);
  const roas = totalSpend > 0 ? totalRevenue / totalSpend : 0;
  const aov = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const platformBreakdown = {};
  for (const c of allCampaigns) {
    if (!platformBreakdown[c.platform]) {
      platformBreakdown[c.platform] = { spend: 0, revenue: 0, clicks: 0, impressions: 0, conversions: 0 };
    }
    platformBreakdown[c.platform].spend += c.spend || 0;
    platformBreakdown[c.platform].revenue += c.revenue || 0;
    platformBreakdown[c.platform].clicks += c.clicks || 0;
    platformBreakdown[c.platform].impressions += c.impressions || 0;
    platformBreakdown[c.platform].conversions += c.conversions || 0;
  }

  res.json({
    kpis: {
      spend: totalSpend,
      revenue: totalRevenue,
      roas: Number(roas.toFixed(2)),
      orders: totalOrders,
      aov: Math.round(aov),
    },
    platformBreakdown,
    shopify: shopifyLive || null,
    alerts: alerts.map(a => ({
      id: a._id, severity: a.severity, platform: a.platform,
      title: a.title, description: a.description, isRead: a.isRead,
    })),
  });
}
