import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Card,
  Grid,
  Stack,
  Typography,
  Button,
  TextField,
  MenuItem,
  FormControlLabel,
  Switch,
  Chip,
  IconButton,
  CircularProgress,
  Divider,
  Paper,
  Alert,
  useTheme,
} from '@mui/material';
import {
  IconArrowLeft,
  IconDeviceFloppy,
  IconUpload,
  IconPlus,
  IconTrash,
  IconArticle,
  IconEye,
} from '@tabler/icons-react';
import blogService from '../../services/blogService';
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

const STANDARD_BLOG_CATEGORIES = [
  'Spices & Techniques',
  'Nutrition & Health',
  'Cooking Tips',
  'Street Food Stories',
  'Desserts & Sweets',
  'Regional Flavors',
  'General',
];

const BlogForm = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();

  const isEditMode = Boolean(id);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [category, setCategory] = useState('Cooking Tips');
  const [author, setAuthor] = useState('Chef Master');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [tags, setTags] = useState(['Culinary', 'Cooking']);
  const [tagInput, setTagInput] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  // SEO State
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  // UI State
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isEditMode) {
      setLoading(true);
      blogService
        .getBlogById(id)
        .then((data) => {
          if (data) {
            setTitle(data.title || '');
            setSlug(data.slug || '');
            setIsSlugManual(true);
            setCategory(data.category || 'Cooking Tips');
            setAuthor(data.author || 'Chef Master');
            setExcerpt(data.excerpt || '');
            setContent(data.content || '');
            setImageUrl(data.featuredImage || '');
            setImagePreview(data.featuredImage || '');
            setTags(Array.isArray(data.tags) ? data.tags : []);
            setIsPublished(data.isPublished !== false);
            setSeoTitle(data.seoTitle || '');
            setSeoDescription(data.seoDescription || '');
          }
        })
        .catch((err) => {
          setErrorMessage(err.message || 'Failed to load article details.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, isEditMode]);

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setTitle(val);
    if (!isSlugManual) {
      setSlug(slugify(val));
    }
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage('Article title is required');
      return;
    }
    if (!content.trim()) {
      setErrorMessage('Article content cannot be empty');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    const payload = {
      title: title.trim(),
      slug: slug.trim() || slugify(title),
      category,
      author: author.trim() || 'Chef Master',
      excerpt: excerpt.trim(),
      content: content.trim(),
      featuredImage: imageUrl.trim(),
      tags,
      isPublished,
      seoTitle: seoTitle.trim(),
      seoDescription: seoDescription.trim(),
    };

    try {
      if (isEditMode) {
        await blogService.updateBlog(id, payload, imageFile);
        dispatch(
          openSnackbar({
            open: true,
            message: 'Article updated successfully!',
            variant: 'alert',
            alert: { color: 'success' },
            close: true,
          })
        );
      } else {
        await blogService.createBlog(payload, imageFile);
        dispatch(
          openSnackbar({
            open: true,
            message: 'Article published successfully!',
            variant: 'alert',
            alert: { color: 'success' },
            close: true,
          })
        );
      }
      navigate('/blogs');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to save article.');
      dispatch(
        openSnackbar({
          open: true,
          message: err.message || 'Failed to save article.',
          variant: 'alert',
          alert: { color: 'error' },
          close: true,
        })
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress size={40} color="primary" />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 1000, mx: 'auto' }}>
      {/* Header Actions */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<IconArrowLeft size="18px" />}
          onClick={() => navigate('/blogs')}
          sx={{ borderRadius: '10px' }}
        >
          All Articles
        </Button>
        <Typography variant="h3" sx={{ fontWeight: 800 }}>
          {isEditMode ? 'Edit Article' : 'Write New Article'}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : <IconDeviceFloppy size="18px" />}
          onClick={handleSubmit}
          disabled={submitting}
          sx={{ borderRadius: '10px', fontWeight: 700, px: 3 }}
        >
          {submitting ? 'Saving...' : isEditMode ? 'Update' : 'Publish'}
        </Button>
      </Stack>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
          {errorMessage}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {/* Card 1: Basic Information */}
          <Card sx={{ p: 3, borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2.5 }}>
              General Information
            </Typography>
            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Article Title *"
                  placeholder="e.g. 10 Essential Spices for Indian Cooking"
                  value={title}
                  onChange={handleTitleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="URL Slug *"
                  placeholder="10-essential-spices"
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value);
                    setIsSlugManual(true);
                  }}
                  helperText="Unique identifier in article URL"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Category *"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {STANDARD_BLOG_CATEGORIES.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Author Name"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Chef Master"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isPublished}
                      onChange={(e) => setIsPublished(e.target.checked)}
                      color="success"
                    />
                  }
                  label={
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Status: {isPublished ? 'Published to Website' : 'Save as Draft'}
                    </Typography>
                  }
                  sx={{ mt: 1 }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Short Excerpt / Summary"
                  placeholder="Brief 1-2 sentence hook for recipe cards and search listings..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                />
              </Grid>
            </Grid>
          </Card>

          {/* Card 2: Featured Image */}
          <Card sx={{ p: 3, borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Featured Cover Image
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Upload a high-resolution banner image or paste an external image URL.
            </Typography>

            {imagePreview ? (
              <Box
                sx={{
                  width: '100%',
                  maxHeight: 280,
                  borderRadius: '12px',
                  overflow: 'hidden',
                  mb: 2,
                  border: '1px solid #e2e8f0',
                }}
              >
                <img
                  src={imagePreview}
                  alt="Cover Preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Box>
            ) : null}

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button
                component="label"
                variant="outlined"
                startIcon={<IconUpload size="18px" />}
                sx={{ borderRadius: '10px' }}
              >
                Select Image File
                <input type="file" accept="image/*" hidden onChange={handleImageFileChange} />
              </Button>
              <TextField
                fullWidth
                size="small"
                label="Or Image URL"
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  if (!imageFile) setImagePreview(e.target.value);
                }}
              />
            </Stack>
          </Card>

          {/* Card 3: Article Content */}
          <Card sx={{ p: 3, borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Article Body Content *
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Write your culinary story, techniques, ingredients insights, and step-by-step cooking advice.
            </Typography>

            <TextField
              fullWidth
              multiline
              rows={12}
              placeholder="Write the full article content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              sx={{
                '& .MuiInputBase-root': {
                  fontFamily: 'monospace, sans-serif',
                  fontSize: '0.95rem',
                  lineHeight: 1.6,
                },
              }}
            />
          </Card>

          {/* Card 4: Tags */}
          <Card sx={{ p: 3, borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
              Tags & Topics
            </Typography>

            <Stack direction="row" spacing={1.5} sx={{ mb: 2 }}>
              <TextField
                size="small"
                placeholder="Add a topic tag (e.g. Spices, Nutrition, Tips)..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                sx={{ maxWidth: 360 }}
              />
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<IconPlus size="16px" />}
                onClick={handleAddTag}
                sx={{ borderRadius: '8px' }}
              >
                Add Tag
              </Button>
            </Stack>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => handleRemoveTag(tag)}
                  color="primary"
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />
              ))}
            </Box>
          </Card>

          {/* Card 5: Search Engine Optimization */}
          <Card sx={{ p: 3, borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
              SEO Metadata
            </Typography>

            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="SEO Meta Title"
                  placeholder={title || 'Custom meta title for Google'}
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  helperText="Leave empty to use the article title"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="SEO Meta Description"
                  placeholder={excerpt || 'Meta description for search engine result snippets'}
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  helperText="Recommended length: 140 - 160 characters"
                />
              </Grid>
            </Grid>

            {/* Google Search Mockup */}
            <Box sx={{ mt: 3, p: 2.5, bgcolor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <Typography variant="caption" sx={{ color: '#16a34a', fontWeight: 600, display: 'block', mb: 0.5 }}>
                https://recipe-website.com/articles/{slug || 'your-article-slug'}
              </Typography>
              <Typography variant="subtitle1" sx={{ color: '#1d4ed8', fontWeight: 700, mb: 0.5 }}>
                {seoTitle || title || 'Article Title - Foodie Recipe Hub'}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {seoDescription || excerpt || 'Detailed culinary guide and cooking tips from our master chefs.'}
              </Typography>
            </Box>
          </Card>

          {/* Bottom Action Row */}
          <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ pb: 4 }}>
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => navigate('/blogs')}
              disabled={submitting}
              sx={{ borderRadius: '10px' }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={submitting}
              startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : <IconDeviceFloppy size="18px" />}
              sx={{ borderRadius: '10px', px: 4, fontWeight: 700 }}
            >
              {submitting ? 'Saving...' : isEditMode ? 'Save Changes' : 'Publish Article'}
            </Button>
          </Stack>
        </Stack>
      </form>
    </Box>
  );
};

export default BlogForm;
