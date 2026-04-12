import Link from '../models/Link.js';
import Profile from '../models/Profile.js';

export const createLink = async (req, res) => {
  try {
    const { title, url } = req.body;
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    const link = await Link.create({ profile: profile._id, title, url });
    res.status(201).json(link);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

export const getMyLinks = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    const links = await Link.find({ profile: profile._id }).sort({ order: 1, createdAt: -1 });
    res.json(links);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

export const updateLink = async (req, res) => {
  try {
    const link = await Link.findById(req.params.id);
    if (!link) return res.status(404).json({ message: 'Link not found' });
    const profile = await Profile.findOne({ user: req.user._id });
    if (link.profile.toString() !== profile._id.toString()) return res.status(401).json({ message: 'Not authorized' });
    link.title = req.body.title || link.title;
    link.url = req.body.url || link.url;
    await link.save();
    res.json(link);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

export const toggleLinkStatus = async (req, res) => {
  try {
    const link = await Link.findById(req.params.id);
    if (!link) return res.status(404).json({ message: 'Link not found' });
    const profile = await Profile.findOne({ user: req.user._id });
    if (link.profile.toString() !== profile._id.toString()) return res.status(401).json({ message: 'Not authorized' });
    link.isActive = !link.isActive;
    await link.save();
    res.json(link);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

export const deleteLink = async (req, res) => {
  try {
    const link = await Link.findById(req.params.id);
    if (!link) return res.status(404).json({ message: 'Link not found' });
    const profile = await Profile.findOne({ user: req.user._id });
    if (link.profile.toString() !== profile._id.toString()) return res.status(401).json({ message: 'Not authorized' });
    await link.deleteOne();
    res.json({ message: 'Link removed' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

export const incrementClick = async (req, res) => {
  try {
    const link = await Link.findById(req.params.id);
    if (!link) return res.status(404).json({ message: 'Link not found' });
    link.clicks += 1;
    await link.save();
    res.json({ clicks: link.clicks });
  } catch (error) { res.status(500).json({ message: error.message }); }
};