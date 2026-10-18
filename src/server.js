import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import dns from 'node:dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import campaignRoutes from './routes/campaignRoutes.js';
import alertRoutes from './routes/alertRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import integrationRoutes from './routes/integrationRoutes.js';
import contentRoutes from './routes/contentRoutes.js';

dotenv.config();

await connectDB();

const app = express();


app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.get('/', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/integrations', integrationRoutes);
app.use('/api/content', contentRoutes);


// Error handler
app.use((err, _req, res, _next) => {
  console.error(err.stack);

  res.status(err.statusCode || 500).json({
    message: err.message || 'Server error',
  });
});

// Port from .env
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
