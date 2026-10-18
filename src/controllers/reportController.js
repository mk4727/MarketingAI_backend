import Report from '../models/Report.js';

export async function getReports(req, res) {
  const { type } = req.query;
  const filter = { userId: req.user._id };
  if (type && type !== 'all') filter.type = type;
  const reports = await Report.find(filter).sort({ createdAt: -1 });
  res.json(reports);
}

export async function getReport(req, res) {
  const report = await Report.findOne({ _id: req.params.id, userId: req.user._id });
  if (!report) return res.status(404).json({ message: 'Report not found' });
  res.json(report);
}
