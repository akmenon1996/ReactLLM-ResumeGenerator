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

  useEffect(() => {
    const username = localStorage.getItem('username');
    if (username) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (username: string) => {
    localStorage.setItem('username', username);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <Header onSignOut={handleLogout} />
      <Routes>
        <Route
          path="/login"
          element={<LoginPageWithOverview onLogin={(username: string) => handleLogin(username)} />}
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
        <Route path="*" element={<Navigate to={isLoggedIn ? "/current-profile" : "/login"} />} />
      </Routes>
    </Router>
  );
};

export default App;
