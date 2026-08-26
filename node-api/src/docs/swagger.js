const swaggerJsdoc = require('swagger-jsdoc');
const config = require('../config/env.config');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Recipe Website REST API',
      version: '1.0.0',
      description:
        'Production-Ready REST API for Recipe Master Platform. Features public recipe discovery, categories, articles, user favorites, ratings, comments, collections, newsletter subscriptions, and role-protected admin management endpoints.',
      contact: {
        name: 'API Support Team',
        email: 'support@recipe.com',
      },
    },
    servers: [
      {
        url: `${config.apiBaseUrl.replace(/\/$/, '')}/api/v1`,
        description: 'Production Server (Render)',
      },
      {
        url: `http://localhost:${config.port}/api/v1`,
        description: 'Development Server (Localhost)',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT access token to authorize protected API requests.',
        },
      },
      schemas: {
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Operation completed successfully' },
            data: { type: 'object' },
            meta: { type: 'object' },
          },
        },
        ApiError: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error description' },
            error: {
              type: 'object',
              properties: {
                code: { type: 'string', example: 'RECIPE_NOT_FOUND' },
              },
            },
          },
        },
        ValidationError: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Validation failed' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string', example: 'email' },
                  message: { type: 'string', example: 'Valid email address is required' },
                },
              },
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '65d1a2b3c4d5e6f7a8b9c0d1' },
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', example: 'user@recipe.com' },
            role: { type: 'string', example: 'USER', enum: ['USER', 'ADMIN'] },
            avatar: { type: 'string', example: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop' },
            status: { type: 'string', example: 'ACTIVE' },
          },
        },
        Recipe: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '65d1a2b3c4d5e6f7a8b9c0d2' },
            title: { type: 'string', example: 'Butter Chicken' },
            slug: { type: 'string', example: 'butter-chicken' },
            description: { type: 'string', example: 'Rich and creamy tomato-based curry with tender chicken.' },
            image: { type: 'string', example: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop' },
            categoryName: { type: 'string', example: 'Non-Veg' },
            prepTime: { type: 'number', example: 15 },
            cookTime: { type: 'number', example: 30 },
            totalTime: { type: 'number', example: 45 },
            difficulty: { type: 'string', example: 'Medium', enum: ['Easy', 'Medium', 'Hard'] },
            ratingAverage: { type: 'number', example: 4.9 },
            ratingCount: { type: 'number', example: 120 },
            isFeatured: { type: 'boolean', example: true },
            isPublished: { type: 'boolean', example: true },
          },
        },
        Category: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '65d1a2b3c4d5e6f7a8b9c0d3' },
            name: { type: 'string', example: 'Veg' },
            slug: { type: 'string', example: 'veg' },
            description: { type: 'string', example: 'Vegetarian recipes' },
            image: { type: 'string', example: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=200&h=200&fit=crop' },
          },
        },
        Blog: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '65d1a2b3c4d5e6f7a8b9c0d4' },
            title: { type: 'string', example: '10 Essential Spices for Indian Cooking' },
            slug: { type: 'string', example: '10-essential-spices-for-indian-cooking' },
            content: { type: 'string', example: 'Full article content...' },
            excerpt: { type: 'string', example: 'Must-have spices for Indian cuisine.' },
            featuredImage: { type: 'string', example: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=250&fit=crop' },
            author: { type: 'string', example: 'Chef Master' },
          },
        },
        Comment: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '65d1a2b3c4d5e6f7a8b9c0d5' },
            content: { type: 'string', example: 'This recipe turned out amazing!' },
            userName: { type: 'string', example: 'Jane Smith' },
            status: { type: 'string', example: 'APPROVED', enum: ['PENDING', 'APPROVED', 'REJECTED'] },
          },
        },
      },
    },
    paths: {
      '/auth/register': {
        post: {
          tags: ['Authentication'],
          summary: 'Register a new user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'email', 'password'],
                  properties: {
                    name: { type: 'string', example: 'Jane Doe' },
                    email: { type: 'string', example: 'jane@example.com' },
                    password: { type: 'string', example: 'password123' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Registration successful' },
            400: { description: 'Validation error' },
            409: { description: 'Email already exists' },
          },
        },
      },
      '/auth/login': {
        post: {
          tags: ['Authentication'],
          summary: 'Login user & obtain JWT token',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', example: 'admin@recipe.com' },
                    password: { type: 'string', example: 'admin123' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Login successful with JWT access token' },
            401: { description: 'Invalid credentials' },
          },
        },
      },
      '/auth/me': {
        get: {
          tags: ['Authentication'],
          summary: 'Get current authenticated user profile',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'User profile retrieved' },
            401: { description: 'Unauthorized' },
          },
        },
      },

      // Public Recipe Endpoints (Read-Only)
      '/recipes': {
        get: {
          tags: ['Recipes'],
          summary: 'List all published recipes with pagination, filtering & sorting',
          parameters: [
            { name: 'q', in: 'query', schema: { type: 'string' }, description: 'Search term' },
            { name: 'category', in: 'query', schema: { type: 'string' }, description: 'Category slug or ID' },
            { name: 'difficulty', in: 'query', schema: { type: 'string', enum: ['Easy', 'Medium', 'Hard'] } },
            { name: 'sort', in: 'query', schema: { type: 'string', enum: ['latest', 'oldest', 'rating_desc', 'rating_asc', 'name_asc', 'name_desc', 'popular'] } },
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
          ],
          responses: {
            200: { description: 'List of recipes with pagination meta' },
          },
        },
      },
      '/recipes/{slug}': {
        get: {
          tags: ['Recipes'],
          summary: 'Get recipe details by slug or ID',
          parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Recipe details' },
            404: { description: 'Recipe not found' },
          },
        },
      },

      // Public Categories Endpoints (Read-Only)
      '/categories': {
        get: {
          tags: ['Categories'],
          summary: 'List all active categories',
          responses: {
            200: { description: 'List of categories' },
          },
        },
      },
      '/categories/{slug}': {
        get: {
          tags: ['Categories'],
          summary: 'Get category details by slug or ID',
          parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Category details' },
            404: { description: 'Category not found' },
          },
        },
      },

      // Image Upload Endpoint (Cloudinary)
      '/upload/image': {
        post: {
          tags: ['File Upload (Cloudinary)'],
          summary: 'Upload a binary image file to Cloudinary',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  properties: {
                    image: {
                      type: 'string',
                      format: 'binary',
                      description: 'Select an image file (jpg, png, webp, gif)',
                    },
                    folder: {
                      type: 'string',
                      example: 'recipes',
                      description: 'Cloudinary target folder name',
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Image uploaded successfully to Cloudinary',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: { type: 'string', example: 'Image uploaded to Cloudinary successfully' },
                      data: {
                        type: 'object',
                        properties: {
                          url: { type: 'string', example: 'https://res.cloudinary.com/n9thvoig/image/upload/v12345/recipes/sample.jpg' },
                          public_id: { type: 'string', example: 'recipes/sample' },
                          format: { type: 'string', example: 'jpg' },
                          width: { type: 'number', example: 800 },
                          height: { type: 'number', example: 600 },
                        },
                      },
                    },
                  },
                },
              },
            },
            400: { description: 'No file provided or invalid file format' },
            401: { description: 'Unauthorized' },
          },
        },
      },

      // Admin Management API Routes
      '/admin/recipes': {
        get: {
          tags: ['Admin Recipes'],
          summary: 'Get all recipes with search, filtering, and aggregate pagination (Admin Dashboard)',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'q', in: 'query', schema: { type: 'string' }, description: 'Search term for title, description, category, or tags' },
            { name: 'category', in: 'query', schema: { type: 'string' }, description: 'Filter by category name or slug' },
            { name: 'difficulty', in: 'query', schema: { type: 'string', enum: ['Easy', 'Medium', 'Hard'] }, description: 'Filter by difficulty level' },
            { name: 'sort', in: 'query', schema: { type: 'string', enum: ['latest', 'oldest', 'title_asc', 'title_desc'], default: 'latest' }, description: 'Sort criteria' },
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 }, description: 'Page number' },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 }, description: 'Items per page' },
          ],
          responses: {
            200: { description: 'All recipes list fetched with aggregate pagination' },
            403: { description: 'Admin role required' },
          },
        },
        post: {
          tags: ['Admin Recipes'],
          summary: 'Create a new recipe with full schema fields (Supports Binary Image Upload to Cloudinary)',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  required: ['title', 'description', 'category'],
                  properties: {
                    title: { type: 'string', example: 'Chicken Biryani' },
                    slug: { type: 'string', example: 'chicken-biryani' },
                    description: { type: 'string', example: 'Aromatic layered rice and spiced meat dish.' },
                    category: { type: 'string', example: 'Non-Veg', description: 'Category ID, slug, or name' },
                    image: { type: 'string', format: 'binary', description: 'Select a binary image file (JPG, PNG, WEBP, GIF)' },
                    prepTime: { type: 'number', example: 20 },
                    cookTime: { type: 'number', example: 40 },
                    servings: { type: 'number', example: 4 },
                    difficulty: { type: 'string', example: 'Medium', enum: ['Easy', 'Medium', 'Hard'] },
                    tags: { type: 'string', example: '["Indian", "Spiced", "Biryani"]', description: 'JSON array string or comma separated tags' },
                    ingredients: { type: 'string', example: '[{"item":"Basmati Rice","qty":"500g","note":"soaked"},{"item":"Chicken","qty":"750g","note":"marinated"}]', description: 'JSON array string of ingredients [{item, qty, note}]' },
                    instructions: { type: 'string', example: '["Marinate chicken in yogurt and spices for 1 hour.","Cook basmati rice with whole spices until 70% done.","Layer rice and chicken, seal pot, and cook on low heat for 25 mins."]', description: 'JSON array string of step-by-step instructions' },
                    nutrition: { type: 'string', example: '{"calories":"550 kcal","protein":"35g","carbs":"60g","fats":"18g"}', description: 'JSON object string of nutrition values' },
                    isFeatured: { type: 'boolean', example: true },
                    isPublished: { type: 'boolean', example: true },
                    seoTitle: { type: 'string', example: 'Authentic Chicken Biryani Recipe' },
                    seoDescription: { type: 'string', example: 'Best homemade chicken biryani recipe with step by step instructions.' },
                  },
                },
              },
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['title', 'description', 'category'],
                  properties: {
                    title: { type: 'string', example: 'Chicken Biryani' },
                    slug: { type: 'string', example: 'chicken-biryani' },
                    description: { type: 'string', example: 'Aromatic layered rice and spiced meat dish.' },
                    category: { type: 'string', example: 'Non-Veg' },
                    image: { type: 'string', example: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop' },
                    prepTime: { type: 'number', example: 20 },
                    cookTime: { type: 'number', example: 40 },
                    servings: { type: 'number', example: 4 },
                    difficulty: { type: 'string', example: 'Medium', enum: ['Easy', 'Medium', 'Hard'] },
                    tags: { type: 'array', items: { type: 'string' }, example: ['Indian', 'Spiced', 'Biryani'] },
                    ingredients: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          item: { type: 'string', example: 'Basmati Rice' },
                          qty: { type: 'string', example: '500g' },
                          note: { type: 'string', example: 'soaked' },
                        },
                      },
                    },
                    instructions: { type: 'array', items: { type: 'string' }, example: ['Marinate chicken in yogurt and spices.', 'Cook rice with whole spices.'] },
                    nutrition: {
                      type: 'object',
                      properties: {
                        calories: { type: 'string', example: '550 kcal' },
                        protein: { type: 'string', example: '35g' },
                        carbs: { type: 'string', example: '60g' },
                        fats: { type: 'string', example: '18g' },
                      },
                    },
                    isFeatured: { type: 'boolean', example: true },
                    isPublished: { type: 'boolean', example: true },
                    seoTitle: { type: 'string', example: 'Authentic Chicken Biryani Recipe' },
                    seoDescription: { type: 'string', example: 'Best homemade chicken biryani recipe.' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Recipe created successfully' },
            403: { description: 'Admin role required' },
          },
        },
      },
      '/admin/recipes/{id}': {
        get: {
          tags: ['Admin Recipes'],
          summary: 'Get recipe details by ID (Admin)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Recipe details' },
            404: { description: 'Recipe not found' },
          },
        },
        patch: {
          tags: ['Admin Recipes'],
          summary: 'Update recipe by ID with full schema fields (Supports Binary Image Upload to Cloudinary)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    slug: { type: 'string' },
                    description: { type: 'string' },
                    category: { type: 'string' },
                    image: { type: 'string', format: 'binary', description: 'Select a binary image file to replace existing image' },
                    prepTime: { type: 'number' },
                    cookTime: { type: 'number' },
                    servings: { type: 'number' },
                    difficulty: { type: 'string', enum: ['Easy', 'Medium', 'Hard'] },
                    tags: { type: 'string', description: 'JSON array string or comma separated tags' },
                    ingredients: { type: 'string', description: 'JSON array string of ingredients [{item, qty, note}]' },
                    instructions: { type: 'string', description: 'JSON array string of instructions' },
                    nutrition: { type: 'string', description: 'JSON object string of nutrition values' },
                    isFeatured: { type: 'boolean' },
                    isPublished: { type: 'boolean' },
                    seoTitle: { type: 'string' },
                    seoDescription: { type: 'string' },
                  },
                },
              },
              'application/json': { schema: { type: 'object' } },
            },
          },
          responses: {
            200: { description: 'Recipe updated' },
          },
        },
        delete: {
          tags: ['Admin Recipes'],
          summary: 'Delete recipe by ID (Admin)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Recipe deleted' },
          },
        },
      },

      '/admin/categories': {
        get: {
          tags: ['Admin Categories'],
          summary: 'Get all categories with search and aggregate pagination (Admin Dashboard)',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'q', in: 'query', schema: { type: 'string' }, description: 'Search term for category name or description' },
            { name: 'sort', in: 'query', schema: { type: 'string', enum: ['name_asc', 'name_desc', 'latest', 'oldest'], default: 'name_asc' }, description: 'Sort criteria' },
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 }, description: 'Page number' },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 }, description: 'Items per page' },
          ],
          responses: {
            200: { description: 'Categories list fetched with aggregate pagination' },
          },
        },
        post: {
          tags: ['Admin Categories'],
          summary: 'Create a category (Supports Binary Image Upload to Cloudinary)',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  required: ['name'],
                  properties: {
                    name: { type: 'string', example: 'Snacks' },
                    description: { type: 'string', example: 'Finger foods and quick bites' },
                    image: { type: 'string', format: 'binary', description: 'Select a binary image file (JPG, PNG, WEBP)' },
                  },
                },
              },
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name'],
                  properties: {
                    name: { type: 'string', example: 'Snacks' },
                    description: { type: 'string', example: 'Finger foods and quick bites' },
                    image: { type: 'string', example: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=200&h=200&fit=crop' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Category created' },
          },
        },
      },
      '/admin/categories/{id}': {
        get: {
          tags: ['Admin Categories'],
          summary: 'Get category by ID (Admin)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Category details' },
          },
        },
        patch: {
          tags: ['Admin Categories'],
          summary: 'Update category by ID (Supports Binary Image Upload to Cloudinary)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    description: { type: 'string' },
                    image: { type: 'string', format: 'binary', description: 'Select a binary image file to replace existing image' },
                  },
                },
              },
              'application/json': { schema: { type: 'object' } },
            },
          },
          responses: {
            200: { description: 'Category updated' },
          },
        },
        delete: {
          tags: ['Admin Categories'],
          summary: 'Delete category by ID with dependency safety check (Admin)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Category deleted' },
            400: { description: 'Category in use by recipes' },
          },
        },
      },

      '/admin/blogs': {
        get: {
          tags: ['Admin Articles / Blogs'],
          summary: 'Get all articles including draft/unpublished (Admin)',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Articles list fetched' },
          },
        },
        post: {
          tags: ['Admin Articles / Blogs'],
          summary: 'Create article (Admin)',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['title', 'content'],
                  properties: {
                    title: { type: 'string', example: 'Mastering the Tandoor' },
                    content: { type: 'string', example: 'Article body...' },
                    excerpt: { type: 'string', example: 'Short summary' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Article created' },
          },
        },
      },
      '/admin/blogs/{id}': {
        get: {
          tags: ['Admin Articles / Blogs'],
          summary: 'Get article by ID (Admin)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Article details' },
          },
        },
        patch: {
          tags: ['Admin Articles / Blogs'],
          summary: 'Update article by ID (Admin)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Article updated' },
          },
        },
        delete: {
          tags: ['Admin Articles / Blogs'],
          summary: 'Delete article by ID (Admin)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Article deleted' },
          },
        },
      },

      '/admin/users': {
        get: {
          tags: ['Admin User Management'],
          summary: 'List all registered users (Admin)',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Users list' },
          },
        },
      },
      '/admin/users/{id}': {
        get: {
          tags: ['Admin User Management'],
          summary: 'Get user details by ID (Admin)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'User details' },
          },
        },
        patch: {
          tags: ['Admin User Management'],
          summary: 'Update user status or role (Admin)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    role: { type: 'string', enum: ['USER', 'ADMIN'] },
                    status: { type: 'string', enum: ['ACTIVE', 'INACTIVE'] },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'User updated' },
          },
        },
      },

      '/admin/comments': {
        get: {
          tags: ['Admin Comments Moderation'],
          summary: 'Get all comments for moderation (Admin)',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Comments list' },
          },
        },
      },
      '/admin/comments/{id}/status': {
        patch: {
          tags: ['Admin Comments Moderation'],
          summary: 'Update comment moderation status (Admin)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['status'],
                  properties: {
                    status: { type: 'string', enum: ['PENDING', 'APPROVED', 'REJECTED'] },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Comment status updated' },
          },
        },
      },
      '/admin/comments/{id}': {
        delete: {
          tags: ['Admin Comments Moderation'],
          summary: 'Delete comment by ID (Admin)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Comment deleted' },
          },
        },
      },

      '/admin/newsletter/subscribers': {
        get: {
          tags: ['Admin Newsletter'],
          summary: 'List all newsletter subscribers (Admin)',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Subscribers list' },
          },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
