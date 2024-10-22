import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGenres } from '../../redux/genreSlice'; // Import the async thunk for genres
import { fetchRhythms } from '../../redux/rhythmSlice'; // Import the async thunk for rhythms
import addSong from '../../redux/addAction';
import NavbarTop from '../Navbar/Navbar';
import axios from 'axios';

const AddSong = () => {
  const dispatch = useDispatch();
  const genres = useSelector((state) => state.genres);
  const rhythms = useSelector((state) => state.rhythms);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedRhythm, setSelectedRhythm] = useState('');
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [tone, setTone] = useState('C'); // Default tone
  const [lyrics, setLyrics] = useState('');

  useEffect(() => {
    dispatch(fetchGenres()); // Fetch genres when the component mounts
    dispatch(fetchRhythms()); // Fetch rhythms when the component mounts
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newSong = {
      title,
      artist,
      genre: selectedGenre,
      rhythm: selectedRhythm,
      tone,
      lyrics: [
        {
          verse: lyrics,
          chords: extractChords(lyrics),
        },
      ],
    };
    dispatch(addSong(newSong)); // Dispatch action to add song
  };

  const extractChords = (lyrics) => {
    const regex = /\[(.*?)\]/g;
    let matches = [];
    let match;
    while ((match = regex.exec(lyrics)) !== null) {
      matches.push(match[1]);
    }
    return matches;
  };

  return (
    <>
      <div className="top">
        <NavbarTop />
      </div>
      <div className="container">
        <h3>Thêm bài hát mới</h3>
        <form onSubmit={handleSubmit}>
          {/* Your form inputs remain unchanged */}
          <div className="row mb-3">
            <div className="col-12">
              <div className="form-group">
                <label htmlFor="title1">Tên bài hát (*)</label>
                <input
                  type="text"
                  name="title1"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-3">
              <div className="form-group">
                <label htmlFor="composer3">Tác giả</label>
                <input
                  type="text"
                  name="composer3"
                  className="form-control author"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Genre Selection */}
          <div className="row mb-3">
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="genre">Thể loại</label>
                <select
                  name="genre"
                  className="form-control"
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  required
                >
                  <option value="">Chọn thể loại</option>
                  {genres.map((genre) => (
                    <option key={genre._id} value={genre._id}>
                      {genre.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Rhythm Selection */}
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="rhythm">Điệu nhạc</label>
                <select
                  name="rhythm"
                  className="form-control"
                  value={selectedRhythm}
                  onChange={(e) => setSelectedRhythm(e.target.value)}
                  required
                >
                  <option value="">Chọn điệu nhạc</option>
                  {rhythms.map((rhythm) => (
                    <option key={rhythm._id} value={rhythm._id}>
                      {rhythm.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tone Selection */}
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="tone">Tone chủ bài hát</label>
                <select
                  name="tone"
                  className="form-control"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                >
                  <option value="C">C</option>
                  <option value="D">D</option>
                  <option value="E">E</option>
                  <option value="F">F</option>
                  <option value="G">G</option>
                </select>
              </div>
            </div>
          </div>

          {/* Lyrics Section */}
          <div className="form-group">
            <label htmlFor="lyrics">Lời và hợp âm (*)</label>
            <textarea
              rows="10"
              name="lyrics"
              id="lyrics"
              className="form-control"
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              required
            ></textarea>
            <small className="text-muted">
              Hợp âm phải bỏ trong dấu ngoặc vuông []. Thông tin ca sĩ thể hiện và link bài hát để ở dưới cùng.
            </small>
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary">
            Đăng bài
          </button>
        </form>
      </div>
    </>
  );
};

export default AddSong;
