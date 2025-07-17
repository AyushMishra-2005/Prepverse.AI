import React from 'react';
import {
  Box,
  Button,
  Typography,
  Modal
} from '@mui/material';
import { FocusCards } from "../components/ui/focus-cards.jsx";
import templateImage2 from '../assets/resumeImage2.png'
import templateImage1 from '../assets/resumeImage1.png'

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 1200,
  maxHeight: '90vh',
  overflowY: 'auto',
  bgcolor: '#1f2937',
  borderRadius: '16px',
  boxShadow: 24,
  p: 4,
  color: 'white',
};

const ResumeTemplateModal = ({ open, handleClose, setTemplate, handleSubmit }) => {
  const cards = [
    {
      title: "Template 1",
      src: templateImage1,
    },
    {
      title: "Template 2",
      src: templateImage2,
    },
  ];

  const handleCardSelect = (index) => {
    setTemplate(index);
    handleSubmit(index);
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="resume-modal-title"
      aria-describedby="resume-modal-description"
    >
      <Box sx={modalStyle}>
        <Typography id="resume-modal-title" variant="h6" component="h2" gutterBottom>
          Choose Your Resume Template
        </Typography>
        <FocusCards 
          cards={cards.map((card, idx) => ({
          ...card,
          onClick: () => {
            handleCardSelect(idx);
          }
        }))} />
        <Box mt={4} display="flex" justifyContent="flex-end">
          <Button variant="outlined" color="inherit" onClick={handleClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ResumeTemplateModal;
