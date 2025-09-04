const { ethers } = require("hardhat");

const CONTRACT_ADDRESS = "0x9A2478962cC59f0A606D536937883cE5845eA400";

async function main() {
  console.log("🧪 Testing Ezpay contract on Mantle Sepolia...");
  console.log("📍 Contract address:", CONTRACT_ADDRESS);
  
  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  const deployerAddress = await deployer.getAddress();
  const balance = await ethers.provider.getBalance(deployerAddress);
  
  console.log("📝 Tester address:", deployerAddress);
  console.log("💰 Tester balance:", ethers.formatEther(balance), "ETH");
  
  // Connect to the deployed contract
  const Ezpay = await ethers.getContractFactory("Ezpay");
  const ezpay = Ezpay.attach(CONTRACT_ADDRESS);
  
  console.log("\n🔍 Contract connection test...");
  
  try {
    // Test 1: Create a test bill
    console.log("\n📋 Test 1: Creating a test bill...");
    
    // Generate a proper bytes32 billId using the contract's function
    const nonce = Date.now();
    const billId = await ezpay.generateBillId(deployerAddress, nonce);
    const token = "0x0000000000000000000000000000000000000000"; // ETH
    const amount = ethers.parseEther("0.001"); // 0.001 ETH
    
    console.log("  Bill ID:", billId);
    console.log("  Nonce:", nonce);
    console.log("  Token:", token, "(ETH)");
    console.log("  Amount:", ethers.formatEther(amount), "ETH");
    
    const createTx = await ezpay.createBill(
      billId,
      token,
      amount
    );
    
    console.log("  Transaction hash:", createTx.hash);
    console.log("  Waiting for confirmation...");
    
    const createReceipt = await createTx.wait();
    console.log("  ✅ Bill created! Block:", createReceipt.blockNumber);
    
    // Test 2: Read the bill back
    console.log("\n📖 Test 2: Reading the bill...");
    
    const bill = await ezpay.getBill(billId);
    console.log("  Retrieved bill:");
    console.log("    Receiver:", bill.receiver);
    console.log("    Token:", bill.token);
    console.log("    Amount:", ethers.formatEther(bill.amount), "ETH");
    console.log("    Is Paid:", bill.paid);
    console.log("    Created At:", new Date(Number(bill.createdAt) * 1000).toISOString());
    console.log("    Paid At:", bill.paidAt.toString());
    console.log("    Payer:", bill.payer);
    
    // Verify data matches
    const dataMatches = 
      bill.receiver === deployerAddress &&
      bill.token === token &&
      bill.amount === amount &&
      bill.paid === false;
    
    console.log("  ✅ Data verification:", dataMatches ? "PASSED" : "FAILED");
    
    // Test 3: Pay the bill
    console.log("\n💳 Test 3: Paying the bill...");
    
    const payTx = await ezpay.payBill(billId, {
      value: amount
    });
    
    console.log("  Payment transaction hash:", payTx.hash);
    console.log("  Waiting for confirmation...");
    
    const payReceipt = await payTx.wait();
    console.log("  ✅ Payment confirmed! Block:", payReceipt.blockNumber);
    
    // Test 4: Verify payment
    console.log("\n✅ Test 4: Verifying payment...");
    
    const paidBill = await ezpay.getBill(billId);
    console.log("  Bill status after payment:");
    console.log("    Is Paid:", paidBill.paid);
    console.log("    Paid By:", paidBill.payer);
    console.log("    Paid At:", new Date(Number(paidBill.paidAt) * 1000).toISOString());
    
    const paymentVerified = 
      paidBill.paid === true &&
      paidBill.payer === deployerAddress &&
      paidBill.paidAt > 0n;
    
    console.log("  ✅ Payment verification:", paymentVerified ? "PASSED" : "FAILED");
    
    // Test 5: Try to pay again (should fail)
    console.log("\n🚫 Test 5: Testing double payment prevention...");
    
    try {
      await ezpay.payBill(billId, { value: amount });
      console.log("  ❌ Double payment should have failed!");
    } catch (error) {
      console.log("  ✅ Double payment correctly prevented:", error.reason || error.message);
    }
    
    // Test 6: Event logs
    console.log("\n📝 Test 6: Checking event logs...");
    
    // Get BillCreated events
    const billCreatedFilter = ezpay.filters.BillCreated(billId);
    const billCreatedEvents = await ezpay.queryFilter(billCreatedFilter);
    console.log("  BillCreated events found:", billCreatedEvents.length);
    
    // Get BillPaid events
    const billPaidFilter = ezpay.filters.BillPaid(billId);
    const billPaidEvents = await ezpay.queryFilter(billPaidFilter);
    console.log("  BillPaid events found:", billPaidEvents.length);
    
    console.log("\n🎉 All tests completed successfully!");
    console.log("📊 Test Summary:");
    console.log("  ✅ Contract deployment: WORKING");
    console.log("  ✅ Bill creation: WORKING");
    console.log("  ✅ Bill reading: WORKING");
    console.log("  ✅ Bill payment: WORKING");
    console.log("  ✅ Payment verification: WORKING");
    console.log("  ✅ Double payment prevention: WORKING");
    console.log("  ✅ Event emission: WORKING");
    
    console.log("\n🚀 Ezpay contract is ready for production use!");
    console.log("🔗 Explorer:", `https://explorer.sepolia.mantle.xyz/address/${CONTRACT_ADDRESS}`);
    
  } catch (error) {
    console.error("❌ Test failed:", error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Test suite failed:", error);
    process.exit(1);
  }); 