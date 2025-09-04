const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const EZPAY_ADDRESS = process.env.EZPAY_ADDRESS; // required
  const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS; // MockUSDC
  const AMOUNT = process.env.AMOUNT || (1_000_000).toString(); // 1 mUSDC (6 decimals)

  if (!EZPAY_ADDRESS || !TOKEN_ADDRESS) {
    throw new Error("Set EZPAY_ADDRESS and TOKEN_ADDRESS env vars");
  }

  const network = await ethers.provider.getNetwork();
  const chainId = Number(network.chainId);
  console.log("Network:", network.name, chainId);
  console.log("Ezpay:", EZPAY_ADDRESS);
  console.log("Token:", TOKEN_ADDRESS);

  // Wallets
  const deployer = (await ethers.getSigners())[0];
  const sponsorPk = (process.env.SPONSOR_PK || process.env.PRIVATE_KEY || "").trim();
  const payerPk = (process.env.PAYER_PK || process.env.PRIVATE_KEY || "").trim();
  const merchantPk = (process.env.MERCHANT_PK || process.env.PRIVATE_KEY || "").trim();

  const sponsor = sponsorPk ? new ethers.Wallet(sponsorPk.startsWith("0x") ? sponsorPk : "0x"+sponsorPk, ethers.provider) : deployer;
  const payer = payerPk ? new ethers.Wallet(payerPk.startsWith("0x") ? payerPk : "0x"+payerPk, ethers.provider) : deployer;
  const merchant = merchantPk ? new ethers.Wallet(merchantPk.startsWith("0x") ? merchantPk : "0x"+merchantPk, ethers.provider) : deployer;

  console.log("Sponsor:", await sponsor.getAddress());
  console.log("Payer:", await payer.getAddress());
  console.log("Merchant:", await merchant.getAddress());

  // Instances
  const Ezpay = await ethers.getContractAt("Ezpay", EZPAY_ADDRESS);
  const token = await ethers.getContractAt("MockUSDC", TOKEN_ADDRESS);

  // Ensure payer has tokens (transfer from deployer/owner if needed)
  const payerBal = await token.balanceOf(await payer.getAddress());
  console.log("Payer mUSDC before:", payerBal.toString());
  if (payerBal < BigInt(AMOUNT)) {
    console.log("Transferring tokens to payer...");
    const tx = await token.connect(deployer).transfer(await payer.getAddress(), AMOUNT);
    await tx.wait();
  }

  // Build merchant authorization (PayAuthorization)
  const receiver = await merchant.getAddress();
  const tokenAddr = TOKEN_ADDRESS;
  const contractAddress = EZPAY_ADDRESS;

  // message = keccak256(abi.encode(receiver, token, chainId, contractAddress))
  const encoded = ethers.AbiCoder.defaultAbiCoder().encode([
    "address","address","uint256","address"
  ], [receiver, tokenAddr, chainId, contractAddress]);
  const innerHash = ethers.keccak256(encoded);
  const ethHash = ethers.hashMessage(ethers.getBytes(innerHash));
  const merchantSig = await merchant.signMessage(ethers.getBytes(innerHash));

  const auth = {
    receiver,
    token: tokenAddr,
    chainId,
    contractAddress,
    signature: merchantSig,
  };

  // Build EIP-2612 permit for payer
  const name = await token.name();
  const version = "1"; // OpenZeppelin ERC20Permit default
  const owner = await payer.getAddress();
  const spender = EZPAY_ADDRESS;
  const value = BigInt(AMOUNT);
  const nonce = await token.nonces(owner);
  const deadline = Math.floor(Date.now()/1000) + 3600; // +1h

  const domain = {
    name,
    version,
    chainId,
    verifyingContract: TOKEN_ADDRESS,
  };

  const types = {
    Permit: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
      { name: "value", type: "uint256" },
      { name: "nonce", type: "uint256" },
      { name: "deadline", type: "uint256" },
    ],
  };

  const message = { owner, spender, value, nonce, deadline };

  const sig = await payer.signTypedData(domain, types, message);
  const sigBytes = ethers.getBytes(sig);
  const r = ethers.hexlify(sigBytes.slice(0, 32));
  const s = ethers.hexlify(sigBytes.slice(32, 64));
  const v = sigBytes[64];

  const permit = {
    owner,
    token: TOKEN_ADDRESS,
    value,
    deadline,
    v,
    r,
    s,
  };

  console.log("Calling payDynamicERC20WithPermit via sponsor...");
  const ezpaySponsor = Ezpay.connect(sponsor);
  const tx = await ezpaySponsor.payDynamicERC20WithPermit(auth, permit);
  const receipt = await tx.wait();
  console.log("Tx mined:", receipt.hash);

  const payerBalAfter = await token.balanceOf(owner);
  const merchBalAfter = await token.balanceOf(receiver);
  console.log("Merchant mUSDC after:", merchBalAfter.toString());
}

main().then(()=>process.exit(0)).catch((e)=>{console.error(e); process.exit(1);});
