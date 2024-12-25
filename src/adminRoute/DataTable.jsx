import { useDispatch, useSelector } from "react-redux";
import { fetchAllSongs } from "../redux/fecthListAction";
import { fetchSongById } from "../redux/fetchSongAction";
import { deleteSong } from "../redux/fecthListAction";
import AddEditForm from "./EditForm";  // Import AddEditForm component
import { fetchRequests } from '../redux/requestSongSlice.js';
import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, Box, TableContainer, TableHead, TableRow, Paper, Button, CircularProgress, Typography, Modal } from '@mui/material';
import CreateSong from './CreateSong.jsx';
import UpdateSongForm from "./EditForm.jsx";

const DataTable = ({ data, loading, error, tabValue, isRequest, onDeleteClick,onUpdateSuccess ,openDialog }) => {
  const [openModal, setOpenModal] = useState({}); // Track the modal open state for each item
  const [selectedItemId, setSelectedItemId] = useState(null);
  const { requests } = useSelector((state) => state.songRequest);

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    maxHeight: '90vh',  // Maximum height of the modal is 90% of the viewport height
    overflow: 'auto',   // Enable scrolling if the content overflows vertically
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
  };

  // Error handling: if error is an object, convert it to a string
  if (error) {
    const errorMessage = typeof error === 'string' ? error : error.message || JSON.stringify(error);
    return <Typography color="error">{errorMessage}</Typography>;
  }

  if (loading) {
    return <CircularProgress />;
  }

  const handleEditClick = (itemId) => {
    setSelectedItemId(itemId);
    setOpenModal((prevState) => ({
      ...prevState,
      [itemId]: true,  // Open modal for the clicked item
    }));
  };

  const closeModal = (itemId) => {
    setOpenModal((prevState) => ({
      ...prevState,
      [itemId]: false,  // Close modal for the clicked item
    }));
    setSelectedItemId(null); // Reset itemId when closing the modal
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Artist</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>
              <Button variant="contained" color="primary" onClick={() => console.log("Add Song")}>
                Add New Song
              </Button>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item._id}>
              <TableCell>{item._id}</TableCell>
              <TableCell>{item.title}</TableCell>
              <TableCell>{item.artist || "Unknown"}</TableCell>
              <TableCell>{item.status || "Pending"}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="warning"
                  onClick={() => handleEditClick(item._id)} // Open the modal for the specific item
                  style={{ marginRight: '10px' }}
                >
                  Edit
                </Button>
                <Modal
                  open={openModal[item._id] || false}
                  onClose={() => closeModal(item._id)}  
                   
                >
                  <Box sx={modalStyle}>
                    {tabValue === "songs" ? (
                      <UpdateSongForm itemId={selectedItemId} closeModal={() => closeModal(item._id)} />
                    ) : (
                      <CreateSong itemId={selectedItemId} closeModal={() => closeModal(item._id)} />
                    )}
                  </Box>
                </Modal>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => onDeleteClick(item._id)} // Delete the item when the button is clicked
                  openDialog={true}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataTable;
