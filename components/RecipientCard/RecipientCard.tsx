"use client";

import { callAPI } from "@/helpers/api";
import { generateTraitProof } from "@/helpers/crypto";
import { setSnackbar } from "@/redux/features/snackbarSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Dialog, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { CustomButton } from "../CustomButton/CustomButton";
import { CustomTextField } from "../CustomTextField/CustomTextField";
import { Trait } from "../Home/Home";

type Props = {
  handleClose: () => void;
  open: boolean;
  handleSubmit: (qr: string) => void;
  traits: Trait[];
};

export const RecipientCard: React.FC<Props> = ({
  handleClose,
  open,
  handleSubmit,
  traits,
}) => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const user = useAppSelector((state) => state.user.user);
  const [error, setError] = useState("");
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    // validate email
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
      setError("Invalid email");
      return;
    }
    // create proof
    try {
      setLoading(true);
      const bundleJson = [];
      for (const trait of traits) {
        const traitProof = await generateTraitProof(
          trait.keys ?? "",
          password,
          email,
          trait.groupId,
          trait.repId ?? 0
        );
        bundleJson.push(traitProof);
      }

      const resp = await callAPI("/proofs", "POST", user.jwt ?? "", {
        code: email,
        bundle: JSON.stringify(bundleJson),
      });
      setLoading(false);
      handleSubmit(`${process.env.NEXT_PUBLIC_APP_URL}/verify/${resp.id}`);
      setEmail("");
      setPassword("");
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
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <Stack
        direction="column"
        alignItems="center"
        gap={1}
        m={1.5}
        width={400}
        maxWidth="70vw"
      >
        <Typography variant="bodySmall" fontWeight={700}>
          Enter Password
        </Typography>
        <Typography
          variant="bodySmall"
          fontSize={12}
          fontWeight={300}
          textAlign="center"
          mb={1}
        >
          Please key in the password that you entered when linking the selected
          provider
        </Typography>
        <CustomTextField
          value={password}
          setValue={setPassword}
          placeholder=""
          type="password"
        />
        <Typography variant="bodySmall" fontWeight={700} mt={1}>
          Enter Recipient Email
        </Typography>
        <Typography
          variant="bodySmall"
          fontSize={12}
          fontWeight={300}
          textAlign="center"
          mb={1}
        >
          Please key in the recipient email who can view the selected trait(s)
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
          disabled={!email}
          text="Submit"
          sx={{
            mb: 3,
          }}
          loading={loading}
          onClick={() => {
            onSubmit();
          }}
        />
      </Stack>
    </Dialog>
  );
};
