function getCredentials() {
  const domain = process.env.SHOPIFY_SHOP_DOMAIN;
  const token = process.env.SHOPIFY_ACCESS_TOKEN;
  if (!domain || !token) return null;
  return { domain, token };
}

export async function getShopifyProducts() {
  const creds = getCredentials();
  if (!creds) return null;

  try {
    const res = await fetch(`https://${creds.domain}/admin/api/2024-07/products.json?limit=50`, {
      headers: { 'X-Shopify-Access-Token': creds.token },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const products = data.products || [];

    return products.map((p) => {
      const variant = p.variants?.[0] || {};
      const inventory = Number(variant.inventory_quantity || 0);
      const price = Number(variant.price || 0);
      const status = inventory === 0 ? 'out-of-stock' : inventory < 20 ? 'low-stock' : 'in-stock';
      return {
        _id: `shop-${p.id}`,
        name: p.title,
        sku: variant.sku || '',
        price,
        inventory,
        unitsSold: 0,
        revenue: 0,
        trend: 0,
        status,
      };
    });
  } catch {
    return null;
  }
}

export async function getShopifyOrders() {
  const creds = getCredentials();
  if (!creds) return null;

  try {
    const res = await fetch(`https://${creds.domain}/admin/api/2024-07/orders.json?limit=50&status=any`, {
      headers: { 'X-Shopify-Access-Token': creds.token },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const orders = data.orders || [];

    const totalRevenue = orders.reduce((s, o) => s + Number(o.total_price || 0), 0);
    const totalOrders = orders.length;

    return {
      totalRevenue: Math.round(totalRevenue),
      totalOrders,
      aov: totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0,
    };
  } catch {
    return null;
  }
}
