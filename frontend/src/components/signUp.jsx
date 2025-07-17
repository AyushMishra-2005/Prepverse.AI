import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Divider,
  Avatar,
  Link
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios'
import server from '../environment.js'
import { useAuth } from '../context/AuthProvider.jsx'
import { toast } from 'react-hot-toast'
import { useGoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'


function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [profileFile, setProfileFile] = useState(null);
  const { authUser, setAuthUser } = useAuth();
  const [loading, setLoading] = useState(false);


  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    otp: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({
    name: false,
    username: false,
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

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePic(URL.createObjectURL(e.target.files[0]));
      setProfileFile(e.target.files[0]);
    }
  };

  const handleSendOtp = async () => {
    if (!formData.email) {
      setErrors(prev => ({ ...prev, email: true }));
      return;
    }
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

  const validateForm = () => {
    const newErrors = {
      name: !formData.name,
      username: !formData.username,
      email: !formData.email,
      otp: !formData.otp,
      password: !formData.password,
      confirmPassword: !formData.confirmPassword || formData.password !== formData.confirmPassword
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleGoogleSignUp = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (response) => {
      try {

        const withGoogle = true;

        await axios.post(
          `${server}/user/signup`,
          {code: response.code, withGoogle},
          { withCredentials: true }
        )
          .then((response) => {
            if (response.data) {
              toast.success("SignUp successful you can login now.");
            }
            console.log(response.data);
            localStorage.setItem("authUserData", JSON.stringify(response.data));
            setAuthUser(response.data);
            setLoading(false);
          })
          .catch((err) => {
            console.log("Error in signup page : ", err);
            setLoading(false);
            if(err.response && err.response.data){
              toast.error(err.response.data.message);
            }
          });

      } catch (err) {
        console.log(err);
      }
    },

    onError: (err) => {
      console.log(err)
    },
  });

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

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const valid = await handleVerifyOtp();

    if (!valid) {
      setLoading(false);
      return;
    }

    let imageURL = "";

    if (profileFile) {
      try {
        const { data } = await axios.get(
          `${server}/getImage`,
          {},
          { withCredentials: true }
        );

        const imageFormData = new FormData();
        imageFormData.append("file", profileFile);
        imageFormData.append('api_key', data.apiKey);
        imageFormData.append('timestamp', data.timestamp);
        imageFormData.append('signature', data.signature);

        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${data.cloudName}/image/upload`;

        const uploadRes = await axios.post(cloudinaryUrl, imageFormData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        imageURL = uploadRes.data.secure_url;

        console.log(imageURL);

      } catch (err) {
        console.log(err);
      }
    }

    const userInfo = {
      name: formData.name,
      username: formData.username,
      email: formData.email,
      password: formData.password,
      confirmpassword: formData.confirmPassword,
      profilePicURL: imageURL,
      otp: formData.otp,
      withGoogle : false,
    }

    if (!imageURL || imageURL.trim() === "") {
      const name = userInfo.name.trim();
      const encodedName = encodeURIComponent(name);
      imageURL = `https://ui-avatars.com/api/?name=${encodedName}&background=random&color=fff&size=128`;
      userInfo.profilePicURL = imageURL;
    }


    await axios.post(
      `${server}/user/signup`,
      userInfo,
      { withCredentials: true }
    )
      .then((response) => {
        if (response.data) {
          toast.success("SignUp successful you can login now.");
        }
        console.log(response.data);
        localStorage.setItem("authUserData", JSON.stringify(response.data));
        setAuthUser(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Error in signup page : ", err);
        setLoading(false);
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
          width: '800px',
          height: '80vh',
          minHeight: '600px',
          maxHeight: '800px',
          boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.5)',
          display: 'flex',
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
        {/* Left Side - Image Upload */}
        <Box
          sx={{
            width: '40%',
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            borderRight: '1px solid rgba(255, 255, 255, 0.1)',
            position: 'relative',
            zIndex: 1,
            background: 'linear-gradient(135deg, rgba(30,30,30,0.7) 0%, rgba(18,18,18,1) 100%)'
          }}
        >
          <Typography variant="h5" component="h2" gutterBottom sx={{ color: 'white', mb: 3 }}>
            Profile Picture
          </Typography>

          <Avatar
            src={profilePic}
            sx={{
              width: 180,
              height: 180,
              bgcolor: 'rgba(51, 51, 51, 0.7)',
              mb: 3,
              '& .MuiSvgIcon-root': { fontSize: 70 },
              border: '2px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
            }}
          >
            {!profilePic && <PhotoCamera fontSize="large" />}
          </Avatar>

          <label htmlFor="profile-pic">
            <input
              accept="image/*"
              id="profile-pic"
              type="file"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <Button
              variant="outlined"
              component="span"
              startIcon={<PhotoCamera />}
              sx={{
                color: 'white',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                '&:hover': {
                  borderColor: '#90caf9',
                  backgroundColor: 'rgba(144, 202, 249, 0.08)'
                },
                backdropFilter: 'blur(5px)',
                background: 'rgba(30, 30, 30, 0.4)'
              }}
            >
              Upload Profile
            </Button>
          </label>

          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mt: 3, textAlign: 'center' }}>
            Upload a clear photo of yourself for better recognition
          </Typography>
        </Box>

        {/* Right Side - Form Fields */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: '60%',
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            zIndex: 1,
            background: 'linear-gradient(135deg, rgba(18,18,18,1) 0%, rgba(30,30,30,0.7) 100%)',
            overflowY: 'auto',
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
            Create Account
          </Typography>

          <TextField
            fullWidth
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            error={errors.name}
            helperText={errors.name ? 'This field is required' : ''}
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

          <TextField
            fullWidth
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            error={errors.username}
            helperText={errors.username ? 'This field is required' : ''}
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
              '&.Mui-disabled': {
                backgroundColor: '#90caf9',
                color: '#fff',
                boxShadow: 'none'
              },
              backdropFilter: 'blur(5px)',
              boxShadow: '0 4px 15px rgba(25, 118, 210, 0.3)'
            }}
            disabled={loading}
          >
            Sign Up
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
            onClick={handleGoogleSignUp}
          >
            Continue with Google
          </Button>

          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', textAlign: 'center', mt: 'auto' }}>
            Already have an account?{' '}
            <Link component={RouterLink} to="/login" sx={{ color: '#90caf9', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              Login
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default SignUp;