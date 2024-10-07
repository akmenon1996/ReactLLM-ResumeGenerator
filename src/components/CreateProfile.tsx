import React, { useState } from 'react';
import { Button, TextField, Typography, Container, Box, RadioGroup, FormControlLabel, Radio, FormControl, FormLabel, Grid, TextareaAutosize } from '@mui/material';
import axios from 'axios';

const CreateProfile: React.FC = () => {
  const [userAction, setUserAction] = useState('upload'); // State for user action (upload or manual entry)
  const [resumeFile, setResumeFile] = useState<File | null>(null); // Resume file state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [urls, setUrls] = useState([{ label: '', url: '' }]); // URLs array
  const [pastedData, setPastedData] = useState(''); // State for pasted resume text

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleAddUrl = () => {
    setUrls([...urls, { label: '', url: '' }]); // Add new URL input field
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('username', name);
    formData.append('email', email);
    formData.append('phone', phone);

    // Add URLs to the form data
    urls.forEach((urlObj, index) => {
      formData.append(`urls[${index}][label]`, urlObj.label);
      formData.append(`urls[${index}][url]`, urlObj.url);
    });

    try {
      if (userAction === 'upload' && resumeFile) {
        // If the user chooses to upload a PDF, append the file
        formData.append('resume_pdf', resumeFile);
      } else if (userAction === 'paste' && pastedData) {
        // If the user chooses to paste resume text, append the text
        formData.append('resume_text', pastedData);
      }

      // Send form data to the backend
      const response = await axios.post('/api/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Profile updated successfully:', response.data);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 10 }}>
      <Typography variant="h4" gutterBottom>
        Create Your Profile
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

        {/* Optional URLs Section */}
        <Typography variant="h6" gutterBottom>
          Other URLs (Optional)
        </Typography>
        {urls.map((url, index) => (
          <Grid container spacing={2} key={index}>
            <Grid item xs={6}>
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
            <Grid item xs={6}>
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
              placeholder="Paste your new resume text here"
              style={{ width: '100%', padding: '8px' }}
              value={pastedData}
              onChange={(e) => setPastedData(e.target.value)}
            />
          </Box>
        )}

        {/* Submit Button */}
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
          Submit
        </Button>
      </Box>
    </Container>
  );
};

export default CreateProfile;
