"use client";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useEffect } from "react";
import { callAPI } from "@/helpers/api";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Identity, Reputation } from "../Home/Home";
import { useRouter } from "next/navigation";
import { decryptAES, getProvenCallbackUrl } from "@/helpers/crypto";
import { resetUser } from "@/redux/features/userSlice";
import { CustomTextField } from "../CustomTextField/CustomTextField";
import { CustomButton } from "../CustomButton/CustomButton";

type Props = {
  pwd: string;
  reputationId: number;
  callbackUrl: string;
};

export const PasswordCard: React.FC<Props> = ({
  pwd,
  reputationId,
  callbackUrl,
}) => {
  const user = useAppSelector((state) => state.user.user);
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  const [reputation, setReputation] = useState<Reputation | null>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const refetchIdentities = async () => {
    try {
      const resp = await callAPI("/identities", "GET", user.jwt ?? "", {});
      if (!!resp.message) throw new Error(resp.name);
      if (!resp.data) throw new Error("Identities not found.");
      return resp.data;
    } catch (err) {}
  };

  const onSubmit = async () => {
    try {
      setLoading(true);
      // check that the password can be used to decode all previous identities (exclude current one)
      const identities = await refetchIdentities();
      let isDifferentPassword = false;
      for (const id of identities) {
        if (reputationId === id.reputationId) continue;
        if (isDifferentPassword) break;
        try {
          decryptAES(id.keys, pass);
        } catch (err) {
          isDifferentPassword = true;
        }
      }

      if (isDifferentPassword) {
        setOpen(true);
        return;
      }

      const resp = await callAPI("/identities", "POST", user?.jwt ?? "", {
        reputationId,
        password: pass,
      });
      if (!!resp.message) {
        throw new Error(resp.name);
      }
      if (!resp.commitment) throw new Error("Commitment not found.");

      const provenCallback = await getProvenCallbackUrl(
        pass,
        pwd,
        resp.keys,
        callbackUrl
      );

      setLoading(false);

      router.push(provenCallback);
    } catch (err) {
      setLoading(false);
    }
  };

  const refetchReputation = async () => {
    try {
      const resp = await callAPI(
        `/reputations/${reputationId}`,
        "GET",
        user.jwt ?? "",
        {}
      );
      if (!!resp.message) throw new Error(resp.name);
      setReputation(resp);
    } catch (err) {
      dispatch(resetUser());
    }
  };

  useEffect(() => {
    refetchReputation();
  }, [reputationId]);

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
        }}
      >
        <Typography variant="bodySmall" fontWeight={700} mb={2}>
          {!!reputation?.name ? `Link ${reputation.name}` : "Link Provider"}
        </Typography>
        <Typography
          variant="bodySmall"
          fontSize={12}
          fontWeight={300}
          textAlign="center"
          mb={1}
        >
          Encrypt your data with a password
        </Typography>
        <CustomTextField
          value={pass}
          setValue={setPass}
          type="password"
          placeholder="Enter Password"
        />
        <CustomTextField
          type="password"
          value={pass2}
          setValue={setPass2}
          placeholder="Repeat Password"
          onSubmit={() => {
            onSubmit();
          }}
        />
        <CustomButton
          sx={{
            mb: 3,
          }}
          loading={loading}
          disabled={!pass || pass !== pass2}
          onClick={async () => {
            onSubmit();
          }}
          text="Submit"
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
          Back
        </Typography>
      </Stack>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          setLoading(false);
        }}
      >
        <DialogTitle>
          <Typography variant="bodyMedium">
            Oops, looks like you have entered a different password
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography variant="bodySmall">
              Do you want to keep your old password, or update to this new one?
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{
            mb: 3,
          }}
        >
          <CustomButton
            sx={{
              width: "100%",
            }}
            onClick={async () => {
              setOpen(false);
              setLoading(false);
            }}
            variant="grey"
            text="Cancel"
          />
          <CustomButton
            sx={{
              width: "100%",
            }}
            onClick={async () => {
              try {
                const identities = await refetchIdentities();
                for (const id of identities) {
                  const resp = await callAPI(
                    "/identities",
                    "POST",
                    user?.jwt ?? "",
                    {
                      reputationId: id.reputationId,
                      password: pass,
                    }
                  );
                  if (!!resp.message) {
                    throw new Error(resp.name);
                  }
                }
                const resp = await callAPI(
                  "/identities",
                  "POST",
                  user?.jwt ?? "",
                  {
                    reputationId,
                    password: pass,
                  }
                );
                if (!!resp.message) {
                  throw new Error(resp.name);
                }

                if (!resp.commitment) throw new Error("Commitment not found.");

                const provenCallback = await getProvenCallbackUrl(
                  pass,
                  pwd,
                  resp.keys,
                  callbackUrl
                );

                setLoading(false);

                router.push(provenCallback);
              } catch (err) {
                setLoading(false);
              }
            }}
            text="Update All"
          />
        </DialogActions>
      </Dialog>
    </Stack>
  );
};
