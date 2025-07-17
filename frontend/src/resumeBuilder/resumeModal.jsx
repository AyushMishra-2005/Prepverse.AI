import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Modal,
  TextField
} from '@mui/material';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 450,
  bgcolor: '#1f2937',
  borderRadius: '16px',
  boxShadow: 24,
  p: 4,
  color: 'white',
};

const ResumeModal = ({ open, handleClose, title, setTitle, handleSubmit }) => {
  const [titleError, setTitleError] = useState(false);

  const onSubmit = () => {
    if (!title.trim()) {
      setTitleError(true);
      return;
    }

    setTitleError(false);
    handleSubmit(); 
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="resume-modal-title"
      aria-describedby="resume-modal-description"
    >
      <Box sx={modalStyle}>
        <Typography
          id="resume-modal-title"
          variant="h5"
          component="h2"
          sx={{
            fontWeight: 'bold',
            mb: 3,
            background: 'linear-gradient(to right, #4facfe, #00f2fe)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: 'center',
          }}
        >
          Start Creating Your Resume
        </Typography>

        <TextField
          fullWidth
          label="Resume Title"
          variant="outlined"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (titleError) setTitleError(false); 
          }}
          error={titleError}
          helperText={titleError ? "Resume title is required" : ""}
          sx={{
            input: { color: 'white' },
            label: { color: '#bbb' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#555' },
              '&:hover fieldset': { borderColor: '#888' },
            },
            mb: 3,
          }}
        />

        <Button
          variant="contained"
          fullWidth
          onClick={onSubmit}
          sx={{
            background: 'linear-gradient(to right, #4facfe, #00f2fe)',
            color: 'white',
            fontWeight: 'bold',
            textTransform: 'none',
            '&:hover': {
              background: 'linear-gradient(to right, #3ea0ff, #00e6e6)',
            },
          }}
        >
          Submit
        </Button>
      </Box>
    </Modal>
  );
};

export default ResumeModal;
