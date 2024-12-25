import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import LyricsSong from './components/Lyrics/LyricsSong';
import AddSong from './components/AddNewSong/AddSong';
import ResetPassword from './components/Register/ResetPassword.jsx';
import Liked from './components/liked/Liked';
import { Provider } from 'react-redux';
import store from './redux/store';
import ListSong from './components/ListSong/ListSong';
import AdminHome from './adminRoute/AdminHome.jsx';
import PrivateRoute from './privateRoute.jsx';
import PostedSongs from './components/posted/Posted';
import Metronome from './components/Metronome/Metronome.jsx';
import RequestSongForm from './components/requestSong/RequestSongForm.jsx';
function App() {
  return (

    <Provider store={store}>
     
       <Router>
      <Routes>
     
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/chord/:id" element={<LyricsSong />} />
        <Route path="/add" element={<AddSong />} />
          <Route path="/liked" element={<Liked />} />
        <Route path="/list/genre/:genreId" element={<ListSong />} />
        <Route path="/list/rhythm/:rhythmId" element={<ListSong />} />
        <Route path="/list/artist/:artistName" element={<ListSong />} />
        <Route path="/search/:query" element={<ListSong />} />
        <Route path="/metronome" element={<Metronome/>} />
        <Route path="/request" element={<RequestSongForm/>} />
        <Route path="/posted" element={<PostedSongs/>} />
        <Route path="/metronome" element={<Metronome />} />
        <Route path="/restpassword" element={<ResetPassword />} />
        <Route path="/list/search/:query" element={<ListSong />} />
        {/* <Route path="/tuner" element={<Tuner />} /> */}
                {/* Các route admin chỉ cho phép admin truy cập */}
          <Route element={<PrivateRoute allowedRoles={['admin']} />}>
                   <Route path="/admin" element={<AdminHome/>} />
          </Route>
      </Routes>
    </Router>
    </Provider>
   
  );
}

export default App;
// AIzaSyA_Hv-f3rm9KdjV0nDegfPlWTlQWNpdyS8