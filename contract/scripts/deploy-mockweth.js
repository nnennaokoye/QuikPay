const { ethers } = require("hardhat");

async function main() {
  console.log(" Deploying MockWETH (ERC20Permit)...");

  const [deployer] = await ethers.getSigners();
  const deployerAddress = await deployer.getAddress();
  const balance = await ethers.provider.getBalance(deployerAddress);

  console.log(" Deployer:", deployerAddress);
  console.log(" Balance:", ethers.formatEther(balance), "ETH");

  const network = await ethers.provider.getNetwork();
  console.log(" Network:", network.name, "(" + network.chainId + ")");

  const Token = await ethers.getContractFactory("MockWETH");
  const token = await Token.deploy();
  await token.waitForDeployment();

  const address = await token.getAddress();
  console.log("✅ MockWETH deployed at:", address);

  console.log(" Symbol:", await token.symbol());
  console.log(" Decimals:", await token.decimals());
  console.log(" Deployer token balance:", (await token.balanceOf(deployerAddress)).toString());

  console.log(" Explorer:", getExplorerUrl(network.chainId, address));
}

function getExplorerUrl(chainId, address) {
  switch (chainId.toString()) {
    case "5003":
      return `https://explorer.sepolia.mantle.xyz/address/${address}`;
    case "5000":
      return `https://explorer.mantle.xyz/address/${address}`;
    default:
      return `Chain ID ${chainId}`;
  }
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
