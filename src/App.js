import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Components/pages/home';
import Auth from './Components/auth';
import Dashboard from './Components/pages/dashboard';
import Scan from './Components/pages/demo';
import Profile from './Components/pages/profiles';
import SideBar from './Components/pages/sidebar';
import Notification from './Components/pages/Notification';
import AdminDashboard from './Components/Admin/Admin';
import Resume from './Components/resume';
import RankTable from './Components/Admin/RankTable';
import Allowed from './Components/Admin/Allowed';
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn');
    setIsLoggedIn(loggedInStatus === 'true');
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/login" element={<Auth setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/signup" element={<Auth setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/demo" element={<Scan />} />
        <Route path="/Profile" element={<Profile/>} />
        <Route path="sidebar" element={<SideBar />} />
        <Route path="/home" element={<Home />} />
        <Route path="/Notification" element={<Notification />} />
        <Route path="/Admin" element={<AdminDashboard />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/RankTable" element={<RankTable />} />
        <Route path="/Allowed" element={<Allowed />} />
      </Routes>
    </Router>
  );
}

export default App;