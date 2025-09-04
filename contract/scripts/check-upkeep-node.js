#!/usr/bin/env node
// Read-only checkUpkeep using ethers v6 with a direct JSON-RPC provider (no Hardhat)
// Usage:
//   node scripts/check-upkeep-node.js <contract> <receiver> <maxToExpire>
//   or
//   node scripts/check-upkeep-node.js <contract> <encodedHex>

const { ethers } = require("ethers");

const RPC_URL = process.env.RPC_URL || "https://rpc.sepolia.mantle.xyz"; // Mantle Sepolia default

function usage() {
  console.log(`Usage:\n  node scripts/check-upkeep-node.js <contract> <receiver> <maxToExpire>\n  or\n  node scripts/check-upkeep-node.js <contract> <encodedHex>\n\nEnv:\n  RPC_URL (optional) - defaults to Mantle Sepolia`);
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    usage();
    process.exit(1);
  }
  const [contractAddr, a2, a3] = args;
  if (!ethers.isAddress(contractAddr)) throw new Error("contract must be a valid address");

  let checkData;
  if (a2 && a3) {
    if (!ethers.isAddress(a2)) throw new Error("receiver must be a valid address");
    const maxToExpire = BigInt(a3);
    const coder = ethers.AbiCoder.defaultAbiCoder();
    checkData = coder.encode(["address", "uint256"], [a2, maxToExpire]);
  } else if (a2) {
    checkData = a2; // pre-encoded hex
  } else {
    usage();
    process.exit(1);
  }

  const provider = new ethers.JsonRpcProvider(RPC_URL);
  // Minimal ABI for checkUpkeep(bytes) returns (bool, bytes)
  const abi = [
    "function checkUpkeep(bytes checkData) view returns (bool upkeepNeeded, bytes performData)"
  ];
  const contract = new ethers.Contract(contractAddr, abi, provider);
  const [needed, performData] = await contract.checkUpkeep.staticCall(checkData);
  console.log("upkeepNeeded:", needed);
  console.log("performData:", performData);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
