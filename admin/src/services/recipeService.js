import api from './api';

const INITIAL_FALLBACK_RECIPES = [
  {
    _id: 'recipe-01',
    title: 'Chicken Biryani',
    slug: 'chicken-biryani',
    description: 'Aromatic layered basmati rice and richly spiced marinated chicken dish cooked on dum.',
    category: 'Non-Veg',
    categoryName: 'Non-Veg',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&h=500&fit=crop',
    prepTime: 20,
    cookTime: 40,
    totalTime: 60,
    servings: 4,
    difficulty: 'Medium',
    tags: ['Indian', 'Spiced', 'Biryani', 'Chicken', 'Dum'],
    ingredients: [
      { item: 'Basmati Rice', qty: '500g', note: 'soaked for 30 mins' },
      { item: 'Chicken', qty: '750g', note: 'curry cut' },
      { item: 'Yogurt', qty: '1 cup', note: 'whisked' },
      { item: 'Biryani Masala', qty: '2 tbsp', note: 'freshly ground' },
      { item: 'Saffron Milk', qty: '3 tbsp', note: 'warm' },
      { item: 'Fried Onions (Birista)', qty: '1 cup', note: 'crispy' },
    ],
    instructions: [
      'Marinate chicken in yogurt, ginger-garlic paste, and spices for at least 1 hour.',
      'Parboil basmati rice with whole spices until 70% cooked, then drain.',
      'Layer marinated chicken and rice alternately in a heavy-bottom pot.',
      'Top with fried onions, mint leaves, saffron milk, and pure ghee.',
      'Seal the pot with dough or foil and cook on low heat (dum) for 25 minutes.',
    ],
    nutrition: {
      calories: '550 kcal',
      protein: '35g',
      carbs: '60g',
      fats: '18g',
    },
    isFeatured: true,
    isPublished: true,
    seoTitle: 'Authentic Dum Chicken Biryani Recipe',
    seoDescription: 'Master the art of authentic homemade chicken biryani with step-by-step dum cooking technique.',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'recipe-02',
    title: 'Paneer Butter Masala',
    slug: 'paneer-butter-masala',
    description: 'Soft cottage cheese cubes simmered in a silky, mildly spiced tomato and cashew gravy.',
    category: 'Veg',
    categoryName: 'Veg',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&h=500&fit=crop',
    prepTime: 15,
    cookTime: 25,
    totalTime: 40,
    servings: 4,
    difficulty: 'Easy',
    tags: ['North Indian', 'Curry', 'Vegetarian', 'Paneer'],
    ingredients: [
      { item: 'Fresh Paneer', qty: '300g', note: 'cubed' },
      { item: 'Tomatoes', qty: '4 large', note: 'pureed' },
      { item: 'Butter', qty: '3 tbsp', note: 'divided' },
      { item: 'Heavy Cream', qty: '2 tbsp', note: 'for garnish' },
      { item: 'Kasuri Methi', qty: '1 tsp', note: 'crushed' },
    ],
    instructions: [
      'Saute onions, ginger, garlic, and cashews, then blend to a smooth paste.',
      'Cook tomato puree in butter until oil separates, then add spice powders.',
      'Mix in the cashew paste and simmer with water to achieve desired gravy consistency.',
      'Gently add paneer cubes and finish with crushed kasuri methi and fresh cream.',
    ],
    nutrition: {
      calories: '420 kcal',
      protein: '16g',
      carbs: '22g',
      fats: '30g',
    },
    isFeatured: true,
    isPublished: true,
    seoTitle: 'Restaurant Style Paneer Butter Masala',
    seoDescription: 'Rich and creamy restaurant-style paneer butter masala recipe ready in under 40 minutes.',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'recipe-03',
    title: 'Gulab Jamun',
    slug: 'gulab-jamun',
    description: 'Golden fried milk solids dumplings soaked in fragrant cardamom and rose sugar syrup.',
    category: 'Desserts',
    categoryName: 'Desserts',
    image: 'https://images.unsplash.com/photo-1605197584547-c93ed1a71911?w=800&h=500&fit=crop',
    prepTime: 20,
    cookTime: 30,
    totalTime: 50,
    servings: 6,
    difficulty: 'Medium',
    tags: ['Dessert', 'Indian Sweet', 'Festive', 'Traditional'],
    ingredients: [
      { item: 'Khoya / Mawa', qty: '200g', note: 'grated' },
      { item: 'All Purpose Flour', qty: '50g', note: 'sifted' },
      { item: 'Sugar', qty: '1.5 cups', note: 'for syrup' },
      { item: 'Cardamom Powder', qty: '1/2 tsp', note: 'freshly crushed' },
      { item: 'Rose Water', qty: '1 tsp', note: 'pure' },
      { item: 'Ghee', qty: 'for frying', note: 'deep fry' },
    ],
    instructions: [
      'Knead khoya and flour with a splash of milk into a smooth, crack-free dough.',
      'Make small smooth balls without any fissures.',
      'Prepare sugar syrup infused with cardamom and rose water to a sticky consistency.',
      'Fry the balls in low-medium ghee until uniformly golden brown.',
      'Immediately transfer hot jamuns into warm sugar syrup and soak for 2 hours.',
    ],
    nutrition: {
      calories: '320 kcal',
      protein: '6g',
      carbs: '48g',
      fats: '12g',
    },
    isFeatured: false,
    isPublished: true,
    seoTitle: 'Soft Melt-in-Mouth Gulab Jamun Recipe',
    seoDescription: 'Authentic recipe for making super soft, spongy gulab jamuns from scratch at home.',
    createdAt: new Date().toISOString(),
  },
];

