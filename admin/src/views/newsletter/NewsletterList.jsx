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
  Tooltip,
  Avatar,
  TablePagination,
  CircularProgress,
  useTheme,
} from '@mui/material';
import {
  IconSearch,
  IconMail,
  IconRefresh,
  IconCalendar,
  IconMailOff,
  IconUserCheck,
} from '@tabler/icons-react';
import newsletterService from '../../services/newsletterService';
import { useDispatch } from '../../store';
import { openSnackbar } from '../../store/slices/snackbar';

const NewsletterList = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const data = await newsletterService.getSubscribers();
      setSubscribers(data.subscribers || []);
    } catch (err) {
      dispatch(
        openSnackbar({
          open: true,
          message: err.message || 'Failed to load newsletter subscribers',
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
    fetchSubscribers();
  }, []);

  const handleToggleUnsubscribe = async (sub) => {
    try {
      if (sub.isSubscribed) {
        await newsletterService.unsubscribe(sub.email);
        setSubscribers((prev) =>
          prev.map((s) => (s._id === sub._id ? { ...s, isSubscribed: false, unsubscribedAt: new Date().toISOString() } : s))
        );
        dispatch(
          openSnackbar({
            open: true,
            message: `${sub.email} unsubscribed.`,
            variant: 'alert',
            alert: { color: 'info' },
            close: true,
          })
        );
      } else {
        await newsletterService.subscribe(sub.email);
        setSubscribers((prev) =>
          prev.map((s) => (s._id === sub._id ? { ...s, isSubscribed: true, unsubscribedAt: null } : s))
        );
        dispatch(
          openSnackbar({
            open: true,
            message: `${sub.email} re-subscribed!`,
            variant: 'alert',
            alert: { color: 'success' },
            close: true,
          })
        );
      }
    } catch (err) {
      dispatch(
        openSnackbar({
          open: true,
          message: err.message || 'Failed to update subscription',
          variant: 'alert',
          alert: { color: 'error' },
          close: true,
        })
      );
    }
  };

  const filteredSubscribers = useMemo(() => {
    return subscribers.filter((sub) => {
      const q = searchQuery.toLowerCase();
      return !searchQuery || sub.email?.toLowerCase().includes(q);
    });
  }, [subscribers, searchQuery]);

  const displayedSubscribers = useMemo(() => {
    return filteredSubscribers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredSubscribers, page, rowsPerPage]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
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
      {/* Header Card */}
      <Card sx={{ p: 3, mb: 3, borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
          <Grid item xs={12} md={7}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                sx={{
                  bgcolor: '#0ea5e9',
                  width: 48,
                  height: 48,
                  boxShadow: '0 4px 12px rgba(14, 165, 233, 0.35)',
                }}
              >
                <IconMail size="26px" color="#fff" />
              </Avatar>
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>
                  Newsletter Subscribers
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  View and manage audience members subscribed to culinary newsletters and recipe releases
                </Typography>
              </Box>
            </Stack>
          </Grid>
          <Grid item xs={12} md={5} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<IconRefresh size="18px" />}
              onClick={fetchSubscribers}
              sx={{ borderRadius: '10px' }}
            >
              Refresh
            </Button>
          </Grid>
        </Grid>

        {/* Search Bar */}
        <Box sx={{ mt: 3, maxWidth: 500 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search subscriber by email address..."
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
        </Box>
      </Card>

      {/* Subscribers Table */}
      <Card sx={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <TableContainer component={Paper} elevation={0} sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: theme.palette.grey[50] }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, py: 2 }}>Subscriber Email</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Subscribed On</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Unsubscribed On</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, pr: 3 }}>
                  Subscription Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={36} color="primary" />
                    <Typography variant="body2" sx={{ mt: 2 }} color="textSecondary">
                      Loading subscribers...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : displayedSubscribers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <IconMail size="48px" color={theme.palette.grey[400]} />
                    <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>
                      No Subscribers Found
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {searchQuery
                        ? 'Try adjusting your search query.'
                        : 'Newsletter subscribers from the website will appear here.'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                displayedSubscribers.map((sub) => (
                  <TableRow key={sub._id} hover>
                    <TableCell>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar sx={{ bgcolor: '#e0f2fe', color: '#0284c7', width: 36, height: 36 }}>
                          <IconMail size="18px" />
                        </Avatar>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {sub.email}
                        </Typography>
                      </Stack>
                    </TableCell>

                    <TableCell>
                      <Chip
                        size="small"
                        label={sub.isSubscribed ? 'Subscribed' : 'Unsubscribed'}
                        color={sub.isSubscribed ? 'success' : 'default'}
                        sx={{ fontWeight: 700, fontSize: '0.72rem' }}
                      />
                    </TableCell>

                    <TableCell>
                      <Stack direction="row" spacing={0.8} alignItems="center">
                        <IconCalendar size="15px" color={theme.palette.grey[500]} />
                        <Typography variant="caption" color="textSecondary">
                          {formatDate(sub.subscribedAt || sub.createdAt)}
                        </Typography>
                      </Stack>
                    </TableCell>

                    <TableCell>
                      <Typography variant="caption" color="textSecondary">
                        {formatDate(sub.unsubscribedAt)}
                      </Typography>
                    </TableCell>

                    <TableCell align="right" sx={{ pr: 3 }}>
                      <Tooltip title={sub.isSubscribed ? 'Unsubscribe Email' : 'Re-subscribe Email'}>
                        <Button
                          size="small"
                          variant="outlined"
                          color={sub.isSubscribed ? 'error' : 'success'}
                          startIcon={sub.isSubscribed ? <IconMailOff size="16px" /> : <IconUserCheck size="16px" />}
                          onClick={() => handleToggleUnsubscribe(sub)}
                          sx={{ borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700 }}
                        >
                          {sub.isSubscribed ? 'Unsubscribe' : 'Re-subscribe'}
                        </Button>
                      </Tooltip>
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
          count={filteredSubscribers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Card>
    </Box>
  );
};

export default NewsletterList;
