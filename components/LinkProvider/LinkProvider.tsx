"use client";

import { Box, Dialog, Stack, Typography } from "@mui/material";
import React from "react";
import { Reputation } from "../Home/Home";

type Props = {
  handleClose: () => void;
  open: boolean;
  reputations: Array<Reputation>;
};

export const LinkProvider: React.FC<Props> = ({
  handleClose,
  open,
  reputations,
}) => {
  return (
    <Dialog onClose={handleClose} open={open}>
      <Stack
        direction="column"
        alignItems="center"
        gap={1}
        m={1.5}
        width={400}
        maxWidth="70vw"
        minHeight={300}
      >
        <Typography variant="bodySmall" fontWeight={700}>
          Link Provider
        </Typography>
        {reputations.map((reputation) => {
          return (
            <Box
              key={reputation.id}
              component="div"
              pt={1.5}
              pb={1.5}
              width="100%"
              gap={3}
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "8px",
                border: "1px solid #EEE",
                cursor: "pointer",
                background:
                  "linear-gradient(0deg, #FFF 0%, #FFF 100%), linear-gradient(135deg, #FF8600 0%, #733E03 100%)",
              }}
              onClick={() => {
                window.open(reputation.content?.linkUrl ?? "", "_blank");
              }}
            >
              <img
                src={reputation.content?.logo ?? ""}
                alt={reputation.name}
                width={32}
                height={32}
                style={{
                  objectFit: "contain",
                }}
              />
              <Typography>{reputation.name ?? ""}</Typography>
            </Box>
          );
        })}
      </Stack>
    </Dialog>
  );
};
