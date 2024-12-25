import React, { useEffect, useState} from "react";
import { Container, Grid, Button, Box, Tab, Tabs, Typography,Modal,DialogActions,Dialog,DialogTitle,DialogContent } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllSongs, deleteSong } from "../redux/fecthListAction";  // Import deleteSong action
import DataTable from "./DataTable";
import PendingSongs from "./PendingSongs";
import Requests from "./Request";
import { fetchPending } from "../redux/fecthListAction";
import { fetchSongById } from "../redux/fetchSongAction"; // Import action để fetch bài hát theo ID
import {fetchRequests} from '../redux/requestSongSlice.js'
import CreateSong from './CreateSong.jsx';
import { Snackbar } from "@mui/material";
import { Alert } from "@mui/material";
const AdminHome = () => {
  const dispatch = useDispatch();
  const { songs, loading, error } = useSelector((state) => state.list);
  const [tabValue, setTabValue] = React.useState("songs");
  const [openModal, setOpenModal] = useState(false); // Trạng thái Modal
  const [selectedItemId, setSelectedItemId] = useState(null); 
    const {requests}=useSelector((state) => state.songRequest );
    const [openSnackbar, setOpenSnackbar] = useState(false); 
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("success");
    const [songToDelete, setSongToDelete] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const handleUpdateSuccess = () => {
      dispatch(fetchAllSongs());  // Reload the list of songs after the update
    };
  // Fetch data when the component loads
  useEffect(() => {
    if (tabValue === "songs") {
      dispatch(fetchAllSongs());
      console.log(tabValue)
    }
   
    if (tabValue === "request") {
      dispatch(fetchRequests());console.log(tabValue)
    }
  }, [dispatch, tabValue]);

  // Fetch dữ liệu bài hát khi nhấn nút Edit
  const handleDeleteClick = (itemId) => {
    setSongToDelete(itemId); // Store the ID of the song to be deleted
    setOpenDialog(true); // Open the dialog
  };

  // Confirm delete action
  const handleConfirmDelete = () => {
    if (!songToDelete) return;

    dispatch(deleteSong(songToDelete))
      .then(() => {
        setMessage("Song deleted successfully!");
        setSeverity("success");
        setOpenSnackbar(true);
        setOpenDialog(false); // Close dialog after successful deletion
      })
      .catch((error) => {
        setMessage("Failed to delete song!");
        setSeverity("error");
        setOpenSnackbar(true);
        setOpenDialog(false); // Close dialog even if error occurs
      });
  };
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Close the dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Close the snackbar
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  return (
    <Container maxWidth="xl" className="admin-home">
          <Typography variant="h4" align="center" gutterBottom>
            Admin Dashboard
          </Typography>

      {/* Tabs */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
        <Tabs value={tabValue} onChange={handleTabChange} indicatorColor="primary" textColor="primary">
          <Tab label="List Songs" value="songs" />
          <Tab label="Request" value="request" />
        </Tabs>
      </Box>

      <Box sx={{ padding: 3 }}>
        {tabValue === "songs" && (
          <Box>
          
            <DataTable tabValue='songs'
              data={songs} 
              loading={loading} 
              error={error} 
              onEditClick={handleDeleteClick} 
              onDeleteClick={handleDeleteClick}
              onUpdateSuccess={handleUpdateSuccess} 
              isRequest={false}  // Truyền onDeleteClick vào DataTable
            />
          </Box>
        )}

        
        {tabValue === "request" && <DataTable tabValue='request' data={requests}  isRequest={true}
              loading={loading} 
              error={error}  onEditClick={handleDeleteClick} onDeleteClick={handleDeleteClick} />}
      </Box>
        {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this song? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for success/error */}
      <Snackbar
  open={openSnackbar}
  autoHideDuration={6000}
  onClose={handleCloseSnackbar}
  anchorOrigin={{
    vertical: 'top',  // Position the Snackbar at the bottom of the screen
    horizontal: 'right', // Position the Snackbar to the right of the screen
  }}
>
  <Alert onClose={handleCloseSnackbar} severity={severity}>
    {message}
  </Alert>
</Snackbar>

    </Container>
  );
};

export default AdminHome;
