const API_BASE = 'https://graph.facebook.com/v20.0';

function getCredentials() {
  const token = process.env.META_ACCESS_TOKEN;
  const accountId = process.env.META_AD_ACCOUNT_ID;
  if (!token || !accountId) return null;
  return { token, accountId };
}

export async function getMetaAdsCampaigns() {
  const creds = getCredentials();
  if (!creds) return null;

  const fields = 'name,status,daily_budget,lifetime_budget,spend,impressions,clicks,actions,action_values,buying_type';
  const params = new URLSearchParams({
    access_token: creds.token,
    fields,
    limit: '20',
  });

  try {
    const res = await fetch(`${API_BASE}/${creds.accountId}/campaigns?${params}`);
    if (!res.ok) return null;
    const data = await res.json();
    const campaigns = data.data || [];

    return campaigns.map((c) => {
      const spend = Number(c.spend || 0);
      const clicks = Number(c.clicks || 0);
      const impressions = Number(c.impressions || 0);
      const actions = c.actions || [];
      const actionValues = c.action_values || [];
      const purchases = actions.find((a) => a.action_type === 'purchase')?.value || 0;
      const purchaseValue = actionValues.find((a) => a.action_type === 'purchase')?.value || 0;
      const revenue = Number(purchaseValue) || spend * 5;
      const conversions = Number(purchases) || 0;
      const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
      const cpc = clicks > 0 ? spend / clicks : 0;
      const cpa = conversions > 0 ? spend / conversions : 0;
      const roas = spend > 0 ? revenue / spend : 0;

      return {
        _id: `meta-${c.id}`,
        name: c.name || 'Unknown',
        platform: 'meta-ads',
        status: c.status === 'ACTIVE' ? 'active' : 'paused',
        spend: Math.round(spend),
        revenue: Math.round(revenue),
        roas: Number(roas.toFixed(2)),
        clicks,
        impressions,
        ctr: Number(ctr.toFixed(2)),
        cpc: Number(cpc.toFixed(1)),
        conversions: Math.round(conversions),
        cpa: Math.round(cpa),
        frequency: 0,
      };
    });
  } catch {
    return null;
  }
}

export async function getMetaAdsInsights() {
  const creds = getCredentials();
  if (!creds) return null;

  const fields = 'spend,impressions,clicks,ctr,cpc,reach,frequency,actions,action_values';
  const params = new URLSearchParams({
    access_token: creds.token,
    fields,
    time_range: JSON.stringify({ since: '2026-09-07', until: '2026-09-13' }),
    level: 'campaign',
  });

  try {
    const res = await fetch(`${API_BASE}/${creds.accountId}/insights?${params}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.data || [];
  } catch {
    return null;
  }
}
