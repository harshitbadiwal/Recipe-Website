import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
  Card,
  Avatar,
  Chip,
  Alert,
} from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { IconEye, IconEyeOff, IconChefHat, IconLock, IconMail } from '@tabler/icons-react';
import useAuth from '../../hooks/useAuth';
import AnimateButton from '../../ui-component/extended/AnimateButton';

const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [checked, setChecked] = useState(true);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `radial-gradient(circle at top right, ${theme.palette.primary.light} 0%, #f8fafc 60%, ${theme.palette.secondary.light} 100%)`,
        py: 6,
        px: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 480,
          width: '100%',
          p: { xs: 3, sm: 5 },
          borderRadius: '16px',
          boxShadow: '0 20px 40px -15px rgba(99, 102, 241, 0.15)',
          border: '1px solid',
          borderColor: theme.palette.grey[200],
        }}
      >
        <Stack spacing={2} alignItems="center" sx={{ mb: 4, textAlign: 'center' }}>
          <Avatar
            sx={{
              bgcolor: theme.palette.primary.main,
              width: 54,
              height: 54,
              boxShadow: '0 8px 16px rgba(99, 102, 241, 0.3)',
            }}
          >
            <IconChefHat size="32px" color="#fff" />
          </Avatar>
          <Box>
            <Typography variant="h2" sx={{ fontWeight: 800, color: theme.palette.text.primary, letterSpacing: '-0.5px' }}>
              Welcome to Foodie<span style={{ color: theme.palette.secondary.main }}>Admin</span>
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
              Enter your credentials to manage culinary operations
            </Typography>
          </Box>
        </Stack>

        <Formik
          initialValues={{
            email: 'admin@recipe.com',
            password: 'admin123',
            submit: null,
          }}
          validationSchema={Yup.object().shape({
            email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
            password: Yup.string().max(255).required('Password is required'),
          })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            try {
              await login(values.email, values.password);
              setStatus({ success: true });
              setSubmitting(false);
              navigate('/recipes');
            } catch (err) {
              setStatus({ success: false });
              setErrors({ submit: err.message || 'Authentication failed. Please verify your credentials.' });
              setSubmitting(false);
            }
          }}
        >
          {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
            <form noValidate onSubmit={handleSubmit}>
              {errors.submit && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {errors.submit}
                </Alert>
              )}

              <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ mb: 2 }}>
                <InputLabel htmlFor="outlined-adornment-email-login">Email Address</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-email-login"
                  type="email"
                  value={values.email}
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  label="Email Address"
                  startAdornment={
                    <InputAdornment position="start">
                      <IconMail size="20px" color={theme.palette.grey[400]} />
                    </InputAdornment>
                  }
                />
                {touched.email && errors.email && <FormHelperText error>{errors.email}</FormHelperText>}
              </FormControl>

              <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ mb: 2 }}>
                <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password-login"
                  type={showPassword ? 'text' : 'password'}
                  value={values.password}
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  label="Password"
                  startAdornment={
                    <InputAdornment position="start">
                      <IconLock size="20px" color={theme.palette.grey[400]} />
                    </InputAdornment>
                  }
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        size="large"
                      >
                        {showPassword ? <IconEye size="20px" /> : <IconEyeOff size="20px" />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                {touched.password && errors.password && <FormHelperText error>{errors.password}</FormHelperText>}
              </FormControl>

              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} sx={{ mb: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checked}
                      onChange={(event) => setChecked(event.target.checked)}
                      name="checked"
                      color="primary"
                    />
                  }
                  label="Remember me"
                />
                <Typography
                  component={Link}
                  to="/forgot-password"
                  variant="subtitle2"
                  color="primary"
                  sx={{ textDecoration: 'none', fontWeight: 600 }}
                >
                  Forgot Password?
                </Typography>
              </Stack>

              <Box sx={{ mt: 2 }}>
                <AnimateButton>
                  <Button
                    disableElevation
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ py: 1.5, fontSize: '1rem', fontWeight: 700 }}
                  >
                    {isSubmitting ? 'Signing In...' : 'Sign In to Console'}
                  </Button>
                </AnimateButton>
              </Box>

              <Divider sx={{ my: 3 }}>
                <Chip label="QUICK ADMIN ACCOUNTS" size="small" sx={{ fontWeight: 600, fontSize: '0.7rem' }} />
              </Divider>

              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      setFieldValue('email', 'admin@recipe.com');
                      setFieldValue('password', 'admin123');
                    }}
                  >
                    Admin User
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      setFieldValue('email', 'admin@foodie-admin.io');
                      setFieldValue('password', 'Password@123');
                    }}
                  >
                    Demo Admin
                  </Button>
                </Grid>
              </Grid>
            </form>
          )}
        </Formik>
      </Card>
    </Box>
  );
};

export default Login;
