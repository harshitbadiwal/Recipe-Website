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
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  MenuItem,
  useTheme,
} from '@mui/material';
import {
  IconSearch,
  IconPlus,
  IconEdit,
  IconTrash,
  IconEye,
  IconArticle,
  IconRefresh,
  IconCalendar,
  IconUser,
} from '@tabler/icons-react';
import blogService from '../../services/blogService';
import { useDispatch } from '../../store';
import { openSnackbar } from '../../store/slices/snackbar';

const BlogList = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Delete State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const data = await blogService.getAllBlogs();
      setBlogs(data.blogs || []);
    } catch (err) {
      dispatch(
        openSnackbar({
          open: true,
          message: err.message || 'Failed to load articles',
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
    fetchBlogs();
  }, []);

  const categories = useMemo(() => {
    const set = new Set();
    blogs.forEach((b) => {
      if (b.category) set.add(b.category);
    });
    return Array.from(set);
  }, [blogs]);

  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        blog.title?.toLowerCase().includes(q) ||
        blog.excerpt?.toLowerCase().includes(q) ||
        blog.category?.toLowerCase().includes(q) ||
        (Array.isArray(blog.tags) && blog.tags.some((t) => t.toLowerCase().includes(q)));

      const matchesCat =
        selectedCategory === 'all' ||
        blog.category?.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCat;
    });
  }, [blogs, searchQuery, selectedCategory]);

  const displayedBlogs = useMemo(() => {
    return filteredBlogs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredBlogs, page, rowsPerPage]);

  const handleDeleteConfirm = async () => {
    if (!blogToDelete) return;
    setDeleting(true);
    try {
      await blogService.deleteBlog(blogToDelete._id);
      setBlogs((prev) => prev.filter((b) => b._id !== blogToDelete._id));
      dispatch(
        openSnackbar({
          open: true,
          message: `Article "${blogToDelete.title}" deleted.`,
          variant: 'alert',
          alert: { color: 'success' },
          close: true,
        })
      );
      setDeleteDialogOpen(false);
      setBlogToDelete(null);
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
    if (!dateStr) return 'Draft';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch (e) {
      return dateStr;
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
                  bgcolor: '#8b5cf6',
                  width: 48,
                  height: 48,
                  boxShadow: '0 4px 12px rgba(139, 92, 246, 0.35)',
                }}
              >
                <IconArticle size="26px" color="#fff" />
              </Avatar>
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>
                  Articles & Culinary Blogs
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Create, publish, and manage food stories, culinary guides, and cooking tips
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
                onClick={fetchBlogs}
                sx={{ borderRadius: '10px' }}
              >
                Refresh
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<IconPlus size="18px" />}
                onClick={() => navigate('/blogs/create')}
                sx={{
                  borderRadius: '10px',
                  fontWeight: 700,
                  boxShadow: '0 6px 16px rgba(225, 29, 72, 0.35)',
                }}
              >
                Write Article
              </Button>
            </Stack>
          </Grid>
        </Grid>

        {/* Filter and Search Bar */}
        <Grid container spacing={2} sx={{ mt: 2 }} alignItems="center">
          <Grid item xs={12} sm={8} md={6}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search articles by title, keywords, or tags..."
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
            <TextField
              select
              fullWidth
              size="small"
              label="Filter Category"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(0);
              }}
              sx={{ bgcolor: '#fff', borderRadius: '10px' }}
            >
              <MenuItem value="all">All Categories</MenuItem>
              {categories.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={3} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
            <Typography variant="body2" color="textSecondary">
              Showing <strong>{filteredBlogs.length}</strong> article{filteredBlogs.length === 1 ? '' : 's'}
            </Typography>
          </Grid>
        </Grid>
      </Card>

      {/* Blogs Table */}
      <Card sx={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <TableContainer component={Paper} elevation={0} sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: 800 }}>
            <TableHead sx={{ bgcolor: theme.palette.grey[50] }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, py: 2 }}>Article</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Author</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Published Date</TableCell>
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
                      Loading articles...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : displayedBlogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <IconArticle size="48px" color={theme.palette.grey[400]} />
                    <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>
                      No Articles Found
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                      {searchQuery || selectedCategory !== 'all'
                        ? 'Try clearing your search query or filter.'
                        : 'Start by writing your very first culinary story.'}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<IconPlus size="18px" />}
                      onClick={() => navigate('/blogs/create')}
                      sx={{ borderRadius: '10px' }}
                    >
                      Write First Article
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                displayedBlogs.map((blog) => (
                  <TableRow
                    key={blog._id}
                    hover
                    sx={{ cursor: 'pointer', transition: 'background 0.2s ease' }}
                  >
                    {/* Title & Image */}
                    <TableCell onClick={() => navigate(`/blogs/view/${blog._id}`)}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar
                          src={blog.featuredImage}
                          variant="rounded"
                          sx={{
                            width: 60,
                            height: 48,
                            borderRadius: '10px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                            border: '1px solid #e2e8f0',
                          }}
                        />
                        <Box sx={{ maxWidth: 360 }}>
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: 700,
                              color: theme.palette.text.primary,
                              display: '-webkit-box',
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {blog.title}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="textSecondary"
                            sx={{
                              display: '-webkit-box',
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {blog.excerpt || 'No summary available.'}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>

                    {/* Category */}
                    <TableCell>
                      <Chip
                        size="small"
                        label={blog.category || 'General'}
                        sx={{ bgcolor: '#ede9fe', color: '#6d28d9', fontWeight: 700, fontSize: '0.75rem' }}
                      />
                    </TableCell>

                    {/* Author */}
                    <TableCell>
                      <Stack direction="row" spacing={0.8} alignItems="center">
                        <IconUser size="15px" color={theme.palette.grey[500]} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {blog.author || 'Chef Master'}
                        </Typography>
                      </Stack>
                    </TableCell>

                    {/* Published Date */}
                    <TableCell>
                      <Stack direction="row" spacing={0.8} alignItems="center">
                        <IconCalendar size="15px" color={theme.palette.grey[500]} />
                        <Typography variant="caption" color="textSecondary">
                          {formatDate(blog.publishedAt || blog.createdAt)}
                        </Typography>
                      </Stack>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Chip
                        size="small"
                        label={blog.isPublished !== false ? 'Published' : 'Draft'}
                        color={blog.isPublished !== false ? 'success' : 'default'}
                        sx={{ fontWeight: 700, fontSize: '0.72rem' }}
                      />
                    </TableCell>

                    {/* Actions */}
                    <TableCell align="right" sx={{ pr: 3 }}>
                      <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                        <Tooltip title="View Preview">
                          <IconButton
                            size="small"
                            color="info"
                            onClick={() => navigate(`/blogs/view/${blog._id}`)}
                          >
                            <IconEye size="18px" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Article">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => navigate(`/blogs/edit/${blog._id}`)}
                          >
                            <IconEdit size="18px" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Article">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => {
                              setBlogToDelete(blog);
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

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredBlogs.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Card>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteDialogOpen} onClose={() => !deleting && setDeleteDialogOpen(false)}>
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Article</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete article <strong>"{blogToDelete?.title}"</strong>? This action cannot be undone.
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
            {deleting ? 'Deleting...' : 'Delete Article'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BlogList;
