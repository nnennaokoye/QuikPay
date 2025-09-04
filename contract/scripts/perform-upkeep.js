const { ethers } = require("hardhat");

function usage() {
  console.log(
    "Usage:\n  npx hardhat run scripts/perform-upkeep.js --network <network> -- <contract> <receiver> <maxToExpire>\n  or\n  npx hardhat run scripts/perform-upkeep.js --network <network> -- <contract> <encodedHex>\n\nNotes:\n- Use the '--' separator to stop Hardhat from parsing script args."
  );
}

async function main() {
  
  const sepIndex = process.argv.indexOf('--');
  const args = sepIndex >= 0
    ? process.argv.slice(sepIndex + 1)
    : process.argv.slice(2).filter(a => !a.startsWith("--"));

  if (args.length < 2) {
    usage();
    process.exit(1);
  }
  const [contractAddr, a2, a3] = args;
  const ezpay = await ethers.getContractAt("Ezpay", contractAddr);

  let performData;
  if (a2 && a3) {
    if (!ethers.isAddress(a2)) throw new Error("receiver must be a valid address");
    const maxToExpire = BigInt(a3);
    const coder = ethers.AbiCoder.defaultAbiCoder();
    performData = coder.encode(["address", "uint256"], [a2, maxToExpire]);
  } else if (a2) {

    performData = a2;
  } else {
    usage();
    process.exit(1);
  }

  const tx = await ezpay.performUpkeep(performData);
  console.log("Submitted performUpkeep, tx:", tx.hash);
  const rcpt = await tx.wait();
  console.log("Mined in block:", rcpt.blockNumber);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
