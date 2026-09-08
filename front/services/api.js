const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://recipe-website-ja3v.onrender.com/api/v1';

/**
 * Base fetcher with ISR caching and error tolerance.
 */
export async function fetchApiFull(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      next: { revalidate: 60 },
      ...options,
    });
    if (!res.ok) {
      throw new Error(`API error ${res.status}`);
    }
    const json = await res.json();
    return {
      success: true,
      data: json.data,
      meta: json.meta || null,
      message: json.message || '',
    };
  } catch (error) {
    console.warn(`Fetch to ${endpoint} failed:`, error.message);
    return {
      success: false,
      data: null,
      meta: null,
      error: error.message,
    };
  }
}

export async function fetchFromAPI(endpoint, options = {}) {
  const result = await fetchApiFull(endpoint, options);
  return result.data;
}

/**
 * GET /home
 * Returns: { heroSlides, featuredRecipes, latestRecipes, categories, latestBlogs, videos }
 */
export async function getHomepageData() {
  const data = await fetchFromAPI('/home');
  if (data) {
    return data;
  }
  return {
    heroSlides: [],
    featuredRecipes: [],
    latestRecipes: [],
    categories: [],
    latestBlogs: [],
    videos: [],
  };
}

/**
 * GET /recipes
 * List all published recipes with pagination, filtering & sorting.
 * Query params: q, category, difficulty, tag, minTime, maxTime, minRating, sort, page, limit
 */
export async function getRecipes(queryParams = {}) {
  const cleanParams = {};
  for (const [key, value] of Object.entries(queryParams)) {
    if (value !== undefined && value !== null && value !== '') {
      cleanParams[key] = String(value);
    }
  }

  if (cleanParams.limit) {
    const parsedLimit = parseInt(cleanParams.limit, 10);
    if (!isNaN(parsedLimit)) {
      cleanParams.limit = String(Math.min(100, Math.max(1, parsedLimit)));
    }
  }

  const queryString = new URLSearchParams(cleanParams).toString();
  const endpoint = queryString ? `/recipes?${queryString}` : '/recipes';
  const result = await fetchApiFull(endpoint);

  if (result.success && Array.isArray(result.data)) {
    return {
      recipes: result.data,
      meta: result.meta || {
        page: parseInt(cleanParams.page, 10) || 1,
        limit: parseInt(cleanParams.limit, 10) || result.data.length,
        total: result.data.length,
        totalPages: 1,
      },
    };
  }

  return {
    recipes: [],
    meta: {
      page: parseInt(cleanParams.page, 10) || 1,
      limit: parseInt(cleanParams.limit, 10) || 20,
      total: 0,
      totalPages: 1,
    },
  };
}

/**
 * GET /recipes/:slug
 * Get recipe details by slug or ID
 */
export async function getRecipeBySlug(slugOrId) {
  if (!slugOrId) return null;
  const data = await fetchFromAPI(`/recipes/${encodeURIComponent(slugOrId)}`);
  return data || null;
}

/**
 * GET /categories
 * List all active categories
 */
export async function getCategories() {
  const data = await fetchFromAPI('/categories');
  return Array.isArray(data) ? data : [];
}

/**
 * GET /categories/:slug
 * Get category details by slug or ID
 */
export async function getCategoryBySlug(slugOrId) {
  if (!slugOrId) return null;
  const data = await fetchFromAPI(`/categories/${encodeURIComponent(slugOrId)}`);
  return data || null;
}

/**
 * GET /categories/:slug/recipes
 * Get recipes under a category
 */
export async function getCategoryRecipes(slugOrId, options = {}) {
  if (!slugOrId) return { category: null, recipes: [], total: 0 };
  const params = new URLSearchParams(options).toString();
  const endpoint = `/categories/${encodeURIComponent(slugOrId)}/recipes${params ? `?${params}` : ''}`;
  const res = await fetchApiFull(endpoint);

  if (res.success && Array.isArray(res.data)) {
    return {
      category: res.meta?.category || null,
      recipes: res.data,
      total: res.meta?.total || res.data.length,
    };
  }

  return {
    category: null,
    recipes: [],
    total: 0,
  };
}

