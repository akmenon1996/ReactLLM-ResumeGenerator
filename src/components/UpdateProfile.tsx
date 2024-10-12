import React, { useState, useEffect } from 'react';
import { Button, TextField, Typography, Container, Box, RadioGroup, FormControlLabel, Radio, FormControl, FormLabel, Grid, TextareaAutosize } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const apiBaseUrl = process.env.NODE_ENV === 'production'
  ? 'https://abmenon.pythonanywhere.com'  // Production URL
  : 'http://127.0.0.1:5000';  

const UpdateProfile: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [urls, setUrls] = useState([{ label: '', url: '' }]); // Initialize with empty values
  const [userAction, setUserAction] = useState('paste'); // Either upload or paste
  const [resumeFile, setResumeFile] = useState<File | null>(null); // Resume file state
  const [pastedData, setPastedData] = useState(''); // Pasted new experience data
  const navigate = useNavigate();

  // Fetch existing user profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      const isAuthenticated = localStorage.getItem('isAuthenticated');
      const storedUsername = localStorage.getItem('username');
    
      if (!isAuthenticated) {
        // If not authenticated, redirect to login page
        navigate('/login');
      }; 

      try {
        const response = await axios.get(`${apiBaseUrl}/api/profile?username=${storedUsername}`, {
          withCredentials: true,
        });
        
        const profileData = response.data;
        setName(profileData.name || '');
        setPhone(profileData.phone || '');
        setEmail(profileData.email || '');
        setUrls(profileData.urls.length ? profileData.urls : [{ label: '', url: '' }]); // Set URLs or empty fields
      } catch (error) {
        console.error('Error fetching profile:', error);
        alert('Error fetching profile.');
      }
    };

    fetchProfile();
  }, []); // Empty array to ensure this only runs once on mount

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleAddUrl = () => {
    setUrls([...urls, { label: '', url: '' }]); // Add new URL input field
  };

  const handleRemoveUrl = (index: number) => {
    const updatedUrls = [...urls];
    updatedUrls.splice(index, 1); // Remove the URL at the given index
    setUrls(updatedUrls);
  };

  // Wipe the current profile data and reset the form fields
  const handleWipeProfile = async () => {
    const storedUsername = localStorage.getItem('username');

    if (!storedUsername) {
      alert('Username is missing. Please log in again.');
      return;
    }

    try {
      const response = await axios.post(`${apiBaseUrl}/api/profile/wipe?username=${storedUsername}`, {}, {
        withCredentials: true,
      });

      if (response.status === 200) {
        setName('');
        setPhone('');
        setEmail('');
        setUrls([{ label: '', url: '' }]);
        setResumeFile(null);
        setPastedData('');
        alert('Profile wiped successfully!');
      } else {
        alert('Error wiping profile.');
      }
    } catch (error) {
      console.error('Error wiping profile:', error);
      alert('Error wiping profile.');
    }
  };


  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData();
    
    // Retrieve username from localStorage
    const storedUsername = localStorage.getItem('username');
    
    if (!storedUsername) {
      alert('Username is missing. Please log in again.');
      return;
    }
    
    formData.append('name', name);  
    formData.append('email', email);
    formData.append('phone', phone); // Include phone
    
    // Append the URLs
    urls.forEach((urlObj, index) => {
      formData.append(`urls[${index}][label]`, urlObj.label);
      formData.append(`urls[${index}][url]`, urlObj.url);
    });

    if (userAction === 'upload' && resumeFile) {
      console.log('Uploading updated resume:', resumeFile);
      formData.append('resume_pdf', resumeFile);
    } else if (userAction === 'paste' && pastedData) {
      console.log('Processing new experience data:', pastedData);
      formData.append('resume_text', pastedData);
    }
  
    try {
      // Pass the username from localStorage as a query parameter in the API call
      const response = await axios.post(`http://127.0.0.1:5000/api/profile?username=${storedUsername}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,  // Ensures cookies are passed along for authentication
      });
      
      console.log('Profile updated successfully:', response.data);
      alert('Profile updated successfully!');
      navigate('/current-profile');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile.');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 10 }}>
      <Typography variant="h4" gutterBottom>
        Update Your Profile
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        {/* User Metadata */}
        <Typography variant="h6" gutterBottom>
          User Metadata
        </Typography>
        <TextField
          fullWidth
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
          required
        />

        {/* Existing URLs Section */}
        <Typography variant="h6" gutterBottom>
          Other URLs (Optional)
        </Typography>
        {urls.map((url, index) => (
          <Grid container spacing={2} key={index}>
            <Grid item xs={5}>
              <TextField
                fullWidth
                label="Label"
                value={url.label}
                onChange={(e) => {
                  const newUrls = [...urls];
                  newUrls[index].label = e.target.value;
                  setUrls(newUrls);
                }}
                margin="normal"
              />
            </Grid>
            <Grid item xs={5}>
              <TextField
                fullWidth
                label="URL"
                value={url.url}
                onChange={(e) => {
                  const newUrls = [...urls];
                  newUrls[index].url = e.target.value;
                  setUrls(newUrls);
                }}
                margin="normal"
              />
            </Grid>
            <Grid item xs={2}>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleRemoveUrl(index)}
              >
                Remove
              </Button>
            </Grid>
          </Grid>
        ))}
        <Button onClick={handleAddUrl} sx={{ mt: 1 }}>
          Add Another URL
        </Button>

        {/* User Action Selection */}
        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
          New User Actions
        </Typography>
        <FormControl component="fieldset">
          <FormLabel component="legend">What would you like to do?</FormLabel>
          <RadioGroup
            aria-label="userAction"
            name="userAction"
            value={userAction}
            onChange={(e) => setUserAction(e.target.value)}
          >
            <FormControlLabel value="upload" control={<Radio />} label="Upload a New Resume" />
            <FormControlLabel value="paste" control={<Radio />} label="Add New Data" />
          </RadioGroup>
        </FormControl>

        {/* Resume Upload Section (only shown if "Upload" is selected) */}
        {userAction === 'upload' && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Upload Your Resume
            </Typography>
            <input type="file" accept=".pdf" onChange={handleFileUpload} />
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Limit 200MB per file - PDF
            </Typography>
          </Box>
        )}

        {/* Pasted Data Section (only shown if "Add New Data" is selected) */}
        {userAction === 'paste' && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Paste Your New Data
            </Typography>
            <TextareaAutosize
              minRows={6}
              placeholder="Paste your new experience or resume text here"
              style={{ width: '100%', padding: '8px' }}
              value={pastedData}
              onChange={(e) => setPastedData(e.target.value)}
            />
          </Box>
        )}

        {/* Submit Button */}
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
          Submit Profile Updates
        </Button>

        {/* Wipe Existing Data Button */}
        <Button
          fullWidth
          variant="outlined"
          color="error"
          sx={{ mt: 2 }}
          onClick={handleWipeProfile}
        >
          Wipe Existing Data and Create New Profile
        </Button>
      </Box>
    </Container>
  );
};

export default UpdateProfile;