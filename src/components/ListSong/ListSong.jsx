import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchSongsByGenre,
    fetchSongsByRhythm,
    fetchSongsByArtist,
    fetchRecentSongs,
    searchSongs
} from "../../redux/fecthListAction";
import { fetchGenres } from "../../redux/genreSlice";
import { fetchRhythms } from "../../redux/rhythmSlice";
import "./listsong.css";
import Footer from "../Home/Footer";
import Pagination from "../Pagination/Pagination";
import NavbarTop from "../Navbar/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import { setType } from "../../redux/types";
import {
    List,
    ListItemText,
    Divider,
    Typography,
    Paper,
    CircularProgress,
    Alert,    AlertTitle
} from "@mui/material";
import note from "../../assets/note.png";
const ListSong = ({ showNavbar = true,showFooter=true,typeH  }) => {
    const dispatch = useDispatch();
    const { songs, loading, error,searchSongs,recent } = useSelector((state) => state.list);
    const { childTypeId, type: currentType } = useSelector((state) => state.types);
    const rhythm = useSelector((state) => state.rhythms || []);
    const genre = useSelector((state) => state.genres || []);

    const { genreId, rhythmId, artistName,type, query } = useParams();
    const [displayLabel, setDisplayLabel] = useState("");
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(0);
    const [songsPerPage, setSongsPerPage] = useState(5);

    // Determine the slice of songs to display
    const indexOfLastSong = (currentPage + 1) * songsPerPage;
    const indexOfFirstSong = indexOfLastSong - songsPerPage;
    const currentSongs = (typeH === 'recent' ? (recent && recent.length > 0 ? recent : []) :
    (songs && songs.length > 0 ? songs : (Array.isArray(searchSongs) ? searchSongs : []))
).slice(indexOfFirstSong, indexOfLastSong);



    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        
        if (typeH === "recent") {
            setDisplayLabel("mới");
            console.log("fetch recent songs");
            dispatch(fetchRecentSongs());
        } else if (currentType === "artist" && artistName) {
            setDisplayLabel(`của ${artistName}`);
            dispatch(fetchSongsByArtist(artistName));
        } else if (currentType === "rhythm" && childTypeId) {
            const rhythmName = rhythm.find((r) => r._id === childTypeId)?.name || "";
            setDisplayLabel(`điệu ${rhythmName}`);
            dispatch(fetchSongsByRhythm(childTypeId));
        } else if (currentType === "genre" && childTypeId) {
            const genreName = genre.find((g) => g._id === childTypeId)?.name || "";
            setDisplayLabel(`thể loại ${genreName}`);
            dispatch(fetchSongsByGenre(childTypeId));
        } else if (rhythmId) {
            const rhythmName = rhythm.find((r) => r._id === rhythmId)?.name || "";
            setDisplayLabel(`điệu ${rhythmName}`);
            dispatch(fetchSongsByRhythm(rhythmId));
        } else if (genreId) {
            const genreName = genre.find((g) => g._id === genreId)?.name || "";
            setDisplayLabel(genreName);
            dispatch(fetchSongsByGenre(genreId));
        }
        if (type==='search' && query) {
            dispatch(searchSongs());
        }
    }, [dispatch, artistName, childTypeId, type, rhythmId, genreId, genre, rhythm,query]);

    const handleClick = (id) => {
        navigate(`/chord/${id}`);
    };

    return (
        <>
            {showNavbar && (
                <div className="top">
                    <NavbarTop />
                </div>
            )}
            <div
                className="center"
                style={{ marginTop: "20px", display: "flex", flexDirection: "column" }}
            >
                <Typography variant="h4">{`Danh sách bài hát ${displayLabel}`}</Typography>
            </div>
            {!loading && !error && (
                <List
                    sx={{
                        width: "100%",
                        maxWidth: "100%",
                        bgcolor: "background.paper",
                    }}
                >
                    {currentSongs.map((song) => (
                        <div key={song._id}>
                            <Paper
                                onClick={() => handleClick(song._id)}
                                alignItems="flex-start"
                                sx={{ paddingLeft: "16px",
                                    "&:hover": {
                                        background: "#dee2e6",
                                        cursor: "pointer",
                                    },
                                }}
                            >
                                <ListItemText
                                    img={note}
                                    primary={
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                color: "primary.main",
                                                textDecoration: "none",
                                                fontWeight: "bold",
                                                fontSize: "21px",
                                            }}
                                        >
                                            <img
                                                src={note}
                                                alt=""
                                                style={{ width: "20px", height: "20px" }}
                                            />
                                            {song.title}
                                        </Typography>
                                    }
                                    secondary={
                                        <React.Fragment>
                                            <Typography
                                                component="span"
                                                variant="body2"
                                                sx={{
                                                    color: "text.primary",
                                                    display: "inline",
                                                }}
                                            >
                                                {song.artist}
                                            </Typography>
                                            <br />
                                            {song.lyrics.length > 0
                                                ? song.lyrics[0].verse
                                                      .split("\n")
                                                      .slice(0, 5)
                                                      .join(" ")
                                                : ""}
                                        </React.Fragment>
                                    }
                                />
                            </Paper>
                        </div>
                    ))}
                </List>
            )}
            {!loading && !error && (
                <Pagination
                    songsPerPage={songsPerPage}
                    totalSongs={songs.length}
                    paginate={paginate}
                    currentPage={currentPage}
                />
            )}
             {showNavbar && (
                <div className="bottom">
                    <Footer />
                </div>
            )}
        </>
    );
};

export default ListSong;
