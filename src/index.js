import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';

import { ApiError, ErrorHandler } from './controllers/errorController.js';
import { blogRouter } from './routes/blogRoutes.js';
import { authRouter } from './routes/authRoutes.js';
import { getDirname, limiter } from './utils/util.js';

const port = process.env.PORT;
const uri = process.env.URI;
const local_uri = process.env.LOCAL_URI;
const __dirname = getDirname(import.meta.url);

// Start express app
const app = express();

// 1) GLOBAL MIDDLEWARES
app.use(cors());
app.options('*', cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(helmet());
app.use('/', limiter);
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// 2) ROUTES
app.use('/auth', authRouter);
app.use('/blog', blogRouter);
app.use('/view', viewRouter);
app.use('/', (req, res, next) => {
  res.status(200).render('homepage', { title: 'Home' });
});
app.all('*', (req, res, next) => {
  next(
    new ApiError(404, `Oooops!! Can't find ${req.originalUrl} on this server!`)
  );
});

app.use(ErrorHandler);

// Start express Server.
app.listen(port, async () => {
  console.log(`Server running on port ${port}`);
  try {
    await mongoose.connect(local_uri);
    console.log('Connected to database.');
  } catch (error) {
    console.error(error);
  }
});
