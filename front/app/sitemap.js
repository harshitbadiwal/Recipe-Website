import { featuredRecipes, categories, articles, videos } from '@/data/dummyData'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://recipemaster.com'

export default function sitemap() {
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
      url: `${SITE_URL}/videos`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
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

  // Dynamic Recipe pages
  const recipeRoutes = featuredRecipes.map((recipe) => ({
    url: `${SITE_URL}/recipes/${recipe.id}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.9,
  }))

  // Dynamic Category pages
  const categoryRoutes = categories.map((category) => ({
    url: `${SITE_URL}/category/${encodeURIComponent(category.name)}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // Dynamic Article pages
  const articleRoutes = articles.map((article) => ({
    url: `${SITE_URL}/articles/${article.id}`,
    lastModified: currentDate,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticRoutes, ...recipeRoutes, ...categoryRoutes, ...articleRoutes]
}
