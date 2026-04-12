import User from '../models/User.js';
import Profile from '../models/Profile.js';
import Link from '../models/Link.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    const usersWithStats = await Promise.all(users.map(async (user) => {
      const profile = await Profile.findOne({ user: user._id });
      let linkCount = 0;
      if (profile) linkCount = await Link.countDocuments({ profile: profile._id });
      return { ...user.toObject(), profileId: profile ? profile._id : null, username: profile ? profile.username : 'N/A', linkCount };
    }));
    res.json(usersWithStats);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user._id.toString() === req.user._id.toString()) return res.status(400).json({ message: 'Cannot delete self' });
    const profile = await Profile.findOne({ user: user._id });
    if (profile) {
      await Link.deleteMany({ profile: profile._id });
      await profile.deleteOne();
    }
    await user.deleteOne();
    res.json({ message: 'User removed' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};