import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, List, ListItem, ListItemText, Divider } from "@mui/material";
import { fetchRequests } from '../../redux/requestSongSlice.js';

const RequestSongList = () => {
  const dispatch = useDispatch();
  const { requests } = useSelector((state) => state.songRequest);

  useEffect(() => {
    dispatch(fetchRequests());
  }, [dispatch]);

  // Phân tách danh sách theo trạng thái
  const approvedRequests = requests.filter(request => request.status === "approved");
  const pendingRequests = requests.filter(request => request.status !== "approved");

  return (
    <Box
      sx={{display: "flex", flexDirection: "column", padding: "1rem", justifyContent: "center",
        maxWidth: "600px",
        margin: "1rem auto",
        borderRadius: "8px",
      }}
    >
      <Typography variant="h6" align="center" gutterBottom sx={{ marginBottom: "5px" }}>
        Danh sách yêu cầu bài hát
      </Typography>

      {/* Danh sách bài hát đã duyệt */}
      <Typography variant="h6" gutterBottom  sx={{
          
          marginBottom: "0px",
        }}>
        Bài hát đã duyệt
      </Typography>
      <List >
        {approvedRequests && approvedRequests.length > 0 ? (
          approvedRequests.map((request) => (
            <React.Fragment key={request._id}>
              <ListItem sx={{marginBottom: "0px"}}>
                <ListItemText
                  primary={
                    <span style={{ textDecoration: "line-through" }}>
                      {request.title} - {request.artist}
                    </span>
                  }
                  secondary={
                   
                      <Typography>{request.requestedAt}</Typography>
                   
                  }
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))
        ) : (
          <Typography align="center">Không có yêu cầu nào đã duyệt</Typography>
        )}
      </List>

      {/* Danh sách bài hát chưa duyệt */}
      <Typography variant="h6" gutterBottom sx={{ marginBottom: "0px" }}>
        Yêu cầu mới
      </Typography>
      <List>
        {pendingRequests && pendingRequests.length > 0 ? (
          pendingRequests.map((request) => (
            <React.Fragment key={request._id}>
              <ListItem>
                <ListItemText
                  primary={request.title + " - " + request.artist}
                  secondary={
                      <Typography>{request.requestedAt}</Typography>
                  }
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))
        ) : (
          <Typography align="center">Không có yêu cầu nào chưa duyệt</Typography>
        )}
      </List>
    </Box>
  );
};

export default RequestSongList;
