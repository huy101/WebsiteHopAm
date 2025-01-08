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
import {chordImages} from './transposeChords'
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
    Paper,
    Divider,
    Chip,
    useTheme,
    useMediaQuery,
    Grid,
    Tooltip
} from "@mui/material";
import {
    ArrowDownward,
    ArrowUpward,
    MusicNote,
    Category,
    Speed,
    YouTube
  } from '@mui/icons-material';
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
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

    const navigate = useNavigate();
    // const chordImages = {
    //     Bm: ["/img/Bm/Bm1.png"],
    //     C: ["/img/C/C1.png", "/img/C/C2.png", "/img/C/C3.png"],
    //     D: ["/img/D/D1.png", "/img/D/D2.png", "/img/D/D3.png"],
    //     E: ["/img/E/E1.png", "/img/E/E2.png", "/img/E/E3.png"],
    //     F: ["/img/F/F1.png"],
    //     G: ["/img/G/G1.png", "/img/G/G2.png"],
    //     A: ["/img/A/A1.png", "/img/A/A2.png"],
    //     Em: ["/img/Em/Em1.png", "/img/Em/Em2.png", "/img/Em/Em3.png"],
    //     Cm: ["/img/Cm/Cm1.png", "/img/Cm/Cm2.png"],
    //     Dm: ["/img/Dm/Dm1.png", "/img/Dm/Dm2.png"],
    //     Am: ["/img/Am/Am1.png", "/img/Am/Am2.png"],
    //     Bm: ["/img/Bm/Bm1.png"],
    //     Gm: ["/img/Gm/Gm1.png"],
    //     "C#m": ["/img/Dbm/Dbm.png"],
    //     "D#m": ["/img/D#m/D#m.png"],
    //     "F#m": ["/img/Gbm/Gbm.png"],
    //     Fm: ["/img/Fm/Fm1.png"],
    //     "G#m": ["/img/G#m/G#m.png"],
    //     "A#m": ["/img/A#m/A#m.png"],

    //     A7: ["/img/A/A7.png"],
    //     D7: ["/img/D/D7.png"],
    //     Fm: ["/img/Fm/Fm1.png"],
    // };
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

        F: ["/Audio/F.wav"],
        Fm: ["/Audio/Fm.wav"],
        F7: ["/Audio/F7.wav"],

        G: ["/Audio/G.wav"],
        Gm: ["/Audio/Gm.wav"],
        G7: ["/Audio/G7.wav"],

        A: ["/Audio/A.wav"],
        Am: ["/Audio/Am.wav"],
        A7: ["/Audio/A7.wav"],

        B: ["/Audio/B.wav"],
        Bm: ["/Audio/Bm.wav"],
        B7: ["/Audio/B7.wav"],

        // Hợp âm nâng cao (thêm nếu cần)
        Cmaj7: ["/Audio/Cmaj7.wav"],
        Dmaj7: ["/Audio/Dmaj7.wav"],
        Emaj7: ["/Audio/Emaj7.wav"],
        Fmaj7: ["/Audio/Fmaj7.wav"],
        Gmaj7: ["/Audio/Gmaj7.wav"],
        Amaj7: ["/Audio/Amaj7.wav"],
        Bmaj7: ["/Audio/Bmaj7.wav"],
    };
    const userId = localStorage.getItem("userId");
    const { childTypeId, type } = useSelector((state) => state.types);
    const [displayLabel, setDisplayLabel] = useState("");
    const handleNextChordImage = () => {
        setChordImageIndex((prevIndex) => (prevIndex % chordImages[hoveredChord].length) + 1);
    };

    // Kiểm tra xem favoriteSongs có đúng dữ liệu không
    console.log(id);

    useEffect(() => {
        if (!songData || !songData.song || songData.song._id !== id) {
            dispatch(fetchSongById(id));

            dispatch(checkFavorite({ userId, songId: id }));
        }
    }, [dispatch, id]);
    const liked = favoriteSongs[id] || false;
    const handleLikeClick = () => {
        if (token) {
            dispatch(toggleFavorite({ userId, songId: id, liked }));
        }
    };
    console.log(favoriteSongs);
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
    let scrollSpeed = null; // Initial speed
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
        const chordList = Array.from(chordsSet);
    
        return (
            <Box sx={{
                '& .MuiTab-root': {
                    textTransform: 'none',
                    minHeight: 40,
                },
                padding: '16px',
                backgroundColor: '#f5f5f5',
                borderRadius: '8px',
            }}>
                <Divider sx={{ marginY: 1 }} />
    
                <Typography 
                    variant="subtitle1" 
                    sx={{
                        fontWeight: 600,
                        marginBottom: 1,
                        color: '#2c3e50'
                    }}
                >
                    Danh sách hợp âm
                </Typography>
    
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: '12px',
                    alignItems: 'flex-start',
                }}>
                    {chordList.map((chord, index) => (
                        <Paper
                            key={index}
                            elevation={1}
                            sx={{
                                padding: 1,
                                backgroundColor: '#ffffff',
                                transition: 'transform 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                },
                                width: '100px',
                            }}
                        >
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 0.5
                            }}>
                                <Typography 
                                    sx={{
                                        fontWeight: 600,
                                        fontSize: '0.9rem',
                                        color: '#1a73e8',
                                    }}
                                >
                                    {chord}
                                </Typography>
                                
                                {chordImages[chord] && (
                                    <Box
                                        sx={{
                                            width: '90px',
                                            height: '80px',
                                            borderRadius: '4px',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <img
                                            src={chordImages[chord]?.[chordImageIndex - 1]}
                                            alt={`Chord ${chord}`}
                                            style={{
                                                height: '100%',
                                                width: '100%',
                                                objectFit: 'cover',
                                            }}
                                        />
                                    </Box>
                                )}
                            </Box>
                        </Paper>
                    ))}
                </Box>
            </Box>
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
    hoveredChordIndex.index === `${index}-${i}-${j}` &&
    chordImages[chord] && (
        <Box
            sx={{
                background: "#fff",
                width: "150px",
                height: "170px",
                position: "absolute",
                top: "-165px",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 3,
                borderRadius: "8px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                border: "1px solid rgba(0,0,0,0.08)",
                overflow: "hidden",
                transition: "all 0.2s ease-in-out",
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '-8px',
                    left: '50%',
                    transform: 'translateX(-50%) rotate(45deg)',
                    width: '16px',
                    height: '16px',
                    background: '#fff',
                    boxShadow: '2px 2px 5px rgba(0,0,0,0.1)',
                    borderRight: '1px solid rgba(0,0,0,0.08)',
                    borderBottom: '1px solid rgba(0,0,0,0.08)',
                }
            }}
        >
            <Box 
                sx={{
                    padding: "8px 12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderBottom: "1px solid rgba(0,0,0,0.06)",
                    backgroundColor: "rgba(0,0,0,0.02)"
                }}
            >
                <Typography 
                    sx={{ 
                        fontWeight: 600,
                        fontSize: "16px",
                        color: "#2c3e50"
                    }}
                >
                    {hoveredChord}
                </Typography>
                <Box sx={{ display: "flex",  }}>
                    {chordSounds[chord] && (
                        <IconButton
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                const audio = new Audio(chordSounds[chord]);
                                audio.play();
                            }}
                            sx={{
                                '&:hover': {
                                    backgroundColor: 'rgba(223, 73, 91, 0.1)'
                                }
                            }}
                        >
                            <VolumeUpIcon 
                                sx={{ 
                                    fontSize: "18px",
                                    color: "#df495b"
                                }}
                            />
                        </IconButton>
                    )}
                </Box>
            </Box>

            <Box sx={{ display:'flex',flexDirection:'column', position: "relative" }}>
                <img
                    src={chordImages[chord]?.[chordImageIndex - 1]}
                    alt={`Chord ${chord}`}
                    style={{
                        width: "100%",
                        height: "100px",
                        objectFit: "cover",
                        display: "block"
                    }}
                />
                <IconButton
                    onClick={handleNextChordImage}
                    sx={{
                        right: "8px",
                        bottom: "8px",
                        marginTop:'10px',
                        padding: "4px",
                        zIndex: 2,

                        '&:hover': {
                            backgroundColor: "rgba(255,255,255,1)"
                        }
                    }}
                >
                    <ArrowRightIcon 
                        sx={{ 
                            fontSize: "18px",
                            color: "black"
                        }}
                    />
                </IconButton>
            </Box>
        </Box>
    )
}
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
                bgcolor="#fff"
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
        <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <div className="top">
        <NavbarTop />
      </div>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Left Column */}
          <Grid item xs={12} md={8}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 2, bgcolor: 'white' }}>
              {/* Song Title */}
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 700,
                  color: '#1e293b',
                  mb: 2 
                }}
              >
                {songData.song.title}
              </Typography>

              {/* Song Metadata */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <MusicNote sx={{ fontSize: 20, color: '#64748b' }} />
                  <Typography color="text.secondary">
                    Ca sĩ:{' '}
                    {songData.song.artist.map((artist, index) => (
                      <Typography
                        component="span"
                        key={index}
                        onClick={() => handleArtist(artist.name)}
                        sx={{
                          color: '#3b82f6',
                          cursor: 'pointer',
                          '&:hover': { textDecoration: 'underline' }
                        }}
                      >
                        {artist.name}
                        {index < songData.song.artist.length - 1 ? ', ' : ''}
                      </Typography>
                    ))}
                  </Typography>
                </Box>

                <Chip
                  icon={<Category sx={{ fontSize: 18 }} />}
                  label={songData.song.genre.name}
                  size="small"
                  sx={{ borderRadius: 1 }}
                />

                <Chip
                  icon={<Speed sx={{ fontSize: 18 }} />}
                  label={`Điệu: ${songData.song.rhythm.name} ${displayLabel}`}
                  size="small"
                  sx={{ borderRadius: 1 }}
                />

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Visibility sx={{ fontSize: 18, color: '#64748b' }} />
                  <Typography variant="body2" color="text.secondary">
                    {songData.song.viewCount}
                  </Typography>
                </Box>

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
                                        <Typography>{liked ? "Đã thích" : "Thích"}</Typography>
                                    </IconButton>
                                </Box>
              </Box>

              {/* Toolbar */}
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 2, 
                  mb: 3, 
                  bgcolor: '#f8fafc',
                  borderRadius: 2,
                }}
              >
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <ButtonGroup variant="outlined" size="small">
                    <Tooltip title="Giảm tone">
                      <Button 
                        onClick={() => setSemitones(semitones - 1)}
                 
                        sx={{ minWidth: 40 , textTransform: 'none'}}
                      >
                        b
                      </Button>
                    </Tooltip>
                    <Button 
                      disabled 
                      sx={{ 
                        minWidth: 60,
                        '& .MuiTypography-root': {
                          color: '#ef4444',
                          fontWeight: 600
                        }
                      }}
                    >
                      <Typography sx={{textTransform: 'none'}}>[{transposeTone(songData.song.tone)}]</Typography>
                    </Button>
                    <Tooltip title="Tăng tone">
                      <Button 
                        onClick={() => setSemitones(semitones + 1)}
                        sx={{ minWidth: 40 }}
                      >
                        #
                      </Button>
                    </Tooltip>
                  </ButtonGroup>

                  <ButtonGroup variant="outlined" size="small">
                    <Tooltip title="Bắt đầu cuộn">
                      <Button onClick={startScroll}>
                        <ArrowDownward sx={{ fontSize: 18 }} />
                      </Button>
                    </Tooltip>
                    <Tooltip title="Giảm tốc độ cuộn">
                      <Button onClick={decreaseScrollSpeed}>
                        <ArrowUpward sx={{ fontSize: 18 }} />
                      </Button>
                    </Tooltip>
                  </ButtonGroup>
                </Box>
              </Paper>

              {/* Lyrics */}
              <Box sx={{ 
                fontFamily: 'monospace',
                fontSize: '1.1rem',
                lineHeight: 1.8,
                color: '#334155'
              }}>
                {renderLyrics(songData.song.lyrics)}
              </Box>
            </Paper>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md={4}>
            <Box sx={{ top: 24 }}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: 'white' }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600,
                    color: '#1e293b',
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <YouTube sx={{ color: '#ef4444' }} />
                  Nghe bài hát
                </Typography>

                {/* <Box sx={{ mb: 2 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    mb: 1
                  }}>
                    <Typography 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        gap: 1,
                        color: '#64748b'
                      }}
                    >
                      <MusicNote sx={{ fontSize: 18 }} />
                      Thúy Chi
                    </Typography>
                    <Chip 
                      label="C#m"
                      size="small"
                      sx={{ 
                        bgcolor: '#f1f5f9',
                        fontWeight: 500
                      }} 
                    />
                  </Box>
                </Box> */}

                <Video videoId={songData.song.videoId} />
              </Paper>

              {/* Comments Section */}
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: 'white' }}>
                <CommentSection songId={songData.song._id} />
              </Paper>

              {/* Chord List */}
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: 'white' }}>
                {renderChordList()}
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>

      <Footer />
    </Box>
    );
};

export default LyricsSong;
