import React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { Typography } from '@mui/material';
const PaginationComponent = ({ songsPerPage, totalSongs, paginate, currentPage }) => {
  const pageCount = totalSongs ? Math.ceil(totalSongs / songsPerPage) : 0; // Avoid division by 0

  const handlePageChange = (event, value) => {
    paginate(value - 1); // `value - 1` because `Pagination` uses 1-based indexing, but your state uses 0-based indexing.
  };

  return pageCount > 0 ? (
    <Stack spacing={2}>
      <Pagination
        count={pageCount}
        page={currentPage + 1}
        onChange={handlePageChange}
        shape="rounded"
        color="primary"
        siblingCount={1}
      />
    </Stack>
  ) : (
    <Typography variant="h6">No songs available</Typography>
  );
  
};

export default PaginationComponent;
