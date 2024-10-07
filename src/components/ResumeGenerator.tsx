import React, { useState } from 'react';
import { Button, TextField, Typography, Container, Box, Slider } from '@mui/material';

const ResumeGenerator: React.FC = () => {
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [fontSize, setFontSize] = useState(14); // Font size customization
  const [lineHeight, setLineHeight] = useState(1.5); // Line height customization
  const [generatedResume, setGeneratedResume] = useState<string | null>(null); // Store the generated resume (PDF preview URL or base64)
  
  const handleGenerateResume = async () => {
    // Prepare data to send to the backend/LLM
    const resumeData = {
      jobTitle,
      company,
      jobDescription,
      fontSize,
      lineHeight,
    };

    console.log('Sending resume data to LLM:', resumeData);

    // Example: Simulate an API call to generate the resume via the LLM and return a PDF URL or base64 PDF
    const jsonResponse = await mockGenerateResumeAPI(resumeData); // Replace this with real API call to LLM
    setGeneratedResume(jsonResponse.pdfUrl); // Save the generated PDF for preview
  };

  // Simulate backend LLM response (mock function)
  const mockGenerateResumeAPI = async (data: any) => {
    return new Promise<{ pdfUrl: string }>((resolve) => {
      setTimeout(() => {
        resolve({ pdfUrl: 'https://www.example.com/path-to-generated-pdf' }); // Simulate PDF URL or base64 response
      }, 2000);
    });
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
        >
          Generate Resume
        </Button>
      </Box>

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