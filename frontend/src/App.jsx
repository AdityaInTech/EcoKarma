import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import your pages
import Home from './pages/Home';
import ActionHub from './pages/ActionHub';
import CommunitySOS from './pages/CommunitySOS';
import Perks from './pages/Perks';
import AboutUs from './pages/AboutUs';
import Profile from './pages/Profile';
import Auth from './pages/Auth'; // <-- ADDED: Your new Login/Signup page

// Import the "Bouncer" component
import ProtectedRoute from './components/ProtectedRoute'; // <-- ADDED: The security wrapper

function App() {
  return (
    <Routes>
      
      {/* =========================================
          PUBLIC ROUTES (Anyone can see these!) 
      ========================================= */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/auth" element={<Auth />} />

      {/* =========================================
          PROTECTED ROUTES (Must be logged in!) 
      ========================================= */}
      <Route element={<ProtectedRoute />}>
        {/* Ensure this path is strictly lowercase */}
        <Route path="/action-hub" element={<ActionHub />} />
        <Route path="/sos" element={<CommunitySOS />} />
        <Route path="/perks" element={<Perks />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

    </Routes>
  );
}

export default App;