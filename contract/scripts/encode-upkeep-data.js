#!/usr/bin/env node
// Encode perform/check data for Chainlink Automation: abi.encode(address receiver, uint256 maxToExpire)
const { ethers } = require("ethers");

function usage() {
  console.log("Usage: node scripts/encode-upkeep-data.js <receiver> <maxToExpire>");
  console.log("Example: node scripts/encode-upkeep-data.js 0xabc123... 10");
}

async function main() {
  const [,, receiver, maxStr] = process.argv;
  if (!receiver || !maxStr) {
    usage();
    process.exit(1);
  }
  if (!ethers.isAddress(receiver)) {
    console.error("Invalid receiver address");
    process.exit(1);
  }
  const maxToExpire = BigInt(maxStr);
  if (maxToExpire <= 0n) {
    console.error("maxToExpire must be > 0");
    process.exit(1);
  }
  const abiCoder = ethers.AbiCoder.defaultAbiCoder();
  const encoded = abiCoder.encode(["address", "uint256"], [receiver, maxToExpire]);
  console.log("checkData/performData (hex):", encoded);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
