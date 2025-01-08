import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
    fetchSongsByGenre,
    fetchSongsByRhythm,
    fetchSongsByArtist,
    fetchRecentSongs,
    fetchPopularSongs,
} from "../../redux/fecthListAction";
import { Box, List, ListItemText, Typography, Paper, Alert } from "@mui/material";
import NavbarTop from "../Navbar/Navbar";
import Footer from "../Home/Footer";
import Pagination from "../Pagination/Pagination";
import note from "../../assets/note.png";
import PopularSongs from "./Popular";

const ListSong = ({ showNavbar = true, showFooter = true, typeH }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { songs = [], loading, error, searchSongs = [], recent = [] } = useSelector((state) => state.list);
    const { childTypeId, type: currentType } = useSelector((state) => state.types);
    const rhythm = useSelector((state) => state.rhythms || []);
    const genre = useSelector((state) => state.genres || []);
    const { genreId, rhythmId, artistName, query } = useParams();

    const [displayLabel, setDisplayLabel] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [songsPerPage] = useState(3);

    const indexOfLastSong = (currentPage + 1) * songsPerPage;
    const indexOfFirstSong = indexOfLastSong - songsPerPage;

    // Handle homepage display (popular and recent)
    useEffect(() => {
        if (!query && !genreId && !rhythmId && !artistName && !childTypeId) {
            dispatch(fetchRecentSongs());
            dispatch(fetchPopularSongs());
            setDisplayLabel("mới");
        }
    }, [dispatch, query, genreId, rhythmId, artistName, childTypeId]);

    // Handle search results
    useEffect(() => {
        if (query) {
            setDisplayLabel(`tìm kiếm "${query}"`);
        }
    }, [query]);

    // Handle genre filter
    useEffect(() => {
        if (genreId || (currentType === "genre" && childTypeId)) {
            const targetId = genreId || childTypeId;
            const genreName = genre.find((g) => g._id === targetId)?.name || "";
            setDisplayLabel(`thể loại ${genreName}`);
            dispatch(fetchSongsByGenre(targetId));
        }
    }, [dispatch, genreId, currentType, childTypeId, genre]);

    // Handle rhythm filter
    useEffect(() => {
        if (rhythmId || (currentType === "rhythm" && childTypeId)) {
            const targetId = rhythmId || childTypeId;
            const rhythmName = rhythm.find((r) => r._id === targetId)?.name || "";
            setDisplayLabel(`điệu ${rhythmName}`);
            dispatch(fetchSongsByRhythm(targetId));
        }
    }, [dispatch, rhythmId, currentType, childTypeId, rhythm]);

    // Handle artist filter
    useEffect(() => {
        if (artistName) {
            setDisplayLabel(`của ${artistName}`);
            dispatch(fetchSongsByArtist(artistName));
        }
    }, [dispatch, artistName]);

    const handleClick = (id) => navigate(`/chord/${id}`);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Determine which songs to display with null checks
    const getSongsToDisplay = () => {
        if (query) return searchSongs || [];
        if (genreId || rhythmId || artistName || childTypeId) return songs || [];
        return recent || [];
    };

    const songsToDisplay = getSongsToDisplay();
    const currentSongs = songsToDisplay.slice(indexOfFirstSong, indexOfLastSong);

    return (
        <>
            {showNavbar && <NavbarTop />}
            
            <Box sx={{ 
                display: "flex", 
                padding: "2rem 10rem",
                gap: "2rem",
                minHeight: "100vh"
            }}>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="h4" sx={{ marginBottom: "1.5rem" }}>
                        {`Danh sách bài hát ${displayLabel}`}
                    </Typography>

                    {loading && (
                        <Alert severity="info">Đang tải dữ liệu...</Alert>
                    )}

                    {!loading && !error && currentSongs.length > 0 && (
                        <List>
                            {currentSongs.map((song) => (
                                <Paper
                                    key={song._id}
                                    onClick={() => handleClick(song._id)}
                                    sx={{
                                        padding: "1rem",
                                        marginBottom: "1rem",
                                        transition: "background-color 0.2s",
                                        "&:hover": {
                                            backgroundColor: "#dee2e6",
                                            cursor: "pointer",
                                        },
                                    }}
                                >
                                    <ListItemText
                                        primary={
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "0.5rem",
                                                    color: "primary.main",
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
                                            <>
                                                <Typography variant="body2" color="text.primary">
                                                    {Array.isArray(song.artist)
                                                        ? song.artist.map(artist => artist.name).join(", ")
                                                        : "Unknown Artist"}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        display: "-webkit-box",
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: "vertical",
                                                    }}
                                                >
                                                    {song.lyrics?.[0]?.verse
                                                        ?.split("\n")
                                                        ?.slice(0, 5)
                                                        ?.join(" ") || ""}
                                                </Typography>
                                            </>
                                        }
                                    />
                                </Paper>
                            ))}
                        </List>
                    )}

                    {!loading && currentSongs.length === 0 && (
                        <Alert severity="info" sx={{ marginY: 2 }}>
                            Không tìm thấy bài hát nào phù hợp với yêu cầu.
                        </Alert>
                    )}

                    {!loading && error && (
                        <Alert severity="error" sx={{ marginY: 2 }}>
                            Đã xảy ra lỗi khi tải dữ liệu!
                        </Alert>
                    )}

                    {!loading && songsToDisplay.length > 0 && (
                        <Pagination
                            songsPerPage={songsPerPage}
                            totalSongs={songsToDisplay.length}
                            paginate={paginate}
                            currentPage={currentPage}
                        />
                    )}
                </Box>

                <Box sx={{ width: "30%" }}>
                    <PopularSongs />
                </Box>
            </Box>

            {showFooter && <Footer />}
        </>
    );
};

export default ListSong;