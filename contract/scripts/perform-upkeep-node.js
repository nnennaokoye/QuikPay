#!/usr/bin/env node
// State-changing performUpkeep using ethers v6 with a direct JSON-RPC provider (no Hardhat)
// Usage:
//   node scripts/perform-upkeep-node.js <contract> <receiver> <maxToExpire>
//   or
//   node scripts/perform-upkeep-node.js <contract> <encodedHex>

const { ethers } = require("ethers");

const RPC_URL = process.env.RPC_URL || "https://rpc.sepolia.mantle.xyz"; // Mantle Sepolia default
const PRIVATE_KEY = process.env.PRIVATE_KEY; // required

function usage() {
  console.log(`Usage:\n  node scripts/perform-upkeep-node.js <contract> <receiver> <maxToExpire>\n  or\n  node scripts/perform-upkeep-node.js <contract> <encodedHex>\n\nEnv:\n  RPC_URL (optional) - defaults to Mantle Sepolia\n  PRIVATE_KEY (required) - funded key to send tx`);
}

async function main() {
  if (!PRIVATE_KEY) {
    console.error("Missing PRIVATE_KEY in environment");
    process.exit(1);
  }

  const args = process.argv.slice(2);
  if (args.length < 2) {
    usage();
    process.exit(1);
  }
  const [contractAddr, a2, a3] = args;
  if (!ethers.isAddress(contractAddr)) throw new Error("contract must be a valid address");

  let performData;
  if (a2 && a3) {
    if (!ethers.isAddress(a2)) throw new Error("receiver must be a valid address");
    const maxToExpire = BigInt(a3);
    const coder = ethers.AbiCoder.defaultAbiCoder();
    performData = coder.encode(["address", "uint256"], [a2, maxToExpire]);
  } else if (a2) {
    performData = a2; // pre-encoded hex
  } else {
    usage();
    process.exit(1);
  }

  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  // Minimal ABI for performUpkeep(bytes)
  const abi = [
    "function performUpkeep(bytes performData)"
  ];
  const contract = new ethers.Contract(contractAddr, abi, wallet);
  const tx = await contract.performUpkeep(performData);
  console.log("Submitted performUpkeep, tx:", tx.hash);
  const rcpt = await tx.wait();
  console.log("Mined in block:", rcpt.blockNumber);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
