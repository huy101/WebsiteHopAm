import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRequests } from '../redux/requestSongSlice';
import DataTable from './DataTable';
import { Typography } from "@mui/material";

const Requests = ({ onEditClick, onDeleteClick }) => {
  const dispatch = useDispatch();
  const { requests, loading, error } = useSelector((state) => state.requests);

  useEffect(() => {
    dispatch(fetchRequests());
  }, [dispatch]);

  return (
    <div>
      <Typography variant="h6">Requests</Typography>
      <DataTable 
        data={requests} 
        loading={loading} 
        error={error} 
        onEditClick={onEditClick} 
        onDeleteClick={onDeleteClick} // Truyền onDeleteClick vào DataTable
      />
    </div>
  );
};

export default Requests;
