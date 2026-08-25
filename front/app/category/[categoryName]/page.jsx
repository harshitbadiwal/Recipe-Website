import Link from 'next/link'
import { featuredRecipes, categories } from '@/data/dummyData'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://recipemaster.com'

export async function generateMetadata({ params }) {
  const { categoryName } = await params
  const decodedCategory = decodeURIComponent(categoryName)
  const categoryInfo = categories.find((c) => c.name.toLowerCase() === decodedCategory.toLowerCase())

  const pageTitle = `${decodedCategory} Recipes - Authentic ${decodedCategory} Dishes`
  const pageDesc = `Explore our collection of authentic ${decodedCategory} recipes. Step-by-step cooking instructions, ingredient lists, and chef tips.`
  const categoryImage =
    categoryInfo?.image ||
    'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=1200&h=630&fit=crop'

  return {
    title: pageTitle,
    description: pageDesc,
    openGraph: {
      title: `${decodedCategory} Recipes - Recipe Master`,
      description: pageDesc,
      url: `${SITE_URL}/category/${encodeURIComponent(categoryName)}`,
      images: [
        {
          url: categoryImage,
          width: 1200,
          height: 630,
          alt: `${decodedCategory} Recipes`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${decodedCategory} Recipes - Recipe Master`,
      description: pageDesc,
      images: [categoryImage],
    },
  }
}

export default async function CategoryRecipesPage({ params }) {
  const { categoryName } = await params
  const decodedCategory = decodeURIComponent(categoryName)

  const filteredRecipes = featuredRecipes.filter(
    (recipe) => recipe.category.toLowerCase() === decodedCategory.toLowerCase()
  )

  return (
    <main className="category-page">
      <div className="category-hero">
        <div className="container">
          <p className="breadcrumb">
            <Link href="/">Home</Link> / <Link href="/recipes">Recipes</Link> / <span>{decodedCategory}</span>
          </p>
          <h1 className="category-title">{decodedCategory} Recipes</h1>
          <p className="category-subtitle">
            Showing all featured recipes in the <strong>{decodedCategory}</strong> category.
          </p>
        </div>
      </div>

      <div className="container">
        {filteredRecipes.length === 0 ? (
          <div className="category-empty">
            <p>No recipes found in this category yet.</p>
            <Link href="/recipes" className="back-link">
              Back to all recipes
            </Link>
          </div>
        ) : (
          <div className="category-recipes-grid">
            {filteredRecipes.map((recipe) => (
              <Link key={recipe.id} href={`/recipes/${recipe.id}`} className="recipe-card-link">
                <div className="category-recipe-card">
                  <div className="category-recipe-image-wrapper">
                    <img src={recipe.image} alt={recipe.title} className="category-recipe-image" loading="lazy" />
                  </div>
                  <div className="category-recipe-info">
                    <h3>{recipe.title}</h3>
                    <p className="category-recipe-meta">
                      {recipe.difficulty} • {recipe.time}
                    </p>
                    <p className="category-recipe-desc">{recipe.description.slice(0, 80)}...</p>
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
