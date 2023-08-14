"use client";

import { Stack, Typography } from "@mui/material";
import React from "react";

type Props = {
  handleOpen: () => void;
  open: boolean;
  title: string;
  desc: string;
  logo: string;
  traitLogo: string;
  invalid?: boolean;
};

export const ProofCard: React.FC<Props> = ({
  handleOpen,
  open,
  title,
  desc,
  logo,
  invalid,
  traitLogo,
}) => {
  return (
    <Stack
      direction="column"
      alignItems="flex-start"
      p={1.5}
      pb={3}
      width={200}
      maxWidth="70vw"
      sx={{
        borderRadius: "16px",
        background: invalid ? "#7A7A7A" : "#FAFAFC",
        boxShadow: "0px 0px 20px 0px rgba(0, 0, 0, 0.15)",
        cursor: open ? "auto" : "pointer",
      }}
      onClick={() => {
        handleOpen();
      }}
    >
      <Stack direction="row" gap={3} alignItems="center" mb={1} width="100%">
        <Typography
          variant="bodySmall"
          fontWeight={700}
          flex={1}
          color={invalid ? "#FFF" : "#3B3F53"}
        >
          {title ?? ""}
        </Typography>
        {!!logo && (
          <img
            src={logo ?? ""}
            alt={title}
            height={10}
            style={{
              objectFit: "cover",
              borderRadius: "50%",
            }}
          />
        )}
      </Stack>
      {open && (
        <Stack direction="column" width="100%">
          {!!traitLogo && (
            <img
              src={traitLogo}
              alt="logo"
              width={60}
              height={60}
              style={{
                objectFit: "contain",
                marginBottom: 8,
                alignSelf: "center",
              }}
            />
          )}
          <Typography
            variant="bodySmall"
            fontWeight={300}
            fontSize={14}
            mb={3}
            color={invalid ? "#FFF" : "#3B3F53"}
          >
            {desc ?? ""}
          </Typography>
        </Stack>
      )}
    </Stack>
  );
};
