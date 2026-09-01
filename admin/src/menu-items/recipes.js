import { IconToolsKitchen2, IconCategory, IconArticle } from '@tabler/icons-react';

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
