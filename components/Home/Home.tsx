"use client";

import { Box, Stack, Typography } from "@mui/material";
import React, { useMemo, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { useEffect } from "react";
import { callAPI } from "@/helpers/api";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { LinkProvider } from "../LinkProvider/LinkProvider";
import { TraitCard } from "../TraitCard/TraitCard";
import { GenerateBundle } from "../GenerateBundle/GenerateBundle";
import { resetUser } from "@/redux/features/userSlice";
import { BundleTraitCard } from "../TraitCard/BundleTraitCard";
import { CustomButton } from "../CustomButton/CustomButton";
import { Header } from "../Header/Header";

export type Trait = {
  id: string;
  userId: string;
  groupId: number;
  createdAt: string;
  updatedAt: string;
  traitLogo?: string;
  name?: string;
  logo?: string;
  description?: string;
  keys?: string;
  commitment?: string;
  repId?: number;
};

export type Identity = {
  id: string;
  userId: string;
  reputationId: number;
  commitment: string;
  keys: string;
};

export type Reputation = {
  id: number;
  name: string;
  contentURI: string;
  content: any;
};

export const Home: React.FC = () => {
  const [reputations, setReputations] = useState<Array<Reputation>>([]);
  const [identities, setIdentities] = useState<Array<Identity>>([]);
  const user = useAppSelector((state) => state.user.user);
  const [openLinkProvider, setOpenLinkProvider] = useState(false);
  const [activeTraitCard, setActiveTraitCard] = useState("");
  const [openBundle, setOpenBundle] = useState(false);
  const [traits, setTraits] = useState<Array<Trait>>([]);
  const [bundleQr, setBundleQr] = useState<string>("");
  const dispatch = useAppDispatch();

  const refetchReputations = async () => {
    try {
      const resp = await callAPI("/reputations", "GET", user.jwt ?? "", {});
      if (!!resp.message) throw new Error(resp.name);
      if (!resp.data) throw new Error("Providers not found.");
      resp.data.forEach((d: Reputation) => {
        d.content = JSON.parse(d.content);
      });
      setReputations(resp.data);
    } catch (err) {
      dispatch(resetUser());
    }
  };

  const refetchIdentities = async () => {
    try {
      const resp = await callAPI("/identities", "GET", user.jwt ?? "", {});
      if (!!resp.message) throw new Error(resp.name);
      if (!resp.data) throw new Error("Identities not found.");
      setIdentities(resp.data);
    } catch (err) {
      dispatch(resetUser());
    }
  };

  const refetchTraits = async () => {
    try {
      const resp = await callAPI("/traits", "GET", user.jwt ?? "", {});
      if (!!resp.message) throw new Error(resp.name);
      if (!resp.data) throw new Error("Identities not found.");
      setTraits(resp.data);
    } catch (err) {
      dispatch(resetUser());
    }
  };

  useEffect(() => {
    if (!user?.jwt) return;
    // on load, fetch reputations and identities
    refetchReputations();
    refetchIdentities();
    refetchTraits();
  }, [user?.jwt]);

  const traitCards = useMemo(() => {
    const result: Array<Trait> = JSON.parse(JSON.stringify(traits));
    result.forEach((trait: Trait) => {
      let traitName = "";
      let traitDesc = "";
      let logo = "";
      let keys = "";
      let commitment = "";
      let repId = 0;
      let traitLogo = "";
      reputations.forEach((rep) => {
        if (!!traitName) return;
        const targetTrait = (rep.content?.traits ?? []).find(
          (t: any) => t.id === trait.groupId
        );
        if (!!targetTrait) {
          // patch identity key and commitment
          const targetIdentity = (identities ?? []).find(
            (id) => id.reputationId === rep.id
          );
          if (!!targetIdentity) {
            keys = targetIdentity.keys;
            commitment = targetIdentity.commitment;
          }
          traitDesc = targetTrait.description ?? "";
          traitName = targetTrait.name ?? "";
          logo = rep.content?.logo ?? "";
          traitLogo = targetTrait.logo ?? "";
          repId = rep.id ?? 0;
        }
      });
      trait.name = traitName;
      trait.description = traitDesc;
      trait.traitLogo = traitLogo;
      trait.logo = logo;
      trait.keys = keys;
      trait.commitment = commitment;
      trait.repId = repId;
    });
    return result;
  }, [reputations, traits, identities]);

  return (
    <Stack
      direction="column"
      sx={{
        width: "100vw",
        height: "100vh",
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundImage: "url('/assets/bg.png')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        backgroundColor: "#F6F6F6",
        backgroundAttachment: "fixed",
        overflow: "scroll",
      }}
    >
      <Header />
      <Stack direction="column" alignItems="center" mt={4}>
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
          fontWeight={400}
          fontSize={16}
          mb={2}
          mt={5}
        >
          Welcome to your YOU ID
        </Typography>
        <Typography
          variant="headlineMedium"
          color="#1C1C1E"
          fontWeight={300}
          fontSize={14}
          mb={2}
          fontStyle="italic"
        >
          <b
            style={{
              color: "#FF8600",
            }}
          >
            {identities.length}
          </b>{" "}
          Provider{identities.length > 1 ? "s" : ""} Linked
        </Typography>
        <Stack direction="row" alignItems="center" gap={2} mb={5}>
          <Box
            component="div"
            sx={{
              filter: "drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.10))",
              background: "white",
              borderRadius: "50%",
              border: "1px solid rgba(0, 0, 0, 0.10)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 32,
              height: 32,
              cursor: "pointer",
            }}
            onClick={() => {
              setOpenLinkProvider(true);
            }}
          >
            <AddIcon
              sx={{
                fontSize: 24,
                color: "#010101",
                opacity: 0.5,
              }}
            />
          </Box>
          {reputations
            .filter(
              (reputation) =>
                identities.filter(
                  (identity) => identity.reputationId === reputation.id
                ).length > 0
            )
            .map((reputation) => {
              return (
                <img
                  key={reputation.id}
                  src={reputation.content?.logo ?? ""}
                  alt={reputation.name}
                  width={32}
                  height={32}
                  style={{
                    objectFit: "cover",
                    borderRadius: "50%",
                  }}
                />
              );
            })}
        </Stack>

        {identities.length === 0 && (
          <Box
            component="div"
            mb={5}
            sx={{
              filter: "drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.10))",
              background: "white",
              borderRadius: "16px",
              border: "1px solid rgba(0, 0, 0, 0.10)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              maxWidth: 300,
              cursor: "pointer",
              p: 2,
              pt: 4,
              pb: 4,
            }}
            onClick={() => {
              setOpenLinkProvider(true);
            }}
          >
            <Typography textAlign="center" variant="bodySmall" fontWeight={300}>
              Add Link provider to get reputation card
            </Typography>
          </Box>
        )}

        {identities.length !== 0 && traitCards.length === 0 && (
          <Box
            component="div"
            mb={5}
            sx={{
              filter: "drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.10))",
              background: "white",
              borderRadius: "16px",
              border: "1px solid rgba(0, 0, 0, 0.10)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              maxWidth: 300,
              p: 2,
              pt: 4,
              pb: 4,
            }}
          >
            <Typography textAlign="center" variant="bodySmall" fontWeight={300}>
              Come back later to view your reputation
            </Typography>
          </Box>
        )}

        {traitCards.length > 0 && (
          <Stack direction="column" position="relative" mb={3}>
            {!bundleQr && (
              <CustomButton
                onClick={async () => {
                  setOpenBundle(true);
                }}
                text="Generate Proof in Bundle"
                sx={{
                  width: "100%",
                  maxWidth: "90vw",
                  mb: 3,
                }}
              />
            )}
            {traitCards.map((card, index) => {
              return (
                <Box
                  key={card.id}
                  component="div"
                  sx={{
                    transform: `translateY(-${index * 10}px)`,
                  }}
                >
                  <TraitCard
                    handleOpen={() => {
                      setActiveTraitCard(card.id);
                    }}
                    open={activeTraitCard === card.id}
                    traitCard={card}
                  />
                </Box>
              );
            })}
            {!!bundleQr && (
              <Box
                component="div"
                sx={{
                  transform: `translateY(-${traitCards.length * 10}px)`,
                }}
              >
                <BundleTraitCard
                  handleOpen={() => {
                    setActiveTraitCard("bundleToGenerate");
                  }}
                  open={activeTraitCard === "bundleToGenerate"}
                  qr={bundleQr}
                  setOpenBundle={() => {
                    setOpenBundle(true);
                  }}
                />
              </Box>
            )}
          </Stack>
        )}
      </Stack>
      <LinkProvider
        open={openLinkProvider}
        handleClose={() => {
          setOpenLinkProvider(false);
        }}
        reputations={reputations.filter(
          (reputation) =>
            identities.filter(
              (identity) => identity.reputationId === reputation.id
            ).length === 0
        )}
      />
      <GenerateBundle
        open={openBundle}
        handleClose={() => {
          setOpenBundle(false);
          setActiveTraitCard("bundleToGenerate");
        }}
        traitCards={traitCards}
        setBundleQr={setBundleQr}
      />
    </Stack>
  );
};
