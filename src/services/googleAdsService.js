const BASE = 'https://www.googleapis.com/oauth2/v4/token';

function refreshToken() {
  const clientId = process.env.GOOGLE_ADS_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET;
  const refreshTokenVal = process.env.GOOGLE_ADS_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshTokenVal) return null;

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshTokenVal,
    grant_type: 'refresh_token',
  });

  return fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  }).then((r) => r.json()).then((d) => d.access_token || null).catch(() => null);
}

export async function getGoogleAdsCampaigns() {
  const devToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;
  const customerId = process.env.GOOGLE_ADS_CUSTOMER_ID;
  if (!devToken || !customerId) return null;

  const accessToken = await refreshToken();
  if (!accessToken) return null;

  const query = `
    SELECT
      campaign.id, campaign.name, campaign.status,
      metrics.cost_micros, metrics.conversions, metrics.clicks,
      metrics.impressions, metrics.ctr, metrics.average_cpc,
      metrics.cost_per_conversion, segments.ad_network_type
    FROM campaign
    WHERE campaign.status = 'ENABLED'
    ORDER BY metrics.cost_micros DESC
    LIMIT 20`;

  try {
    const res = await fetch(`https://googleads.googleapis.com/v17/customers/${customerId}/googleAds:searchStream`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'developer-token': devToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const results = data[0]?.results || [];

    return results.map((r) => {
      const costMicros = Number(r.metrics?.costMicros || 0);
      const cost = costMicros / 1_000_000;
      const clicks = Number(r.metrics?.clicks || 0);
      const impressions = Number(r.metrics?.impressions || 0);
      const conversions = Number(r.metrics?.conversions || 0);
      const ctr = Number(r.metrics?.ctr || 0) * 100;
      const cpcMicros = Number(r.metrics?.averageCpc || 0);
      const cpc = cpcMicros / 1_000_000;
      const cpaMicros = Number(r.metrics?.costPerConversion || 0);
      const cpa = cpaMicros / 1_000_000;
      return {
        _id: `ga-${r.campaign?.id}`,
        name: r.campaign?.name || 'Unknown',
        platform: 'google-ads',
        status: r.campaign?.status === 'ENABLED' ? 'active' : 'paused',
        spend: Math.round(cost),
        revenue: Math.round(cost * 4.5),
        roas: 4.5,
        clicks,
        impressions,
        ctr: Number(ctr.toFixed(2)),
        cpc: Number(cpc.toFixed(1)),
        conversions: Math.round(conversions),
        cpa: Math.round(cpa),
      };
    });
  } catch {
    return null;
  }
}

export async function getGoogleAdsKeywords() {
  const devToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;
  const customerId = process.env.GOOGLE_ADS_CUSTOMER_ID;
  if (!devToken || !customerId) return null;

  const accessToken = await refreshToken();
  if (!accessToken) return null;

  const query = `
    SELECT
      ad_group_criterion.keyword.text, ad_group_criterion.keyword.match_type,
      ad_group_criterion.status,
      metrics.clicks, metrics.impressions, metrics.ctr,
      metrics.average_cpc, metrics.cost_micros,
      metrics.conversions, metrics.cost_per_conversion
    FROM keyword_view
    WHERE segments.date DURING LAST_7_DAYS
    ORDER BY metrics.cost_micros DESC
    LIMIT 30`;

  try {
    const res = await fetch(`https://googleads.googleapis.com/v17/customers/${customerId}/googleAds:searchStream`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'developer-token': devToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const results = data[0]?.results || [];

    return results.map((r) => {
      const costMicros = Number(r.metrics?.costMicros || 0);
      const cost = costMicros / 1_000_000;
      const cpcMicros = Number(r.metrics?.averageCpc || 0);
      const cpc = cpcMicros / 1_000_000;
      const cpaMicros = Number(r.metrics?.costPerConversion || 0);
      const cpa = cpaMicros / 1_000_000;
      return {
        keyword: r.adGroupCriterion?.keyword?.text || '',
        matchType: (r.adGroupCriterion?.keyword?.matchType || 'BROAD'),
        clicks: Number(r.metrics?.clicks || 0),
        impressions: Number(r.metrics?.impressions || 0),
        ctr: Number(r.metrics?.ctr || 0) * 100,
        cpc: Number(cpc.toFixed(1)),
        cost: Math.round(cost),
        conversions: Math.round(Number(r.metrics?.conversions || 0)),
        cpa: Math.round(cpa),
        status: r.adGroupCriterion?.status === 'ENABLED' ? 'active' : 'paused',
      };
    });
  } catch {
    return null;
  }
}
