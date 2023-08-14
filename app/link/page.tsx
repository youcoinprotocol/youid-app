"use client";

import { CustomSnackbar } from "@/components/CustomSnackbar/CustomSnackbar";
import { PasswordCard } from "@/components/PasswordCard/PasswordCard";
import { theme } from "@/constants/theme";
import { useAppSelector } from "@/redux/hooks";
import { Box, ThemeProvider, Typography } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const user = useAppSelector((state) => state.user.user);
  const searchParams = useSearchParams();
  const reputationId = searchParams.get("reputationId");
  const pwd = searchParams.get("pwd");
  const callbackUrl = searchParams.get("callbackUrl");
  const router = useRouter();

  useEffect(() => {
    if (!user.jwt) router.replace("/");
  }, [user]);

  if (!pwd || !reputationId || !callbackUrl)
    return (
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            width: "100%",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="headlineLarge">Invalid URL</Typography>
        </Box>
        <CustomSnackbar />
      </ThemeProvider>
    );

  return (
    <ThemeProvider theme={theme}>
      <PasswordCard
        pwd={pwd}
        reputationId={+reputationId}
        callbackUrl={callbackUrl}
      />
      <CustomSnackbar />
    </ThemeProvider>
  );
}
