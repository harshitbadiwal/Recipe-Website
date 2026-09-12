import Link from 'next/link'
import { getRecipeBySlug } from '@/services/api'
import FavoriteButton from '@/components/Recipe/FavoriteButton'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://recipemaster.com'

export async function generateMetadata({ params }) {
  const { id } = await params
  const recipe = await getRecipeBySlug(id)

  if (!recipe) {
    return {
      title: 'Recipe Not Found | Recipe Master',
      description: 'The requested recipe could not be found. Explore our catalog of delicious culinary creations.',
    }
  }

  const slug = recipe.slug || recipe._id || id
  const canonicalUrl = `${SITE_URL}/recipes/${slug}`
  const pageTitle = recipe.seoTitle || `${recipe.title} Recipe - Authentic Step-by-Step Guide`
  const pageDescription =
    recipe.seoDescription ||
    `${recipe.description} Prep: ${recipe.prepTime || 15}m, Cook: ${recipe.cookTime || 30}m, Difficulty: ${recipe.difficulty || 'Easy'}.`
  const categoryName = recipe.categoryName || recipe.category?.name || 'Cuisine'
  const subCategoryName =
    recipe.subCategoryName ||
    recipe.subCategory?.name ||
    (Array.isArray(recipe.subCategoryNames) && recipe.subCategoryNames[0]) ||
    ''

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: [
      recipe.title,
      `${recipe.title} recipe`,
      `${categoryName} recipes`,
      ...(subCategoryName ? [`${subCategoryName} recipes`, `${categoryName} ${subCategoryName}`] : []),
      'how to cook',
      recipe.difficulty || 'Easy',
      'step by step cooking',
      ...(Array.isArray(recipe.tags) ? recipe.tags : []),
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: canonicalUrl,
      siteName: 'Recipe Master',
      type: 'article',
      publishedTime: recipe.createdAt || '2026-01-01T00:00:00.000Z',
      modifiedTime: recipe.updatedAt || recipe.createdAt || '2026-01-01T00:00:00.000Z',
      authors: [recipe.authorName || 'Chef Master'],
      tags: Array.isArray(recipe.tags) ? recipe.tags : [categoryName, ...(subCategoryName ? [subCategoryName] : [])],
      images: [
        {
          url: recipe.image,
          width: 1200,
          height: 630,
          alt: `${recipe.title} Culinary Presentation`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [recipe.image],
      creator: '@recipemaster',
    },
  }
}

export default async function RecipeDetailPage({ params }) {
  const { id } = await params
  const recipe = await getRecipeBySlug(id)

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

  const categoryName = recipe.categoryName || recipe.category?.name || recipe.category || 'Specialty'
  const subCategoryName =
    recipe.subCategoryName ||
    recipe.subCategory?.name ||
    (Array.isArray(recipe.subCategoryNames) && recipe.subCategoryNames[0]) ||
    ''
  const prepMinutes = parseInt(recipe.prepTime, 10) || 15
  const cookMinutes = parseInt(recipe.cookTime, 10) || 30
  const totalMinutes = parseInt(recipe.totalTime, 10) || prepMinutes + cookMinutes
  const timeFormatted = recipe.totalTime ? `${recipe.totalTime} min` : recipe.time || `${totalMinutes} min`
  const servings = recipe.servings || 4
  const ratingVal = typeof recipe.ratingAverage === 'number' ? recipe.ratingAverage.toFixed(1) : '4.9'
  const reviewCount = recipe.ratingCount || 120

  // Dynamic ingredients parser (handles arrays of objects, strings, or newline-delimited strings)
  const parseIngredients = (raw) => {
    if (!raw) return []
    if (Array.isArray(raw)) {
      return raw
        .map((ing) => {
          if (typeof ing === 'string') return { item: ing.trim(), qty: '', note: '' }
          return {
            item: (ing.item || ing.name || '').trim(),
            qty: (ing.qty || ing.amount || '').trim(),
            note: (ing.note || '').trim(),
          }
        })
        .filter((ing) => Boolean(ing.item))
    }
    if (typeof raw === 'string' && raw.trim().length > 0) {
      return raw
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter(Boolean)
        .map((item) => ({ item, qty: '', note: '' }))
    }
    return []
  }

  // Dynamic instructions parser (handles arrays of steps or newline-separated text)
  const parseInstructions = (raw) => {
    if (!raw) return []
    if (Array.isArray(raw)) {
      return raw
        .map((step) => (typeof step === 'string' ? step.trim() : (step.text || step.step || '').trim()))
        .filter(Boolean)
    }
    if (typeof raw === 'string' && raw.trim().length > 0) {
      return raw
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter(Boolean)
    }
    return []
  }

  const ingredientsList = parseIngredients(recipe.ingredients)
  const instructionsList = parseInstructions(recipe.instructions)
  const nutrition = recipe.nutrition && typeof recipe.nutrition === 'object' ? recipe.nutrition : null
  const hasNutrition = Boolean(
    nutrition && (nutrition.calories || nutrition.protein || nutrition.carbs || nutrition.fats)
  )

  // Rich Schema.org Recipe Structured Data
  const recipeJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.title,
    image: [recipe.image],
    description: recipe.description,
    recipeCategory: categoryName,
    prepTime: `PT${prepMinutes}M`,
    cookTime: `PT${cookMinutes}M`,
    totalTime: `PT${totalMinutes}M`,
    recipeYield: `${servings} servings`,
    keywords: Array.isArray(recipe.tags) ? recipe.tags.join(', ') : categoryName,
    author: {
      '@type': 'Person',
      name: recipe.authorName || 'Chef Master',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: ratingVal,
      reviewCount: String(reviewCount),
      bestRating: '5',
      worstRating: '1',
    },
    ...(hasNutrition && {
      nutrition: {
        '@type': 'NutritionInformation',
        ...(nutrition.calories && { calories: nutrition.calories }),
        ...(nutrition.protein && { proteinContent: nutrition.protein }),
        ...(nutrition.carbs && { carbohydrateContent: nutrition.carbs }),
        ...(nutrition.fats && { fatContent: nutrition.fats }),
      },
    }),
    ...(ingredientsList.length > 0 && {
      recipeIngredient: ingredientsList.map((ing) => (ing.qty ? `${ing.qty} ${ing.item}` : ing.item)),
    }),
    ...(instructionsList.length > 0 && {
      recipeInstructions: instructionsList.map((step, idx) => ({
        '@type': 'HowToStep',
        name: `Step ${idx + 1}`,
        text: typeof step === 'string' ? step : step.text || '',
      })),
    }),
  }

  // Schema.org BreadcrumbList with category and subcategory
  const breadcrumbItems = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: `${SITE_URL}`,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Recipes',
      item: `${SITE_URL}/recipes`,
    },
  ]
  let pos = 3
  if (categoryName) {
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: pos++,
      name: categoryName,
      item: `${SITE_URL}/recipes?category=${encodeURIComponent(recipe.category?.slug || categoryName)}`,
    })
  }
  if (subCategoryName) {
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: pos++,
      name: subCategoryName,
      item: `${SITE_URL}/recipes?category=${encodeURIComponent(recipe.category?.slug || categoryName)}&subCategory=${encodeURIComponent(recipe.subCategory?.slug || subCategoryName)}`,
    })
  }
  breadcrumbItems.push({
    '@type': 'ListItem',
    position: pos,
    name: recipe.title,
    item: `${SITE_URL}/recipes/${recipe.slug || recipe._id || id}`,
  })

  const breadcrumbsJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems,
  }

  return (
    <main className="recipe-detail-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(recipeJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />

      <div className="recipe-detail-hero">
        <div className="container">
          <p className="breadcrumb">
            <Link href="/">Home</Link> <span className="breadcrumb-sep">/</span>{' '}
            <Link href="/recipes">Recipes</Link>
            {categoryName && (
              <>
                {' '}<span className="breadcrumb-sep">/</span>{' '}
                <Link href={`/recipes?category=${encodeURIComponent(recipe.category?.slug || categoryName)}`}>
                  {categoryName}
                </Link>
              </>
            )}
            {subCategoryName && (
              <>
                {' '}<span className="breadcrumb-sep">/</span>{' '}
                <Link
                  href={`/recipes?category=${encodeURIComponent(recipe.category?.slug || categoryName)}&subCategory=${encodeURIComponent(recipe.subCategory?.slug || subCategoryName)}`}
                >
                  {subCategoryName}
                </Link>
              </>
            )}
            {' '}<span className="breadcrumb-sep">/</span>{' '}
            <span>{recipe.title}</span>
          </p>
          <div className="recipe-header-title-row">
            <div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px', alignItems: 'center' }}>
                <Link
                  href={`/recipes?category=${encodeURIComponent(recipe.category?.slug || categoryName)}`}
                  className="detail-category-badge"
                >
                  {categoryName}
                </Link>
                {subCategoryName && (
                  <Link
                    href={`/recipes?category=${encodeURIComponent(recipe.category?.slug || categoryName)}&subCategory=${encodeURIComponent(recipe.subCategory?.slug || subCategoryName)}`}
                    className="detail-category-badge"
                    style={{
                      background: 'rgba(225, 29, 72, 0.1)',
                      color: 'var(--primary, #e11d48)',
                      borderColor: 'rgba(225, 29, 72, 0.25)',
                    }}
                  >
                    ↳ {subCategoryName}
                  </Link>
                )}
              </div>
              <h1 className="recipe-detail-title">{recipe.title}</h1>
            </div>
            <FavoriteButton recipe={recipe} />
          </div>
          <div className="recipe-detail-meta-pills">
            <span className="meta-pill">
              ⏱ <strong>Prep:</strong> {prepMinutes}m
            </span>
            <span className="meta-pill">
              🔥 <strong>Cook:</strong> {cookMinutes}m
            </span>
            <span className="meta-pill">
              ⌛ <strong>Total:</strong> {timeFormatted}
            </span>
            <span className="meta-pill">
              🎯 <strong>Difficulty:</strong> {recipe.difficulty || 'Easy'}
            </span>
            <span className="meta-pill">
              🍽 <strong>Servings:</strong> {servings}
            </span>
            <span className="meta-pill">
              ⭐ <strong>Rating:</strong> {ratingVal} ({reviewCount} reviews)
            </span>
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
              {Array.isArray(recipe.tags) && recipe.tags.length > 0 && (
                <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {recipe.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        background: 'rgba(255, 255, 255, 0.08)',
                        fontSize: '0.85rem',
                        color: 'var(--text-secondary, #a0aec0)',
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {ingredientsList.length > 0 && (
              <div className="recipe-detail-section">
                <h2 className="section-subheading">Key Ingredients ({ingredientsList.length})</h2>
                <div className="ingredients-grid">
                  {ingredientsList.map((ing, i) => (
                    <div key={i} className="ingredient-item">
                      <span className="ingredient-bullet">✔</span>
                      <div className="ingredient-text">
                        <strong>{ing.item}</strong>
                        {(ing.qty || ing.note) && (
                          <span className="ingredient-qty">
                            {[ing.qty, ing.note].filter(Boolean).join(' • ')}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {instructionsList.length > 0 && (
              <div className="recipe-detail-section">
                <h2 className="section-subheading">Step-by-Step Instructions ({instructionsList.length} Steps)</h2>
                <div className="steps-list">
                  {instructionsList.map((step, idx) => (
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
            )}
          </div>

          <aside className="recipe-detail-sidebar">
            <div className="sidebar-card highlight-card">
              <h3>Chef's Pro Tip 💡</h3>
              <p>
                Toast your whole spices lightly in a dry pan before grinding to unlock deeper floral and earthy aromatic tones.
              </p>
            </div>

            {hasNutrition && (
              <div className="sidebar-card">
                <h3>Quick Nutrition Facts</h3>
                {nutrition.calories && (
                  <div className="nutrition-row">
                    <span>Estimated Calories:</span>
                    <strong>{nutrition.calories}</strong>
                  </div>
                )}
                {nutrition.protein && (
                  <div className="nutrition-row">
                    <span>Protein:</span>
                    <strong>{nutrition.protein}</strong>
                  </div>
                )}
                {nutrition.carbs && (
                  <div className="nutrition-row">
                    <span>Carbohydrates:</span>
                    <strong>{nutrition.carbs}</strong>
                  </div>
                )}
                {nutrition.fats && (
                  <div className="nutrition-row">
                    <span>Fats:</span>
                    <strong>{nutrition.fats}</strong>
                  </div>
                )}
              </div>
            )}

            <div className="sidebar-card">
              <h3>Curated By</h3>
              <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-primary, #fff)' }}>
                {recipe.authorName || 'Chef Master'}
              </p>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary, #a0aec0)' }}>
                Recipe Master Culinary Team
              </p>
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