/**
 * GET /blogs
 * List all published articles/blogs
 */
export async function getBlogs(queryParams = {}) {
  const cleanParams = {};
  for (const [key, value] of Object.entries(queryParams)) {
    if (value !== undefined && value !== null && value !== '') {
      cleanParams[key] = String(value);
    }
  }
  const queryString = new URLSearchParams(cleanParams).toString();
  const endpoint = queryString ? `/blogs?${queryString}` : '/blogs';
  const data = await fetchFromAPI(endpoint);
  return Array.isArray(data) ? data : [];
}

/**
 * GET /blogs/:slug
 * Get blog details by slug or ID
 */
export async function getBlogBySlug(slugOrId) {
  if (!slugOrId) return null;
  const data = await fetchFromAPI(`/blogs/${encodeURIComponent(slugOrId)}`);
  return data || null;
}

/**
 * ====================================================================
 * AUTHENTICATION & USER FAVORITES APIS
 * ====================================================================
 */

/**
 * POST /auth/register
 * Register a new user
 */
export async function registerUser({ name, email, password }) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || `Registration failed (${res.status})`);
    }
    return {
      success: true,
      data: json.data, // { user, accessToken }
      message: json.message || 'Registration successful',
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * POST /auth/login
 * Login user & obtain JWT token
 */
export async function loginUser({ email, password }) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || `Login failed (${res.status})`);
    }
    return {
      success: true,
      data: json.data, // { user, accessToken }
      message: json.message || 'Login successful',
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * GET /auth/me
 * Get current authenticated user profile
 */
export async function getCurrentUser(token) {
  if (!token) return null;
  try {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const json = await res.json();
    if (!res.ok) return null;
    return json.data || null;
  } catch (error) {
    return null;
  }
}

/**
 * GET /users/me/favorites
 * Get logged-in user favorite recipes list with pagination
 */
export async function getUserFavorites(token, queryParams = {}) {
  if (!token) return { favorites: [], meta: null };
  const cleanParams = new URLSearchParams(queryParams).toString();
  const endpoint = cleanParams ? `/users/me/favorites?${cleanParams}` : '/users/me/favorites';

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to fetch favorites');
    return {
      favorites: Array.isArray(json.data) ? json.data : [],
      meta: json.meta || null,
    };
  } catch (error) {
    return { favorites: [], meta: null, error: error.message };
  }
}

/**
 * POST /users/me/favorites/{recipeId}
 * Add a recipe to logged-in user favorites
 */
export async function addFavorite(recipeId, token) {
  if (!token || !recipeId) throw new Error('Authentication required');
  const res = await fetch(`${API_BASE_URL}/users/me/favorites/${encodeURIComponent(recipeId)}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to add favorite');
  return json;
}

/**
 * DELETE /users/me/favorites/{recipeId}
 * Remove a recipe from logged-in user favorites
 */
export async function removeFavorite(recipeId, token) {
  if (!token || !recipeId) throw new Error('Authentication required');
  const res = await fetch(`${API_BASE_URL}/users/me/favorites/${encodeURIComponent(recipeId)}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to remove favorite');
  return json;
}

/**
 * GET /users/me/favorites/check/{recipeId}
 * Check if a recipe is in logged-in user favorites
 */
export async function checkIsFavorite(recipeId, token) {
  if (!token || !recipeId) return false;
  try {
    const res = await fetch(`${API_BASE_URL}/users/me/favorites/check/${encodeURIComponent(recipeId)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const json = await res.json();
    if (!res.ok) return false;
    return Boolean(json.data?.isFavorite);
  } catch {
    return false;
  }
}
