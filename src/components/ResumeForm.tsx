import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Container } from '@mui/material';

const ResumeForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [experience, setExperience] = useState('');
  const [skills, setSkills] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle the profile submission logic (e.g., save to backend or local state)
    console.log('Profile submitted:', { name, email, experience, skills });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Typography variant="h4" gutterBottom>
        Create Your Profile
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
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
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Experience"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Skills"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          margin="normal"
          required
        />
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
          Submit Profile
        </Button>
      </Box>
    </Container>
  );
};

export default ResumeForm;
