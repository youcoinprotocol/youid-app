import { AlertColor } from "@mui/material";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type SnackbarPayload = {
  open: boolean;
  message: string;
  severity: AlertColor;
};

type SnackbarState = {
  snackbar: SnackbarPayload;
};

const initialState = {
  snackbar: {
    open: false,
    message: "",
    severity: "error",
  },
} as SnackbarState;

export const snackbar = createSlice({
  name: "snackbar",
  initialState,
  reducers: {
    resetSnackbar: () => initialState,
    setSnackbar: (state, action: PayloadAction<SnackbarPayload>) => {
      state.snackbar = action.payload;
    },
  },
});

export const { resetSnackbar, setSnackbar } = snackbar.actions;
export default snackbar.reducer;
