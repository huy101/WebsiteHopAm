import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import  addSong from "../redux/addAction";  
import { fetchRequestById } from "../redux/requestSongSlice";
import { TextField, Button, FormControlLabel, Checkbox, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { fetchGenres } from '../redux/genreSlice';
import { fetchRhythms } from '../redux/rhythmSlice';
import {createSongFromRequest} from '../redux/requestSongSlice'
const CreateSong = ({ itemId, closeModal }) => {  const extractChords = (lyrics) => {
  const regex = /\[(.*?)\]/g;
  let matches = [];
  let match;
  while ((match = regex.exec(lyrics)) !== null) {
    matches.push(match[1]);
  }
  return matches;
};
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    videoId: "",
    tone: "",
    genreId: "",
    rhythmId: "",
    lyrics: [{ verse: "", chords: [] }],  // Initialize with the new structure
    status: false,
  });
  const { selectedRequest } = useSelector((state) => state.songRequest);
  const genres = useSelector((state) => state.genres);
  const rhythms = useSelector((state) => state.rhythms);

  useEffect(() => {
    if (itemId) {
      dispatch(fetchRequestById(itemId));  // Fetch song details to pre-fill the form
      dispatch(fetchGenres());
      dispatch(fetchRhythms());
    }
  }, [itemId, dispatch]);

  // Pre-fill form data if selectedRequest is available
  useEffect(() => {
    if (selectedRequest && selectedRequest.title) {
      setFormData({
        title: selectedRequest.title || "",
        artist: selectedRequest.artist || "",
        videoId: selectedRequest.videoId || "",
        tone: selectedRequest.tone || "",
        genreId: selectedRequest.genre ? selectedRequest.genre._id : "",
        rhythmId: selectedRequest.rhythm ? selectedRequest.rhythm._id : "",
        lyrics: selectedRequest.lyrics?.map((lyric) => ({
          verse: lyric.verse || "",
          chords: lyric.chords || [],
        })) || [{ verse: "", chords: [] }],
        status: selectedRequest.status || false,
      });
    }
  }, [selectedRequest]);

 

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('lyrics')) {
      // Update specific lyric verse
      const index = parseInt(name.split('-')[1], 10); // Get the lyric index
      setFormData((prev) => {
        const updatedLyrics = [...prev.lyrics];
        updatedLyrics[index] = { ...updatedLyrics[index], verse: value, chords: extractChords(value) };
        return { ...prev, lyrics: updatedLyrics };
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedRequest) {
      dispatch(
        createSongFromRequest({
          requestId: itemId,
          data: { ...formData, userId: selectedRequest.userId },
        })
      ).then(() => {
        closeModal(); // Close the modal on success
      });
    }
  };
  

  return (
      <form onSubmit={handleSubmit}>
        <TextField label="Title" name="title" value={formData.title} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Artist" name="artist" value={formData.artist} onChange={handleChange} fullWidth margin="normal" />
  
        <FormControl fullWidth margin="normal">
          <InputLabel>Tone</InputLabel>
          <Select name="tone" value={formData.tone} onChange={handleChange}>
            {["C", "D", "E", "F", "G", "A", "B", "Cm", "Dm", "Em", "Fm", "Gm", "Am", "Bm"].map((toneOption) => (
              <MenuItem key={toneOption} value={toneOption}>
                {toneOption}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
  
        <FormControl fullWidth margin="normal">
          <InputLabel>Genre</InputLabel>
          <Select name="genreId" value={formData.genreId} onChange={handleChange}>
            {genres?.map((genre) => (
              <MenuItem key={genre._id} value={genre._id}>
                {genre.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
  
        <FormControl fullWidth margin="normal">
          <InputLabel>Rhythm</InputLabel>
          <Select name="rhythmId" value={formData.rhythmId || ""} onChange={handleChange}>
            <MenuItem value="">Select Rhythm</MenuItem>
            {rhythms?.map((rhythm) => (
              <MenuItem key={rhythm._id} value={rhythm._id}>
                {rhythm.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
  
        <TextField label="Video ID" name="videoId" value={formData.videoId} onChange={handleChange} fullWidth margin="normal" />
        
        {formData.lyrics.map((lyric, index) => (
          <TextField
            key={index}
            label={`Lyrics ${index + 1}`}
            name={`lyrics-${index}`}
            value={lyric.verse}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            minRows={2}
            maxRows={10}
          />
        ))}
        
        <FormControlLabel control={<Checkbox name="status" checked={formData.status} onChange={handleChange} />} label="Approval" />
        <Button variant="contained" color="primary" type="submit">
          Save
        </Button>
      </form>
    );
  };

export default CreateSong;
