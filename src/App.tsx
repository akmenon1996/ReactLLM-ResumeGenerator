import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPageWithOverview from './components/LoginPageWithOverview';
import CurrentProfile from './components/CurrentProfile';
import UpdateProfile from './components/UpdateProfile';
import ResumeGenerator from './components/ResumeGenerator';
import ViewResumes from './components/ViewResumes';
import Header from './components/Header';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [authChecked, setAuthChecked] = useState<boolean>(false);
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    // Check if the user is logged in from localStorage
    const username = localStorage.getItem('username');
    if (username) {
      setIsLoggedIn(true);
    }

    // Save the last visited route before refresh
    const lastRoute = window.location.pathname; // Get the current URL path
    localStorage.setItem('lastRoute', lastRoute); // Store it in localStorage
    setInitialRoute(lastRoute);

    setAuthChecked(true); // Ensure we signal the check has been performed
  }, []);

  const handleLogin = (username: string) => {
    localStorage.setItem('username', username);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('lastRoute');
    setIsLoggedIn(false);
  };

  // Show nothing (or a loading spinner) until authentication is checked
  if (!authChecked) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Header isLoggedIn={isLoggedIn} onSignOut={handleLogout} />
      <Routes>
        <Route
          path="/login"
          element={
            isLoggedIn ? <Navigate to={initialRoute || '/current-profile'} /> : <LoginPageWithOverview onLogin={handleLogin} />
          }
        />
        <Route
          path="/current-profile"
          element={isLoggedIn ? <CurrentProfile /> : <Navigate to="/login" />}
        />
        <Route
          path="/update-profile"
          element={isLoggedIn ? <UpdateProfile /> : <Navigate to="/login" />}
        />
        <Route
          path="/generate-resume"
          element={isLoggedIn ? <ResumeGenerator /> : <Navigate to="/login" />}
        />
        <Route
          path="/view-resumes"
          element={isLoggedIn ? <ViewResumes /> : <Navigate to="/login" />}
        />
        {/* Redirect to last visited page if logged in, or to login */}
        <Route
          path="*"
          element={<Navigate to={isLoggedIn ? (initialRoute || '/current-profile') : '/login'} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
