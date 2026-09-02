const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  item: { type: String, required: true },
  qty: { type: String, default: '' },
  note: { type: String, default: '' },
});

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Recipe title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop',
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: false,
      index: true,
    },
    categoryName: {
      type: String,
      default: '',
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        index: true,
      },
    ],
    categoryNames: [
      {
        type: String,
      },
    ],
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    prepTime: {
      type: Number, // in minutes
      default: 15,
    },
    cookTime: {
      type: Number, // in minutes
      default: 30,
    },
    totalTime: {
      type: Number, // in minutes
      default: 45,
    },
    servings: {
      type: Number,
      default: 4,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Easy',
    },
    ingredients: [ingredientSchema],
    instructions: [
      {
        type: String,
        required: true,
      },
    ],
    nutrition: {
      calories: { type: String, default: '450 kcal' },
      protein: { type: String, default: '20g' },
      carbs: { type: String, default: '30g' },
      fats: { type: String, default: '15g' },
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
    isScheduled: {
      type: Boolean,
      default: false,
      index: true,
    },
    scheduledDate: {
      type: String,
      default: '',
    },
    scheduledTime: {
      type: String,
      default: '',
    },
    scheduledAt: {
      type: Date,
      default: null,
      index: true,
    },
    ratingAverage: {
      type: Number,
      default: 4.8,
      min: 0,
      max: 5,
    },
    ratingCount: {
      type: Number,
      default: 10,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    authorName: {
      type: String,
      default: 'Chef Master',
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

recipeSchema.index({ title: 'text', description: 'text', tags: 'text' });
recipeSchema.index({ createdAt: -1 });
recipeSchema.index({ isPublished: 1, isScheduled: 1, scheduledAt: 1 });

module.exports = mongoose.model('Recipe', recipeSchema);
