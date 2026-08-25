import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Card,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
  Avatar,
} from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { IconKey, IconMail } from '@tabler/icons-react';
import AnimateButton from '../../ui-component/extended/AnimateButton';
import { useDispatch } from '../../store';
import { openSnackbar } from '../../store/slices/snackbar';

const ForgotPassword = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `radial-gradient(circle at bottom right, ${theme.palette.primary.light} 0%, #f8fafc 60%, ${theme.palette.secondary.light} 100%)`,
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
          textAlign: 'center',
        }}
      >
        <Avatar
          sx={{
            bgcolor: theme.palette.primary.main,
            width: 54,
            height: 54,
            margin: '0 auto 16px',
            boxShadow: '0 8px 16px rgba(99, 102, 241, 0.3)',
          }}
        >
          <IconKey size="32px" color="#fff" />
        </Avatar>

        <Typography variant="h2" sx={{ fontWeight: 800, color: theme.palette.text.primary, mb: 1 }}>
          Forgot Password?
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 4 }}>
          Enter your registered email address and we'll send you instructions to reset your password.
        </Typography>

        <Formik
          initialValues={{
            email: 'admin@foodie-admin.io',
          }}
          validationSchema={Yup.object().shape({
            email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          })}
          onSubmit={async (values, { setSubmitting }) => {
            dispatch(
              openSnackbar({
                open: true,
                message: `Reset link sent to ${values.email}`,
                variant: 'alert',
                alert: { color: 'success' },
                close: true,
              })
            );
            setSubmitting(false);
            navigate('/login-otp-verify');
          }}
        >
          {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
            <form noValidate onSubmit={handleSubmit}>
              <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ mb: 3 }}>
                <InputLabel htmlFor="forgot-email">Email Address</InputLabel>
                <OutlinedInput
                  id="forgot-email"
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
                  Send Reset Link
                </Button>
              </AnimateButton>
            </form>
          )}
        </Formik>

        <Box sx={{ mt: 3 }}>
          <Typography component={Link} to="/login" variant="subtitle2" color="primary" sx={{ textDecoration: 'none', fontWeight: 600 }}>
            Back to Login
          </Typography>
        </Box>
      </Card>
    </Box>
  );
};

export default ForgotPassword;
