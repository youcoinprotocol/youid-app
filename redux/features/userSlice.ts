import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserPayload = {
  id: string;
  createdAt: string;
  jwt: string;
  updatedAt: string;
  username: string;
};

type UserState = {
  user: UserPayload;
};

const initialState = {
  user: {
    id: "",
    createdAt: "",
    jwt: "",
    updatedAt: "",
    username: "",
  },
} as UserState;

export const user = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetUser: () => initialState,
    setUser: (state, action: PayloadAction<UserPayload>) => {
      state.user = action.payload;
    },
  },
});

export const { resetUser, setUser } = user.actions;
export default user.reducer;
