import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NavbarTop from "../Navbar/Navbar";
import {
    Box,
    Paper,
    Typography,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    Container,
} from "@mui/material";
import ListSong from "../ListSong/ListSong";
import RequestSongList from "../RequestSongList/RequestSongList";
import RequestSongForm from "../requestSong/RequestSongForm";
import "./home.css";
import { fetchPopularSongs } from "../../redux/fecthListAction";
import { Link } from "react-router-dom";
import Footer from "./Footer";
const Home = () => {
    const dispatch = useDispatch();
    const [openRequestForm, setOpenRequestForm] = useState(false);

    // State for storing songs from Redux

    // Function to handle opening the request form
    const handleOpenRequestForm = () => {
        setOpenRequestForm(true);
    };

    useEffect(() => {
        dispatch(fetchPopularSongs());
    }, []);

    const handleCloseRequestForm = () => {
        setOpenRequestForm(false);
    };

    const popularSongs = useSelector((state) => state.list.popular);
    return (
        <>
            <div className="top">
                <NavbarTop />
            </div>
        
            <Box className="home_center" sx={{display: "flex",justifyContent: 'center', marginTop: '20px',  
    minHeight: '100vh',
    flexDirection: 'row', gap: '30px'
    }}>
                <Box sx={{width: "50%"}}>
                    <ListSong showNavbar={false} typeH="recent" sx={{}} showFooter={false}/>
                </Box>
                <Box  sx={{}}>
                    <Paper
                        sx={{
                            backgroundColor: "#f9f9f9",
                            borderRadius: "8px",
                            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                            padding: "16px",
                            display: 'flex',justifyContent: 'center',alignItems: 'center', flexDirection: 'column',
                        }}
                    >
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: "bold",
                                color: "#333",
                                marginBottom: "16px",
                                
                            }}
                        >
                            Bài hát  nhiều trong tháng
                        </Typography>
                        {/* Display the popular songs directly */}
                        {popularSongs.length > 0 ? (
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "1rem",
                                }}
                            >
                                {popularSongs.map((song, index) => (
                                    <Link
                                        to={`/chord/${song._id}`}
                                        key={index}
                                        style={{
                                            textDecoration: "none",
                                            color: "#555",
                                            transition: "color 0.3s ease, transform 0.3s ease",
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.color = "#1e88e5";
                                            e.target.style.transform = "translateX(5px)";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.color = "#555";
                                            e.target.style.transform = "translateX(0)";
                                        }}
                                    >
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                fontSize: "16px",
                                            }}
                                        >
                                           {index+1}. {song.title} - {song.artist}
                                        </Typography>
                                    </Link>
                                ))}
                            </Box>
                        ) : (
                            <Typography variant="body1">Không có bài hát nào phổ biến</Typography>
                        )}
                        <Button
                            variant="contained"
                            sx={{ marginTop: 2,display: 'flex',justifyContent: 'center',alignItems: 'center',width: '100%'}}
                            onClick={handleOpenRequestForm}
                        >
                            Yêu cầu hợp âm bài hát
                        </Button>
                        <RequestSongList />
                    </Paper>
                    {/* Dialog for Request Song Form */}
                    <Dialog open={openRequestForm} onClose={handleCloseRequestForm}>
                        <DialogContent>
                            <RequestSongForm />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseRequestForm} color="primary">
                                Đóng
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Box>
            </Box>

            <Footer />
        </>
    );
};

export default Home;
