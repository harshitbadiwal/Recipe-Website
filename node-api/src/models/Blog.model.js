const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    content: {
      type: String,
      required: [true, 'Blog content is required'],
    },
    excerpt: {
      type: String,
      default: '',
    },
    featuredImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&h=400&fit=crop',
    },
    author: {
      type: String,
      default: 'Chef Master',
    },
    category: {
      type: String,
      default: 'General',
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    seoTitle: { type: String, default: '' },
    seoDescription: { type: String, default: '' },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

blogSchema.index({ title: 'text', content: 'text', excerpt: 'text' });
blogSchema.index({ publishedAt: -1 });

module.exports = mongoose.model('Blog', blogSchema);
