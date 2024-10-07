import React, { useState } from 'react';
import { Button, TextField, Typography, Container, Box } from '@mui/material';

const ResumeUploadOrManualInput: React.FC = () => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [experience, setExperience] = useState('');
  const [skills, setSkills] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Later, send data to the backend
    console.log('Submitted:', resumeFile || { name, experience, skills });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Typography variant="h4" gutterBottom>
        Upload Resume or Enter Details Manually
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <Typography variant="h6">Upload Resume (PDF/Word)</Typography>
        <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileUpload} />

        <Typography variant="h6" sx={{ mt: 4 }}>Or Enter Details Manually</Typography>
        <TextField
          fullWidth
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Experience"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Skills"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          margin="normal"
        />

        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
          Submit
        </Button>
      </Box>
    </Container>
  );
};

export default ResumeUploadOrManualInput;
