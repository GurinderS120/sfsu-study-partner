import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
};

const UserSlice = createSlice({
  name: "user",
  initialState,
  // Reducers represent various actions that can be performed on a state
  reducers: {
    signUserIn: (state, action) => {
      state.user = action.payload.user;
    },
    signUserOut: (state) => {
      state.user = null;
    },
  },
});

export const { signUserIn, signUserOut } = UserSlice.actions;

// The following function allows us to select a value from the state
// which in this case is user
export const selectUser = (state) => state.user.user;

export default UserSlice.reducer;
