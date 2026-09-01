import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import Loadable from '../ui-component/Loadable';
import AuthGuard from './AuthGuard';

// Views lazy loading
const RecipeList = Loadable(lazy(() => import('../views/recipes/RecipeList')));
const RecipeForm = Loadable(lazy(() => import('../views/recipes/RecipeForm')));
const RecipeDetail = Loadable(lazy(() => import('../views/recipes/RecipeDetail')));
const CategoryList = Loadable(lazy(() => import('../views/categories/CategoryList')));
const BlogList = Loadable(lazy(() => import('../views/blogs/BlogList')));
const BlogForm = Loadable(lazy(() => import('../views/blogs/BlogForm')));
const BlogDetail = Loadable(lazy(() => import('../views/blogs/BlogDetail')));
const UserList = Loadable(lazy(() => import('../views/users/UserList')));
const NewsletterList = Loadable(lazy(() => import('../views/newsletter/NewsletterList')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: (
    <AuthGuard>
      <MainLayout />
    </AuthGuard>
  ),
  children: [
    {
      path: '/',
      element: <Navigate to="/recipes" replace />,
    },
    {
      path: 'dashboard',
      element: <Navigate to="/recipes" replace />,
    },
    {
      path: 'recipes',
      element: <RecipeList />,
    },
    {
      path: 'recipes/create',
      element: <RecipeForm />,
    },
    {
      path: 'recipes/edit/:id',
      element: <RecipeForm />,
    },
    {
      path: 'recipes/view/:id',
      element: <RecipeDetail />,
    },
    {
      path: 'categories',
      element: <CategoryList />,
    },
    {
      path: 'blogs',
      element: <BlogList />,
    },
    {
      path: 'blogs/create',
      element: <BlogForm />,
    },
    {
      path: 'blogs/edit/:id',
      element: <BlogForm />,
    },
    {
      path: 'blogs/view/:id',
      element: <BlogDetail />,
    },
    {
      path: 'users',
      element: <UserList />,
    },
    {
      path: 'newsletter',
      element: <NewsletterList />,
    },
  ],
};

export default MainRoutes;
