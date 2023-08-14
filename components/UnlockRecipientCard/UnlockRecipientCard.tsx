"use client";

import { Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CustomTextField } from "../CustomTextField/CustomTextField";
import { CustomButton } from "../CustomButton/CustomButton";

type Props = {
  setRecipient: (v: string) => void;
  error: string;
  setError: (v: string) => void;
  loading: boolean;
};

export const UnlockRecipientCard: React.FC<Props> = ({
  setRecipient,
  error,
  setError,
  loading,
}) => {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const onSubmit = async () => {
    // validate email
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
      setError("Invalid email");
      return;
    }
    setRecipient(email);
  };

  return (
    <Stack
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "rgba(241, 242, 246, 0.70)",
        backdropFilter: "blur(15px)",
        zIndex: 100,
      }}
    >
      <Stack
        direction="column"
        alignItems="center"
        gap={1}
        p={1.5}
        pl={8}
        pr={8}
        sx={{
          borderRadius: "16px",
          background: "#FFF",
          boxShadow: "0px 0px 20px 0px rgba(0, 0, 0, 0.05)",
          maxWidth: "50vw",
        }}
      >
        <Typography variant="bodySmall" fontWeight={700} mb={2}>
          Unlock Reputation
        </Typography>
        <Typography
          variant="bodySmall"
          fontSize={12}
          fontWeight={300}
          textAlign="center"
          mb={1}
        >
          Please key in your email to view user reputation
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
          text="Submit"
          disabled={!email}
          sx={{ mb: 3 }}
          onClick={async () => {
            onSubmit();
          }}
          loading={loading}
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
            router.push("/");
          }}
        >
          Cancel
        </Typography>
      </Stack>
    </Stack>
  );
};
