const recipeService = require('./recipe.service');
const categoryService = require('./category.service');
const blogService = require('./blog.service');

class HomeService {
  async getHomepageContent() {
    const [featuredRecipes, latestRecipes, categories, blogs] = await Promise.all([
      recipeService.getFeaturedRecipes(8),
      recipeService.getLatestRecipes(8),
      categoryService.getCategories(),
      blogService.getBlogs({ page: 1, limit: 4 }),
    ]);

    const heroSlides = [
      {
        id: 1,
        image: '/Gemini_Generated_Image_3xpagu3xpagu3xpa_compressed.webp',
        title: 'Delicious Indian Recipes',
        subtitle: 'Discover authentic flavors & chef-crafted delicacies',
        ctaText: 'Explore Recipes',
      },
      {
        id: 2,
        image: '/Gemini_Generated_Image_51wxoi51wxoi51wx_compressed.webp',
        title: 'Master Chef Specials',
        subtitle: 'Learn authentic cooking techniques and secret spices',
        ctaText: 'Explore Recipes',
      },
    ];

    const videos = [
      {
        id: 1,
        title: 'How to Make Perfect Biryani',
        thumbnail: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=400&h=225&fit=crop',
        duration: '15:30',
      },
      {
        id: 2,
        title: 'Butter Chicken Recipe',
        thumbnail: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=225&fit=crop',
        duration: '12:45',
      },
      {
        id: 3,
        title: 'Paneer Tikka Masala',
        thumbnail: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=225&fit=crop',
        duration: '10:20',
      },
    ];

    return {
      heroSlides,
      featuredRecipes,
      latestRecipes,
      categories,
      latestBlogs: blogs.blogs,
      videos,
    };
  }
}

module.exports = new HomeService();
