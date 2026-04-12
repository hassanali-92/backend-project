import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { createOrUpdateProfile, getMyProfile, getPublicProfile } from '../controllers/profileController.js';
const router = express.Router();
router.post('/', protect, createOrUpdateProfile);
router.get('/me', protect, getMyProfile);
router.get('/:username', getPublicProfile);
export default router;