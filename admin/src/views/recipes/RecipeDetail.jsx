import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  Grid,
  Stack,
  Typography,
  Button,
  Chip,
  Avatar,
  Divider,
  Paper,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  useTheme,
} from '@mui/material';
import {
  IconArrowLeft,
  IconEdit,
  IconTrash,
  IconClock,
  IconUsers,
  IconStar,
  IconCheck,
  IconFlame,
  IconToolsKitchen2,
  IconWorldWww,
} from '@tabler/icons-react';
import recipeService from '../../services/recipeService';
import { useDispatch } from '../../store';
import { openSnackbar } from '../../store/slices/snackbar';

const RecipeDetail = () => {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const data = await recipeService.getRecipeById(id);
        setRecipe(data);
      } catch (err) {
        dispatch(
          openSnackbar({
            open: true,
            message: err.message || 'Recipe not found',
            variant: 'alert',
            alert: { color: 'error' },
            close: true,
          })
        );
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id, dispatch]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await recipeService.deleteRecipe(recipe._id);
      dispatch(
        openSnackbar({
          open: true,
          message: 'Recipe deleted successfully.',
          variant: 'alert',
          alert: { color: 'success' },
          close: true,
        })
      );
      navigate('/recipes');
    } catch (err) {
      dispatch(
        openSnackbar({
          open: true,
          message: err.message || 'Failed to delete recipe',
          variant: 'alert',
          alert: { color: 'error' },
          close: true,
        })
      );
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={40} color="primary" />
      </Box>
    );
  }

  if (!recipe) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h3" sx={{ mb: 2 }}>
          Recipe Not Found
        </Typography>
        <Button variant="contained" onClick={() => navigate('/recipes')}>
          Back to Recipes
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1.5, sm: 3 }, maxWidth: 1100, mx: 'auto' }}>
      {/* Action Navigation */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<IconArrowLeft size="18px" />}
          onClick={() => navigate('/recipes')}
          sx={{ borderRadius: '10px' }}
        >
          All Recipes
        </Button>
        <Stack direction="row" spacing={1.5}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<IconEdit size="18px" />}
            onClick={() => navigate(`/recipes/edit/${recipe._id}`)}
            sx={{ borderRadius: '10px', fontWeight: 700 }}
          >
            Edit Recipe
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<IconTrash size="18px" />}
            onClick={() => setDeleteDialogOpen(true)}
            sx={{ borderRadius: '10px' }}
          >
            Delete
          </Button>
        </Stack>
      </Stack>

      {/* Main Recipe Card */}
      <Card sx={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 8px 30px rgba(0,0,0,0.06)', mb: 3 }}>
        {/* Banner image */}
        <Box sx={{ position: 'relative', width: '100%', height: { xs: 240, md: 360 }, bgcolor: '#0f172a' }}>
          <img
            src={recipe.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&fit=crop'}
            alt={recipe.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(180deg, rgba(15,23,42,0.2) 0%, rgba(15,23,42,0.85) 100%)',
            }}
          />
          <Box sx={{ position: 'absolute', bottom: 24, left: 24, right: 24, color: '#fff' }}>
            <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
              <Chip
                label={
                  typeof recipe.category === 'object' && recipe.category !== null
                    ? recipe.category.name || recipe.category.slug || 'General'
                    : recipe.category || recipe.categoryName || 'General'
                }
                size="small"
                sx={{ bgcolor: theme.palette.primary.main, color: '#fff', fontWeight: 700 }}
              />
              <Chip
                label={recipe.difficulty || 'Medium'}
                size="small"
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 700 }}
              />
              {recipe.isFeatured && (
                <Chip
                  icon={<IconStar size="14px" color="#f59e0b" fill="#f59e0b" />}
                  label="Featured"
                  size="small"
                  sx={{ bgcolor: '#fef3c7', color: '#b45309', fontWeight: 700 }}
                />
              )}
            </Stack>
            <Typography variant="h2" sx={{ fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>
              {recipe.title}
            </Typography>
            <Typography variant="caption" sx={{ color: '#cbd5e1' }}>
              Slug: /{recipe.slug}
            </Typography>
          </Box>
        </Box>

        {/* Specs bar */}
        <Box sx={{ p: 3, bgcolor: '#fafaf9', borderBottom: '1px solid #f1f5f9' }}>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Stack direction="row" spacing={1} alignItems="center">
                <IconClock size="20px" color={theme.palette.primary.main} />
                <Box>
                  <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
                    Prep Time
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {recipe.prepTime || 0} mins
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Stack direction="row" spacing={1} alignItems="center">
                <IconFlame size="20px" color={theme.palette.secondary.main} />
                <Box>
                  <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
                    Cook Time
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {recipe.cookTime || 0} mins
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Stack direction="row" spacing={1} alignItems="center">
                <IconUsers size="20px" color={theme.palette.success.main} />
                <Box>
                  <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
                    Servings
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {recipe.servings || 4} persons
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Stack direction="row" spacing={1} alignItems="center">
                <IconToolsKitchen2 size="20px" color={theme.palette.info.main} />
                <Box>
                  <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
                    Total Time
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {(recipe.prepTime || 0) + (recipe.cookTime || 0)} mins
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Box>

        {/* Content Body */}
        <Box sx={{ p: { xs: 2.5, md: 4 } }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            About this Dish
          </Typography>
          <Typography variant="body1" sx={{ color: theme.palette.text.secondary, lineHeight: 1.7, mb: 4 }}>
            {recipe.description}
          </Typography>

          {/* Tags */}
          {Array.isArray(recipe.tags) && recipe.tags.length > 0 && (
            <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {recipe.tags.map((tag) => (
                <Chip key={tag} label={`#${tag}`} size="small" variant="outlined" sx={{ fontWeight: 600 }} />
              ))}
            </Box>
          )}

          <Grid container spacing={4}>
            {/* Ingredients */}
            <Grid item xs={12} md={5}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                Ingredients Required
              </Typography>
              <Stack spacing={1.5}>
                {Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 ? (
                  recipe.ingredients.map((ing, idx) => (
                    <Paper
                      key={idx}
                      variant="outlined"
                      sx={{ p: 1.5, borderRadius: '10px', bgcolor: '#fafaf9', display: 'flex', gap: 1.5 }}
                    >
                      <IconCheck size="18px" color="#16a34a" style={{ marginTop: 2, flexShrink: 0 }} />
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          {ing.item} {ing.qty && <span style={{ color: '#e11d48' }}>({ing.qty})</span>}
                        </Typography>
                        {ing.note && (
                          <Typography variant="caption" color="textSecondary">
                            Note: {ing.note}
                          </Typography>
                        )}
                      </Box>
                    </Paper>
                  ))
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No ingredients listed.
                  </Typography>
                )}
              </Stack>

              {/* Nutrition Card */}
              {recipe.nutrition && (
                <Box sx={{ mt: 3, p: 2, borderRadius: '12px', bgcolor: '#f1f5f9' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                    Nutrition Estimate
                  </Typography>
                  <Grid container spacing={1}>
                    {Object.entries(recipe.nutrition).map(([k, v]) => (
                      <Grid item xs={6} key={k}>
                        <Typography variant="caption" color="textSecondary" sx={{ textTransform: 'capitalize' }}>
                          {k}:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {v}
                        </Typography>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </Grid>

            {/* Instructions */}
            <Grid item xs={12} md={7}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                Preparation Method
              </Typography>
              <Stack spacing={2}>
                {Array.isArray(recipe.instructions) && recipe.instructions.length > 0 ? (
                  recipe.instructions.map((step, idx) => (
                    <Stack key={idx} direction="row" spacing={2} alignItems="flex-start">
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: theme.palette.primary.main,
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          flexShrink: 0,
                          mt: 0.5,
                        }}
                      >
                        {idx + 1}
                      </Avatar>
                      <Paper variant="outlined" sx={{ p: 2, borderRadius: '12px', flex: 1, bgcolor: '#ffffff' }}>
                        <Typography variant="body2" sx={{ lineHeight: 1.7, color: theme.palette.text.primary }}>
                          {step}
                        </Typography>
                      </Paper>
                    </Stack>
                  ))
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No steps added yet.
                  </Typography>
                )}
              </Stack>
            </Grid>
          </Grid>

          {/* SEO Preview Box */}
          {(recipe.seoTitle || recipe.seoDescription) && (
            <Box sx={{ mt: 5, p: 3, borderRadius: '12px', border: '1px solid #e2e8f0', bgcolor: '#fff' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconWorldWww size="18px" color="#2563eb" />
                Google Search & Meta Preview
              </Typography>
              <Typography variant="body2" sx={{ color: '#1a0dab', fontWeight: 600, fontSize: '1.05rem' }}>
                {recipe.seoTitle || recipe.title}
              </Typography>
              <Typography variant="caption" sx={{ color: '#006621', display: 'block', mb: 0.5 }}>
                https://recipemaster.com/recipes/{recipe.slug}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {recipe.seoDescription || recipe.description}
              </Typography>
            </Box>
          )}
        </Box>
      </Card>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteDialogOpen} onClose={() => !deleting && setDeleteDialogOpen(false)}>
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Recipe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <strong>"{recipe.title}"</strong>? This will remove it from the catalog.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button disabled={deleting} onClick={() => setDeleteDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            disabled={deleting}
            onClick={handleDelete}
            color="error"
            variant="contained"
            startIcon={deleting ? <CircularProgress size={16} color="inherit" /> : <IconTrash size="18px" />}
            sx={{ borderRadius: '8px' }}
          >
            {deleting ? 'Deleting...' : 'Delete Recipe'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RecipeDetail;
