import ConnectedAccount from '../models/ConnectedAccount.js';

export async function getAccounts(req, res) {
  const accounts = await ConnectedAccount.find({ userId: req.user._id });
  res.json(accounts);
}

export async function toggleAccount(req, res) {
  const account = await ConnectedAccount.findOne({ _id: req.params.id, userId: req.user._id });
  if (!account) return res.status(404).json({ message: 'Account not found' });

  if (account.status === 'connected') {
    account.status = 'disconnected';
    account.connectedAt = null;
  } else {
    account.status = 'connected';
    account.connectedAt = new Date();
  }
  await account.save();
  res.json(account);
}
