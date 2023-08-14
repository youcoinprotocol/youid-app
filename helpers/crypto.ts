import crypto from "crypto";
import { generateProof } from "@semaphore-protocol/proof";
import { Identity } from "@semaphore-protocol/identity";
import { Group } from "@semaphore-protocol/group";
import * as ethers from "ethers";
import * as process from "process";
import { verifyProof, calculateNullifierHash } from "@semaphore-protocol/proof";
import { callAPI } from "./api";
const ABI = require("./abi.json");

export async function getMerkleTreeRoot(
  groupId: number
): Promise<ethers.BigNumberish> {
  const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_JSONRPC);
  const contract = new ethers.Contract(
    process.env.NEXT_PUBLIC_SEMAPHORE_CONTRACT ?? "",
    ABI,
    provider
  );
  const res = await contract.getMerkleTreeRoot(groupId);
  return res;
}

export function encryptAES(input: string, key: string): string {
  const iv = crypto.randomBytes(16);

  const hashedKey = generateMD5Hash(key);

  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(hashedKey),
    iv
  );

  let encrypted = cipher.update(input);

  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return Buffer.from(
    iv.toString("base64") + ":" + encrypted.toString("base64")
  ).toString("base64");
}

export function decryptAES(encryptedData: string, key: string): string {
  const hashedKey = generateMD5Hash(key);

  const [ivString, encryptedString] = Buffer.from(encryptedData, "base64")
    .toString()
    .split(":");

  const iv = Buffer.from(ivString, "base64");

  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(hashedKey),
    iv
  );

  let decrypted = decipher.update(Buffer.from(encryptedString, "base64"));

  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
}

export function generateMD5Hash(input: string): string {
  const md5Hash = crypto.createHash("md5").update(input).digest("hex");

  return md5Hash;
}

export const getProvenCallbackUrl = async (
  password: string,
  pwd: string,
  keys: string,
  callbackUrl: string
) => {
  const cwd = process.cwd();

  const identity = new Identity(decryptAES(keys, password));
  const { trapdoor, nullifier, commitment } = identity;
  const group = new Group(1);
  group.addMember(commitment);
  const mp = group.generateMerkleProof(0);
  const externalNullifier = ethers.encodeBytes32String(pwd);
  const signal = ethers.encodeBytes32String(pwd);

  const fullProof = await generateProof(
    identity,
    mp,
    externalNullifier,
    signal
  );

  const proofs = fullProof.proof;
  const nullifierHash = calculateNullifierHash(
    identity.nullifier,
    externalNullifier
  );

  const callback = `${callbackUrl}?commitment=${commitment.toString()}&pwd=${pwd}&proofs=${encodeURIComponent(
    JSON.stringify(proofs)
  )}&nullifierHash=${nullifierHash}`;

  return callback;
};

export const generateTraitProof = async (
  keys: string,
  password: string,
  recipient: string,
  traitGroupId: number,
  traitRepId: number
) => {
  const identity = new Identity(decryptAES(keys, password));
  const groupData = await callAPI(`/groups/${traitGroupId}`, "GET");
  const group = new Group(traitGroupId, 20);
  for (const m of groupData.members) {
    group.addMember(m);
  }

  const externalNullifier = ethers.encodeBytes32String(recipient);
  const signal = ethers.encodeBytes32String(recipient);

  const fullProof = await generateProof(
    identity,
    group,
    externalNullifier,
    signal
  );

  return {
    reputationId: traitRepId,
    groupId: traitGroupId,
    proofs: fullProof.proof,
    nullifierHash: fullProof.nullifierHash,
  };
};

export const verifyTraitProof = async (
  traitGroupId: number,
  proof: string[],
  nullifierHash: string,
  recipient: string
) => {
  const externalNullifier = ethers.encodeBytes32String(recipient);
  const signal = ethers.encodeBytes32String(recipient);

  const myProof = {
    merkleTreeRoot: await getMerkleTreeRoot(traitGroupId),
    nullifierHash,
    signal,
    externalNullifier,
    proof,
  };

  // @ts-ignore
  const verificationRes = await verifyProof(myProof, 20);
  return verificationRes;
};
