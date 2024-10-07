import React, { useState } from 'react';
import { Button, TextField, Grid, Box } from '@mui/material';

interface Experience {
  position: string;
  company: string;
  startDate: string;
  endDate: string;
  responsibilities: string;
}

interface ExperienceFormProps {
  onSubmit: (experience: Experience) => void;
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({ onSubmit }) => {
  const [position, setPosition] = useState('');
  const [company, setCompany] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [responsibilities, setResponsibilities] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const experience: Experience = { position, company, startDate, endDate, responsibilities };
    onSubmit(experience);
    setPosition('');
    setCompany('');
    setStartDate('');
    setEndDate('');
    setResponsibilities('');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            name="position"
            required
            fullWidth
            id="position"
            label="Position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            id="company"
            label="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            type="date"
            required
            fullWidth
            id="startDate"
            label="Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            type="date"
            fullWidth
            id="endDate"
            label="End Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            multiline
            rows={4}
            id="responsibilities"
            label="Responsibilities"
            value={responsibilities}
            onChange={(e) => setResponsibilities(e.target.value)}
          />
        </Grid>
      </Grid>
      <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
        Add Experience
      </Button>
    </Box>
  );
};

export default ExperienceForm;