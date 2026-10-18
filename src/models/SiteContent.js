import mongoose from 'mongoose';

const featureSchema = new mongoose.Schema({
  icon: { type: String, default: 'BarChart3' },
  title: { type: String, required: true },
  desc: { type: String, required: true },
});

const stepSchema = new mongoose.Schema({
  num: { type: String, default: '01' },
  title: { type: String, required: true },
  desc: { type: String, required: true },
});

const planFeatureSchema = new mongoose.Schema({
  text: { type: String, required: true },
});

const planSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: String, required: true },
  period: { type: String, default: '/month' },
  desc: { type: String, default: '' },
  features: [planFeatureSchema],
  cta: { type: String, default: 'Start free trial' },
  highlighted: { type: Boolean, default: false },
});

const statSchema = new mongoose.Schema({
  value: { type: String, required: true },
  label: { type: String, required: true },
});

const siteContentSchema = new mongoose.Schema({
  // Hero section
  heroBadge: { type: String, default: 'Your AI Performance Marketing Employee' },
  heroTitleLine1: { type: String, default: "Don't just see your data." },
  heroTitleLine2: { type: String, default: 'Understand it.' },
  heroDescription: { type: String, default: 'One platform that connects Google Ads, Meta Ads, Shopify, and GA4 — then uses AI to tell you what happened, why it happened, and exactly what to do next.' },
  heroCtaPrimary: { type: String, default: 'Start your free trial' },
  heroCtaSecondary: { type: String, default: 'View live demo' },
  heroSubtext: { type: String, default: 'No credit card required · 14-day free trial · Cancel anytime' },

  // Features section
  featuresBadge: { type: String, default: 'Everything in one place' },
  featuresTitle: { type: String, default: 'The marketing platform that thinks' },
  featuresDescription: { type: String, default: 'Traditional dashboards show you data. MarketingAI tells you what to do with it.' },
  features: [featureSchema],

  // How it works
  howTitle: { type: String, default: 'How it works' },
  howDescription: { type: String, default: 'Three steps to your AI marketing employee' },
  steps: [stepSchema],

  // USP section
  uspBadge: { type: String, default: 'The difference' },
  uspTitle: { type: String, default: 'Traditional dashboards say' },
  uspTitleHighlight: { type: String, default: '"Here is your data."' },
  uspDescription: { type: String, default: 'MarketingAI says "Here is what happened, why it happened, and what you should do next." That is the difference between a reporting tool and an AI marketing employee.' },

  // Stats
  stats: [statSchema],

  // Pricing
  pricingTitle: { type: String, default: 'Simple, transparent pricing' },
  pricingDescription: { type: String, default: 'Choose the plan that fits your business. Upgrade or downgrade anytime.' },
  plans: [planSchema],

  // CTA section
  ctaTitle: { type: String, default: 'Ready to hire your AI marketing employee?' },
  ctaDescription: { type: String, default: 'Join D2C brands and agencies using MarketingAI to save hours of reporting and catch problems before they scale.' },
  ctaButtonText: { type: String, default: 'Start your free trial' },

  // Footer
  footerText: { type: String, default: '© 2026 MarketingAI. All rights reserved.' },
  footerLinks: [{ label: String, url: String }],

  // Branding
  brandName: { type: String, default: 'MarketingAI' },
}, { timestamps: true });

siteContentSchema.statics.getSingleton = async function () {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({});
  }
  return doc;
};

export default mongoose.model('SiteContent', siteContentSchema);
