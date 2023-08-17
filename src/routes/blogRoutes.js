import express from 'express';
import { ApiError } from '../controllers/errorController.js';
import { BlogModel } from '../models/blogs.js';
import { protect } from '../controllers/authController.js';

const router = express.Router();

router.post('/add', protect, async (req, res, next) => {
  const { title, content } = req.body;
  try {
    const blog = await BlogModel.create({
      title,
      content,
      author_Id: req.user.id,
    });

    res.status(201).json({
      status: 'success',
      message: 'Blog created successfully.',
      data: blog,
    });
  } catch (error) {
    console.error(error);
    next(new ApiError(500, 'internal server error'));
  }
});

router.get('/all', protect, async (req, res, next) => {
  try {
    const blogs = await BlogModel.find();
    res.status(200).json({ blogs });
  } catch (error) {
    console.error(error);
    next(new ApiError(500, 'internal server error'));
  }
});

router.get('/search', async (req, res, next) => {
  try {
    const blogs = await BlogModel.find({
      $text: { $search: req.body.keyword },
    });
    res.status(200).json({ blogs });
  } catch (error) {
    console.error(error);
    next(new ApiError(500, 'internal server error'));
  }
});

router.delete('/delete', protect, async (req, res, next) => {
  try {
    const blog = await BlogModel.findById(req.params.id);
    if (!req.user.id == blog.author_Id || req.user.role !== 'admin') {
      return new ApiError(403, 'You are not allowed to perform this action.');
    }
    await BlogModel.deleteOne({ id: blog._id });
    res.status(200).json({
      status: 'success',
      message: 'Blog deleted successfully..',
    });
  } catch (error) {
    console.error(error);
    next(new ApiError(500, 'Internal server error.'));
  }
});

router.get('/trending', async (req, res) => {
  const timeSpan = 7 * 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  const currentTime = Date.now();

  try {
    const trendingPosts = await BlogPost.find({
      createdAt: { $gte: currentTime - timeSpan },
    })
      .sort({ reads: -1 })
      .limit(10);
    res.json(trendingPosts);
  } catch (error) {
    res.status(500).json({ error: 'Could not retrieve trending posts.' });
  }
});

router.get('/top', async (req, res) => {
  try {
    const topPosts = await BlogPost.find().sort({ likes: -1 }).limit(10); // Retrieve top 10 posts
    res.json(topPosts);
  } catch (error) {
    res.status(500).json({ error: 'Could not retrieve top posts.' });
  }
});

router.get('/latest', async (req, res) => {
  try {
    const latestPosts = await BlogPost.find().sort({ createdAt: -1 }).limit(10);
    // Retrieve latest 10 posts
    res.json(latestPosts);
  } catch (error) {
    res.status(500).json({ error: 'Could not retrieve latest posts.' });
  }
});

router.get('/recommended', async (req, res) => {
  try {
    const recommendedPosts = await BlogPost.find({ recommendedByEditor: true });
    res.json(recommendedPosts);
  } catch (error) {
    res.status(500).json({ error: 'Could not retrieve recommended posts.' });
  }
});

export { router as blogRouter };
