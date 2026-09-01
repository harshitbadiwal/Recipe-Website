import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  Grid,
  Stack,
  Typography,
  Button,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  TablePagination,
  useTheme,
} from '@mui/material';
import {
  IconSearch,
  IconPlus,
  IconEye,
  IconEdit,
  IconTrash,
  IconClock,
  IconStar,
  IconUsers,
  IconToolsKitchen2,
  IconRefresh,
} from '@tabler/icons-react';
import recipeService from '../../services/recipeService';
import categoryService from '../../services/categoryService';
import { useDispatch } from '../../store';
import { openSnackbar } from '../../store/slices/snackbar';

const RecipeList = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Delete modal state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const data = await recipeService.getAllRecipes();
      setRecipes(data.recipes || []);
    } catch (err) {
      dispatch(
        openSnackbar({
          open: true,
          message: err.message || 'Failed to load recipes',
          variant: 'alert',
          alert: { color: 'error' },
          close: true,
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const cats = await categoryService.getCategories();
      setCategories(cats || []);
    } catch (err) {
      // Ignored
    }
  };

  useEffect(() => {
    fetchRecipes();
    fetchCategories();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!recipeToDelete) return;
    setDeleting(true);
    try {
      await recipeService.deleteRecipe(recipeToDelete._id);
      dispatch(
        openSnackbar({
          open: true,
          message: `Recipe "${recipeToDelete.title}" deleted successfully.`,
          variant: 'alert',
          alert: { color: 'success' },
          close: true,
        })
      );
      setRecipes((prev) => prev.filter((r) => r._id !== recipeToDelete._id));
      setDeleteDialogOpen(false);
      setRecipeToDelete(null);
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

  const getCategoryName = (cat, fallbackName) => {
    if (!cat && !fallbackName) return 'General';
    if (typeof cat === 'string') return cat;
    if (typeof cat === 'object' && cat !== null) {
      return cat.name || cat.slug || fallbackName || 'General';
    }
    return String(fallbackName || 'General');
  };

  // Filtering
  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      const matchesSearch =
        !searchQuery ||
        recipe.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (Array.isArray(recipe.tags) && recipe.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

      const catName = getCategoryName(recipe.category, recipe.categoryName).toLowerCase();
      const matchesCat =
        selectedCategory === 'all' ||
        catName === selectedCategory.toLowerCase();

      return matchesSearch && matchesCat;
    });
  }, [recipes, searchQuery, selectedCategory]);

  const displayedRecipes = useMemo(() => {
    return filteredRecipes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredRecipes, page, rowsPerPage]);

  const getDifficultyColor = (diff) => {
    switch (diff?.toLowerCase()) {
      case 'easy':
        return 'success';
      case 'medium':
        return 'warning';
      case 'hard':
        return 'error';
      default:
        return 'default';
    }
  };

  const getCategoryColor = (cat) => {
    const catName = getCategoryName(cat, '').toLowerCase();
    switch (catName) {
      case 'veg':
        return { bg: '#dcfce7', text: '#15803d' };
      case 'non-veg':
        return { bg: '#fee2e2', text: '#b91c1c' };
      case 'desserts':
        return { bg: '#fef3c7', text: '#b45309' };
      case 'snacks':
        return { bg: '#f3e8ff', text: '#7e22ce' };
      default:
        return { bg: '#f1f5f9', text: '#475569' };
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Page Header */}
      <Card sx={{ p: 3, mb: 3, borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
          <Grid item xs={12} md={7}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                sx={{
                  bgcolor: theme.palette.primary.main,
                  width: 48,
                  height: 48,
                  boxShadow: '0 4px 12px rgba(225, 29, 72, 0.3)',
                }}
              >
                <IconToolsKitchen2 size="26px" color="#fff" />
              </Avatar>
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>
                  Recipe Management
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Create, curate, update, and manage your culinary recipe catalog
                </Typography>
              </Box>
            </Stack>
          </Grid>
          <Grid item xs={12} md={5} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
            <Stack direction="row" spacing={1.5} justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<IconRefresh size="18px" />}
                onClick={fetchRecipes}
                sx={{ borderRadius: '10px' }}
              >
                Refresh
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<IconPlus size="18px" />}
                onClick={() => navigate('/recipes/create')}
                sx={{
                  borderRadius: '10px',
                  fontWeight: 700,
                  boxShadow: '0 6px 16px rgba(225, 29, 72, 0.35)',
                }}
              >
                Add Recipe
              </Button>
            </Stack>
          </Grid>
        </Grid>

        {/* Filter Controls */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={8} md={6}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by title, description, or ingredients..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(0);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconSearch size="18px" color={theme.palette.grey[500]} />
                  </InputAdornment>
                ),
              }}
              sx={{ bgcolor: '#fff', borderRadius: '10px' }}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="category-filter-label">Filter Category</InputLabel>
              <Select
                labelId="category-filter-label"
                value={selectedCategory}
                label="Filter Category"
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setPage(0);
                }}
                sx={{ bgcolor: '#fff', borderRadius: '10px' }}
              >
                <MenuItem value="all">All Categories</MenuItem>
                {categories.map((c) => (
                  <MenuItem key={c._id || c.name} value={c.name}>
                    {c.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3} sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600 }}>
              Showing {filteredRecipes.length} recipe{filteredRecipes.length === 1 ? '' : 's'}
            </Typography>
          </Grid>
        </Grid>
      </Card>

      {/* Recipes Table Card */}
      <Card sx={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <TableContainer component={Paper} elevation={0}>
          <Table sx={{ minWidth: 700 }} aria-label="recipes table">
            <TableHead sx={{ bgcolor: theme.palette.grey[50] }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, py: 2 }}>Recipe</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Difficulty</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Timing & Servings</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, pr: 3 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={36} color="primary" />
                    <Typography variant="body2" sx={{ mt: 2 }} color="textSecondary">
                      Loading recipe database...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : displayedRecipes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <IconToolsKitchen2 size="48px" color={theme.palette.grey[400]} />
                    <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>
                      No Recipes Found
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                      {searchQuery || selectedCategory !== 'all'
                        ? 'Try clearing your filters or search keywords.'
                        : 'Start by creating your very first recipe.'}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<IconPlus size="18px" />}
                      onClick={() => navigate('/recipes/create')}
                      sx={{ borderRadius: '10px' }}
                    >
                      Create First Recipe
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                displayedRecipes.map((recipe) => {
                  const catName = getCategoryName(recipe.category, recipe.categoryName);
                  const catStyle = getCategoryColor(catName);
                  return (
                    <TableRow
                      key={recipe._id}
                      hover
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                        cursor: 'pointer',
                        transition: 'background 0.2s ease',
                      }}
                    >
                      {/* Recipe title and image */}
                      <TableCell onClick={() => navigate(`/recipes/view/${recipe._id}`)}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar
                            src={recipe.image}
                            variant="rounded"
                            sx={{
                              width: 56,
                              height: 56,
                              borderRadius: '12px',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                              border: '1px solid #e2e8f0',
                            }}
                          />
                          <Box>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                                {recipe.title}
                              </Typography>
                              {recipe.isFeatured && (
                                <Tooltip title="Featured Recipe">
                                  <Chip
                                    size="small"
                                    icon={<IconStar size="12px" color="#f59e0b" fill="#f59e0b" />}
                                    label="Featured"
                                    sx={{
                                      height: 20,
                                      fontSize: '0.65rem',
                                      bgcolor: '#fef3c7',
                                      color: '#b45309',
                                      fontWeight: 700,
                                    }}
                                  />
                                </Tooltip>
                              )}
                            </Stack>
                            <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 0.2 }}>
                              slug: {recipe.slug || 'n/a'}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>

                      {/* Category */}
                      <TableCell>
                        <Chip
                          size="small"
                          label={catName}
                          sx={{
                            bgcolor: catStyle.bg,
                            color: catStyle.text,
                            fontWeight: 700,
                            fontSize: '0.75rem',
                          }}
                        />
                      </TableCell>

                      {/* Difficulty */}
                      <TableCell>
                        <Chip
                          size="small"
                          label={recipe.difficulty || 'Medium'}
                          color={getDifficultyColor(recipe.difficulty)}
                          variant="outlined"
                          sx={{ fontWeight: 700, fontSize: '0.75rem' }}
                        />
                      </TableCell>

                      {/* Timings */}
                      <TableCell>
                        <Stack spacing={0.5}>
                          <Stack direction="row" spacing={0.8} alignItems="center">
                            <IconClock size="14px" color={theme.palette.grey[600]} />
                            <Typography variant="caption" sx={{ fontWeight: 600, color: theme.palette.text.secondary }}>
                              {(recipe.prepTime || 0) + (recipe.cookTime || 0)} mins
                            </Typography>
                          </Stack>
                          <Stack direction="row" spacing={0.8} alignItems="center">
                            <IconUsers size="14px" color={theme.palette.grey[600]} />
                            <Typography variant="caption" sx={{ fontWeight: 600, color: theme.palette.text.secondary }}>
                              {recipe.servings || 4} servings
                            </Typography>
                          </Stack>
                        </Stack>
                      </TableCell>

                      {/* Published status */}
                      <TableCell>
                        <Chip
                          size="small"
                          label={recipe.isPublished !== false ? 'Published' : 'Draft'}
                          color={recipe.isPublished !== false ? 'success' : 'default'}
                          sx={{ fontWeight: 700, fontSize: '0.72rem' }}
                        />
                      </TableCell>

                      {/* Action buttons */}
                      <TableCell align="right" sx={{ pr: 3 }}>
                        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                          <Tooltip title="View Recipe">
                            <IconButton
                              size="small"
                              color="info"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/recipes/view/${recipe._id}`);
                              }}
                            >
                              <IconEye size="18px" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Recipe">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/recipes/edit/${recipe._id}`);
                              }}
                            >
                              <IconEdit size="18px" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Recipe">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={(e) => {
                                e.stopPropagation();
                                setRecipeToDelete(recipe);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <IconTrash size="18px" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredRecipes.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => !deleting && setDeleteDialogOpen(false)}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title" sx={{ fontWeight: 700 }}>
          Delete Recipe
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to permanently delete{' '}
            <strong>"{recipeToDelete?.title}"</strong>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button disabled={deleting} onClick={() => setDeleteDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            disabled={deleting}
            onClick={handleDeleteConfirm}
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

export default RecipeList;
