import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { Box, Button, Card, Grid, OutlinedInput, Stack, Typography, Avatar } from '@mui/material';
import { IconShieldCheck } from '@tabler/icons-react';
import AnimateButton from '../../ui-component/extended/AnimateButton';
import { useDispatch } from '../../store';
import { openSnackbar } from '../../store/slices/snackbar';

const OtpVerify = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [otp, setOtp] = useState(['4', '8', '2', '9', '', '']);
  const [timer, setTimer] = useState(59);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleVerify = () => {
    dispatch(
      openSnackbar({
        open: true,
        message: '2-Factor Authentication Verified Successfully!',
        variant: 'alert',
        alert: { color: 'success' },
        close: true,
      })
    );
    navigate('/recipes');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `radial-gradient(circle at top left, ${theme.palette.primary.light} 0%, #f8fafc 60%, ${theme.palette.secondary.light} 100%)`,
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
            bgcolor: theme.palette.secondary.main,
            width: 54,
            height: 54,
            margin: '0 auto 16px',
            boxShadow: '0 8px 16px rgba(16, 185, 129, 0.3)',
          }}
        >
          <IconShieldCheck size="32px" color="#fff" />
        </Avatar>

        <Typography variant="h2" sx={{ fontWeight: 800, color: theme.palette.text.primary, mb: 1 }}>
          Two-Step Verification
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 4 }}>
          We sent a verification code to <strong>admin@foodie-admin.io</strong>. Enter the 6-digit code below.
        </Typography>

        <Grid container spacing={1.5} justifyContent="center" sx={{ mb: 3 }}>
          {otp.map((digit, index) => (
            <Grid item xs={2} key={index}>
              <OutlinedInput
                id={`otp-input-${index}`}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                inputProps={{
                  maxLength: 1,
                  style: { textAlign: 'center', fontSize: '1.25rem', fontWeight: 700, padding: '12px 0' },
                }}
              />
            </Grid>
          ))}
        </Grid>

        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          Did not receive code?{' '}
          {timer > 0 ? (
            <strong style={{ color: theme.palette.primary.main }}>Resend in 0:{timer < 10 ? `0${timer}` : timer}</strong>
          ) : (
            <Button size="small" onClick={() => setTimer(60)} sx={{ fontWeight: 700 }}>
              Resend Code
            </Button>
          )}
        </Typography>

        <AnimateButton>
          <Button
            fullWidth
            size="large"
            variant="contained"
            color="primary"
            onClick={handleVerify}
            sx={{ py: 1.5, fontSize: '1rem', fontWeight: 700 }}
          >
            Verify & Proceed
          </Button>
        </AnimateButton>

        <Box sx={{ mt: 3 }}>
          <Typography component={Link} to="/login" variant="subtitle2" color="primary" sx={{ textDecoration: 'none', fontWeight: 600 }}>
            Back to Login
          </Typography>
        </Box>
      </Card>
    </Box>
  );
};

export default OtpVerify;
