import React, { useState } from 'react';
import './InterviewSection.css';
import { useNavigate } from 'react-router-dom';
import useConversation from '../stateManage/useConversation';
import toast from 'react-hot-toast';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';

const InterviewSection = () => {
  const navigate = useNavigate();
  const { setAccessInterviewPage,  setInterviewData, interviewModelId, setInterviewModelId} = useConversation();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    role: '',
    topic: '',
    numOfQns: 2
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    if (!formData.role || !formData.topic || !formData.numOfQns) {
      toast.error("Please fill the form");
      return;
    }

    if (formData.numOfQns <= 0) {
      toast.error("Please enter valid number of questions");
      return;
    }

    try {
      setLoading(true);
      const { role, topic, numOfQns } = formData;
      const { data } = await axios.post(
        "http://localhost:8000/interview/checkRoleAndTopic",
        {
          role, topic, numOfQns
        },
        { withCredentials: true }
      );

      console.log(data.response);
      if (!data.response.valid) {
        setLoading(false);
        return toast.error("Please enter valid Role and Topic!");
      }

      setInterviewModelId(data.interviewModelId);

      setInterviewData({
        topic,
        role,
        numOfQns
      });

      setLoading(false);

    } catch (err) {
      console.log(err);
      setLoading(false);
    }

    setAccessInterviewPage(true);
    navigate('/interviewPage');
  };

  return (
    <div className="interview-container">
      <div className="gradient-box">
        <h1 className="colorful-heading">Welcome to Interview Section</h1>

        <div className="scrollable-form">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="role">Role:</label>
              <input
                type="text"
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="Enter job role"
              />
            </div>
            <div className="form-group">
              <label htmlFor="topic">Topic:</label>
              <input
                type="text"
                id="topic"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                placeholder="Enter interview topic"
              />
            </div>
            <div className="form-group">
              <label htmlFor="numOfQns">Number Of Questions</label>
              <input
                type="number"
                id="numOfQns"
                name="numOfQns"
                value={formData.numOfQns}
                onChange={handleChange}
                placeholder="Enter number of questions 0-25"
              />
            </div>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <CircularProgress size={20} color="inherit" />
                  Loading...
                </>
              ) : (
                "Submit"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InterviewSection;
