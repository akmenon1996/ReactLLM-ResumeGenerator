import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import AccountCircle from '@mui/icons-material/AccountCircle';

const Header: React.FC<{ onSignOut: () => void }> = ({ onSignOut }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    onSignOut();
    setAnchorEl(null);
    navigate('/');
  };

  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Resume Generator App
        </Typography>
        <Box>
          <Button color="inherit" component={Link} to="/current-profile">
            Current Profile
          </Button>
          <Button color="inherit" component={Link} to="/update-profile">
            Update Profile
          </Button>
          <Button color="inherit" component={Link} to="/generate-resume">
            Generate Resume
          </Button>
          <Button color="inherit" component={Link} to="/view-resumes">
            View Resumes
          </Button>

          <IconButton edge="end" aria-label="account" onClick={handleMenu} color="inherit">
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
