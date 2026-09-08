import { getRecipes, getCategories, getBlogs } from '@/services/api'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://recipemaster.com'

export default async function sitemap() {
  const currentDate = new Date().toISOString()

  // Base static routes
  const staticRoutes = [
    {
      url: `${SITE_URL}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/recipes`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/categories`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // {
    //   url: `${SITE_URL}/videos`,
    //   lastModified: currentDate,
    //   changeFrequency: 'weekly',
    //   priority: 0.8,
    // },
    {
      url: `${SITE_URL}/articles`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]

  // Dynamic Recipe pages from API
  let recipeRoutes = []
  try {
    const { recipes } = await getRecipes({ limit: 100 })
    recipeRoutes = recipes.map((recipe) => ({
      url: `${SITE_URL}/recipes/${recipe.slug || recipe._id}`,
      lastModified: recipe.updatedAt || recipe.createdAt || currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    }))
  } catch (err) {
    console.warn('Failed to fetch recipes for sitemap:', err.message)
  }

  // Dynamic Category pages from API
  let categoryRoutes = []
  try {
    const activeCategories = await getCategories()
    categoryRoutes = activeCategories.map((category) => ({
      url: `${SITE_URL}/category/${category.slug || category.name}`,
      lastModified: category.updatedAt || category.createdAt || currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    }))
  } catch (err) {
    console.warn('Failed to fetch categories for sitemap:', err.message)
  }

  // Dynamic Article pages from API
  let articleRoutes = []
  try {
    const blogs = await getBlogs()
    articleRoutes = blogs.map((article) => ({
      url: `${SITE_URL}/articles/${article.slug || article._id}`,
      lastModified: article.updatedAt || article.publishedAt || currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    }))
  } catch (err) {
    console.warn('Failed to fetch blogs for sitemap:', err.message)
  }

  return [...staticRoutes, ...recipeRoutes, ...categoryRoutes, ...articleRoutes]
}
