import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Login from './pages/Login'
import Register from './pages/Register'
import BrowseMeals from './pages/BrowseMeals'
import Donate from './pages/Donate';
import Home from './pages/Home'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import AdminDashboard from './pages/AdminDashboard'
import Chatbot from "./components/Chatbot"
import ChatbotProvider from './components/ChatbotProvider';
import './App.css';

function App() {
  return (
    <ChatbotProvider>
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browsemeals" element={<BrowseMeals />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/myprofile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
        <Footer />
      </div>
    </Router>

    <Chatbot />
    </ChatbotProvider>
  );
}

export default App;
