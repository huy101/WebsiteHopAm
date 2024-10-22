import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  childTypeId: null,
  type: ' ',
};

const typeSlice = createSlice({
  name: 'type',
  initialState,
  reducers: {
    setType: (state, action) => {
      state.childTypeId = action.payload.childTypeId;
      state.type = action.payload.type;
    },
    // Các reducer khác nếu cần
  },
});

export const { setType } = typeSlice.actions;
export default typeSlice.reducer;
