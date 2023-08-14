"use client";

import { mobile } from "@/constants/constants";
import { Box, Stack, Typography, useMediaQuery } from "@mui/material";
import React, { useMemo, useState } from "react";
import { useEffect } from "react";
import { callAPI } from "@/helpers/api";
import { Reputation } from "../Home/Home";
import { UnlockRecipientCard } from "../UnlockRecipientCard/UnlockRecipientCard";
import { ProofCard } from "../ProofCard/ProofCard";
import { verifyTraitProof } from "@/helpers/crypto";

export type Bundle = {
  reputationId: number;
  groupId: number;
  proofs: Array<string>;
  nullifierHash: string;
  trait?: {
    name: string;
    description: string;
    id: string;
    logo: string;
    traitLogo?: string;
  };
  isValid: boolean;
};

export type Proof = {
  id: string;
  code: string;
  bundle: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

type Props = {
  uid: string;
};

export const Proof: React.FC<Props> = ({ uid }) => {
  const isMobile = useMediaQuery(mobile);
  const [reputations, setReputations] = useState<Array<Reputation>>([]);
  const [activeTrait, setActiveTrait] = useState("");
  const [bundlesWithValidity, setBundlesWithValidity] = useState<Array<Bundle>>(
    []
  );
  const [recipient, setRecipient] = useState("");
  const [processed, setProcessed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const refetchProof = async (uid: string, rec: string) => {
    if (!uid || !rec) return;
    try {
      setLoading(true);
      // get proof (public)
      const resp = await callAPI(`/proofs/${uid}`, "GET", "", {});
      if (!!resp.message) throw new Error(resp.name);
      if (!resp.bundle) throw new Error("Invalid bundle");
      const bundles: Array<Bundle> = JSON.parse(resp.bundle);
      for (const bundle of bundles) {
        const valid = await verifyTraitProof(
          bundle.groupId,
          bundle.proofs,
          bundle.nullifierHash,
          rec
        );
        bundle.isValid = valid;
      }
      setBundlesWithValidity(bundles);
      setProcessed(true);
      setLoading(false);
    } catch (error) {
      setError("Error verifying proof.");
      setProcessed(true);
    }
  };

  useEffect(() => {
    refetchProof(uid, recipient);
  }, [uid, recipient]);

  const refetchReputations = async () => {
    try {
      // get reputations (public)
      const resp = await callAPI("/reputations", "GET", "", {});
      if (!!resp.message) throw new Error(resp.name);
      if (!resp.data) throw new Error("Providers not found.");
      resp.data.forEach((d: Reputation) => {
        d.content = JSON.parse(d.content);
      });
      setReputations(resp.data);
    } catch (err) {}
  };

  useEffect(() => {
    // on load, fetch reputations
    refetchReputations();
  }, []);

  const bundlesWithTraits = useMemo(() => {
    const result: Array<Bundle> = [];
    bundlesWithValidity.forEach((bun) => {
      const targetReputation = reputations.find(
        (rep) => rep.id === bun.reputationId
      );
      if (!targetReputation) return;
      const targetTrait = (targetReputation?.content?.traits ?? []).find(
        (t: any) => t.id === bun.groupId
      );
      if (!targetTrait) return;
      result.push({
        ...bun,
        trait: {
          name: targetTrait.name ?? "",
          id: `${targetTrait?.id}-${result.length + 1}`,
          description: targetTrait.description ?? "",
          logo: targetReputation.content?.logo ?? "",
          traitLogo: targetTrait.logo ?? "",
        },
      });
    });
    return result;
  }, [bundlesWithValidity, reputations]);

  const validBundles: Array<Bundle> = useMemo(() => {
    return bundlesWithTraits.filter((x) => x.isValid);
  }, [bundlesWithTraits]);

  const invalidBundles: Array<Bundle> = useMemo(() => {
    return bundlesWithTraits.filter((x) => !x.isValid);
  }, [bundlesWithTraits]);

  if (!processed)
    return (
      <UnlockRecipientCard
        setRecipient={setRecipient}
        error={error}
        setError={setError}
        loading={loading}
      />
    );

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
      <Stack direction="column" alignItems="center" mt={4}>
        <img
          src="/assets/logo.png"
          width={48}
          height={48}
          style={{
            objectFit: "contain",
          }}
        />
        <Stack direction={isMobile ? "column" : "row"} gap={3} mt={5}>
          {!!validBundles && (
            <Stack direction="column" alignItems="center" gap={3}>
              <Box
                component="div"
                sx={{
                  width: 200,
                  maxWidth: "90vw",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  pt: 1.5,
                  pb: 1.5,
                  borderRadius: "16px",
                  border: "1px solid #FF8600",
                  background: "#FF8600",
                  boxShadow: "0px 0px 20px 0px rgba(0, 0, 0, 0.15)",
                }}
              >
                <Typography variant="bodySmall" fontWeight={700} color="white">
                  Verified
                </Typography>
              </Box>
              <Stack direction="column" position="relative">
                {validBundles.map((bundle, index) => {
                  return (
                    <Box
                      key={bundle.trait?.id}
                      component="div"
                      sx={{
                        transform: `translateY(-${index * 10}px)`,
                      }}
                    >
                      <ProofCard
                        handleOpen={() => {
                          setActiveTrait(bundle.trait?.id ?? "");
                        }}
                        open={activeTrait === bundle.trait?.id}
                        title={bundle.trait?.name ?? ""}
                        desc={bundle.trait?.description ?? ""}
                        logo={bundle.trait?.logo ?? ""}
                        traitLogo={bundle.trait?.traitLogo ?? ""}
                      />
                    </Box>
                  );
                })}
              </Stack>
            </Stack>
          )}
          {!!invalidBundles && (
            <Stack direction="column" alignItems="center" gap={3}>
              <Box
                component="div"
                sx={{
                  width: 200,
                  maxWidth: "90vw",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  pt: 1.5,
                  pb: 1.5,
                  borderRadius: "16px",
                  border: "1px solid #7A7A7A",
                  background: "#7A7A7A",
                  boxShadow: "0px 0px 20px 0px rgba(0, 0, 0, 0.15)",
                }}
              >
                <Typography variant="bodySmall" fontWeight={700} color="white">
                  Invalid
                </Typography>
              </Box>
              <Stack direction="column" position="relative">
                {invalidBundles.map((bundle, index) => {
                  return (
                    <Box
                      key={bundle.trait?.id}
                      component="div"
                      sx={{
                        transform: `translateY(-${index * 10}px)`,
                      }}
                    >
                      <ProofCard
                        handleOpen={() => {
                          setActiveTrait(bundle.trait?.id ?? "");
                        }}
                        open={activeTrait === bundle.trait?.id}
                        title={bundle.trait?.name ?? ""}
                        desc={bundle.trait?.description ?? ""}
                        logo={bundle.trait?.logo ?? ""}
                        traitLogo={bundle.trait?.traitLogo ?? ""}
                        invalid
                      />
                    </Box>
                  );
                })}
              </Stack>
            </Stack>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};
