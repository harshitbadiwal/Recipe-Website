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
  FormHelperText,
  useTheme,
} from '@mui/material';
import {
  IconSearch,
  IconPlus,
  IconEdit,
  IconTrash,
  IconHierarchy,
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

const SubCategoryList = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [subCategories, setSubCategories] = useState([]);
  const [parentCategories, setParentCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedParentFilter, setSelectedParentFilter] = useState('all');

  // Modal (Create / Edit) State
  const [formOpen, setFormOpen] = useState(false);
  const [editingSubCategory, setEditingSubCategory] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [categoryId, setCategoryId] = useState('');
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [fieldErrors, setFieldErrors] = useState({});

  // Delete State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [subCategoryToDelete, setSubCategoryToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch subcategories and all categories
      const [subData, allCatData] = await Promise.all([
        categoryService.getSubCategories({ limit: 100 }),
        categoryService.getAllCategories({ limit: 100 }),
      ]);

      const allCats = allCatData.categories || [];
      setParentCategories(allCats.filter((c) => !c.parentCategory && !c.categoryId));
      setSubCategories(subData.categories || []);
    } catch (err) {
      dispatch(
        openSnackbar({
          open: true,
          message: err.message || 'Failed to load subcategories',
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
    fetchData();
  }, []);

  const handleOpenCreate = () => {
    setEditingSubCategory(null);
    setCategoryId(parentCategories[0]?._id || '');
    setName('');
    setSlug('');
    setIsSlugManual(false);
    setDescription('');
    setImageUrl('');
    setImageFile(null);
    setImagePreview('');
    setIsActive(true);
    setFieldErrors({});
    setFormOpen(true);
  };

  const handleOpenEdit = (sub) => {
    setEditingSubCategory(sub);
    const parentId =
      sub.categoryId?._id ||
      sub.categoryId ||
      sub.parentCategory?._id ||
      sub.parentCategory ||
      '';
    setCategoryId(String(parentId));
    setName(sub.name || '');
    setSlug(sub.slug || '');
    setIsSlugManual(true);
    setDescription(sub.description || '');
    setImageUrl(sub.image || '');
    setImageFile(null);
    setImagePreview(sub.image || '');
    setIsActive(sub.isActive !== false);
    setFieldErrors({});
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    if (!submitting) {
      setFormOpen(false);
      setEditingSubCategory(null);
    }
  };

  const handleNameChange = (e) => {
    const val = e.target.value;
    setName(val);
    if (!isSlugManual) {
      setSlug(slugify(val));
    }
    if (fieldErrors.name) {
      setFieldErrors((prev) => ({ ...prev, name: '' }));
    }
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);
      setImageUrl('');
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!categoryId) {
      errors.categoryId = 'Parent category is required.';
    }
    if (!name.trim()) {
      errors.name = 'Sub-Category name is required.';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        slug: (slug.trim() || slugify(name)).toLowerCase(),
        description: description.trim(),
        categoryId,
        parentCategory: categoryId,
        isActive,
        image: imageFile || imageUrl.trim() || 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&h=300&fit=crop',
      };

      if (editingSubCategory) {
        await categoryService.updateSubCategory(editingSubCategory._id, payload, imageFile);
        dispatch(
          openSnackbar({
            open: true,
            message: `Subcategory "${payload.name}" updated successfully.`,
            variant: 'alert',
            alert: { color: 'success' },
            close: true,
          })
        );
      } else {
        await categoryService.createSubCategory(payload, imageFile);
        dispatch(
          openSnackbar({
            open: true,
            message: `Subcategory "${payload.name}" created successfully.`,
            variant: 'alert',
            alert: { color: 'success' },
            close: true,
          })
        );
      }

      setFormOpen(false);
      fetchData();
    } catch (err) {
      dispatch(
        openSnackbar({
          open: true,
          message: err.message || 'Operation failed',
          variant: 'alert',
          alert: { color: 'error' },
          close: true,
        })
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (sub) => {
    setSubCategoryToDelete(sub);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!subCategoryToDelete) return;
    setDeleting(true);
    try {
      await categoryService.deleteSubCategory(subCategoryToDelete._id);
      dispatch(
        openSnackbar({
          open: true,
          message: `Subcategory "${subCategoryToDelete.name}" deleted.`,
          variant: 'alert',
          alert: { color: 'success' },
          close: true,
        })
      );
      setDeleteDialogOpen(false);
      setSubCategoryToDelete(null);
      fetchData();
    } catch (err) {
      dispatch(
        openSnackbar({
          open: true,
          message: err.message || 'Failed to delete subcategory',
          variant: 'alert',
          alert: { color: 'error' },
          close: true,
        })
      );
    } finally {
      setDeleting(false);
    }
  };

  // Filtered Subcategories
  const filteredSubCategories = useMemo(() => {
    return subCategories.filter((sub) => {
      const matchesSearch =
        !searchQuery ||
        sub.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.slug?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.parentCategoryName?.toLowerCase().includes(searchQuery.toLowerCase());

      const parentId =
        sub.categoryId?._id ||
        sub.categoryId ||
        sub.parentCategory?._id ||
        sub.parentCategory ||
        '';

      const matchesParent =
        selectedParentFilter === 'all' ||
        String(parentId) === String(selectedParentFilter) ||
        (sub.parentCategoryName && sub.parentCategoryName.toLowerCase() === selectedParentFilter.toLowerCase());

      return matchesSearch && matchesParent;
    });
  }, [subCategories, searchQuery, selectedParentFilter]);

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Stack spacing={3}>
        {/* Header Title & Actions */}
        <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
          <Grid item>
            <Typography variant="h3" sx={{ fontWeight: 700, color: theme.palette.text.primary, display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconHierarchy size={28} color={theme.palette.primary.main} />
              Sub-Categories Management
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
              Manage subcategories associated with your primary culinary categories.
            </Typography>
          </Grid>
          <Grid item>
            <Stack direction="row" spacing={1.5}>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<IconRefresh size="18px" />}
                onClick={fetchData}
                disabled={loading}
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
                Add Sub-Category
              </Button>
            </Stack>
          </Grid>
        </Grid>

        {/* Toolbar: Search & Category Filter */}
        <Card sx={{ p: 2, borderRadius: '12px', boxShadow: '0 2px 14px rgba(0,0,0,0.04)' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={5}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search subcategories by name or slug..."
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
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel id="parent-cat-filter-label">Filter by Category</InputLabel>
                <Select
                  labelId="parent-cat-filter-label"
                  value={selectedParentFilter}
                  label="Filter by Category"
                  onChange={(e) => setSelectedParentFilter(e.target.value)}
                  sx={{ bgcolor: '#fff', borderRadius: '10px' }}
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  {parentCategories.map((p) => (
                    <MenuItem key={p._id} value={p._id}>
                      {p.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
              <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600 }}>
                Showing {filteredSubCategories.length} subcategor{filteredSubCategories.length === 1 ? 'y' : 'ies'}
              </Typography>
            </Grid>
          </Grid>
        </Card>

        {/* Subcategories Table */}
        <Card sx={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead sx={{ bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8f9fa' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, width: 70 }}>Media</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Sub-Category Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Parent Category</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>URL Slug</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Recipes Count</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, width: 110 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                      <CircularProgress size={36} color="primary" />
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1.5 }}>
                        Loading subcategories...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : filteredSubCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                      <Typography variant="h5" color="textSecondary" sx={{ mb: 1 }}>
                        No Sub-Categories Found
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Click "Add Sub-Category" to create subcategories under your main categories.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSubCategories.map((sub) => {
                    const parentName =
                      sub.parentCategoryName ||
                      (typeof sub.parentCategory === 'object' ? sub.parentCategory?.name : '') ||
                      'Unassigned';

                    return (
                      <TableRow key={sub._id || sub.slug} hover>
                        <TableCell>
                          <Avatar
                            src={sub.image}
                            alt={sub.name}
                            variant="rounded"
                            sx={{ width: 44, height: 44, bgcolor: 'primary.light' }}
                          >
                            <IconHierarchy size={22} />
                          </Avatar>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {sub.name}
                          </Typography>
                          {sub.description && (
                            <Typography
                              variant="caption"
                              color="textSecondary"
                              sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                maxWidth: 260,
                              }}
                            >
                              {sub.description}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={<IconCategory size={14} />}
                            label={parentName}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ fontWeight: 600 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>
                            {sub.slug}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {sub.recipesCount || 0}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={sub.isActive !== false ? 'Active' : 'Inactive'}
                            size="small"
                            color={sub.isActive !== false ? 'success' : 'default'}
                            variant="filled"
                            sx={{ fontWeight: 600 }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Stack direction="row" spacing={0.5} justifyContent="center">
                            <Tooltip title="Edit Sub-Category">
                              <IconButton size="small" color="primary" onClick={() => handleOpenEdit(sub)}>
                                <IconEdit size={18} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Sub-Category">
                              <IconButton size="small" color="error" onClick={() => handleDeleteClick(sub)}>
                                <IconTrash size={18} />
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
        </Card>
      </Stack>

      {/* Add / Edit Sub-Category Dialog */}
      <Dialog open={formOpen} onClose={handleCloseForm} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1.25rem' }}>
          {editingSubCategory ? `Edit Sub-Category: ${editingSubCategory.name}` : 'Add New Sub-Category'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent dividers>
            <Stack spacing={2.5}>
              {/* Parent Category Dropdown (REQUIRED) */}
              <FormControl fullWidth required error={Boolean(fieldErrors.categoryId)}>
                <InputLabel id="form-category-id-label">Category *</InputLabel>
                <Select
                  labelId="form-category-id-label"
                  value={categoryId}
                  label="Category *"
                  onChange={(e) => {
                    setCategoryId(e.target.value);
                    if (fieldErrors.categoryId) {
                      setFieldErrors((prev) => ({ ...prev, categoryId: '' }));
                    }
                  }}
                >
                  {parentCategories.map((cat) => (
                    <MenuItem key={cat._id} value={cat._id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
                {fieldErrors.categoryId && (
                  <FormHelperText error>{fieldErrors.categoryId}</FormHelperText>
                )}
              </FormControl>

              {/* Subcategory Name */}
              <TextField
                fullWidth
                label="Sub-Category Name *"
                placeholder="e.g. Paneer Dishes, Dal & Lentils"
                value={name}
                onChange={handleNameChange}
                error={Boolean(fieldErrors.name)}
                helperText={fieldErrors.name}
                required
              />

              {/* URL Slug */}
              <TextField
                fullWidth
                label="URL Slug"
                placeholder="e.g. paneer-dishes"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setIsSlugManual(true);
                }}
                helperText="URL-friendly identifier (auto-generated from name)"
              />

              {/* Description */}
              <TextField
                fullWidth
                label="Description"
                placeholder="Brief description of this subcategory..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows={2}
              />

              {/* Image Upload or URL */}
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', mb: 0.5, display: 'block' }}>
                  Sub-Category Image
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar
                    src={imagePreview}
                    variant="rounded"
                    sx={{ width: 56, height: 56, bgcolor: 'grey.200' }}
                  >
                    <IconPhoto size={28} color={theme.palette.grey[500]} />
                  </Avatar>
                  <Stack spacing={0.5} sx={{ flex: 1 }}>
                    <Button
                      variant="outlined"
                      component="label"
                      size="small"
                      startIcon={<IconUpload size={16} />}
                      sx={{ width: 'fit-content' }}
                    >
                      Upload File
                      <input type="file" hidden accept="image/*" onChange={handleImageFileChange} />
                    </Button>
                    <TextField
                      size="small"
                      placeholder="Or enter image URL..."
                      value={imageUrl}
                      onChange={(e) => {
                        setImageUrl(e.target.value);
                        setImagePreview(e.target.value);
                        setImageFile(null);
                      }}
                    />
                  </Stack>
                </Stack>
              </Box>

              {/* Active Toggle */}
              <FormControlLabel
                control={
                  <Switch
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    color="primary"
                  />
                }
                label="Active (visible on website)"
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={handleCloseForm} color="inherit" disabled={submitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={submitting}
              startIcon={submitting && <CircularProgress size={18} color="inherit" />}
              sx={{ fontWeight: 700, borderRadius: '8px', px: 2.5 }}
            >
              {submitting ? 'Saving...' : editingSubCategory ? 'Update Sub-Category' : 'Create Sub-Category'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => !deleting && setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Sub-Category</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <strong>"{subCategoryToDelete?.name}"</strong>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} color="inherit" disabled={deleting}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleting}
            startIcon={deleting && <CircularProgress size={18} color="inherit" />}
            sx={{ fontWeight: 700 }}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SubCategoryList;
