"use client";

import React from "react";
import { ThemeProvider } from "@mui/material";
import { Login } from "@/components/Login/Login";
import { useAppSelector } from "@/redux/hooks";
import { Home } from "@/components/Home/Home";
import { CustomSnackbar } from "@/components/CustomSnackbar/CustomSnackbar";
import { theme } from "@/constants/theme";

export default function Page() {
  const user = useAppSelector((state) => state.user.user);

  return (
    <ThemeProvider theme={theme}>
      {!user.jwt ? <Login /> : <Home />}
      <CustomSnackbar />
    </ThemeProvider>
  );
}
