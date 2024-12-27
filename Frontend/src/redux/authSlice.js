import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  uid: null,
};
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUid(state, action) {
      console.log("Reducer setUid called with payload:", action.payload); // Debug
      state.uid = action.payload;
    },
    clearUid(state) {
      state.uid = null;
    },
  },
});

export const { setUid, clearUid } = authSlice.actions;
export default authSlice.reducer;