import ChatMessage from '../models/ChatMessage.js';

const aiResponses = {
  roas: `Your ROAS dropped from 4.80 to 3.70 yesterday. Here's the breakdown:

**What happened:**
• Google Ads spend increased 25% (₹28,000 → ₹35,000) driven by the Search - Non-Brand Generic campaign
• Conversion rate decreased by 18% across Google Ads
• Meta Ads frequency hit 5.8 on the Interest Stack campaign, causing CTR to drop from 0.34% to 0.23%
• Shopify checkout conversion decreased from 2.8% to 1.9%

**Why it happened:**
The main driver was increased auction competition on Google Ads, pushing CPC up 17%. Combined with creative fatigue on Meta Ads, both platforms saw reduced efficiency simultaneously.

**What to do next:**
1. Reduce Search - Non-Brand Generic budget by 15% (saves ₹1,860/day)
2. Pause the keyword "running shoes online" (CPA ₹816 vs target ₹250)
3. Upload 3-5 new Meta creatives to reset frequency
4. Check GA4 for checkout funnel issues — the drop from 2.8% to 1.9% suggests a UX or payment problem`,
  product: `Based on your Shopify and ad performance data, I recommend advertising **SpeedForce Athletic Shoes**.

**Why this product:**
• Sales trend: +15.8% week-over-week (your fastest-growing product)
• Revenue: ₹2,23,936 last month
• Ad ROAS when promoted: 5.71 (above account average)
• Conversion rate: 2.4% (vs 1.8% account average)
• Price point: ₹3,499 (good margin for ad spend)

**Urgent issue:**
Only 8 units left in stock. If you increase ad spend, restock first — otherwise you'll drive traffic to an out-of-stock product and waste budget.

**Recommended action:**
1. Restock to at least 200 units
2. Allocate ₹3,000/day in Google Shopping
3. Create a Meta Advantage+ Shopping campaign
4. Target lookalike audience based on past buyers`,
  default: `I'm analyzing your marketing data across Google Ads, Meta Ads, Shopify, GA4, and Merchant Center.

Based on current performance, here are the key takeaways:

• **Overall ROAS**: 4.37 (down 2.8% from yesterday)
• **Total Spend**: ₹48,000 across all platforms
• **Revenue**: ₹2,10,000
• **Active Alerts**: 4 issues detected

Ask me about specific campaigns, products, or metrics for a detailed analysis.`,
};

function getAIResponse(query) {
  const lower = query.toLowerCase();
  if (lower.includes('roas') || lower.includes('drop')) return aiResponses.roas;
  if (lower.includes('product') || lower.includes('advertise')) return aiResponses.product;
  return aiResponses.default;
}

export async function chat(req, res) {
  const { message } = req.body;
  if (!message) return res.status(400).json({ message: 'Message is required' });

  await ChatMessage.create({ userId: req.user._id, role: 'user', content: message });

  const content = getAIResponse(message);
  const followUps = ['Show the numbers behind this', 'What should I do first?', 'Compare with last week'];

  const aiMsg = await ChatMessage.create({ userId: req.user._id, role: 'assistant', content, followUps });

  res.json({
    role: 'assistant',
    content,
    followUps,
    id: aiMsg._id,
  });
}

export async function getChatHistory(req, res) {
  const messages = await ChatMessage.find({ userId: req.user._id }).sort({ createdAt: 1 }).limit(50);
  res.json(messages);
}
