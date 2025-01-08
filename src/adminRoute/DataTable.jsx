import { useDispatch, useSelector } from "react-redux";
import { fetchAllSongs } from "../redux/fecthListAction";
import { fetchSongById } from "../redux/fetchSongAction";
import { deleteSong } from "../redux/fecthListAction";
import AddEditForm from "./EditForm";  // Import AddEditForm component
import { deleteRequests, fetchRequests } from '../redux/requestSongSlice.js';
import React, { useEffect, useState } from "react";
import CreateSong from './CreateSong.jsx';
import UpdateSongForm from "./EditForm.jsx";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button, 
  CircularProgress, 
  Typography, 
  Box,
  Modal,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Chip,
  Stack,
  IconButton,
  Tooltip
} from '@mui/material';
import Checkbox from "@mui/material/Checkbox"
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const DataTable = ({ 
  data, 
  loading, 
  error, 
  tabValue, 
  isRequest, 
  onUpdateSuccess,
  onDeleteSongSuccess,
  onDeleteRequestsSuccess,
  onDeleteSongError = () => console.error("Delete error not handled.")
}) => {
  const [openModal, setOpenModal] = useState({});
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [songToDelete, setSongToDelete] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(data);
  const { requests } = useSelector((state) => state.songRequest);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedRequests, setSelectedRequests] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    const filtered = data.filter(item => {
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'pending' && !item.status) ||
        (statusFilter === 'approved' && item.status);
      
      const matchesSearch = 
        (item.title?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
        (typeof item.artist === 'string' && item.artist.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (Array.isArray(item.artist) && item.artist.some(artist => 
          artist.name?.toLowerCase().includes(searchQuery.toLowerCase())
        ));

      return matchesStatus && matchesSearch;
    });
    setFilteredData(filtered);
  }, [data, statusFilter, searchQuery]);

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    maxHeight: '90vh',
    overflow: 'auto',
    bgcolor: 'background.paper',
    borderRadius: 1,
    boxShadow: 24,
    p: 4,
  };

  if (error) {
    const errorMessage = typeof error === 'string' ? error : error.message || JSON.stringify(error);
    return (
      <Typography color="error" sx={{ p: 2 }}>
        {errorMessage}
      </Typography>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
        <CircularProgress />
      </Box>
    );
  }

  const handleDelete = (itemId) => {
    if (isRequest) {
     
      dispatch(deleteRequests(selectedRequests))
        .then(() => { console.log("Delete request");
          onDeleteRequestsSuccess();
          setSelectedRequests([]);
          setOpenDialog(false);
        })
        .catch(() => {
          setOpenDialog(false);
        });
    } else {
      dispatch(deleteSong(itemId))
        .then(() => {
          setOpenDialog(false);
          onDeleteSongSuccess();
        })
        .catch(() => {
          onDeleteSongError();
          setOpenDialog(false);
        });
    }
  };
  

  const handleDeleteClick = (itemId) => {
    setSongToDelete(itemId);
    setOpenDialog(true);
  };
  const handleDeleteClickRe = (itemId) => {
    setSelectedRequests(filteredData.map(item => item._id))
    setOpenDialog(true);
  };

  const handleDeleteSelected = () => {
    
    if (selectedRequests.length === 0) return;
    dispatch(deleteRequests(selectedRequests))
      .then(() => {
        onDeleteRequestsSuccess();
        setOpenDialog(false);
        setSelectedRequests([]);
      })
      .catch(() => setOpenDialog(false));
  };

  const handleEditClick = (itemId) => {
    setSelectedItemId(itemId);
    setOpenModal(prev => ({ ...prev, [itemId]: true }));
  };

  const handleConfirmDelete = () => {
    if (isRequest) {
      handleDeleteSelected();
    } else
    if (!songToDelete) return;
    handleDelete(songToDelete);
  };

  const closeModal = (itemId) => {
    setOpenModal(prev => ({ ...prev, [itemId]: false }));
    setSelectedItemId(null);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2, p: 2 }}>
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={2} 
          sx={{ mb: 2 }}
          alignItems="center"
          justifyContent="space-between"
        >
          <TextField
            placeholder="Search by title or artist..."
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 300 }}
          />
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterListIcon color="action" />
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              size="small"
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="pending">Chờ duyệt</MenuItem>
              <MenuItem value="approved">Đã duyệt</MenuItem>
            </Select>
          </Box>
        </Stack>

        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="songs table">
            <TableHead>
              <TableRow>
               
                <TableCell><Typography variant="subtitle2">STT</Typography></TableCell>
                <TableCell><Typography variant="subtitle2">Tên</Typography></TableCell>
                <TableCell><Typography variant="subtitle2">Ca sĩ</Typography></TableCell>
                <TableCell><Typography variant="subtitle2">Trạng thái</Typography></TableCell>
                <TableCell><Typography variant="subtitle2">Tùy chọn</Typography></TableCell>
               <TableCell sx={{ display: isRequest ? 'table-cell' : 'none' }}>   
               {selectedRequests.length>0 && (
                   <Tooltip title="Delete">
                   <IconButton
                     size="small"
                     onClick={() => {
                       
                         handleDeleteClick(selectedRequests); // Calls handleDeleteClick if isRequest is false
                       
                     }}
                     
                     color="error"
                   >
                     <DeleteIcon fontSize="small" />
                   </IconButton>
                 </Tooltip>
                )}
               </TableCell>
              </TableRow>
              
            </TableHead>
           
            <TableBody>
              {filteredData.map((item, index) => (
                <TableRow 
                  key={index}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>
                    {item.artist 
                      ? (Array.isArray(item.artist)
                          ? item.artist.map(artist => artist.name || 'Unknown').join(', ')
                          : item.artist)
                      : "Unknown"
                    }
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={item.status ? "Approved" : "Pending"}
                      color={item.status ? "success" : "warning"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                   
                        <Tooltip title="Edit">
                          <IconButton 
                            size="small" 
                            onClick={() => handleEditClick(item._id)}
                            color="primary"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {!isRequest && (
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => {
                            if (isRequest) {
                              handleDeleteClickRe(item._id); // Calls handleDeleteSelected if isRequest is true
                            } 
                            else {handleDeleteClick(item._id);} // Calls handleDeleteClick if isRequest is false}
                          }}
                          
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
  {isRequest && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedRequests.includes(item._id)}
                        onChange={() => {
                          setSelectedRequests(prev => 
                            prev.includes(item._id)
                              ? prev.filter(id => id !== item._id)
                              : [...prev, item._id]
                          );
                        }}
                      />
                    </TableCell>
                  )}
                    </Stack>

                    
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          Xóa
        </DialogTitle>
        <DialogContent>
          <Typography>
            Xóa mục này khỏi danh sách?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmDelete} 
            color="error" 
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {Object.entries(openModal).map(([itemId, isOpen]) => (
        isOpen && (
          <Modal
            key={itemId}
            open={isOpen}
            onClose={() => closeModal(itemId)}
          >
            <Box sx={modalStyle}>
              {tabValue === "songs" ? (
                <UpdateSongForm 
                  itemId={selectedItemId} 
                  onUpdateSuccess={onUpdateSuccess} 
                  closeModal={() => closeModal(itemId)} 
                />
              ) : (
                <CreateSong 
                  itemId={selectedItemId} 
                  onUpdateSuccess={onUpdateSuccess} 
                  closeModal={() => closeModal(itemId)} 
                />
              )}
            </Box>
          </Modal>
        )
      ))}
    </Box>
  );
};

export default DataTable;