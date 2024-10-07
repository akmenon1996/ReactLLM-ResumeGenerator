import React, { useState } from 'react';
import { Button, TextField, Typography, Container, Box, Slider } from '@mui/material';
import axios from 'axios';

const ResumeGenerator: React.FC = () => {
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [fontSize, setFontSize] = useState(14); // Font size customization
  const [lineHeight, setLineHeight] = useState(1.5); // Line height customization
  const [generatedResume, setGeneratedResume] = useState<string | null>(null); // Store the generated resume (PDF preview URL)
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  const handleGenerateResume = async () => {
    setLoading(true);
    setError(null);

    try {
      const username = localStorage.getItem('username'); // Assuming username is stored in localStorage

      if (!username) {
        setError('Username not found. Please log in.');
        setLoading(false);
        return;
      }

      // Prepare data to send to the backend
      const requestData = {
        jobDescription,
        fontSize,
        lineHeight
      };

      // Make an API call to generate the resume via the backend
      const response = await axios.post(
        `http://127.0.0.1:5000/api/generate-resume?username=${username}`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',  // Ensure the Content-Type is set
          },
          withCredentials: true,  // Allow cookies and credentials to be sent with the request
          responseType: 'blob',   // Important for handling PDF response
        }
      );
      

      // Create a URL for the PDF file returned
      const pdfUrl = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      setGeneratedResume(pdfUrl);

    } catch (err) {
      console.error('Error generating resume:', err);
      setError('Failed to generate resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 10 }}>
      <Typography variant="h4" gutterBottom>
        Resume Generator
      </Typography>

      {/* Job Details Input */}
      <Box component="form" sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Job Details
        </Typography>
        <TextField
          fullWidth
          label="Job Title"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Job Description"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          multiline
          rows={4}
          margin="normal"
        />

        {/* Customization Options */}
        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
          Customize Your Resume
        </Typography>
        <Typography gutterBottom>Font Size</Typography>
        <Slider
          value={fontSize}
          min={10}
          max={20}
          step={1}
          valueLabelDisplay="auto"
          onChange={(e, newValue) => setFontSize(newValue as number)}
        />
        <Typography gutterBottom>Line Height</Typography>
        <Slider
          value={lineHeight}
          min={1.0}
          max={2.0}
          step={0.1}
          valueLabelDisplay="auto"
          onChange={(e, newValue) => setLineHeight(newValue as number)}
        />

        {/* Generate Resume Button */}
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 3 }}
          onClick={handleGenerateResume}
          disabled={loading}
        >
          {loading ? 'Generating Resume...' : 'Generate Resume'}
        </Button>
      </Box>

      {/* Error Display */}
      {error && (
        <Typography color="error" variant="body1" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {/* PDF Preview */}
      {generatedResume && (
        <Box sx={{ mt: 6 }}>
          <Typography variant="h6" gutterBottom>
            Resume Preview
          </Typography>
          {/* Render a preview iframe for the PDF */}
          <iframe
            src={generatedResume}
            style={{ width: '100%', height: '500px', border: '1px solid black' }}
            title="Resume Preview"
          />
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            href={generatedResume}
            download="generated_resume.pdf"
          >
            Download Resume
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default ResumeGenerator;
