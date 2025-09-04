const fs = require('fs');
const path = require('path');

async function main() {
  console.log("🔍 Manual Contract Verification for Mantle Sepolia");
  console.log("📍 Contract Address: 0x9A2478962cC59f0A606D536937883cE5845eA400");
  
  // Read the contract source code
  const contractPath = path.join(__dirname, '../contracts/Ezpay.sol');
  const sourceCode = fs.readFileSync(contractPath, 'utf8');
  
  console.log("\n📋 Verification Details:");
  console.log("Contract Name: Ezpay");
  console.log("Compiler Version: 0.8.20");
  console.log("Optimization: Enabled (200 runs)");
  console.log("License: MIT");
  
  console.log("\n📝 Source Code Preview:");
  console.log("=" .repeat(50));
  console.log(sourceCode.substring(0, 500) + "...");
  console.log("=" .repeat(50));
  
  console.log("\n🌐 Manual Verification Instructions:");
  console.log("1. Go to: https://explorer.sepolia.mantle.xyz/address/0x9A2478962cC59f0A606D536937883cE5845eA400");
  console.log("2. Click 'Verify and Publish' button");
  console.log("3. Select 'Solidity (Single file)'");
  console.log("4. Enter the following details:");
  console.log("   - Contract Name: Ezpay");
  console.log("   - Compiler Version: v0.8.20+commit.a1b79de6");
  console.log("   - Optimization: Yes (200 runs)");
  console.log("   - License Type: MIT");
  console.log("5. Copy and paste the entire source code from contracts/Ezpay.sol");
  console.log("6. Click 'Verify and Publish'");
  
  console.log("\n📁 Full source code file location:");
  console.log(contractPath);
  
  console.log("\n✅ After manual verification, the contract source code will be visible on the explorer!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
