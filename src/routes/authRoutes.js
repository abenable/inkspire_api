import express from 'express';
import {
  AdminRegister,
  Login,
  Register,
  forgotpassword,
  protect,
  resetpassword,
  restrictTo,
  updatepassword,
} from '../controllers/authController.js';
import { UserModel } from '../models/users.js';

const router = express.Router();

router.post('/register', Register);
router.post('/admin/register', AdminRegister);
router.post('/login', Login);
router.post('/forgotpassword', forgotpassword);
router.post('/updatepassword', updatepassword);
router.patch('/resetpassword/:token', resetpassword);

export { router as authRouter };
