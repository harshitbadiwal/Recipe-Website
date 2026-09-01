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
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Paper,
  useTheme,
} from '@mui/material';
import {
  IconArrowLeft,
  IconEdit,
  IconTrash,
  IconCalendar,
  IconUser,
  IconTag,
  IconSearch,
} from '@tabler/icons-react';
import blogService from '../../services/blogService';
import { useDispatch } from '../../store';
import { openSnackbar } from '../../store/slices/snackbar';

const BlogDetail = () => {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setLoading(true);
    blogService
      .getBlogById(id)
      .then((data) => {
        setBlog(data);
      })
      .catch((err) => {
        dispatch(
          openSnackbar({
            open: true,
            message: err.message || 'Failed to load article details',
            variant: 'alert',
            alert: { color: 'error' },
            close: true,
          })
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, dispatch]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await blogService.deleteBlog(id);
      dispatch(
        openSnackbar({
          open: true,
          message: 'Article deleted successfully',
          variant: 'alert',
          alert: { color: 'success' },
          close: true,
        })
      );
      navigate('/blogs');
    } catch (err) {
      dispatch(
        openSnackbar({
          open: true,
          message: err.message || 'Failed to delete article',
          variant: 'alert',
          alert: { color: 'error' },
          close: true,
        })
      );
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Unpublished';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } catch (e) {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress size={40} color="primary" />
      </Box>
    );
  }

  if (!blog) {
    return (
      <Card sx={{ p: 4, textAlign: 'center', borderRadius: '16px' }}>
        <Typography variant="h3" sx={{ mb: 2 }}>
          Article Not Found
        </Typography>
        <Button variant="contained" onClick={() => navigate('/blogs')}>
          Back to Articles
        </Button>
      </Card>
    );
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 1000, mx: 'auto' }}>
      {/* Top Actions */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<IconArrowLeft size="18px" />}
          onClick={() => navigate('/blogs')}
          sx={{ borderRadius: '10px' }}
        >
          All Articles
        </Button>
        <Stack direction="row" spacing={1.5}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<IconEdit size="18px" />}
            onClick={() => navigate(`/blogs/edit/${blog._id}`)}
            sx={{ borderRadius: '10px', fontWeight: 700 }}
          >
            Edit Article
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

      {/* Main Article Banner */}
      <Card sx={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 8px 30px rgba(0,0,0,0.06)', mb: 3 }}>
        <Box sx={{ position: 'relative', width: '100%', height: { xs: 240, md: 360 }, bgcolor: '#0f172a' }}>
          <img
            src={blog.featuredImage || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1200&fit=crop'}
            alt={blog.title}
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
            <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
              <Chip
                label={blog.category || 'General'}
                size="small"
                sx={{ bgcolor: theme.palette.secondary.main, color: '#fff', fontWeight: 700 }}
              />
              <Chip
                label={blog.isPublished !== false ? 'Published' : 'Draft'}
                size="small"
                sx={{ bgcolor: 'rgba(255,255,255,0.25)', color: '#fff', fontWeight: 700 }}
              />
            </Stack>
            <Typography variant="h2" sx={{ fontWeight: 800, color: '#fff', letterSpacing: '-0.5px', mb: 1 }}>
              {blog.title}
            </Typography>
            <Stack direction="row" spacing={3} alignItems="center">
              <Stack direction="row" spacing={0.8} alignItems="center">
                <IconUser size="16px" color="#cbd5e1" />
                <Typography variant="body2" sx={{ color: '#e2e8f0', fontWeight: 600 }}>
                  {blog.author || 'Chef Master'}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={0.8} alignItems="center">
                <IconCalendar size="16px" color="#cbd5e1" />
                <Typography variant="body2" sx={{ color: '#e2e8f0' }}>
                  {formatDate(blog.publishedAt || blog.createdAt)}
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Box>

        {/* Content Body */}
        <Box sx={{ p: { xs: 3, md: 4 } }}>
          {blog.excerpt && (
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                mb: 3,
                bgcolor: '#f8fafc',
                borderLeft: `4px solid ${theme.palette.primary.main}`,
                borderRadius: '0 12px 12px 0',
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, color: theme.palette.text.primary }}>
                Overview
              </Typography>
              <Typography variant="body1" color="textSecondary" sx={{ fontStyle: 'italic', lineHeight: 1.6 }}>
                "{blog.excerpt}"
              </Typography>
            </Paper>
          )}

          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
            Article Body
          </Typography>
          <Typography
            variant="body1"
            sx={{
              whiteSpace: 'pre-line',
              lineHeight: 1.8,
              fontSize: '1rem',
              color: theme.palette.text.primary,
            }}
          >
            {blog.content}
          </Typography>

          {/* Tags */}
          {Array.isArray(blog.tags) && blog.tags.length > 0 && (
            <Box sx={{ mt: 4, pt: 3, borderTop: `1px solid ${theme.palette.divider}` }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                <IconTag size="18px" color={theme.palette.primary.main} />
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  Associated Topics & Tags
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {blog.tags.map((tag) => (
                  <Chip key={tag} label={`#${tag}`} size="small" variant="outlined" sx={{ fontWeight: 600 }} />
                ))}
              </Stack>
            </Box>
          )}
        </Box>
      </Card>

      {/* SEO Preview Card */}
      <Card sx={{ p: 3, borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', mb: 4 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <IconSearch size="20px" color={theme.palette.primary.main} />
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Search Engine Optimization (Google Snippet Preview)
          </Typography>
        </Stack>

        <Box sx={{ p: 2.5, bgcolor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <Typography variant="caption" sx={{ color: '#16a34a', fontWeight: 600, display: 'block', mb: 0.5 }}>
            https://recipe-website.com/articles/{blog.slug}
          </Typography>
          <Typography variant="subtitle1" sx={{ color: '#1d4ed8', fontWeight: 700, mb: 0.5 }}>
            {blog.seoTitle || blog.title}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {blog.seoDescription || blog.excerpt || blog.content?.substring(0, 150) + '...'}
          </Typography>
        </Box>
      </Card>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => !deleting && setDeleteDialogOpen(false)}>
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Article</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to permanently delete article <strong>"{blog.title}"</strong>?
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
            {deleting ? 'Deleting...' : 'Delete Article'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BlogDetail;
