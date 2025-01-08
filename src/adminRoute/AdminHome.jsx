import React, { useEffect, useState} from "react";
import { Container, Grid, Button, Box, Tab, Tabs, Typography,Modal,DialogActions,Dialog,DialogTitle,DialogContent } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllSongs, deleteSong } from "../redux/fecthListAction";  // Import deleteSong action
import DataTable from "./DataTable";
import PendingSongs from "./PendingSongs";
import Requests from "./Request";
import AddSong from "../components/AddNewSong/AddSong.jsx";
import { fetchPending } from "../redux/fecthListAction";
import { fetchSongById } from "../redux/fetchSongAction"; // Import action để fetch bài hát theo ID
import {fetchRequests,deleteRequests} from '../redux/requestSongSlice.js'
import CreateSong from './CreateSong.jsx';
import { Snackbar } from "@mui/material";
import { Alert } from "@mui/material";
const AdminHome = () => {
  const dispatch = useDispatch();
  const { songs, loading, error } = useSelector((state) => state.list);
  const [tabValue, setTabValue] = React.useState("songs");
  const [openDialog, setOpenDialog] = useState(false); // Trạng thái Modal
    const {requests}=useSelector((state) => state.songRequest );
    const [openSnackbar, setOpenSnackbar] = useState(false); 
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("success");
    
   
    const [successMessage, setSuccessMessage] = useState("");
   
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

  // Confirm delete action

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const handleUpdateSuccess = () => {
    dispatch(fetchAllSongs());  // Reload the list of songs after the update
    if(tabValue==="request"){
      setMessage("Thêm bài hát thành công!");
    }
    else{
    setMessage("Cập nhật bài hát thành công!");}
    setSeverity("success");
    setOpenSnackbar(true); 
  };
  const handleDeleteSongError = () => {
    console.error("Failed to delete the song.");
    // Optionally display a toast or an error message here
  };
  const handleDeleteRequestSuccess = () => {
    dispatch(fetchRequests());  // Reload the list of songs after the update
    setMessage("Xóa yêu cầu thành công!");
    setSeverity("success");
    console.log("Request deleted successfully!");
    setOpenSnackbar(true);
  };
  // Close the dialog
 
  const handleDeleteSongSuccess=()=>{
    dispatch(fetchAllSongs());
    setMessage("Xóa bài hát thành công!");
    setSeverity("success");
    setOpenSnackbar(true);}
  // Close the snackbar
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  
  
  return (
    <Container maxWidth="xl" className="admin-home">
          <Typography variant="h4" align="center" gutterBottom>
           Quản lý bài hát
          </Typography>

      {/* Tabs */}
     
      <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
        <Tabs value={tabValue} onChange={handleTabChange} indicatorColor="primary" textColor="primary">
        
          <Tab label="Danh sách bài hát" value="songs" />
          <Tab label="Yêu cầu" value="request" />
        </Tabs>
        <Button variant="contained" color="primary"   sx={{
                      marginLeft: "10px",
                      backgroundColor: "#1976d2", 
                      border: "2px solid #1976d2", 
                      color: "#fff",  // Màu chữ
                      
                      borderRadius: "5px",   // Bo góc cho nút
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Thêm bóng đổ
                    }}  onClick={() =>setOpenDialog(true)}>
                                  Thêm bài hát
                                </Button>
      </Box>

      <Box sx={{ padding: 3 }}>
        {tabValue === "songs" && (
          <Box>
          
            <DataTable tabValue='songs'
              data={songs} 
              loading={loading} 
              error={error} 
              onDeleteSongSuccess={handleDeleteSongSuccess}
              onUpdateSuccess={handleUpdateSuccess}

            />
          </Box>
        )}

        
        {tabValue === "request" && (<Box>
          <DataTable tabValue='request' data={requests}   onDeleteSongError={handleDeleteSongError} onDeleteRequestsSuccess={handleDeleteRequestSuccess}  isRequest={true}
              loading={loading} 
              error={error}   
              onUpdateSuccess={handleUpdateSuccess} />
        </Box> )}
      </Box>
        {/* Delete Confirmation Dialog */}
      
      {/* Snackbar for success/error */}
      <Snackbar
  open={openSnackbar}
  autoHideDuration={3000}
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
<Dialog open={openDialog}  onClose={() => setOpenDialog(false)}> <DialogTitle>Thêm bài hát</DialogTitle>
  <DialogContent><AddSong/></DialogContent>
</Dialog>
    </Container>
  );
};

export default AdminHome;
