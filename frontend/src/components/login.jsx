import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Divider,
  Link
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios'
import server from '../environment.js'
import { useAuth } from '../context/AuthProvider.jsx'
import { LoaderIcon, toast } from 'react-hot-toast'
import { useGoogleLogin } from '@react-oauth/google'

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { setAuthUser } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({
    email: false,
    otp: false,
    password: false,
    confirmPassword: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: false
      }));
    }
  };

  const handleSendOtp = async () => {
    if (!formData.email) {
      setErrors(prev => ({ ...prev, email: true }));
      return;
    }
    console.log('OTP sent to', formData.email);

    try {
      const { data } = await axios.post(
        `${server}/user/sendOTP`,
        { email: formData.email },
        { withCredentials: true }
      );

      if (data) {
        toast.success('OTP send Successfully');
      }
    } catch (err) {
      console.log(err);
      toast.error('OTP send Failed!');
    }

  };

  const handleVerifyOtp = async () => {
    if (!formData.email) {
      setErrors(prev => ({ ...prev, email: true }));
      return;
    }

    if (!formData.otp) {
      setErrors(prev => ({ ...prev, otp: true }));
      return;
    }

    try {
      const { data } = await axios.post(
        `${server}/user/verifyOTP`,
        {
          email: formData.email,
          otp: formData.otp
        },
        { withCredentials: true }
      );

      if (!data.valid) {
        toast.error('Wrong OTP!');
      }
      return data.valid;
    } catch (err) {
      console.log(err);
      toast.error('OTP Verify Failed!');
    }

  }

  const handleGoogleLogin = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (response) => {
      try {
        const withGoogle = true;

        await axios.post(
          `${server}/user/login`, 
          {code: response.code, withGoogle}, 
          {
            withCredentials: true,
          }
        )
          .then((response) => {
            if (response.data) {
              toast.success("User Logged In Successful!");
            } else {
              toast.error("User Logged In fail!");
              return;
            }

            localStorage.setItem("authUserData", JSON.stringify(response.data));
            setAuthUser(response.data);
          })
          .catch((err) => {
            console.log("Error in login : ", err);
          });
      } catch (err) {
        console.log(err);
      }
    },

    onError: (err) => console.log(err)
  });

  const validateForm = () => {
    const newErrors = {
      email: !formData.email,
      otp: !formData.otp,
      password: !formData.password,
      confirmPassword: !formData.confirmPassword || formData.password !== formData.confirmPassword
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const valid = await handleVerifyOtp();

    if (!valid) {
      return;
    }

    const userInfo = {
      email: formData.email,
      password: formData.password,
      confirmpassword: formData.confirmPassword,
      otp: formData.otp,
      withGoogle : false,
    }

    console.log(userInfo);

    await axios.post(`${server}/user/login`, userInfo, {
      withCredentials: true,
    })
      .then((response) => {
        if (response.data) {
          toast.success("User Logged In Successful!");
        } else {
          toast.error("User Logged In fail!");
          return;
        }

        localStorage.setItem("authUserData", JSON.stringify(response.data));
        setAuthUser(response.data);
      })
      .catch((err) => {
        console.log("Error in login : ", err);
      });

  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 3,
        background: 'radial-gradient(circle at center, #1a1a1a 0%, #000000 100%)',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed'
      }}
    >
      <Box
        sx={{
          backgroundColor: '#121212',
          borderRadius: 4,
          width: '500px',
          height: 'auto',

          boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          overflow: 'hidden',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(145deg, rgba(41,41,41,0.2) 0%, rgba(0,0,0,0.8) 100%)',
            zIndex: 0
          }
        }}
      >
        {/* Login Form */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: '100%',
            height: '80vh',
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            zIndex: 1,
            overflowY: 'auto',
            background: 'linear-gradient(135deg, rgba(18,18,18,1) 0%, rgba(30,30,30,0.7) 100%)',
            '&::-webkit-scrollbar': {
              width: '6px'
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: '3px'
            }
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'white', textAlign: 'center', mb: 3 }}>
            Login
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1, mb: 2 }}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              error={errors.email}
              helperText={errors.email ? 'This field is required' : ''}
              InputLabelProps={{ style: { color: 'rgba(255, 255, 255, 0.7)' } }}
              InputProps={{
                style: { color: 'white' },
                sx: {
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  '&:hover fieldset': {
                    borderColor: '#90caf9',
                  },
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backdropFilter: 'blur(5px)',
                  background: 'rgba(30, 30, 30, 0.2)'
                },
                mb: 2
              }}
            />
            <Button
              variant="contained"
              onClick={handleSendOtp}
              sx={{
                height: '56px',
                backgroundColor: '#1976d2',
                '&:hover': {
                  backgroundColor: '#1565c0'
                },
                backdropFilter: 'blur(5px)',
                boxShadow: '0 2px 10px rgba(25, 118, 210, 0.3)',
                minWidth: '120px'
              }}
            >
              Send OTP
            </Button>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1, mb: 2 }}>
            <TextField
              fullWidth
              label="OTP"
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              error={errors.otp}
              helperText={errors.otp ? 'This field is required' : ''}
              InputLabelProps={{ style: { color: 'rgba(255, 255, 255, 0.7)' } }}
              InputProps={{
                style: { color: 'white' },
                sx: {
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  '&:hover fieldset': {
                    borderColor: '#90caf9',
                  },
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backdropFilter: 'blur(5px)',
                  background: 'rgba(30, 30, 30, 0.2)'
                }
              }}
            />
          </Box>

          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            error={errors.password}
            helperText={errors.password ? 'This field is required' : ''}
            InputLabelProps={{ style: { color: 'rgba(255, 255, 255, 0.7)' } }}
            InputProps={{
              style: { color: 'white' },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                },
                '&:hover fieldset': {
                  borderColor: '#90caf9',
                },
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backdropFilter: 'blur(5px)',
                background: 'rgba(30, 30, 30, 0.2)'
              },
              mb: 2
            }}
          />

          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            error={errors.confirmPassword}
            helperText={errors.confirmPassword ?
              (formData.password !== formData.confirmPassword ? 'Passwords do not match' : 'This field is required')
              : ''}
            InputLabelProps={{ style: { color: 'rgba(255, 255, 255, 0.7)' } }}
            InputProps={{
              style: { color: 'white' },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                    sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                },
                '&:hover fieldset': {
                  borderColor: '#90caf9',
                },
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backdropFilter: 'blur(5px)',
                background: 'rgba(30, 30, 30, 0.2)'
              },
              mb: 2
            }}
          />

          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{
              mt: 2,
              mb: 2,
              py: 1.5,
              backgroundColor: '#1976d2',
              '&:hover': {
                backgroundColor: '#1565c0'
              },
              backdropFilter: 'blur(5px)',
              boxShadow: '0 4px 15px rgba(25, 118, 210, 0.3)'
            }}
          >
            Login
          </Button>

          <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }}>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>OR</Typography>
          </Divider>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            sx={{
              color: 'white',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              '&:hover': {
                borderColor: '#90caf9',
                backgroundColor: 'rgba(144, 202, 249, 0.08)'
              },
              backdropFilter: 'blur(5px)',
              background: 'rgba(30, 30, 30, 0.3)',
              mb: 2
            }}
            onClick={handleGoogleLogin}
          >
            Continue with Google
          </Button>

          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', textAlign: 'center', mt: 2 }}>
            Don't have an account?{' '}
            <Link component={RouterLink} to="/signup" sx={{ color: '#90caf9', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default Login;