"use client";

import React from "react";
import { ThemeProvider } from "@mui/material";
import { useParams } from "next/navigation";
import { Proof } from "@/components/Proof/Proof";
import { CustomSnackbar } from "@/components/CustomSnackbar/CustomSnackbar";
import { theme } from "@/constants/theme";

export default function Page() {
  const params = useParams();

  return (
    <ThemeProvider theme={theme}>
      <Proof uid={(params.uid ?? "").toString()} />
      <CustomSnackbar />
    </ThemeProvider>
  );
}
