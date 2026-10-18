import Alert from '../models/Alert.js';

export async function getAlerts(req, res) {
  const { severity } = req.query;
  const filter = { userId: req.user._id };
  if (severity && severity !== 'all') filter.severity = severity;
  const alerts = await Alert.find(filter).sort({ createdAt: -1 });
  res.json(alerts);
}

export async function markRead(req, res) {
  const alert = await Alert.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { isRead: true },
    { new: true }
  );
  if (!alert) return res.status(404).json({ message: 'Alert not found' });
  res.json(alert);
}

export async function markAllRead(req, res) {
  await Alert.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });
  res.json({ message: 'All alerts marked as read' });
}
