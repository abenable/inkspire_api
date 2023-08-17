import express from 'express';
import { protect, restrictTo } from '../controllers/authController.js';
import {
  allUsers,
  delUser,
  searchUser,
} from '../controllers/userController.js';

const router = express.Router();

router.delete('/delete/:userId', protect, restrictTo('admin'), delUser);
router.get('/search', protect, restrictTo('admin'), searchUser);
router.get('', protect, restrictTo('admin'), allUsers);

export { router as userRouter };
