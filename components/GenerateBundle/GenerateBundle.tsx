"use client";

import { Box, Dialog, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { CustomButton } from "../CustomButton/CustomButton";
import { Trait } from "../Home/Home";
import { RecipientCard } from "../RecipientCard/RecipientCard";

type Props = {
  handleClose: () => void;
  open: boolean;
  traitCards: Array<Trait>;
  setBundleQr: Function;
};

export const GenerateBundle: React.FC<Props> = ({
  handleClose,
  open,
  traitCards,
  setBundleQr,
}) => {
  const [openRecipient, setOpenRecipient] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

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
          Bundle QR
        </Typography>
        {traitCards.map((card) => {
          return (
            <Box
              component="div"
              pt={1.5}
              pb={1.5}
              width="100%"
              key={card.id}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "8px",
                border: selected.includes(card.id)
                  ? "1px solid #FF8600"
                  : "1px solid #EEE",
                cursor: "pointer",
                background:
                  "linear-gradient(0deg, #FFF 0%, #FFF 100%), linear-gradient(135deg, #FF8600 0%, #733E03 100%)",
              }}
              onClick={() => {
                setSelected((prev: string[]) => {
                  if (prev.includes(card.id)) {
                    // deselect
                    return prev.filter((id) => id !== card.id);
                  } else {
                    // select
                    return [...prev, card.id];
                  }
                });
              }}
            >
              <Typography variant="bodySmall" fontSize={12} fontWeight={300}>
                {card.name}
              </Typography>
            </Box>
          );
        })}
        <CustomButton
          onClick={async () => {
            // open recipient dialog
            setOpenRecipient(true);
          }}
          disabled={selected.length === 0}
          text="Generate Bundle QR"
          variant="light"
        />
      </Stack>
      <RecipientCard
        traits={traitCards.filter((c) => selected.includes(c.id))}
        open={openRecipient}
        handleClose={() => {
          setOpenRecipient(false);
        }}
        handleSubmit={(v) => {
          setBundleQr(v);
          handleClose();
          setOpenRecipient(false);
        }}
      />
    </Dialog>
  );
};