const getStoredRecipes = () => {
  try {
    const raw = localStorage.getItem('recipe_admin_stored_recipes');
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  localStorage.setItem('recipe_admin_stored_recipes', JSON.stringify(INITIAL_FALLBACK_RECIPES));
  return INITIAL_FALLBACK_RECIPES;
};

const saveStoredRecipes = (recipes) => {
  try {
    localStorage.setItem('recipe_admin_stored_recipes', JSON.stringify(recipes));
  } catch (e) {}
};

export const recipeService = {
  getAllRecipes: async (params = {}) => {
    try {
      const response = await api.get('/admin/recipes', { params });
      if (response?.data && Array.isArray(response.data)) {
        return {
          recipes: response.data,
          meta: response.meta || { total: response.data.length, page: 1, limit: 50 },
        };
      }
      if (response?.data?.recipes) {
        return {
          recipes: response.data.recipes,
          meta: response.data.meta || { total: response.data.recipes.length, page: 1, limit: 50 },
        };
      }
      throw new Error('Invalid format');
    } catch (error) {
      // Return stored recipes with search/category filter support
      let list = getStoredRecipes();
      if (params.q) {
        const query = params.q.toLowerCase();
        list = list.filter(
          (r) =>
            r.title?.toLowerCase().includes(query) ||
            r.description?.toLowerCase().includes(query) ||
            r.category?.toLowerCase().includes(query)
        );
      }
      if (params.category && params.category !== 'all') {
        list = list.filter(
          (r) => r.category?.toLowerCase() === params.category.toLowerCase()
        );
      }
      return {
        recipes: list,
        meta: { total: list.length, page: 1, limit: 50 },
      };
    }
  },

  getRecipeById: async (id) => {
    try {
      const response = await api.get(`/admin/recipes/${id}`);
      return response.data;
    } catch (error) {
      const list = getStoredRecipes();
      const found = list.find((r) => r._id === id || r.slug === id);
      if (found) return found;
      throw error;
    }
  },

  createRecipe: async (recipeData, imageFile) => {
    let payload;
    let headers = {};

    if (imageFile) {
      payload = new FormData();
      payload.append('image', imageFile);

      Object.keys(recipeData).forEach((key) => {
        const val = recipeData[key];
        if (['ingredients', 'instructions', 'nutrition', 'tags'].includes(key)) {
          payload.append(key, JSON.stringify(val));
        } else if (val !== undefined && val !== null) {
          payload.append(key, val);
        }
      });
      headers['Content-Type'] = 'multipart/form-data';
    } else {
      payload = { ...recipeData };
    }

    try {
      const response = await api.post('/admin/recipes', payload, { headers });
      const created = response.data;
      // Sync local storage
      const list = getStoredRecipes();
      list.unshift(created);
      saveStoredRecipes(list);
      return created;
    } catch (error) {
      // Local fallback creation
      const list = getStoredRecipes();
      const newRecipe = {
        ...recipeData,
        _id: 'recipe-' + Date.now(),
        image:
          recipeData.image ||
          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=500&fit=crop',
        createdAt: new Date().toISOString(),
      };
      list.unshift(newRecipe);
      saveStoredRecipes(list);
      return newRecipe;
    }
  },

  updateRecipe: async (id, recipeData, imageFile) => {
    let payload;
    let headers = {};

    if (imageFile) {
      payload = new FormData();
      payload.append('image', imageFile);

      Object.keys(recipeData).forEach((key) => {
        const val = recipeData[key];
        if (['ingredients', 'instructions', 'nutrition', 'tags'].includes(key)) {
          payload.append(key, JSON.stringify(val));
        } else if (val !== undefined && val !== null) {
          payload.append(key, val);
        }
      });
      headers['Content-Type'] = 'multipart/form-data';
    } else {
      payload = { ...recipeData };
    }

    try {
      const response = await api.patch(`/admin/recipes/${id}`, payload, { headers });
      const updated = response.data;
      const list = getStoredRecipes();
      const index = list.findIndex((r) => r._id === id);
      if (index !== -1) {
        list[index] = { ...list[index], ...updated };
        saveStoredRecipes(list);
      }
      return updated;
    } catch (error) {
      // Local fallback update
      const list = getStoredRecipes();
      const index = list.findIndex((r) => r._id === id);
      if (index !== -1) {
        list[index] = { ...list[index], ...recipeData, updatedAt: new Date().toISOString() };
        saveStoredRecipes(list);
        return list[index];
      }
      throw error;
    }
  },

  deleteRecipe: async (id) => {
    try {
      await api.delete(`/admin/recipes/${id}`);
    } catch (error) {
      // Continue to local sync
    }
    const list = getStoredRecipes();
    const filtered = list.filter((r) => r._id !== id);
    saveStoredRecipes(filtered);
    return true;
  },
};

export default recipeService;
