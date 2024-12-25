import React, { useEffect, useState } from "react";
import Video from "./Video";
import NavbarTop from "../Navbar/Navbar";
import Visibility from "@mui/icons-material/Visibility";
import "./lyricsSong.css";
import { fetchRhythms } from "../../redux/rhythmSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchSongById } from "../../redux/fetchSongAction";
import transposeChords, { transposeNote } from "./transposeChords"; // Import hàm chuyển đổi tone
import CommentSection from "../comments/WriteComment";
import { fetchSongsByArtist } from "../../redux/fecthListAction";
import { setType } from "../../redux/types";
import { toggleFavorite, checkFavorite } from "../../redux/favoriteSlice";
import {
    Button,
    IconButton,
    Typography,
    Container,
    Box,
    AppBar,
    Toolbar,
    ButtonGroup,
    AlertTitle,
    Alert,
    CircularProgress,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import Footer from "../Home/Footer";
const LyricsSong = () => {
    // const [scrollIntervalId, setScrollIntervalId] = useState(0);
    const [semitones, setSemitones] = useState(0); // State để lưu số bán âm thay đổi
    const [hoveredChord, setHoveredChord] = useState(""); // State để lưu hợp âm đang được hover
    const [chordImageIndex, setChordImageIndex] = useState(1);
    const dispatch = useDispatch();
    const { id } = useParams();
    const { artist } = useParams();
    const { loading, error, songData } = useSelector((state) => state.song);
    const rhythm = useSelector((state) => state.rhythms);
    const [hoveredChordIndex, setHoveredChordIndex] = useState(null); // Lưu index của hợp âm đang hover
    const { token } = useSelector((state) => state.auth);
    const favoriteSongs = useSelector((state) => state.favorites.favoriteSongs);
    const [chordsInLyrics, setChordsInLyrics] = useState([]);
    const liked = favoriteSongs[id] || false;
    const navigate = useNavigate();
    const chordImages = {
        Bm: ["/img/Bm/Bm1.png"],
        C: ["/img/C/C1.png", "/img/C/C2.png", "/img/C/C3.png"],
        D: ["/img/D/D1.png", "/img/D/D2.png", "/img/D/D3.png"],
        E: ["/img/E/E1.png", "/img/E/E2.png", "/img/E/E3.png"],
        F: ["/img/F/F1.png"],
        G: ["/img/G/G1.png", "/img/G/G2.png"],
        A: ["/img/A/A1.png", "/img/A/A2.png"],
        Em: ["/img/Em/Em1.png", "/img/Em/Em2.png", "/img/Em/Em3.png"],
        Cm: ["/img/Cm/Cm1.png", "/img/Cm/Cm2.png"],
        Dm: ["/img/Dm/Dm1.png", "/img/Dm/Dm2.png"],
        Am: ["/img/Am/Am1.png", "/img/Am/Am2.png"],
        Bm: ["/img/Bm/Bm1.png"],
        Gm: ["/img/Gm/Gm1.png"],
        "C#m": ["/img/Dbm/Dbm.png"],
        "D#m": ["/img/D#m/D#m.png"],
        "F#m": ["/img/Gbm/Gbm.png"],
        Fm: ["/img/Fm/Fm1.png"],
        "G#m": ["/img/G#m/G#m.png"],
        "A#m": ["/img/A#m/A#m.png"],

        A7: ["/img/A/A7.png"],
        D7: ["/img/D/D7.png"],
        Fm: ["/img/Fm/Fm1.png"],
    };
    const chordSounds = {
        C: ["/Audio/C.wav"],
        Cm: ["/Audio/Cm.wav"],
        C7: ["/Audio/C7.wav"],
        Cm7: ["/Audio/Cm7.wav"],

        D: ["/Audio/D.wav"],
        Dm: ["/Audio/Dm.wav"],
        D7: ["/Audio/D7.wav"],
        Dm7: ["/Audio/Dm7.wav"],

        E: ["/Audio/E.wav"],
        Em: ["/Audio/Em.wav"],
        E7: ["/Audio/E7.wav"],
        Em7: ["/Audio/Em7.wav"],

        F: ["/Audio/F.wav"],
        Fm: ["/Audio/Fm.wav"],
        F7: ["/Audio/F7.wav"],
        Fm7: ["/Audio/Fm7.wav"],

        G: ["/Audio/G.wav"],
        Gm: ["/Audio/Gm.wav"],
        G7: ["/Audio/G7.wav"],
        Gm7: ["/Audio/Gm7.wav"],

        A: ["/Audio/A.wav"],
        Am: ["/Audio/Am.wav"],
        A7: ["/Audio/A7.wav"],
        Am7: ["/Audio/Am7.wav"],

        B: ["/Audio/B.wav"],
        Bm: ["/Audio/Bm.wav"],
        B7: ["/Audio/B7.wav"],
        Bm7: ["/Audio/Bm7.wav"],

        // Hợp âm nâng cao (thêm nếu cần)
        Cmaj7: ["/Audio/Cmaj7.wav"],
        Dmaj7: ["/Audio/Dmaj7.wav"],
        Emaj7: ["/Audio/Emaj7.wav"],
        Fmaj7: ["/Audio/Fmaj7.wav"],
        Gmaj7: ["/Audio/Gmaj7.wav"],
        Amaj7: ["/Audio/Amaj7.wav"],
        Bmaj7: ["/Audio/Bmaj7.wav"],
    };

    const { childTypeId, type } = useSelector((state) => state.types);
    const [displayLabel, setDisplayLabel] = useState("");
    const handleNextChordImage = () => {
        setChordImageIndex((prevIndex) => (prevIndex % chordImages[hoveredChord].length) + 1);
    };

    const userId = localStorage.getItem("userId");

    useEffect(() => {
        if (!songData || !songData.song || songData.song._id !== id) {
            dispatch(fetchSongById(id));

            if (userId && id) {
                dispatch(checkFavorite({ userId, songId: id }));
            }
        }
    }, [dispatch, userId, id]);

    const handleLikeClick = () => {
        if (token) {
            dispatch(toggleFavorite({ userId, songId: id, liked }));
        }
    };

    const handleArtist = (artist) => {
        dispatch(
            setType({
                childTypeId: artist,
                type: "artist",
            })
        );
        navigate(`/list/artist/${artist}`);
    };
    // Biến lưu trạng thái
    // Biến lưu trạng thái
    let scrollSpeed = 1; // Initial speed
    let scrollIntervalId = null; // Current scroll interval
    let stopIntervalId = null; // Current deceleration interval

    // Function to start scrolling
    const startScroll = () => {
        // Increase scroll speed each time the button is pressed
        scrollSpeed += 1;

        // Clear the old scroll interval if it exists
        if (scrollIntervalId) {
            clearInterval(scrollIntervalId);
            scrollIntervalId = null;
        }

        // Calculate the new scroll interval time
        const intervalTime = Math.max(150 - scrollSpeed * 10, 20); // Minimum limit of 20ms

        // Create a new interval for scrolling
        scrollIntervalId = setInterval(() => {
            window.scrollBy(0, scrollSpeed);
        }, intervalTime);

        console.log(`Scroll speed: ${scrollSpeed}, Interval time: ${intervalTime}ms`);
    };

    // Function to stop scrolling
    const stopScroll = () => {
        // Clear the scroll interval if it's running
        if (scrollIntervalId) {
            clearInterval(scrollIntervalId);
            scrollIntervalId = null;
        }

        // Clear the deceleration interval if it exists
        if (stopIntervalId) {
            clearInterval(stopIntervalId);
            stopIntervalId = null;
        }

        // Create a new interval for deceleration
        stopIntervalId = setInterval(() => {
            if (scrollSpeed > 0) {
                scrollSpeed -= 1; // Decrease speed step by step
                console.log(`Decreasing speed: ${scrollSpeed}`);

                // When speed reaches 0, stop completely
                if (scrollSpeed === 0) {
                    clearInterval(stopIntervalId); // Clear the deceleration interval
                    stopIntervalId = null;
                    console.log("Scrolling has completely stopped.");
                }
            }
        }, 100); // Decrease speed every 100ms
    };

    // New function to decrease scroll speed step by step
    const decreaseScrollSpeed = () => {
        if (scrollSpeed > 0) {
            scrollSpeed -= 1; // Decrease speed step by step
            console.log(`Decreasing speed: ${scrollSpeed}`);
        }
    };

    const chordsSet = new Set();

    console.log(chordsSet);
    const renderChordList = () => {
        // Chuyển đổi Set thành mảng và sử dụng .map() để hiển thị danh sách hợp âm
        const chordList = Array.from(chordsSet);

        return (
            <div>
                <hr
  style={{
    marginTop: "1rem",
    marginBottom: "1rem",
    border: 0,
    borderTop: "1px solid rgba(0, 0, 0, 0.1)"
  }}
/>

             <Typography variant="h6" >
                         Danh sách hợp âm
                       </Typography>
                <div
                    style={{
                        display: "flex",
                        alignItems: "flex-start",
                        flexWrap: "wrap",
                        flexDirection: "row",
                        gap: "10px",
                    }}
                >
                    {chordList.map((chord, index) => (
                        <div key={index}>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    flexDirection: "column",
                                }}
                            >
                                {/* Hiển thị tên hợp âm */}
                                <span style={{ marginRight: "10px", fontWeight: "bold" }}>
                                    {chord}
                                </span>

                                {/* Kiểm tra xem có hình ảnh của hợp âm không và hiển thị */}
                                {chordImages[chord] && (<Box sx={{ width: "140px", // Điều chỉnh kích thước ảnh hợp lý
                                            height: "120px",
                                           
                                            zIndex: 2,}}>
                                  <img
                                        src={chordImages[chord]?.[chordImageIndex - 1]}
                                        alt={`Chord ${chord}`}
                                        style={{
                                          height: "100%",
                                          width: "100%",
                                          objectFit: "cover",
                                        }}
                                    />
                                </Box>
                                   
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderLyrics = (lyrics) => {
        const transposedLyrics = transposeChords(lyrics, semitones);

        return transposedLyrics.map((line, index) => {
            const lines = line.verse.split("\n");

            return (
                <div key={index}>
                    {lines.map((sentence, i) => {
                        const wordsWithChords = sentence.split(/(\[.*?\])/g);

                        return (
                            <Typography key={i} variant="body1" paragraph>
                                {wordsWithChords.map((word, j) => {
                                    if (word.startsWith("[") && word.endsWith("]")) {
                                        const chord = word.slice(1, -1);

                                        if (!chordsSet.has(chord)) {
                                            chordsSet.add(chord); // Thêm hợp âm vào Set nếu chưa có
                                        }
                                        return (
                                            <span
                                                key={j}
                                                className="chord"
                                                style={{
                                                    color: "#df495b",
                                                    fontWeight: "bold",
                                                    position: "relative",
                                                    cursor: "pointer",
                                                    display: "inline-block",
                                                }}
                                                onMouseEnter={() => {
                                                    setHoveredChordIndex({
                                                        chord,
                                                        index: `${index}-${i}-${j}`,
                                                    });
                                                    setHoveredChord(chord);
                                                }}
                                                onMouseLeave={() => setHoveredChordIndex(null)}
                                            >
                                                {word}
                                                {hoveredChordIndex &&
                                                    hoveredChordIndex.chord === chord &&
                                                    hoveredChordIndex.index ===
                                                        `${index}-${i}-${j}` &&
                                                    chordImages[chord] && (
                                                        <Box
                                                            sx={{
                                                                background: "#fff",
                                                                width: "150px",
                                                                height: "150px",
                                                                border: "1px solid #ccc",
                                                                textAlign: "center",
                                                                position: "absolute",
                                                                zIndex: "2",
                                                                cursor: "pointer",
                                                            }}
                                                        >
                                                            <Box sx={{}}>
                                                                {hoveredChord}{" "}
                                                                {chordSounds[chord] && (
                                                                    <VolumeUpIcon
                                                                        onClick={(e) => {
                                                                            e.stopPropagation(); // Ngăn việc click ảnh hưởng đến các sự kiện khác
                                                                            const audio = new Audio(
                                                                                chordSounds[chord]
                                                                            );
                                                                            audio.play();
                                                                        }}
                                                                        style={{}}
                                                                    ></VolumeUpIcon>
                                                                )}
                                                                <img
                                                                    src={
                                                                        chordImages[chord]?.[
                                                                            chordImageIndex - 1
                                                                        ]
                                                                    }
                                                                    alt={`Chord ${chord}`}
                                                                    style={{
                                                                        width: "100%",
                                                                        height: "100%",
                                                                        zIndex: "2",
                                                                    }}
                                                                />{" "}
                                                                <ArrowRightIcon
                                                                    onClick={handleNextChordImage}
                                                                />
                                                            </Box>
                                                        </Box>
                                                    )}
                                            </span>
                                        );
                                    }

                                    return <span key={j}>{word} </span>;
                                })}
                            </Typography>
                        );
                    })}
                </div>
            );
        });
    };

    if (loading) {
        return (
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                height="100vh"
                bgcolor="#f5f5f5"
            >
                <CircularProgress color="primary" />
                <Typography variant="h6" mt={2}>
                    Please wait, loading the song...
                </Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100vh"
                bgcolor="#ffebee"
            >
                <Alert severity="error" variant="outlined">
                    <AlertTitle>Error</AlertTitle>
                    {error.message || "An error occurred while fetching the song."}
                </Alert>
            </Box>
        );
    }

    if (!songData || !songData.song) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100vh"
                bgcolor="#fff8e1"
            >
                <Alert severity="warning" variant="outlined">
                    <AlertTitle>Warning</AlertTitle>
                    Song not found or unavailable.
                </Alert>
            </Box>
        );
    }

    const transposeTone = (tone) => {
        return transposeNote(tone, semitones);
    };

    return (
        <>
            <div className="top">
                <NavbarTop />
            </div>

            <Container maxWidth="lg" sx={{ }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "3rem",
                        flexDirection: "row",
                    }}
                >
                    <Box className="center_left" sx={{ width: "60%" }}>
                        <Box>
                            <Typography variant="h3">{songData.song.title}</Typography>
                        </Box>
                        {/* Toolbar */}
                        <Box
                            mt={2}
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyConten: "center",
                                marginBottom: 3,
                            }}
                        >
                            <Typography
                                variant="body1"
                                color="textSecondary"
                                sx={{ display: "flex", alignItems: "center" }}
                            >
                                <i title="Sáng tác" className="fas fa-leaf"></i>
                                <a onClick={() => handleArtist(songData.song.artist)}>
                                    Ca sĩ: {songData.song.artist}
                                </a>{" "}
                                |<i className="fas fa-book"></i> {songData.song.genre.name} | Điệu:
                                {songData.song.rhythm.name} {displayLabel} | <Visibility />
                                <Typography>{songData.song.viewCount}</Typography>
                                <Box
                                    onClick={handleLikeClick}
                                    display="flex"
                                    justifyContent="center"
                                    sx={{
                                        color: "#FFD76E",
                                        width: 20,
                                        height: "20px",
                                        marginLeft: "2rem",
                                    }}
                                >
                                    <IconButton>
                                        {liked ? (
                                            <StarIcon
                                                sx={{ color: "#FFD76E", fontWeight: "bold" }}
                                            />
                                        ) : (
                                            <StarIcon />
                                        )}{" "}
                                        <Typography>{liked ? "Liked" : "Like"}</Typography>
                                    </IconButton>
                                </Box>
                            </Typography>
                        </Box>
                        {/* Toolbar */}

                        <div className="toolbar">
                            <div id="toolbar" style={{ display: "flex", gap: "8px" }}>
                                <ButtonGroup
                                    variant="outlined"
                                    size="small"
                                    className="btn-group mr-1"
                                >
                                    <Button onClick={() => setSemitones(semitones - 1)}  title="Giảm tone bài hát">b</Button>
                                    <Button disabled>
                                        <Typography
                                            style={{
                                                color: "#df495b",
                                                fontWeight: "bold",
                                                position: "relative",
                                                cursor: "pointer",
                                                zIndex: 1,
                                            }}
                                            className="chord"
                                        >
                                            [{transposeTone(songData.song.tone)}]
                                        </Typography>
                                    </Button>
                                    <Button onClick={() => setSemitones(semitones + 1) }  title="Tăng tone bài hát">#</Button>
                                </ButtonGroup>

                                <ButtonGroup
                                    variant="outlined"
                                    size="small"
                                    className="btn-group mr-1"
                                >
                                    <Button onClick={() => startScroll()}  title="Tăng Cuộn trang ">
                                        <ArrowDownward /> 
                                    </Button>
                                    <Button onClick={() => decreaseScrollSpeed()}  title="Giảm cuộn trang">
                                        <ArrowUpward />
                                    </Button>
                                </ButtonGroup>
                            </div>
                        </div>

                        <Box mt={3}>{renderLyrics(songData.song.lyrics)}</Box>
                    </Box>

                    <Container className="center_Right" sx={{ width: "40%" }}>
                        <Typography>
                            <strong>Nghe bài hát</strong>
                        </Typography>

                        <Container style={{ }}>
                            <Box style={{ display: "flex", gap: "12rem",  }}>
                                <Typography style={{}}>
                                    <i className="fas fa-arrow-circle-up"></i> Thúy Chi
                                </Typography>
                                <Typography>C#m</Typography>
                            </Box>

                            <Video videoId={songData.song.videoId} />
                        </Container>

                        {/* Full Song Section */}

                        {/* "Show More" Button */}

                        <Box mt={3}>
                            <CommentSection songId={songData.song._id} />
                        </Box>

                        {renderChordList()}
                    </Container>
                </Box>
            </Container>
            <Footer />
        </>
    );
};

export default LyricsSong;
