#!/usr/bin/env node
// Inspect a receiver's bills on Ezpay: lists bill IDs, paid/canceled, createdAt, and whether expired now
// Usage:
//   node scripts/inspect-receiver-bills.js <contract> <receiver>
// Env:
//   RPC_URL (optional) - defaults to Mantle Sepolia RPC

const { ethers } = require("ethers");

const RPC_URL = process.env.RPC_URL || "https://rpc.sepolia.mantle.xyz";

function usage() {
  console.log("Usage:\n  node scripts/inspect-receiver-bills.js <contract> <receiver>");
}

async function main() {
  const [contractAddr, receiver] = process.argv.slice(2);
  if (!contractAddr || !receiver) {
    usage();
    process.exit(1);
  }
  if (!ethers.isAddress(contractAddr)) throw new Error("Invalid contract address");
  if (!ethers.isAddress(receiver)) throw new Error("Invalid receiver address");

  const provider = new ethers.JsonRpcProvider(RPC_URL);

  const abi = [
    "function getUserBills(address user) view returns (bytes32[])",
    "function getBill(bytes32 billId) view returns (tuple(address receiver,address token,uint256 amount,bool paid,bool canceled,uint256 createdAt,uint256 paidAt,address payer))",
    "function BILL_EXPIRY_SECONDS() view returns (uint256)"
  ];

  const contract = new ethers.Contract(contractAddr, abi, provider);

  const expirySeconds = await contract.BILL_EXPIRY_SECONDS();
  const list = await contract.getUserBills(receiver);

  console.log("Receiver:", receiver);
  console.log("Total bills:", list.length);
  console.log("Expiry window (s):", expirySeconds.toString());

  if (list.length === 0) return;

  const now = Math.floor(Date.now() / 1000);

  for (let i = 0; i < list.length; i++) {
    const id = list[i];
    const bill = await contract.getBill(id);
    const createdAt = Number(bill.createdAt);
    const expiredNow = !bill.paid && !bill.canceled && createdAt + Number(expirySeconds) <= now;

    console.log("\n#", i + 1);
    console.log("billId:", id);
    console.log("token:", bill.token);
    console.log("amount:", bill.amount.toString());
    console.log("paid:", bill.paid);
    console.log("canceled:", bill.canceled);
    console.log("createdAt:", createdAt, new Date(createdAt * 1000).toISOString());
    console.log("paidAt:", bill.paidAt.toString());
    console.log("payer:", bill.payer);
    console.log("expiredNow:", expiredNow);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
