import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import LyricsSong from './components/Lyrics/LyricsSong';
import AddSong from './components/AddNewSong/AddSong';
import Posted from './components/posted/Posted';
import Liked from './components/liked/Liked';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/chord" element={<LyricsSong />} />
        <Route path="/add" element={<AddSong />} />
        <Route path="/posted" element={<Posted />} />
        <Route path="/liked" element={<Liked />} />
        
      </Routes>
    </Router>
  );
}

export default App;
