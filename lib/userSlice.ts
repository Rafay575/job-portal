import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  id: string | null;
  name: string | null;
  email: string | null;
  role: string | null;
  loggedIn:boolean
}

const initialState: UserState = {
  id: null,
  name: null,
  email: null,
  role: null,
  loggedIn:false
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      return { ...state, ...action.payload };
    },

    clearUser: () => initialState,
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;