import jwt from 'jsonwebtoken';
import User from '../models/User.js';

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
}

export async function signup(req, res) {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ message: 'Email already registered' });

  const initials = fullName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const user = await User.create({ fullName, email, password, avatarInitials: initials });
  const token = signToken(user._id);
  res.status(201).json({
    token,
    user: { id: user._id, fullName: user.fullName, email: user.email, avatarInitials: initials, isAdmin: user.isAdmin || false },
  });
}

export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = signToken(user._id);
  res.json({
    token,
    user: { id: user._id, fullName: user.fullName, email: user.email, avatarInitials: user.avatarInitials, isAdmin: user.isAdmin || false },
  });
}

export async function getMe(req, res) {
  res.json({
    user: {
      id: req.user._id,
      fullName: req.user.fullName,
      email: req.user.email,
      avatarInitials: req.user.avatarInitials,
      isAdmin: req.user.isAdmin || false,
    },
  });
}

export async function updateProfile(req, res) {
  const { fullName, company, role } = req.body;
  if (fullName) req.user.fullName = fullName;
  if (company) req.user.company = company;
  if (role) req.user.role = role;
  req.user.avatarInitials = (fullName || req.user.fullName).split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  await req.user.save();
  res.json({ user: { id: req.user._id, fullName: req.user.fullName, email: req.user.email, avatarInitials: req.user.avatarInitials } });
}
