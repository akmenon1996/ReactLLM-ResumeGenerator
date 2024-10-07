import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button, Box, CircularProgress, List, ListItem, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CurrentProfile: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null); // State to store the fetched profile
  const [loading, setLoading] = useState(true); // State for loading spinner
  const [error, setError] = useState<string | null>(null); // State for error handling

  // Fetch username from localStorage
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername); // Set the username from localStorage
    } else {
      setUsername('Guest');
    }
  }, []);

  // Fetch the profile data when the username is set
  useEffect(() => {
    if (username && username !== 'Guest') {
      const fetchProfile = async () => {
        try {
          // Update the backend URL to the correct one
          const response = await axios.get(`http://127.0.0.1:5000/api/profile?username=${username}`);
          setProfile(response.data);
        } catch (err) {
          setError('Failed to fetch profile');
        } finally {
          setLoading(false);
        }
      };
      fetchProfile();
    } else {
      setLoading(false); // Skip loading if the user is a Guest
    }
  }, [username]);

  const handleUpdateProfile = () => {
    navigate('/update-profile');
  };

  // Loading state
  if (loading) {
    return (
      <Box sx={{ mt: 10, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6">Loading profile...</Typography>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ mt: 10, textAlign: 'center' }}>
        <Typography variant="h6" color="error">{error}</Typography>
      </Box>
    );
  }

  // Guest state
  if (username === 'Guest') {
    return (
      <Box sx={{ mt: 10, textAlign: 'center' }}>
        <Typography variant="h6" color="textSecondary">
          You are logged in as a Guest. Please log in to view your profile.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 10 }}>
      <Card sx={{ maxWidth: 600, margin: '0 auto', mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Current Profile
          </Typography>
          <Typography variant="body1">
            <strong>Username:</strong> {username}
          </Typography>
          {profile && (
            <>
              <Typography variant="body1">
                <strong>Email:</strong> {profile.email}
              </Typography>

              <Typography variant="body1">
                <strong>Phone:</strong> {profile.phone}
              </Typography>

              {/* Display Experiences */}
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Experiences
              </Typography>
              {profile.experiences && profile.experiences.length > 0 ? (
                profile.experiences.map((exp: any, index: number) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Typography variant="subtitle1">
                      <strong>{exp.position}</strong> at <strong>{exp.company}</strong> ({exp.start_date} - {exp.end_date})
                    </Typography>
                    <List>
                      {exp.description.split('•').filter(Boolean).map((point: string, i: number) => (
                        <ListItem key={i}>
                          <ListItemText primary={point.trim()} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                ))
              ) : (
                <Typography variant="body2">No experiences added</Typography>
              )}

              {/* Display Education */}
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Education
              </Typography>
              {profile.education && profile.education.length > 0 ? (
                profile.education.map((edu: any, index: number) => (
                  <Typography key={index} variant="body2">
                    {edu.degree}, {edu.institution} ({edu.year})
                  </Typography>
                ))
              ) : (
                <Typography variant="body2">No education details added</Typography>
              )}

              {/* Display Skills */}
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Skills
              </Typography>
              {profile.skills && profile.skills.length > 0 ? (
                <Typography variant="body2">
                  {profile.skills.map((skill: any) => skill.name).join(', ')}
                </Typography>
              ) : (
                <Typography variant="body2">No skills added</Typography>
              )}

              {/* Display Projects */}
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Projects
              </Typography>
              {profile.projects && profile.projects.length > 0 ? (
                profile.projects.map((proj: any, index: number) => (
                  <Box key={index} sx={{ mb: 2 }}> {/* Add margin-bottom for spacing */}
                    <Typography variant="body2">
                      <strong>{proj.title}</strong>: {proj.description}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body2">No projects added</Typography>
              )}

              {/* Display Certifications */}
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Certifications
              </Typography>
              {profile.certifications && profile.certifications.length > 0 ? (
                profile.certifications.map((cert: any, index: number) => (
                  <Typography key={index} variant="body2">
                    {cert.name}, Issued by {cert.issued_by} ({cert.year})
                  </Typography>
                ))
              ) : (
                <Typography variant="body2">No certifications added</Typography>
              )}

              {/* Display Papers */}
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Papers
              </Typography>
              {profile.papers && profile.papers.length > 0 ? (
                profile.papers.map((paper: any, index: number) => (
                  <Typography key={index} variant="body2">
                    {paper.title} - <a href={paper.url} target="_blank" rel="noopener noreferrer">Link</a>
                  </Typography>
                ))
              ) : (
                <Typography variant="body2">No papers added</Typography>
              )}

              {/* Display URLs */}
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                URLs
              </Typography>
              {profile.urls && profile.urls.length > 0 ? (
                profile.urls.map((url: any, index: number) => (
                  <Typography key={index} variant="body2">
                    {url.label}: <a href={url.url} target="_blank" rel="noopener noreferrer">{url.url}</a>
                  </Typography>
                ))
              ) : (
                <Typography variant="body2">No URLs added</Typography>
              )}

            </>
          )}
        </CardContent>
      </Card>

      {/* Update Profile Card */}
      <Card sx={{ maxWidth: 600, margin: '0 auto' }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Update Your Profile
          </Typography>
          <Button variant="contained" onClick={handleUpdateProfile}>
            Update Profile
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CurrentProfile;
