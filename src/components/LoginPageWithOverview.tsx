import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';  // Ensure axios is imported

interface LoginPageWithOverviewProps {
  onLogin: (username: string) => void;
}

const LoginPageWithOverview: React.FC<LoginPageWithOverviewProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://127.0.0.1:5000/api/login',  // Replace with your backend URL
        { username, password },
        { withCredentials: true, headers: { 'Content-Type': 'application/json' } }  // Ensure credentials are sent
      );

      if (response && response.data) {
        console.log("Login successful:", response.data);
        
        // Store username in localStorage after login
        localStorage.setItem('username', username);
        localStorage.setItem('isAuthenticated', 'true');
        setError('');  // Clear any previous errors
        onLogin(username);  // Call onLogin with the logged-in username
        navigate('/current-profile');  // Navigate to profile
      } else {
        setError("Login failed: Invalid response from server.");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError("Login failed: " + error.response.data.message);
      } else {
        setError("Login failed: An unknown error occurred.");
      }
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://127.0.0.1:5000/api/register',  // Replace with your backend URL
        { username, password, email },
        { withCredentials: true, headers: { 'Content-Type': 'application/json' } }  // Ensure credentials are sent
      );

      if (response && response.data) {
        console.log("Registration successful:", response.data);
        setIsRegistering(false);  // Switch back to login mode
        setError('');
      } else {
        setError("Registration failed: Invalid response from server.");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError("Registration failed: " + error.response.data.message);
      } else {
        setError("Registration failed: An unknown error occurred.");
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 10 }}>
      <Grid container spacing={6}>
        {/* Overview Section */}
        <Grid item xs={12} md={8}>
          <Typography variant="h3" gutterBottom>
            Welcome to the AI-Powered Resume Generator!
          </Typography>
          <Typography variant="h5" gutterBottom>
            Overview
          </Typography>
          <Typography paragraph>
            This application is designed to help you create customized resumes tailored to specific job descriptions. By leveraging your past experiences, education, and skills, combined with the power of generative AI, the app can generate a resume that aligns with the job description you provide.
          </Typography>

          <Typography variant="h6" gutterBottom>
            How to Use the App
          </Typography>
          <Typography paragraph>
            <strong>User Profile Page:</strong>
            <ul>
              <li>Navigate to the User Profile page from the sidebar.</li>
              <li>Enter your past experiences, educational background, and skills.</li>
              <li>You can add multiple experiences, educational qualifications, and skills as needed.</li>
              <li>All the information you enter will be saved automatically.</li>
            </ul>
          </Typography>

          <Typography variant="h6" gutterBottom>
            Resume Generator Page:
          </Typography>
          <Typography paragraph>
            <ul>
              <li>Once you have filled in your profile, navigate to the Resume Generator page.</li>
              <li>Paste the job description for which you want to generate a resume.</li>
              <li>Click on the Generate Resume button. The app will process your profile and job description, and generate a customized resume.</li>
              <li>The generated resume will be displayed in the app and saved as a PDF file, which you can download.</li>
            </ul>
          </Typography>

          <Typography variant="h6" gutterBottom>
            Tips for Best Results
          </Typography>
          <Typography paragraph>
            <ul>
              <li>
                <strong>Detailed Information:</strong> The more detailed your profile (experiences, education, skills), the more tailored your generated resume will be.
              </li>
              <li>
                <strong>Relevant Job Description:</strong> Ensure that the job description you provide is clear and specific to get the most accurate resume.
              </li>
            </ul>
          </Typography>
        </Grid>

        {/* Login/Registration Section */}
        <Grid item xs={12} md={4}>
          <Box component="form" onSubmit={isRegistering ? handleRegister : handleLogin} sx={{ mt: 1 }}>
            <Typography variant="h4" align="center" gutterBottom>
              {isRegistering ? 'Create an Account' : 'Login'}
            </Typography>
            {error && <Typography color="error">{error}</Typography>}

            <TextField
              fullWidth
              id="username"
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              variant="outlined"
              margin="normal"
              required
            />
            <TextField
              type="password"
              fullWidth
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              margin="normal"
              required
            />
            {isRegistering && (
              <TextField
                fullWidth
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
                margin="normal"
                required
              />
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {isRegistering ? 'Register' : 'Login'}
            </Button>
            <Typography align="center">
              {isRegistering ? 'Already have an account? Login' : 'Don’t have an account? Create one'}
              <Button onClick={() => setIsRegistering(!isRegistering)} sx={{ ml: 1 }}>
                {isRegistering ? 'Login' : 'Register'}
              </Button>
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LoginPageWithOverview;
