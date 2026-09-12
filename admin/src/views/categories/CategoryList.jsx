import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Card,
  Grid,
  Stack,
  Typography,
  Button,
  TextField,
  InputAdornment,
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
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
} from '@mui/material';
import {
  IconSearch,
  IconPlus,
  IconEdit,
  IconTrash,
  IconCategory,
  IconUpload,
  IconPhoto,
  IconRefresh,
} from '@tabler/icons-react';
import categoryService from '../../services/categoryService';
import { useDispatch } from '../../store';
import { openSnackbar } from '../../store/slices/snackbar';

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');

const CategoryList = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Dialog State (Create / Edit)
  const [formOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [parentCategory, setParentCategory] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [fieldErrors, setFieldErrors] = useState({});

  // Delete State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data.categories || []);
    } catch (err) {
      dispatch(
        openSnackbar({
          open: true,
          message: err.message || 'Failed to load categories',
          variant: 'alert',
          alert: { color: 'error' },
          close: true,
        })
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const topLevelCategories = useMemo(() => {
    return categories.filter((c) => !c.parentCategory);
  }, [categories]);

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setIsSlugManual(false);
    setParentCategory('');
    setDescription('');
    setImageUrl('');
    setImageFile(null);
    setImagePreview('');
    setIsActive(true);
    setFieldErrors({});
    setFormOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setName(cat.name || '');
    setSlug(cat.slug || '');
    setIsSlugManual(true);
    const pId =
      cat.parentCategory && typeof cat.parentCategory === 'object'
        ? cat.parentCategory._id
        : cat.parentCategory || '';
    setParentCategory(pId);
    setDescription(cat.description || '');
    setImageUrl(cat.image || '');
    setImagePreview(cat.image || '');
    setImageFile(null);
    setIsActive(cat.isActive !== false);
    setFieldErrors({});
    setFormOpen(true);
  };

  const handleNameChange = (e) => {
    const val = e.target.value;
    setName(val);
    if (!isSlugManual) {
      setSlug(slugify(val));
    }
    if (fieldErrors.name) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next.name;
        return next;
      });
    }
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setFieldErrors({ name: 'Category name is required.' });
      return;
    }
    setFieldErrors({});

    setSubmitting(true);
    const payload = {
      name: name.trim(),
      slug: slug.trim() || slugify(name),
      description: description.trim(),
      parentCategory: parentCategory || null,
      image: imageUrl.trim(),
      isActive,
    };

    try {
      if (editingCategory) {
        const updated = await categoryService.updateCategory(editingCategory._id, payload, imageFile);
        setCategories((prev) =>
          prev.map((c) => (c._id === editingCategory._id ? { ...c, ...updated } : c))
        );
        dispatch(
          openSnackbar({
            open: true,
            message: 'Category updated successfully!',
            variant: 'alert',
            alert: { color: 'success' },
            close: true,
          })
        );
      } else {
        const created = await categoryService.createCategory(payload, imageFile);
        setCategories((prev) => [created, ...prev]);
        dispatch(
          openSnackbar({
            open: true,
            message: 'Category created successfully!',
            variant: 'alert',
            alert: { color: 'success' },
            close: true,
          })
        );
      }
      setFormOpen(false);
    } catch (err) {
      dispatch(
        openSnackbar({
          open: true,
          message: err.message || 'Failed to save category',
          variant: 'alert',
          alert: { color: 'error' },
          close: true,
        })
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;
    setDeleting(true);
    try {
      await categoryService.deleteCategory(categoryToDelete._id);
      setCategories((prev) => prev.filter((c) => c._id !== categoryToDelete._id));
      dispatch(
        openSnackbar({
          open: true,
          message: `Category "${categoryToDelete.name}" deleted.`,
          variant: 'alert',
          alert: { color: 'success' },
          close: true,
        })
      );
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    } catch (err) {
      dispatch(
        openSnackbar({
          open: true,
          message: err.message || 'Failed to delete category',
          variant: 'alert',
          alert: { color: 'error' },
          close: true,
        })
      );
    } finally {
      setDeleting(false);
    }
  };

  const filteredCategories = useMemo(() => {
    return categories.filter((c) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        c.name?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q) ||
        c.slug?.toLowerCase().includes(q) ||
        c.parentCategoryName?.toLowerCase().includes(q);

      let matchesType = true;
      if (typeFilter === 'top-level') {
        matchesType = !c.parentCategory;
      } else if (typeFilter === 'subcategory') {
        matchesType = Boolean(c.parentCategory);
      }

      return matchesSearch && matchesType;
    });
  }, [categories, searchQuery, typeFilter]);

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header Card */}
      <Card sx={{ p: 3, mb: 3, borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
          <Grid item xs={12} md={7}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                sx={{
                  bgcolor: theme.palette.secondary.main,
                  width: 48,
                  height: 48,
                  boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)',
                }}
              >
                <IconCategory size="26px" color="#fff" />
              </Avatar>
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>
                  Category Management
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Create, organize, and manage recipe categories and dietary classifications
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
                onClick={fetchCategories}
                sx={{ borderRadius: '10px' }}
              >
                Refresh
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<IconPlus size="18px" />}
                onClick={handleOpenCreate}
                sx={{
                  borderRadius: '10px',
                  fontWeight: 700,
                  boxShadow: '0 6px 16px rgba(225, 29, 72, 0.35)',
                }}
              >
                Add Category
              </Button>
            </Stack>
          </Grid>
        </Grid>

        {/* Search Bar & Type Filter */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3 }} alignItems="center">
          <Box sx={{ flexGrow: 1, width: { xs: '100%', sm: 'auto' }, maxWidth: 500 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search categories by name, slug, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconSearch size="18px" color={theme.palette.grey[500]} />
                  </InputAdornment>
                ),
              }}
              sx={{ bgcolor: '#fff', borderRadius: '10px' }}
            />
          </Box>
          <FormControl size="small" sx={{ minWidth: 200, width: { xs: '100%', sm: 'auto' } }}>
            <InputLabel id="type-filter-label">Category Type</InputLabel>
            <Select
              labelId="type-filter-label"
              value={typeFilter}
              label="Category Type"
              onChange={(e) => setTypeFilter(e.target.value)}
              sx={{ bgcolor: '#fff', borderRadius: '10px' }}
            >
              <MenuItem value="all">All Categories ({categories.length})</MenuItem>
              <MenuItem value="top-level">Top-Level Only ({topLevelCategories.length})</MenuItem>
              <MenuItem value="subcategory">Subcategories Only ({categories.length - topLevelCategories.length})</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Card>

      {/* Categories Table */}
      <Card sx={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <TableContainer component={Paper} elevation={0}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: theme.palette.grey[50] }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, py: 2 }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Type / Parent</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Slug</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
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
                      Loading categories...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : filteredCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <IconCategory size="48px" color={theme.palette.grey[400]} />
                    <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>
                      No Categories Found
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                      {searchQuery ? 'Try adjusting your search query.' : 'Add your first recipe category.'}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<IconPlus size="18px" />}
                      onClick={handleOpenCreate}
                      sx={{ borderRadius: '10px' }}
                    >
                      Add Category
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                filteredCategories.map((cat) => (
                  <TableRow key={cat._id || cat.name} hover>
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar
                          src={cat.image}
                          variant="rounded"
                          sx={{
                            width: 50,
                            height: 50,
                            borderRadius: '12px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                            border: '1px solid #e2e8f0',
                          }}
                        />
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                            {cat.name}
                          </Typography>
                          {(cat.recipeCount !== undefined || cat.recipesCount !== undefined) && (
                            <Typography variant="caption" color="textSecondary">
                              {cat.recipeCount ?? cat.recipesCount} recipe{(cat.recipeCount ?? cat.recipesCount) === 1 ? '' : 's'}
                            </Typography>
                          )}
                        </Box>
                      </Stack>
                    </TableCell>

                    <TableCell>
                      {cat.parentCategory ? (
                        <Tooltip title={`Child of ${cat.parentCategoryName || (typeof cat.parentCategory === 'object' ? cat.parentCategory.name : 'Parent')}`}>
                          <Chip
                            label={`↳ ${cat.parentCategoryName || (typeof cat.parentCategory === 'object' ? cat.parentCategory.name : 'Subcategory')}`}
                            size="small"
                            color="secondary"
                            variant="outlined"
                            sx={{ fontWeight: 700, fontSize: '0.73rem' }}
                          />
                        </Tooltip>
                      ) : (
                        <Chip
                          label="Top-Level Category"
                          size="small"
                          color="primary"
                          sx={{ fontWeight: 700, fontSize: '0.73rem' }}
                        />
                      )}
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={`/${cat.slug || slugify(cat.name)}`}
                        size="small"
                        sx={{ bgcolor: '#f1f5f9', fontWeight: 600, fontSize: '0.75rem' }}
                      />
                    </TableCell>

                    <TableCell sx={{ maxWidth: 320 }}>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {cat.description || 'No description provided.'}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        size="small"
                        label={cat.isActive !== false ? 'Active' : 'Disabled'}
                        color={cat.isActive !== false ? 'success' : 'default'}
                        sx={{ fontWeight: 700, fontSize: '0.72rem' }}
                      />
                    </TableCell>

                    <TableCell align="right" sx={{ pr: 3 }}>
                      <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                        <Tooltip title="Edit Category">
                          <IconButton size="small" color="primary" onClick={() => handleOpenEdit(cat)}>
                            <IconEdit size="18px" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Category">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => {
                              setCategoryToDelete(cat);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <IconTrash size="18px" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Create / Edit Category Modal */}
      <Dialog
        open={formOpen}
        onClose={() => !submitting && setFormOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>
          {editingCategory ? 'Edit Category' : 'Create New Category'}
        </DialogTitle>
        <form onSubmit={handleSaveCategory}>
          <DialogContent dividers sx={{ p: 3 }}>
            <Stack spacing={2.5}>
              <TextField
                fullWidth
                label="Category Name *"
                placeholder="e.g. Non-Veg, Desserts, Paneer Dishes"
                value={name}
                onChange={handleNameChange}
                error={Boolean(fieldErrors.name)}
                helperText={fieldErrors.name}
                required
              />

              <FormControl fullWidth size="small">
                <InputLabel id="parent-cat-select-label">Parent Category (Optional)</InputLabel>
                <Select
                  labelId="parent-cat-select-label"
                  value={parentCategory}
                  label="Parent Category (Optional)"
                  onChange={(e) => setParentCategory(e.target.value)}
                >
                  <MenuItem value="">
                    <em>None (Top-Level Category)</em>
                  </MenuItem>
                  {topLevelCategories
                    .filter((c) => !editingCategory || c._id !== editingCategory._id)
                    .map((c) => (
                      <MenuItem key={c._id} value={c._id}>
                        {c.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="URL Slug"
                placeholder="e.g. non-veg"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setIsSlugManual(true);
                }}
                helperText="URL slug used for category recipe routes"
              />

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                placeholder="Brief description of this culinary category..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              {/* Image Preview & Upload */}
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                  Category Banner Image
                </Typography>
                {imagePreview ? (
                  <Box
                    sx={{
                      width: '100%',
                      height: 140,
                      borderRadius: '10px',
                      overflow: 'hidden',
                      mb: 1.5,
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    <img
                      src={imagePreview}
                      alt="Category Preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Box>
                ) : null}

                <Stack direction="row" spacing={1.5}>
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<IconUpload size="16px" />}
                    size="small"
                  >
                    Upload File
                    <input type="file" accept="image/*" hidden onChange={handleImageFileChange} />
                  </Button>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Or enter image URL..."
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      if (!imageFile) setImagePreview(e.target.value);
                    }}
                  />
                </Stack>
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    color="success"
                  />
                }
                label={
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Active & Available for Recipes
                  </Typography>
                }
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button disabled={submitting} onClick={() => setFormOpen(false)} color="inherit">
              Cancel
            </Button>
            <Button
              disabled={submitting}
              type="submit"
              variant="contained"
              color="primary"
              sx={{ borderRadius: '8px', px: 3, fontWeight: 700 }}
            >
              {submitting ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => !deleting && setDeleteDialogOpen(false)}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Category</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete category <strong>"{categoryToDelete?.name}"</strong>?
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
            {deleting ? 'Deleting...' : 'Delete Category'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CategoryList;
