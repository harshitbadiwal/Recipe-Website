import { featuredRecipes, categories, articles, heroSlides, videos } from '@/data/dummyData';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export async function fetchFromAPI(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      next: { revalidate: 10 },
      ...options,
    });
    if (!res.ok) {
      throw new Error(`API error ${res.status}`);
    }
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.warn(`Fetch to ${endpoint} failed, using local fallback data:`, error.message);
    return null;
  }
}

export async function getHomepageData() {
  const data = await fetchFromAPI('/home');
  if (data) {
    return data;
  }
  return {
    heroSlides,
    featuredRecipes,
    latestRecipes: featuredRecipes,
    categories,
    latestBlogs: articles,
    videos,
  };
}

export async function getRecipes(queryParams = {}) {
  const queryString = new URLSearchParams(queryParams).toString();
  const endpoint = queryString ? `/recipes?${queryString}` : '/recipes';
  const data = await fetchFromAPI(endpoint);
  if (data) {
    return data;
  }

  let recipes = [...featuredRecipes];
  if (queryParams.q) {
    const term = queryParams.q.toLowerCase();
    recipes = recipes.filter(
      (r) =>
        r.title.toLowerCase().includes(term) ||
        r.category.toLowerCase().includes(term) ||
        r.description.toLowerCase().includes(term)
    );
  }
  return recipes;
}

export async function getRecipeBySlug(slug) {
  const data = await fetchFromAPI(`/recipes/${slug}`);
  if (data) {
    return data;
  }
  return featuredRecipes.find((r) => r.id === slug || r.slug === slug) || null;
}

export async function getCategories() {
  const data = await fetchFromAPI('/categories');
  if (data) {
    return data;
  }
  return categories;
}

export async function getBlogs() {
  const data = await fetchFromAPI('/blogs');
  if (data) {
    return data;
  }
  return articles;
}
