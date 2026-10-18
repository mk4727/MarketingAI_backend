import SiteContent from '../models/SiteContent.js';

export async function getContent(_req, res) {
  const doc = await SiteContent.getSingleton();
  res.json(doc);
}

export async function updateContent(req, res) {
  const doc = await SiteContent.getSingleton();
  const allowed = [
    'heroBadge', 'heroTitleLine1', 'heroTitleLine2', 'heroDescription',
    'heroCtaPrimary', 'heroCtaSecondary', 'heroSubtext',
    'featuresBadge', 'featuresTitle', 'featuresDescription', 'features',
    'howTitle', 'howDescription', 'steps',
    'uspBadge', 'uspTitle', 'uspTitleHighlight', 'uspDescription',
    'stats',
    'pricingTitle', 'pricingDescription', 'plans',
    'ctaTitle', 'ctaDescription', 'ctaButtonText',
    'footerText', 'footerLinks',
    'brandName',
  ];
  for (const key of allowed) {
    if (req.body[key] !== undefined) {
      doc[key] = req.body[key];
    }
  }
  await doc.save();
  res.json(doc);
}
