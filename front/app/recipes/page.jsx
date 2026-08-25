import Link from 'next/link'
import { featuredRecipes } from '@/data/dummyData'

export const metadata = {
  title: 'All Featured Recipes - Discover Authentic Flavors',
  description:
    'Browse our comprehensive catalog of vegetarian, non-vegetarian, snacks, breads, and dessert recipes with prep times and difficulties.',
  openGraph: {
    title: 'All Featured Recipes - Recipe Master',
    description:
      'Browse our comprehensive catalog of vegetarian, non-vegetarian, snacks, breads, and dessert recipes.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=1200&h=630&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Featured Recipes Collection',
      },
    ],
  },
}

export default async function RecipesPage({ searchParams }) {
  const resolvedParams = await searchParams
  const query = resolvedParams?.q?.toLowerCase()?.trim() || ''

  const recipes = query
    ? featuredRecipes.filter(
        (r) =>
          r.title.toLowerCase().includes(query) ||
          r.category.toLowerCase().includes(query) ||
          r.description.toLowerCase().includes(query)
      )
    : featuredRecipes

  return (
    <main className="recipes-page">
      <div className="recipes-hero">
        <div className="container">
          <h1 className="recipes-hero-title">
            {query ? `Search Results for "${query}"` : 'All Featured Recipes'}
          </h1>
          <p className="recipes-hero-subtitle">
            {query
              ? `Found ${recipes.length} matching recipe(s) in our master catalog.`
              : 'Explore our curated catalog of authentic recipes, from slow-simmered curries to crispy street snacks.'}
          </p>
        </div>
      </div>

      <div className="container">
        {recipes.length === 0 ? (
          <div className="category-empty">
            <p>No recipes found matching &quot;{query}&quot;.</p>
            <Link href="/recipes" className="back-link full-width">
              ← View All Recipes
            </Link>
          </div>
        ) : (
          <div className="recipes-grid-page">
            {recipes.map((recipe) => (
              <Link key={recipe.id} href={`/recipes/${recipe.id}`} className="recipe-card-link">
                <div className="recipe-card-page">
                  <div className="recipe-image-wrapper-page">
                    <img src={recipe.image} alt={recipe.title} className="recipe-image-page" loading="lazy" />
                    <span className="recipe-category-page">{recipe.category}</span>
                    <span className="recipe-time-page">{recipe.time}</span>
                  </div>
                  <div className="recipe-info-page">
                    <h3 className="recipe-title-page">{recipe.title}</h3>
                    <p className="recipe-meta-page">
                      {recipe.difficulty} • {recipe.time}
                    </p>
                    <p className="recipe-description-page">{recipe.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
