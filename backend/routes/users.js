import express from 'express';
import { auth, checkRole } from '../middleware/auth.js';
import { updateProfileImage, getAllUsers, updateProfile, updateUserCategory, deleteUser, updateUserRole, getProfile, updateLanguage } from '../controllers/usersController.js';

const router = express.Router();

// Update profile image
router.post('/profile/image', auth, updateProfileImage);

// Get all users (developer only) with notification status
router.get('/', auth, checkRole(['developer']), getAllUsers);

// Update user profile
router.patch('/profile', auth, updateProfile);

// Update user category (developer only)
router.patch('/:userId/category', auth, checkRole(['developer']), updateUserCategory);

// Delete user (developer only)
router.delete('/:userId', auth, checkRole(['developer']), deleteUser);

// Update user role (developer only)
router.patch('/:userId/role', auth, checkRole(['developer']), updateUserRole);

// Get user profile
router.get('/profile', auth, getProfile);

// Update language preference
router.patch('/language', auth, updateLanguage);

export default router;
