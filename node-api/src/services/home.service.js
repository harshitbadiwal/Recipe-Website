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
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1400&h=600&fit=crop',
        title: 'Delicious Indian Recipes',
        subtitle: 'Discover authentic flavors',
        ctaText: 'Explore Recipes',
      },
      {
        id: 2,
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1400&h=600&fit=crop',
        title: 'Master Chef Specials',
        subtitle: 'Learn from the experts',
        ctaText: 'Watch Videos',
      },
      {
        id: 3,
        image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=1400&h=600&fit=crop',
        title: 'Quick & Easy Meals',
        subtitle: 'Cook delicious food in minutes',
        ctaText: 'Get Started',
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
