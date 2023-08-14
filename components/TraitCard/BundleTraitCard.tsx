"use client";

import { Stack, Typography } from "@mui/material";
import React, { useCallback, useState } from "react";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";
import { CustomButton } from "../CustomButton/CustomButton";

type Props = {
  handleOpen: () => void;
  open: boolean;
  qr: string;
  setOpenBundle: Function;
};

export const BundleTraitCard: React.FC<Props> = ({
  handleOpen,
  open,
  qr,
  setOpenBundle,
}) => {
  const [printRef, setPrintRef] = useState<HTMLDivElement | null>(null);
  const [copied, setCopied] = useState(false);

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
          link.download = `BundleQR.jpg`;
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
          Bundle QR
        </Typography>
      </Stack>
      {open && (
        <Stack direction="column" width="100%" alignItems="center">
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
            onClick={async () => {
              navigator.clipboard.writeText(qr);
              setCopied(true);
            }}
            variant="grey"
            disabled={copied}
            text={copied ? "Copied to Clipboard" : "Copy Link to Clipboard"}
          />
          <CustomButton
            sx={{
              mt: 2,
            }}
            onClick={async () => {
              setCopied(false);
              setOpenBundle();
            }}
            text="Regenerate"
            variant="light"
          />
        </Stack>
      )}
    </Stack>
  );
};
