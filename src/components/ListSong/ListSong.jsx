import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSongsByGenre, fetchSongsByRhythm } from '../../redux/fecthListAction'; // Ensure the correct path
import './listsong.css';
import ListButton from "../ButtonGroup/ListButton";
import NavbarTop from '../Navbar/Navbar';
import { useParams } from 'react-router-dom';

const ListSong = ({ showNavbar = true }) => {
  const dispatch = useDispatch();
  const { songs, loading, error } = useSelector((state) => state.list); // Get the list of songs from Redux
  const { childTypeId, type } = useSelector((state) => state.types);
  // type == rhythm
  // type == category
  // Get genreId and rhythmId from URL params
  const [genre, setGenre] = useState({});

useEffect(() => {
  if (type === 'rhythm') {
    dispatch(fetchSongsByRhythm(childTypeId));
     // Use template literals for dynamic URL
  } else if (type === 'genre') {
    dispatch(fetchSongsByGenre(childTypeId));
  // Use template literals for dynamic URL
  }
}, [dispatch, childTypeId, type]); 
 
  return (
    <>
      {showNavbar && <div className="top"><NavbarTop /></div>}
      <div className="list_song">
        <div className="row p-right">
          <div className="col-lg-12">
            <h1 className="h4">{`Danh sách bài hát thuộc thể loại ${genre.name || ''}`}</h1>
            <div style={{ background: '#eee', border: 0, height: '1px', margin: '10px 0' }}></div>
          </div>
          <div className="col-md-6 col-sm-6">
            {loading ? (
              <p>Đang tải...</p>
            ) : error ? (
              <p>Lỗi: {error.message}</p>
            ) : (
              <p className="float-left font-weight-bold">Có {songs.length} bài hát</p>
            )}
          </div>
          <div className="col-md-6 col-sm-6">
            <div className="float-right">
              {/* Action buttons */}
              <a href="#" className="badge badge-primary">Mới nhất</a>
              <a href="#" className="badge badge-secondary">Xem nhiều</a>
              <a href="#" className="badge badge-secondary">A-Z</a>
              <a href="#" className="badge badge-secondary">Z-A</a>
              <a href="#" className="badge badge-secondary">Đang hot</a>
            </div>
          </div>
        </div>
        <div className="col-12">
          {songs.map((song) => (
            <div key={song._id}> {/* Using _id as the key */}
              <h5>
                <i className="fas fa-guitar fa-fw"></i>
                <a href={`/chord/${song._id}`}>{song.title}</a> {/* Link to the song page */}
                <small>&nbsp;<i className="fas fa-user"></i> Sáng tác: <a href={`/composer/${song.artist}`}>{song.artist}</a></small>
              </h5>
              <em>
                {/* Display intro if available */}
                {song.lyrics.length > 0 && (
                  (() => {
                    const lines = song.lyrics[0].verse.split('\n'); // Tách lời bài hát theo các dòng
                    const firstTwoLines = lines.slice(0, 1); // Lấy 2 dòng đầu tiên
                    const restOfLines = lines.slice(2); // Lấy các dòng còn lại từ dòng thứ 3 trở đi
                    return `${firstTwoLines.join(' ')} \n ${restOfLines.join(' ')}`;
                  })()
                )}
              </em>
              <br />
              {/* Display additional song details */}
              <small>
                <span className="text-muted">Ca sĩ thể hiện: </span>
                <em><a href={`/singer/${song.singerId}`} className="csinger">{song.singer}</a></em>
              </small>
              {/* Display genre */}
              <a href={`/category/${song.genre._id}`}><span className="float-right text-muted small">{song.genre.name}</span></a>
              <div className="clearfix"></div>
              <div style={{ backgroundColor: '#eee', border: 'none', height: '1px', margin: '10px 0' }}></div>
            </div>
          ))}
        </div>
        <ListButton />
      </div>
    </>
  );
}

export default ListSong;
