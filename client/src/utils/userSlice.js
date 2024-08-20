import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
  loginUser: null,
};

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    addToStore: (state, action) => {
      state.data = action.payload;
    },
    addAdminUser: (state, action) => {
      state.loginUser = action.payload;
    },
  },
});
export const { addToStore, addAdminUser } = dataSlice.actions;
export default dataSlice.reducer;
