import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import { Alert } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { resetSnackbar } from "@/redux/features/snackbarSlice";

export const CustomSnackbar = ({}) => {
  const snackbar = useAppSelector((state) => state.snackbar.snackbar);
  const dispatch = useAppDispatch();

  return (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={6000}
      onClose={() => {
        dispatch(resetSnackbar());
      }}
    >
      <Alert
        severity={snackbar.severity}
        onClose={() => {
          dispatch(resetSnackbar());
        }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
};
