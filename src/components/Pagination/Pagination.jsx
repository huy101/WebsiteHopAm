import React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

const PaginationComponent = ({ songsPerPage, totalSongs, paginate, currentPage }) => {
  const pageCount = Math.ceil(totalSongs / songsPerPage); // Calculate the total number of pages

  const handlePageChange = (event, value) => {
    paginate(value - 1); // `value - 1` because `Pagination` uses 1-based indexing, but your state uses 0-based indexing.
  };

  return (
    <Stack spacing={2} >
      <Pagination
        count={pageCount} // Total number of pages
        page={currentPage + 1} // Set the current page (MUI uses 1-based indexing)
        onChange={handlePageChange} // Handle page change
        shape="rounded" // Optional: Makes the pagination rounded
        color="primary" // Optional: Sets the color of the pagination (e.g., primary, secondary, etc.)
        siblingCount={1} // Optional: Shows siblings on each side of the current page
      />
    </Stack>
  );
};

export default PaginationComponent;
