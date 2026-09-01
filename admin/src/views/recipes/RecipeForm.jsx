import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  Grid,
  Stack,
  Typography,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormControlLabel,
  Switch,
  Chip,
  IconButton,
  Divider,
  Paper,
  Alert,
  CircularProgress,
  Avatar,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  IconArrowLeft,
  IconDeviceFloppy,
  IconPlus,
  IconTrash,
  IconUpload,
  IconPhoto,
  IconToolsKitchen2,
  IconSparkles,
  IconChefHat,
} from '@tabler/icons-react';
import recipeService from '../../services/recipeService';
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

const RecipeForm = () => {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [prepTime, setPrepTime] = useState(20);
  const [cookTime, setCookTime] = useState(40);
  const [servings, setServings] = useState(4);
  const [difficulty, setDifficulty] = useState('Medium');

  // Media
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // Tags
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState(['Indian', 'Spiced']);

  // Dynamic Ingredients: [{ item, qty, note }]
  const [ingredients, setIngredients] = useState([
    { item: 'Basmati Rice', qty: '500g', note: 'soaked for 30 mins' },
    { item: 'Chicken', qty: '750g', note: 'curry cut' },
  ]);

  // Dynamic Instructions: [string]
  const [instructions, setInstructions] = useState([
    'Marinate chicken in yogurt, ginger-garlic paste, and spices for at least 1 hour.',
    'Parboil basmati rice until 70% done, then layer with marinated chicken and cook on dum.',
  ]);

  // Nutrition
  const [nutrition, setNutrition] = useState({
    calories: '550 kcal',
    protein: '35g',
    carbs: '60g',
    fats: '18g',
  });

  // Switches
  const [isFeatured, setIsFeatured] = useState(true);
  const [isPublished, setIsPublished] = useState(true);

  // SEO
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  // Load Categories & Recipe (if in edit mode)
  useEffect(() => {
    const init = async () => {
      try {
        const cats = await categoryService.getCategories();
        setCategories(cats || []);
        if (!category && cats && cats.length > 0) {
          setCategory(cats[0].name);
        }

        if (isEditMode) {
          setLoading(true);
          const data = await recipeService.getRecipeById(id);
          if (data) {
            setTitle(data.title || '');
            setSlug(data.slug || '');
            setIsSlugManual(true);
            const initialCatName =
              typeof data.category === 'object' && data.category !== null
                ? data.category.name || data.category.slug || 'Non-Veg'
                : data.category || data.categoryName || 'Non-Veg';
            setCategory(initialCatName);
            setPrepTime(data.prepTime || 20);
            setCookTime(data.cookTime || 40);
            setServings(data.servings || 4);
            setDifficulty(data.difficulty || 'Medium');
            setImageUrl(data.image || '');
            setImagePreview(data.image || '');
            setTags(Array.isArray(data.tags) ? data.tags : []);
            setIngredients(
              Array.isArray(data.ingredients) && data.ingredients.length > 0
                ? data.ingredients
                : [{ item: '', qty: '', note: '' }]
            );
            setInstructions(
              Array.isArray(data.instructions) && data.instructions.length > 0
                ? data.instructions
                : ['']
            );
            setNutrition(
              data.nutrition || {
                calories: '550 kcal',
                protein: '35g',
                carbs: '60g',
                fats: '18g',
              }
            );
            setIsFeatured(Boolean(data.isFeatured));
            setIsPublished(data.isPublished !== false);
            setSeoTitle(data.seoTitle || '');
            setSeoDescription(data.seoDescription || '');
          }
        }
      } catch (err) {
        setErrorMsg(err.message || 'Failed to fetch recipe details');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [id, isEditMode]);

  // Title change -> auto slug generator
  const handleTitleChange = (e) => {
    const val = e.target.value;
    setTitle(val);
    if (!isSlugManual) {
      setSlug(slugify(val));
    }
  };

  // Image Upload handler
  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
    }
  };

  // Tag handler
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Ingredient handlers
  const handleIngredientChange = (index, field, value) => {
    const next = [...ingredients];
    next[index][field] = value;
    setIngredients(next);
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { item: '', qty: '', note: '' }]);
  };

  const handleRemoveIngredient = (index) => {
    if (ingredients.length === 1) return;
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  // Instruction handlers
  const handleInstructionChange = (index, value) => {
    const next = [...instructions];
    next[index] = value;
    setInstructions(next);
  };

  const handleAddInstruction = () => {
    setInstructions([...instructions, '']);
  };

  const handleRemoveInstruction = (index) => {
    if (instructions.length === 1) return;
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Recipe title is required.');
      return;
    }
    if (!description.trim()) {
      setErrorMsg('Recipe description is required.');
      return;
    }
    if (!category.trim()) {
      setErrorMsg('Category is required.');
      return;
    }

    setSaving(true);
    setErrorMsg('');

    const cleanIngredients = ingredients.filter((ing) => ing.item && ing.item.trim() !== '');
    const cleanInstructions = instructions.filter((inst) => inst && inst.trim() !== '');

    const recipePayload = {
      title: title.trim(),
      slug: slug.trim() || slugify(title),
      description: description.trim(),
      category: category.trim(),
      categoryName: category.trim(),
      image: imageUrl.trim(),
      prepTime: Number(prepTime) || 0,
      cookTime: Number(cookTime) || 0,
      servings: Number(servings) || 1,
      difficulty,
      tags,
      ingredients: cleanIngredients,
      instructions: cleanInstructions,
      nutrition,
      isFeatured,
      isPublished,
      seoTitle: seoTitle.trim() || title.trim(),
      seoDescription: seoDescription.trim() || description.trim(),
    };

    try {
      if (isEditMode) {
        await recipeService.updateRecipe(id, recipePayload, imageFile);
        dispatch(
          openSnackbar({
            open: true,
            message: 'Recipe updated successfully!',
            variant: 'alert',
            alert: { color: 'success' },
            close: true,
          })
        );
      } else {
        await recipeService.createRecipe(recipePayload, imageFile);
        dispatch(
          openSnackbar({
            open: true,
            message: 'Recipe created successfully!',
            variant: 'alert',
            alert: { color: 'success' },
            close: true,
          })
        );
      }
      navigate('/recipes');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save recipe');
      dispatch(
        openSnackbar({
          open: true,
          message: err.message || 'Failed to save recipe',
          variant: 'alert',
          alert: { color: 'error' },
          close: true,
        })
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={40} color="primary" />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1.5, sm: 3 }, maxWidth: 1200, mx: 'auto' }}>
      {/* Header Bar */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <IconButton onClick={() => navigate('/recipes')} sx={{ bgcolor: '#fff', border: '1px solid #e2e8f0' }}>
            <IconArrowLeft size="20px" />
          </IconButton>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 800 }}>
              {isEditMode ? 'Edit Recipe' : 'Create New Recipe'}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {isEditMode ? 'Modify recipe details, ingredients, or media' : 'Fill in the culinary recipe specifications'}
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1.5}>
          <Button variant="outlined" color="inherit" onClick={() => navigate('/recipes')}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <IconDeviceFloppy size="18px" />}
            onClick={handleSubmit}
            disabled={saving}
            sx={{
              fontWeight: 700,
              borderRadius: '10px',
              boxShadow: '0 6px 16px rgba(225, 29, 72, 0.35)',
              px: 3,
            }}
          >
            {saving ? 'Saving...' : isEditMode ? 'Update Recipe' : 'Publish Recipe'}
          </Button>
        </Stack>
      </Stack>

      {errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* LEFT COLUMN: Main Specifications */}
          <Grid item xs={12} md={8}>
            <Stack spacing={3}>
              {/* Card 1: Basic Information */}
              <Card sx={{ p: 3, borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconToolsKitchen2 size="22px" color={theme.palette.primary.main} />
                  Basic Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Recipe Title *"
                      placeholder="e.g. Chicken Biryani"
                      value={title}
                      onChange={handleTitleChange}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="URL Slug"
                      placeholder="e.g. chicken-biryani"
                      value={slug}
                      onChange={(e) => {
                        setSlug(e.target.value);
                        setIsSlugManual(true);
                      }}
                      helperText="Leave empty or edit for custom URL"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required>
                      <InputLabel id="category-select-label">Category *</InputLabel>
                      <Select
                        labelId="category-select-label"
                        value={category}
                        label="Category *"
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        {categories.map((cat) => (
                          <MenuItem key={cat._id || cat.name} value={cat.name}>
                            {cat.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Recipe Description *"
                      placeholder="Aromatic layered rice and spiced meat dish..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </Grid>
                </Grid>
              </Card>

              {/* Card 2: Ingredients Builder */}
              <Card sx={{ p: 3, borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconChefHat size="22px" color={theme.palette.primary.main} />
                    Ingredients List
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    color="primary"
                    startIcon={<IconPlus size="16px" />}
                    onClick={handleAddIngredient}
                    sx={{ borderRadius: '8px' }}
                  >
                    Add Ingredient
                  </Button>
                </Stack>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Add each ingredient component with its quantity and any preparation notes.
                </Typography>

                <Stack spacing={1.5}>
                  {ingredients.map((ing, idx) => (
                    <Paper
                      key={idx}
                      variant="outlined"
                      sx={{ p: 1.5, borderRadius: '10px', bgcolor: '#fafaf9', borderColor: '#e2e8f0' }}
                    >
                      <Grid container spacing={1.5} alignItems="center">
                        <Grid item xs={12} sm={5}>
                          <TextField
                            fullWidth
                            size="small"
                            label={`Ingredient #${idx + 1}`}
                            placeholder="e.g. Basmati Rice"
                            value={ing.item}
                            onChange={(e) => handleIngredientChange(idx, 'item', e.target.value)}
                          />
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Quantity"
                            placeholder="e.g. 500g"
                            value={ing.qty}
                            onChange={(e) => handleIngredientChange(idx, 'qty', e.target.value)}
                          />
                        </Grid>
                        <Grid item xs={5} sm={3}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Preparation Note"
                            placeholder="e.g. soaked"
                            value={ing.note}
                            onChange={(e) => handleIngredientChange(idx, 'note', e.target.value)}
                          />
                        </Grid>
                        <Grid item xs={1} sm={1} sx={{ textAlign: 'right' }}>
                          <IconButton
                            size="small"
                            color="error"
                            disabled={ingredients.length === 1}
                            onClick={() => handleRemoveIngredient(idx)}
                          >
                            <IconTrash size="18px" />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Paper>
                  ))}
                </Stack>
              </Card>

              {/* Card 3: Step-by-Step Instructions */}
              <Card sx={{ p: 3, borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconSparkles size="22px" color={theme.palette.primary.main} />
                    Instructions & Method
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    color="primary"
                    startIcon={<IconPlus size="16px" />}
                    onClick={handleAddInstruction}
                    sx={{ borderRadius: '8px' }}
                  >
                    Add Step
                  </Button>
                </Stack>

                <Stack spacing={2}>
                  {instructions.map((step, idx) => (
                    <Stack key={idx} direction="row" spacing={1.5} alignItems="flex-start">
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: theme.palette.primary.main,
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          mt: 1,
                        }}
                      >
                        {idx + 1}
                      </Avatar>
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        label={`Step ${idx + 1}`}
                        placeholder="Describe what to do in this cooking step..."
                        value={step}
                        onChange={(e) => handleInstructionChange(idx, e.target.value)}
                      />
                      <IconButton
                        size="small"
                        color="error"
                        disabled={instructions.length === 1}
                        onClick={() => handleRemoveInstruction(idx)}
                        sx={{ mt: 1 }}
                      >
                        <IconTrash size="18px" />
                      </IconButton>
                    </Stack>
                  ))}
                </Stack>
              </Card>

              {/* Card 4: SEO Metadata */}
              <Card sx={{ p: 3, borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  SEO & Social Sharing
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Control search engine snippet tags and social media card previews.
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="SEO Meta Title"
                      placeholder="e.g. Authentic Chicken Biryani Recipe"
                      value={seoTitle}
                      onChange={(e) => setSeoTitle(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      label="SEO Meta Description"
                      placeholder="Best homemade chicken biryani recipe with step by step instructions..."
                      value={seoDescription}
                      onChange={(e) => setSeoDescription(e.target.value)}
                    />
                  </Grid>
                </Grid>
              </Card>
            </Stack>
          </Grid>

          {/* RIGHT COLUMN: Media, Specs, Nutrition, Toggles */}
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              {/* Media Card */}
              <Card sx={{ p: 3, borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconPhoto size="22px" color={theme.palette.primary.main} />
                  Recipe Image
                </Typography>

                {imagePreview ? (
                  <Box
                    sx={{
                      width: '100%',
                      height: 200,
                      borderRadius: '12px',
                      overflow: 'hidden',
                      mb: 2,
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    }}
                  >
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Box>
                ) : (
                  <Box
                    sx={{
                      width: '100%',
                      height: 160,
                      borderRadius: '12px',
                      bgcolor: '#f8fafc',
                      border: '2px dashed #cbd5e1',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#64748b',
                      mb: 2,
                    }}
                  >
                    <IconPhoto size="36px" />
                    <Typography variant="caption" sx={{ mt: 1 }}>
                      No image selected
                    </Typography>
                  </Box>
                )}

                <Button
                  component="label"
                  variant="outlined"
                  fullWidth
                  startIcon={<IconUpload size="18px" />}
                  sx={{ mb: 2, borderRadius: '10px' }}
                >
                  Upload Local Image
                  <input type="file" accept="image/*" hidden onChange={handleImageFileChange} />
                </Button>

                <TextField
                  fullWidth
                  size="small"
                  label="Or Direct Image URL"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    if (!imageFile) setImagePreview(e.target.value);
                  }}
                />
              </Card>

              {/* Cooking Specifications */}
              <Card sx={{ p: 3, borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                  Cooking Parameters
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Prep Time (mins)"
                      value={prepTime}
                      onChange={(e) => setPrepTime(Math.max(0, parseInt(e.target.value, 10) || 0))}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Cook Time (mins)"
                      value={cookTime}
                      onChange={(e) => setCookTime(Math.max(0, parseInt(e.target.value, 10) || 0))}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Servings"
                      value={servings}
                      onChange={(e) => setServings(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel id="difficulty-label">Difficulty</InputLabel>
                      <Select
                        labelId="difficulty-label"
                        value={difficulty}
                        label="Difficulty"
                        onChange={(e) => setDifficulty(e.target.value)}
                      >
                        <MenuItem value="Easy">Easy</MenuItem>
                        <MenuItem value="Medium">Medium</MenuItem>
                        <MenuItem value="Hard">Hard</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Card>

              {/* Tags Card */}
              <Card sx={{ p: 3, borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                  Recipe Tags
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Type tag & click add..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <Button variant="contained" size="small" onClick={handleAddTag}>
                    Add
                  </Button>
                </Stack>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                  {tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      onDelete={() => handleRemoveTag(tag)}
                      sx={{ fontWeight: 600 }}
                    />
                  ))}
                </Box>
              </Card>

              {/* Nutrition Card */}
              <Card sx={{ p: 3, borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                  Nutrition Facts
                </Typography>
                <Grid container spacing={1.5}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Calories"
                      value={nutrition.calories || ''}
                      onChange={(e) => setNutrition({ ...nutrition, calories: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Protein"
                      value={nutrition.protein || ''}
                      onChange={(e) => setNutrition({ ...nutrition, protein: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Carbs"
                      value={nutrition.carbs || ''}
                      onChange={(e) => setNutrition({ ...nutrition, carbs: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Fats"
                      value={nutrition.fats || ''}
                      onChange={(e) => setNutrition({ ...nutrition, fats: e.target.value })}
                    />
                  </Grid>
                </Grid>
              </Card>

              {/* Publication Settings */}
              <Card sx={{ p: 3, borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                  Visibility & Status
                </Typography>
                <Stack spacing={2}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isPublished}
                        onChange={(e) => setIsPublished(e.target.checked)}
                        color="success"
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          Published Status
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {isPublished ? 'Publicly visible to users' : 'Saved as private draft'}
                        </Typography>
                      </Box>
                    }
                  />
                  <Divider />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.checked)}
                        color="warning"
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          Featured Recipe
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Highlighted on homepage slider & top carousels
                        </Typography>
                      </Box>
                    }
                  />
                </Stack>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default RecipeForm;
