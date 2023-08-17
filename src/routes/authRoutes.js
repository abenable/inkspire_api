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

router.get('/users', protect, restrictTo('admin'), async (req, res) => {
  const users = await UserModel.find();
  res.json(users);
});

router.delete('/users', protect, restrictTo('admin'), async (req, res) => {
  const users = await UserModel.deleteMany({ role: 'user' });
  res.json(users);
});

router.delete('/user/:id', protect, restrictTo('admin'), async (req, res) => {
  const userId = req.params.id;
  const user = await UserModel.deleteOne({ _id: userId });
  res.json(user);
});

router.post('/users', async (req, res) => {
  const users = await UserModel.create(req.body);
  res.json(users);
});

export { router as authRouter };
