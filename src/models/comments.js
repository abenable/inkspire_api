import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  CreatedAt: { type: Date },
  author_Id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'users',
    required: true,
  },
  blog_Id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'blogs',
    required: true,
  },
});

commentSchema.pre('save', async function (next) {
  if (!this.isNew) return next();
  this.CreatedAt = Date.now();
  next();
});

blogSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'author_Id',
    select: 'email',
  }).select('-__v');

  next();
});

export const CommentModel = mongoose.model('comments', commentSchema);
