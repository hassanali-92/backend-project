import Profile from '../models/Profile.js';
import Link from '../models/Link.js';

export const createOrUpdateProfile = async (req, res) => {
  try {
    const { username, fullName, bio, profileImage, theme } = req.body;
    const existing = await Profile.findOne({ username });
    if (existing && existing.user.toString() !== req.user._id.toString()) return res.status(400).json({ message: 'Username taken' });
    
    let profile = await Profile.findOne({ user: req.user._id });
    if (profile) {
      Object.assign(profile, { username, fullName, bio, profileImage, theme });
      await profile.save();
    } else {
      profile = await Profile.create({ user: req.user._id, username, fullName, bio, profileImage, theme });
    }
    res.json(profile);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

export const getMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

export const getPublicProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ username: req.params.username });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    const links = await Link.find({ profile: profile._id, isActive: true }).sort({ order: 1 });
    res.json({ profile, links });
  } catch (error) { res.status(500).json({ message: error.message }); }
};