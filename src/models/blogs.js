import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  content: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    default: 'Lifestyle',
  },
  rating: {
    type: Number,
    max: 5,
    default: 0,
  },

  CreatedAt: { type: Date, default: Date.now },
  author: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'users',
  },
  recommendedByEditor: { type: Boolean, default: false },
  likes: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  reads: { type: Number, default: 0 },
});

blogSchema.pre('save', async function (next) {
  if (!this.isNew) return next();
  this.CreatedAt = Date.now();
  next();
});
blogSchema.index({ '$**': 'text' });

blogSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'author',
    select: 'email',
  }).select('-__v');

  next();
});

export const BlogModel = mongoose.model('blogs', blogSchema);
