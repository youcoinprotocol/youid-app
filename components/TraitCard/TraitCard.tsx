"use client";

import { Stack, Typography } from "@mui/material";
import React, { useCallback, useState } from "react";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";
import { Trait } from "../Home/Home";
import { RecipientCard } from "../RecipientCard/RecipientCard";
import { CustomButton } from "../CustomButton/CustomButton";

type Props = {
  handleOpen: () => void;
  open: boolean;
  traitCard: Trait;
};

export const TraitCard: React.FC<Props> = ({ handleOpen, open, traitCard }) => {
  const [printRef, setPrintRef] = useState<HTMLDivElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [openRecipient, setOpenRecipient] = useState(false);
  const [qr, setQr] = useState("");

  const handleDownloadImage = useCallback(async () => {
    const element = printRef;
    if (!element) return;
    const canvas = await html2canvas(element);

    const data = canvas.toDataURL("image/jpg");

    canvas.toBlob((blob) => {
      if (!blob) return;
      var file = new File([blob], "my_qr.jpg", { type: blob.type });
      const shareData: ShareData = {
        // text: qr ?? "",
        // title: `View my YOUID trait now: ${qr}`,
        files: [file],
      };
      if (navigator.share && navigator.canShare(shareData)) {
        navigator.share(shareData);
      } else {
        const link = document.createElement("a");
        if (typeof link.download === "string") {
          link.href = data;
          link.download = `${traitCard.name ?? "qr"}.jpg`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          window.open(data);
        }
      }
    });
  }, [printRef]);

  return (
    <Stack
      direction="column"
      alignItems="flex-start"
      p={1.5}
      pb={3}
      width={300}
      maxWidth="70vw"
      sx={{
        borderRadius: "16px",
        background: "#FAFAFC",
        boxShadow: "0px 0px 20px 0px rgba(0, 0, 0, 0.15)",
        cursor: open ? "auto" : "pointer",
      }}
      onClick={() => {
        setCopied(false);
        handleOpen();
      }}
    >
      <Stack direction="row" gap={3} alignItems="center" mb={1} width="100%">
        <Typography variant="bodySmall" fontWeight={700} flex={1}>
          {traitCard.name ?? ""}
        </Typography>
        {!!traitCard.logo && (
          <img
            src={traitCard.logo ?? ""}
            alt={traitCard.name}
            height={10}
            style={{
              objectFit: "cover",
              borderRadius: "50%",
            }}
          />
        )}
      </Stack>
      {open &&
        (!qr ? (
          <Stack direction="column" width="100%">
            {!!traitCard.traitLogo && (
              <img
                src={traitCard.traitLogo}
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
            >
              {traitCard.description ?? ""}
            </Typography>
            <CustomButton
              sx={{
                mb: 1,
              }}
              variant="grey"
              onClick={async () => {
                setOpenRecipient(true);
              }}
              text="Generate Proof"
            />
          </Stack>
        ) : (
          <Stack direction="column" width="100%" alignItems="center">
            {!!traitCard.traitLogo && (
              <img
                src={traitCard.traitLogo}
                width={60}
                height={60}
                alt="logo"
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
            >
              {traitCard.description ?? ""}
            </Typography>
            <Stack
              component="div"
              ref={(el: HTMLDivElement) => setPrintRef(el)}
              sx={{
                alignItems: "center",
                justifyContent: "center",
                mb: 3,
              }}
            >
              <QRCode
                size={256}
                style={{ height: "auto", maxWidth: "80%", width: "80%" }}
                value={qr}
                viewBox={`0 0 256 256`}
              />
            </Stack>
            <CustomButton
              sx={{
                mb: 1,
              }}
              variant="grey"
              onClick={async () => {
                handleDownloadImage();
              }}
              text="Share QR"
            />
            <CustomButton
              sx={{
                mb: 1,
              }}
              variant="grey"
              onClick={async () => {
                navigator.clipboard.writeText(qr);
                setCopied(true);
              }}
              disabled={copied}
              text={copied ? "Copied to Clipboard" : "Copy Link to Clipboard"}
            />
          </Stack>
        ))}
      <RecipientCard
        open={openRecipient}
        handleClose={() => {
          setOpenRecipient(false);
        }}
        handleSubmit={(v: string) => {
          setOpenRecipient(false);
          setQr(v);
        }}
        traits={[traitCard]}
      />
    </Stack>
  );
};
