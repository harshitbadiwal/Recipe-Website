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
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  MenuItem,
  Switch,
  FormControlLabel,
  useTheme,
} from '@mui/material';
import {
  IconSearch,
  IconUsers,
  IconEdit,
  IconRefresh,
  IconShieldCheck,
  IconUser,
  IconCalendar,
  IconMail,
} from '@tabler/icons-react';
import userService from '../../services/userService';
import { useDispatch } from '../../store';
import { openSnackbar } from '../../store/slices/snackbar';

const UserList = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editRole, setEditRole] = useState('USER');
  const [editStatus, setEditStatus] = useState('ACTIVE');
  const [updating, setUpdating] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getAllUsers();
      setUsers(data.users || []);
    } catch (err) {
      dispatch(
        openSnackbar({
          open: true,
          message: err.message || 'Failed to load users',
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
    fetchUsers();
  }, []);

  const handleOpenEdit = (user) => {
    setSelectedUser(user);
    setEditRole(user.role || 'USER');
    setEditStatus(user.status || 'ACTIVE');
    setEditModalOpen(true);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    setUpdating(true);
    try {
      const updated = await userService.updateUser(selectedUser._id, {
        role: editRole,
        status: editStatus,
      });

      setUsers((prev) =>
        prev.map((u) => (u._id === selectedUser._id ? { ...u, ...updated, role: editRole, status: editStatus } : u))
      );

      dispatch(
        openSnackbar({
          open: true,
          message: `User ${selectedUser.name || selectedUser.email} updated successfully!`,
          variant: 'alert',
          alert: { color: 'success' },
          close: true,
        })
      );
      setEditModalOpen(false);
      setSelectedUser(null);
    } catch (err) {
      dispatch(
        openSnackbar({
          open: true,
          message: err.message || 'Failed to update user',
          variant: 'alert',
          alert: { color: 'error' },
          close: true,
        })
      );
    } finally {
      setUpdating(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const q = searchQuery.toLowerCase();
      return (
        !searchQuery ||
        user.name?.toLowerCase().includes(q) ||
        user.email?.toLowerCase().includes(q)
      );
    });
  }, [users, searchQuery]);

  const displayedUsers = useMemo(() => {
    return filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredUsers, page, rowsPerPage]);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
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
                  bgcolor: theme.palette.primary.main,
                  width: 48,
                  height: 48,
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)',
                }}
              >
                <IconUsers size="26px" color="#fff" />
              </Avatar>
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>
                  User Management
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Oversee community accounts, assign roles, and manage user access permissions
                </Typography>
              </Box>
            </Stack>
          </Grid>
          <Grid item xs={12} md={5} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<IconRefresh size="18px" />}
              onClick={fetchUsers}
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
            placeholder="Search by name or email address..."
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

      {/* Users Table */}
      <Card sx={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <TableContainer component={Paper} elevation={0} sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: 700 }}>
            <TableHead sx={{ bgcolor: theme.palette.grey[50] }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, py: 2 }}>User</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Email Address</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Account Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Joined Date</TableCell>
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
                      Loading users...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : displayedUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <IconUsers size="48px" color={theme.palette.grey[400]} />
                    <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>
                      No Users Found
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {searchQuery ? 'Try adjusting your search criteria.' : 'No users registered yet.'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                displayedUsers.map((user) => (
                  <TableRow key={user._id} hover>
                    {/* User info */}
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar
                          src={user.avatar}
                          sx={{
                            width: 44,
                            height: 44,
                            borderRadius: '12px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                          }}
                        >
                          <IconUser size="22px" />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                            {user.name || 'Unnamed User'}
                          </Typography>
                          {user.bio && (
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
                              {user.bio}
                            </Typography>
                          )}
                        </Box>
                      </Stack>
                    </TableCell>

                    {/* Email */}
                    <TableCell>
                      <Stack direction="row" spacing={0.8} alignItems="center">
                        <IconMail size="16px" color={theme.palette.grey[500]} />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {user.email}
                        </Typography>
                      </Stack>
                    </TableCell>

                    {/* Role */}
                    <TableCell>
                      <Chip
                        size="small"
                        icon={user.role === 'ADMIN' ? <IconShieldCheck size="14px" /> : undefined}
                        label={user.role || 'USER'}
                        color={user.role === 'ADMIN' ? 'primary' : 'default'}
                        sx={{ fontWeight: 700, fontSize: '0.72rem' }}
                      />
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Chip
                        size="small"
                        label={user.status || 'ACTIVE'}
                        color={user.status === 'INACTIVE' ? 'error' : 'success'}
                        sx={{ fontWeight: 700, fontSize: '0.72rem' }}
                      />
                    </TableCell>

                    {/* Joined Date */}
                    <TableCell>
                      <Stack direction="row" spacing={0.8} alignItems="center">
                        <IconCalendar size="15px" color={theme.palette.grey[500]} />
                        <Typography variant="caption" color="textSecondary">
                          {formatDate(user.createdAt)}
                        </Typography>
                      </Stack>
                    </TableCell>

                    {/* Actions */}
                    <TableCell align="right" sx={{ pr: 3 }}>
                      <Tooltip title="Edit Permissions">
                        <IconButton size="small" color="primary" onClick={() => handleOpenEdit(user)}>
                          <IconEdit size="18px" />
                        </IconButton>
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
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Card>

      {/* Edit User Modal */}
      <Dialog
        open={editModalOpen}
        onClose={() => !updating && setEditModalOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>Manage User Account</DialogTitle>
        <form onSubmit={handleSaveUser}>
          <DialogContent dividers sx={{ p: 3 }}>
            <Stack spacing={2.5}>
              <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: '12px' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {selectedUser?.name || 'Unnamed User'}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {selectedUser?.email}
                </Typography>
              </Box>

              <TextField
                select
                fullWidth
                label="Role"
                value={editRole}
                onChange={(e) => setEditRole(e.target.value)}
                helperText="ADMIN provides full console management access"
              >
                <MenuItem value="USER">USER (Standard Member)</MenuItem>
                <MenuItem value="ADMIN">ADMIN (System Administrator)</MenuItem>
              </TextField>

              <FormControlLabel
                control={
                  <Switch
                    checked={editStatus === 'ACTIVE'}
                    onChange={(e) => setEditStatus(e.target.checked ? 'ACTIVE' : 'INACTIVE')}
                    color="success"
                  />
                }
                label={
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Account Status: {editStatus === 'ACTIVE' ? 'Active & Enabled' : 'Disabled / Suspended'}
                  </Typography>
                }
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button disabled={updating} onClick={() => setEditModalOpen(false)} color="inherit">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={updating}
              sx={{ borderRadius: '8px', px: 3, fontWeight: 700 }}
            >
              {updating ? 'Saving...' : 'Save Permissions'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default UserList;
