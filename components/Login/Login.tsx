"use client";

import { Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { CustomButton } from "../CustomButton/CustomButton";
import { LoginWithEmail } from "./LoginWithEmail";

export const Login: React.FC = () => {
  const [loginMode, setLoginMode] = useState("");

  if (loginMode === "email") return <LoginWithEmail setMode={setLoginMode} />;

  return (
    <Stack
      direction="column"
      sx={{
        width: "100vw",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: "url('/assets/bg.png')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        backgroundColor: "#F6F6F6",
        backgroundAttachment: "fixed",
      }}
    >
      <Stack direction="column" gap={1} alignItems="center">
        <img
          src="/assets/logo.png"
          width={48}
          height={48}
          style={{
            objectFit: "contain",
          }}
        />
        <Typography
          variant="headlineMedium"
          color="#1C1C1E"
          fontWeight={700}
          fontSize={16}
          mb={2}
        >
          YouCoin
        </Typography>
        <Typography
          variant="headlineMedium"
          color="#1C1C1E"
          fontWeight={400}
          fontSize={16}
          mb={1}
        >
          Login with
        </Typography>
        <CustomButton
          onClick={() => {
            setLoginMode("email");
          }}
          text="Email"
        />
      </Stack>
    </Stack>
  );
};
