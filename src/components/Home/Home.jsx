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
    Fade,
    useTheme,
    useMediaQuery,
} from "@mui/material";
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import ListSong from "../ListSong/ListSong";
import RequestSongList from "../RequestSongList/RequestSongList";
import RequestSongForm from "../requestSong/RequestSongForm";
import "./home.css";
import { fetchPopularSongs } from "../../redux/fecthListAction";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import PopularSongs from "../ListSong/Popular";
const Home = () => {
    const dispatch = useDispatch();
    const [openRequestForm, setOpenRequestForm] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
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
        <Box sx={{ minHeight: '100vh' }}>
          <NavbarTop />
          
          <Box  sx={{ marginTop: '20px', p: 2 }}>
            
              {/* Recent Songs Section */}
                  <ListSong showNavbar={false} typeH="recent" showFooter={false} />
    
              {/* Popular Songs Section */}
              
          </Box>
    
          <Dialog 
            open={openRequestForm} 
            onClose={() => setOpenRequestForm(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogContent>
              <RequestSongForm />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenRequestForm(false)}>
                Đóng
              </Button>
            </DialogActions>
          </Dialog>
    
          <Footer />
        </Box>
      );
    };
    
    export default Home;
