"use client";

import { callAPI } from "@/helpers/api";
import { setSnackbar } from "@/redux/features/snackbarSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { CustomButton } from "../CustomButton/CustomButton";
import { CustomTextField } from "../CustomTextField/CustomTextField";
import { EmailLoginOtp } from "./EmailLoginOtp";

type Props = {
  setMode: Function;
};

export const LoginWithEmail: React.FC<Props> = ({ setMode }) => {
  const [email, setEmail] = useState("");
  const [enterOtp, setEnterOtp] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    // validate email
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
      setError("Invalid email");
      return;
    }
    try {
      setLoading(true);
      const resp = await callAPI("/authentication/otps", "POST", "", {
        identifier: email,
      });
      if (!!resp.message) throw new Error(resp.name);
      setEnterOtp(true);
      setLoading(false);
    } catch (err: any) {
      dispatch(
        setSnackbar({
          open: true,
          message: err.toString(),
          severity: "error",
        })
      );
      setLoading(false);
    }
  };

  if (enterOtp)
    return <EmailLoginOtp setEnterOtp={setEnterOtp} email={email} />;

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
        <CustomTextField
          value={email}
          setValue={setEmail}
          placeholder="example@email.com"
          type="text"
          error={error}
          setError={setError}
          onSubmit={() => {
            onSubmit();
          }}
        />
        <CustomButton
          loading={loading}
          disabled={!email}
          onClick={async () => {
            onSubmit();
          }}
          variant="light"
          text="Get Code"
          sx={{
            mb: 3,
          }}
        />
        <Typography
          variant="bodySmall"
          fontStyle="italic"
          fontSize={14}
          fontWeight={300}
          sx={{
            cursor: "pointer",
            "&:hover": {
              fontWeight: 700,
            },
          }}
          onClick={() => {
            setMode("");
          }}
        >
          Back
        </Typography>
      </Stack>
    </Stack>
  );
};
