import Link from 'next/link'
import { featuredRecipes } from '@/data/dummyData'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://recipemaster.com'

export async function generateMetadata({ params }) {
  const { id } = await params
  const recipe = featuredRecipes.find((r) => r.id === id)

  if (!recipe) {
    return {
      title: 'Recipe Not Found',
      description: 'The requested recipe could not be found.',
    }
  }

  const recipeUrl = `${SITE_URL}/recipes/${recipe.id}`
  const pageTitle = `${recipe.title} Recipe - How to Make ${recipe.title}`
  const pageDescription = `${recipe.description} | Category: ${recipe.category} | Cooking Time: ${recipe.time} | Difficulty: ${recipe.difficulty}`

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: [
      recipe.title,
      `${recipe.title} recipe`,
      `${recipe.category} recipes`,
      'how to cook',
      recipe.difficulty,
      'cooking instructions',
    ],
    alternates: {
      canonical: recipeUrl,
    },
    openGraph: {
      title: `${recipe.title} - Authentic Step-by-Step Recipe`,
      description: recipe.description,
      url: recipeUrl,
      siteName: 'Recipe Master',
      type: 'article',
      publishedTime: '2026-02-15T08:00:00.000Z',
      authors: ['Chef Master & Culinary Team'],
      images: [
        {
          url: recipe.image,
          width: 1200,
          height: 630,
          alt: `${recipe.title} Dish Platter`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${recipe.title} Recipe - Step by Step Guide`,
      description: recipe.description,
      images: [recipe.image],
      creator: '@recipemaster',
    },
  }
}

export default async function RecipeDetailPage({ params }) {
  const { id } = await params
  const recipe = featuredRecipes.find((r) => r.id === id)

  if (!recipe) {
    return (
      <main className="recipe-detail-page">
        <div className="container">
          <div className="recipe-not-found">
            <span className="not-found-icon">🍽️</span>
            <h1>Recipe not found</h1>
            <p>The culinary creation you are looking for might have been moved or updated.</p>
            <Link href="/recipes" className="back-link full-width">
              ← Back to all recipes
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const sampleIngredients = [
    { item: 'Main Protein / Starches', qty: '500g', note: 'Freshly prepped' },
    { item: 'Extra Virgin Olive Oil / Ghee', qty: '3 tbsp', note: 'Organic cold-pressed' },
    { item: 'Aromatic Spice Blend (Garam Masala / Herbs)', qty: '2 tsp', note: 'Freshly ground' },
    { item: 'Onions & Garlic Paste', qty: '2 medium', note: 'Finely minced' },
    { item: 'Pureed Ripe Tomatoes / Broth', qty: '1.5 cups', note: 'Simmered base' },
    { item: 'Fresh Cilantro / Basil Leaves', qty: 'Handful', note: 'For garnish' },
  ]

  const sampleSteps = [
    'Prepare and wash all fresh ingredients. Measure spices and aromatics in advance.',
    'Heat oil or butter in a heavy-bottom pan over medium heat. Sauté aromatics until fragrant and golden brown.',
    'Add core spices and stir continuously for 60 seconds to release the essential culinary oils.',
    'Pour in the sauce base, bring to a gentle boil, then lower the flame to simmer for 15-20 minutes.',
    'Fold in the main ingredients, cook until perfectly tender, and rest for 5 minutes before serving garnished.',
  ]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.title,
    image: [recipe.image],
    description: recipe.description,
    recipeCategory: recipe.category,
    prepTime: 'PT15M',
    cookTime: 'PT30M',
    totalTime: `PT${parseInt(recipe.time) || 45}M`,
    recipeYield: '4 servings',
    author: {
      '@type': 'Person',
      name: 'Chef Master',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '128',
    },
    nutrition: {
      '@type': 'NutritionInformation',
      calories: '480 calories',
    },
    recipeIngredient: sampleIngredients.map((ing) => `${ing.qty} ${ing.item}`),
    recipeInstructions: sampleSteps.map((step, idx) => ({
      '@type': 'HowToStep',
      name: `Step ${idx + 1}`,
      text: step,
    })),
  }

  return (
    <main className="recipe-detail-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="recipe-detail-hero">
        <div className="container">
          <p className="breadcrumb">
            <Link href="/">Home</Link> <span className="breadcrumb-sep">/</span>{' '}
            <Link href="/recipes">Recipes</Link> <span className="breadcrumb-sep">/</span>{' '}
            <span>{recipe.title}</span>
          </p>
          <div className="recipe-header-title-row">
            <div>
              <span className="detail-category-badge">{recipe.category}</span>
              <h1 className="recipe-detail-title">{recipe.title}</h1>
            </div>
          </div>
          <div className="recipe-detail-meta-pills">
            <span className="meta-pill">
              ⏱ <strong>Prep Time:</strong> {recipe.time}
            </span>
            <span className="meta-pill">
              🎯 <strong>Difficulty:</strong> {recipe.difficulty}
            </span>
            <span className="meta-pill">⭐ <strong>Rating:</strong> 4.9 (120+ reviews)</span>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="recipe-detail-layout">
          <div className="recipe-detail-main">
            <div className="recipe-detail-image-wrapper">
              <img src={recipe.image} alt={recipe.title} className="recipe-detail-image" />
              <div className="detail-image-glow"></div>
            </div>

            <div className="recipe-detail-section">
              <h2 className="section-subheading">About this Dish</h2>
              <p className="recipe-lead-text">{recipe.description}</p>
              <p className="recipe-body-text">
                Crafted with authentic cooking principles, this recipe balances layered heat, delicate aromatics, and rich textures for an unforgettable restaurant-quality experience at home.
              </p>
            </div>

            <div className="recipe-detail-section">
              <h2 className="section-subheading">Key Ingredients</h2>
              <div className="ingredients-grid">
                {sampleIngredients.map((ing, i) => (
                  <div key={i} className="ingredient-item">
                    <span className="ingredient-bullet">✔</span>
                    <div className="ingredient-text">
                      <strong>{ing.item}</strong>
                      <span className="ingredient-qty">
                        {ing.qty} • {ing.note}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="recipe-detail-section">
              <h2 className="section-subheading">Step-by-Step Instructions</h2>
              <div className="steps-list">
                {sampleSteps.map((step, idx) => (
                  <div key={idx} className="step-card">
                    <div className="step-number">{idx + 1}</div>
                    <div className="step-content">
                      <h4>Step {idx + 1}</h4>
                      <p>{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="recipe-detail-sidebar">
            <div className="sidebar-card highlight-card">
              <h3>Chef's Pro Tip 💡</h3>
              <p>
                Toast your whole spices lightly in a dry pan before grinding to unlock deeper floral and earthy aromatic tones.
              </p>
            </div>

            <div className="sidebar-card">
              <h3>Quick Nutrition Facts</h3>
              <div className="nutrition-row">
                <span>Estimated Calories:</span>
                <strong>480 kcal</strong>
              </div>
              <div className="nutrition-row">
                <span>Protein:</span>
                <strong>28g</strong>
              </div>
              <div className="nutrition-row">
                <span>Carbs:</span>
                <strong>34g</strong>
              </div>
              <div className="nutrition-row">
                <span>Fats:</span>
                <strong>18g</strong>
              </div>
            </div>

            <Link href="/recipes" className="back-link full-width">
              ← Explore More Recipes
            </Link>
          </aside>
        </div>
      </div>
    </main>
  )
}
