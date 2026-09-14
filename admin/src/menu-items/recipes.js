import { IconToolsKitchen2, IconCategory, IconArticle, IconHierarchy } from '@tabler/icons-react';

const recipes = {
  id: 'recipes-group',
  title: 'Culinary Management',
  type: 'group',
  children: [
    {
      id: 'recipes-all',
      title: 'Recipes',
      type: 'item',
      url: '/recipes',
      icon: IconToolsKitchen2,
      breadcrumbs: true,
    },
    {
      id: 'categories-all',
      title: 'Categories',
      type: 'item',
      url: '/categories',
      icon: IconCategory,
      breadcrumbs: true,
    },
    {
      id: 'subcategories-all',
      title: 'Sub-Categories',
      type: 'item',
      url: '/subcategories',
      icon: IconHierarchy,
      breadcrumbs: true,
    },
    {
      id: 'blogs-all',
      title: 'Articles & Blogs',
      type: 'item',
      url: '/blogs',
      icon: IconArticle,
      breadcrumbs: true,
    },
  ],
};

export default recipes;
