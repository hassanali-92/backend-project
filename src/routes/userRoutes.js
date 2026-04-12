import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import { getAllUsers, deleteUser } from '../controllers/userController.js';
const router = express.Router();
router.get('/', protect, admin, getAllUsers);
router.delete('/:id', protect, admin, deleteUser);
export default router;