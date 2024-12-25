// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchPending } from '../redux/fecthListAction';
// import DataTable from './DataTable';
// import { Typography } from "@mui/material";
// const PendingSongs = ({ onEditClick, onDeleteClick }) => {
//   const dispatch = useDispatch();
//   const { pendingSongs, loading, error } = useSelector((state) => state.pending);

//   useEffect(() => {
//     dispatch(fetchPending());
//   }, [dispatch]);

//   return (
//     <div>
//       <Typography variant="h6">Pending Songs</Typography>
//       <DataTable 
//         data={pendingSongs} 
//         loading={loading} 
//         error={error} 
//         onEditClick={onEditClick} 
//         onDeleteClick={onDeleteClick} // Truyền onDeleteClick vào DataTable
//       />
//     </div>
//   );
// };

// export default PendingSongs;
