"use client";

import { callAPI } from "@/helpers/api";
import { setSnackbar } from "@/redux/features/snackbarSlice";
import { setUser } from "@/redux/features/userSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import OtpInput from "react-otp-input";
import { CustomButton } from "../CustomButton/CustomButton";

type Props = {
  setEnterOtp: Function;
  email: string;
};

export const EmailLoginOtp: React.FC<Props> = ({ setEnterOtp, email }) => {
  const [otp, setOtp] = useState("");
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

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
          Input Code
        </Typography>
        <OtpInput
          value={otp}
          onChange={async (v) => {
            setOtp(v);
            if (v.length === 6) {
              try {
                setLoading(true);
                const resp = await callAPI("/authentication", "POST", "", {
                  strategy: "otp",
                  identifier: email,
                  code: v,
                });
                if (!!resp.message) throw new Error(resp.name);
                if (!resp.user) throw new Error("User record not found.");
                resp.user.jwt = resp.accessToken;
                dispatch(setUser(resp.user));
                setLoading(false);
              } catch (err: any) {
                setLoading(false);
                dispatch(
                  setSnackbar({
                    open: true,
                    message: err.toString(),
                    severity: "error",
                  })
                );
              }
            }
          }}
          numInputs={6}
          renderSeparator={<span style={{ width: 8 }}></span>}
          renderInput={(props) => (
            <input
              {...props}
              style={{
                borderRadius: "16px",
                background: "#FFF",
                boxShadow: "0px 0px 20px 0px rgba(0, 0, 0, 0.05)",
                padding: "12px 16px",
                border: "none",
                width: 8,
                marginBottom: 16,
              }}
              pattern="[0-9]*"
              min="0"
              inputMode="numeric"
              type="number"
            />
          )}
        />
        <CustomButton
          sx={{
            mb: 1,
          }}
          disabled={otp.length < 6}
          loading={loading}
          onClick={async () => {
            try {
              setLoading(true);
              const resp = await callAPI("/authentication", "POST", "", {
                strategy: "otp",
                identifier: email,
                code: otp,
              });
              if (!!resp.message) throw new Error(resp.name);
              if (!resp.user) throw new Error("User record not found.");
              resp.user.jwt = resp.accessToken;
              dispatch(setUser(resp.user));
              setLoading(false);
            } catch (err: any) {
              setLoading(false);
              dispatch(
                setSnackbar({
                  open: true,
                  message: err.toString(),
                  severity: "error",
                })
              );
            }
          }}
          variant="dark"
          text="Enter"
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
            setEnterOtp(false);
          }}
        >
          Back
        </Typography>
      </Stack>
    </Stack>
  );
};
