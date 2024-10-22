import React, { useEffect, useState } from 'react';
import NavbarTop from '../Navbar/Navbar';
import './lyricsSong.css';
import ToolBar from '../ToolBar/ToolBar';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchSongById } from '../../redux/fetchSongAction';
import transposeChords, { transposeNote } from './transposeChords'; // Import hàm chuyển đổi tone

const LyricsSong = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { loading, error, songData } = useSelector(state => state.song);

  const [semitones, setSemitones] = useState(0); // State để lưu số bán âm thay đổi

  useEffect(() => {
    dispatch(fetchSongById(id));
  }, [dispatch, id]);

  const renderLyrics = (lyrics) => {
    const transposedLyrics = transposeChords(lyrics, semitones); // Chuyển đổi hợp âm theo số bán âm

    return transposedLyrics.map((line, index) => {
      const lines = line.verse.split("\n");

      return (
        <div key={index}>
          {lines.map((sentence, i) => {
            const wordsWithChords = sentence.split(/(\[.*?\])/g);

            return (
              <p key={i}>
                {wordsWithChords.map((word, j) => {
                  if (word.startsWith('[') && word.endsWith(']')) {
                    return (
                      <span key={j} className="chord" style={{ color: 'blue', fontWeight: 'bold' }}>
                        {word}
                      </span>
                    );
                  }
                  return <span key={j}>{word}</span>;
                })}
              </p>
            );
          })}
        </div>
      );
    });
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error.message || 'An error occurred while fetching the song.'}</div>;
  }

  if (!songData || !songData.song) {
    return <div className="error">Song not found or unavailable.</div>;
  }

  const transposeTone = (tone) => {
    const transposedChord = transposeNote(tone, semitones);
    return transposedChord; // Return without brackets
  };

  const startScroll = () => {
    // Your scroll logic here
  };

  const stopScroll = () => {
    // Your stop logic here
  };

  return (
    <>
      <div className="top">
        <NavbarTop />
      </div>

      <div className="center">
        <div className="row">
          <div className="row_right">
            <div className="ibar mt-2" id="19770">
              <div>
                <h1 className="h3 d-inline-block">{songData.song.title}</h1>
                <div className="d-inline-block float-right">
                  <a href="#" className="badge badge-pill badge-success likes" id="like">
                    <i className="far fa-star"></i> Thích
                  </a>
                </div>
              </div>
              <i title="Sáng tác" className="fas fa-leaf"></i> Sáng tác: <a href="https://hopamviet.vn/chord/composer/553/ngoc-bich.html">Ngọc Bích</a> | 
              <i className="fas fa-book"></i> <a href="https://hopamviet.vn/chord/category/2/nhac-tru-tinh.html">Nhạc Trữ tình</a> | 
              Điệu: <a>Blues</a> | 
              <i title="Người đăng" className="fas fa-user"></i> <a href="https://hopamviet.vn/user/3/kynguyen65">kynguyen65</a> | 
              <i title="Lượt xem" className="fas fa-eye">10000</i>
            </div>

            <div className="toolbar">
              <div id="toolbar" className="btn-toolbar">
                <div className="btn-group mr-1">
                  <span className="btn btn-outline-secondary btn-sm" onClick={() => setSemitones(semitones - 1)} data-original-title="Giảm tone">b</span>
                  <span className="btn btn-outline-secondary btn-sm disabled" ><span className="chord">[{transposeTone(songData.song.tone)}]</span></span>
                  <span className="btn btn-outline-secondary btn-sm" onClick={() => setSemitones(semitones + 1)} data-original-title="Tăng tone">#</span>
                </div>
                <div className="btn-group mr-1">
                  <span className="btn btn-outline-secondary btn-sm" onClick={startScroll} data-original-title="Tăng cuộn trang"><i className="fas fa-arrow-down"></i></span>
                  <span className="btn btn-outline-secondary btn-sm" onClick={stopScroll} data-original-title="Giảm cuộn trang"><i className="fas fa-arrow-up"></i></span>
                </div>
                <div className="btn-group mr-1">
                  <span id="fontsize" className="btn btn-outline-secondary btn-sm" data-original-title="Cỡ chữ"><i className="fas fa-font fa-1x"></i></span>
                  <a href="https://hopamviet.vn/chord/printsong/19770" className="btn btn-outline-secondary btn-sm" data-original-title="In">In</a>
                  <a href="https://hopamviet.vn/chord/export/19770" className="btn btn-outline-secondary btn-sm" data-original-title="Xuất">Xuất</a>
                </div>
              </div>
            </div>

            <div className="lyric-content">
              <div className="lyric-box">
                {renderLyrics(songData.song.lyrics)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LyricsSong;
