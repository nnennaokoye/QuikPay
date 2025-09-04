// QuikPay Contract Configuration
export const QUIKPAY_CONTRACT_ADDRESS = "0x05D3BC969F427d8477C71690B247Fb9E6D390e17" as const;

export const QUIKPAY_ABI = [
  { "type": "constructor", "inputs": [], "stateMutability": "nonpayable" },
  { "type": "function", "name": "BILL_EXPIRY_SECONDS", "inputs": [], "outputs": [ { "name": "", "type": "uint256", "internalType": "uint256" } ], "stateMutability": "view" },
  {
    "type": "function",
    "name": "payDynamicETH",
    "inputs": [
      {
        "name": "auth",
        "type": "tuple",
        "internalType": "struct QuikPay.PayAuthorization",
        "components": [
          { "name": "receiver", "type": "address", "internalType": "address" },
          { "name": "token", "type": "address", "internalType": "address" },
          { "name": "chainId", "type": "uint256", "internalType": "uint256" },
          { "name": "contractAddress", "type": "address", "internalType": "address" },
          { "name": "signature", "type": "bytes", "internalType": "bytes" }
        ]
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "payDynamicERC20WithPermit",
    "inputs": [
      {
        "name": "auth",
        "type": "tuple",
        "internalType": "struct QuikPay.PayAuthorization",
        "components": [
          { "name": "receiver", "type": "address", "internalType": "address" },
          { "name": "token", "type": "address", "internalType": "address" },
          { "name": "chainId", "type": "uint256", "internalType": "uint256" },
          { "name": "contractAddress", "type": "address", "internalType": "address" },
          { "name": "signature", "type": "bytes", "internalType": "bytes" }
        ]
      },
      {
        "name": "permit",
        "type": "tuple",
        "internalType": "struct QuikPay.PermitData",
        "components": [
          { "name": "owner", "type": "address", "internalType": "address" },
          { "name": "token", "type": "address", "internalType": "address" },
          { "name": "value", "type": "uint256", "internalType": "uint256" },
          { "name": "deadline", "type": "uint256", "internalType": "uint256" },
          { "name": "v", "type": "uint8", "internalType": "uint8" },
          { "name": "r", "type": "bytes32", "internalType": "bytes32" },
          { "name": "s", "type": "bytes32", "internalType": "bytes32" }
        ]
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  { "type": "function", "name": "createBill", "inputs": [
      { "name": "billId", "type": "bytes32", "internalType": "bytes32" },
      { "name": "token", "type": "address", "internalType": "address" },
      { "name": "amount", "type": "uint256", "internalType": "uint256" }
    ], "outputs": [], "stateMutability": "nonpayable" },
  { "type": "function", "name": "payBill", "inputs": [ { "name": "billId", "type": "bytes32", "internalType": "bytes32" } ], "outputs": [], "stateMutability": "payable" },
  { "type": "function", "name": "payBillWithAuthorization", "inputs": [
      { "name": "authorization", "type": "tuple", "internalType": "struct QuikPay.Authorization", "components": [
        { "name": "authorizer", "type": "address", "internalType": "address" },
        { "name": "billId", "type": "bytes32", "internalType": "bytes32" },
        { "name": "nonce", "type": "uint256", "internalType": "uint256" },
        { "name": "chainId", "type": "uint256", "internalType": "uint256" },
        { "name": "contractAddress", "type": "address", "internalType": "address" },
        { "name": "signature", "type": "bytes", "internalType": "bytes" }
      ] }
    ], "outputs": [], "stateMutability": "payable" },
  { "type": "function", "name": "expireOldBills", "inputs": [ { "name": "receiver", "type": "address", "internalType": "address" }, { "name": "maxToExpire", "type": "uint256", "internalType": "uint256" } ], "outputs": [], "stateMutability": "nonpayable" },
  { "type": "function", "name": "checkUpkeep", "inputs": [ { "name": "checkData", "type": "bytes", "internalType": "bytes" } ], "outputs": [ { "name": "upkeepNeeded", "type": "bool", "internalType": "bool" }, { "name": "performData", "type": "bytes", "internalType": "bytes" } ], "stateMutability": "view" },
  { "type": "function", "name": "performUpkeep", "inputs": [ { "name": "performData", "type": "bytes", "internalType": "bytes" } ], "outputs": [], "stateMutability": "nonpayable" },
  { "type": "function", "name": "billStatus", "inputs": [ { "name": "billId", "type": "bytes32", "internalType": "bytes32" } ], "outputs": [ { "name": "exists", "type": "bool", "internalType": "bool" }, { "name": "isPaid", "type": "bool", "internalType": "bool" } ], "stateMutability": "view" },
  { "type": "function", "name": "bills", "inputs": [ { "name": "", "type": "bytes32", "internalType": "bytes32" } ], "outputs": [
      { "name": "receiver", "type": "address", "internalType": "address" },
      { "name": "token", "type": "address", "internalType": "address" },
      { "name": "amount", "type": "uint256", "internalType": "uint256" },
      { "name": "paid", "type": "bool", "internalType": "bool" },
      { "name": "canceled", "type": "bool", "internalType": "bool" },
      { "name": "createdAt", "type": "uint256", "internalType": "uint256" },
      { "name": "paidAt", "type": "uint256", "internalType": "uint256" },
      { "name": "payer", "type": "address", "internalType": "address" }
    ], "stateMutability": "view" },
  { "type": "function", "name": "generateBillId", "inputs": [ { "name": "user", "type": "address", "internalType": "address" }, { "name": "nonce", "type": "uint256", "internalType": "uint256" } ], "outputs": [ { "name": "", "type": "bytes32", "internalType": "bytes32" } ], "stateMutability": "view" },
  { "type": "function", "name": "getBill", "inputs": [ { "name": "billId", "type": "bytes32", "internalType": "bytes32" } ], "outputs": [ { "name": "", "type": "tuple", "internalType": "struct QuikPay.Bill", "components": [
      { "name": "receiver", "type": "address", "internalType": "address" },
      { "name": "token", "type": "address", "internalType": "address" },
      { "name": "amount", "type": "uint256", "internalType": "uint256" },
      { "name": "paid", "type": "bool", "internalType": "bool" },
      { "name": "canceled", "type": "bool", "internalType": "bool" },
      { "name": "createdAt", "type": "uint256", "internalType": "uint256" },
      { "name": "paidAt", "type": "uint256", "internalType": "uint256" },
      { "name": "payer", "type": "address", "internalType": "address" }
    ] } ], "stateMutability": "view" },
  { "type": "function", "name": "getNonce", "inputs": [ { "name": "user", "type": "address", "internalType": "address" } ], "outputs": [ { "name": "", "type": "uint256", "internalType": "uint256" } ], "stateMutability": "view" },
  { "type": "function", "name": "getUserBills", "inputs": [ { "name": "user", "type": "address", "internalType": "address" } ], "outputs": [ { "name": "", "type": "bytes32[]", "internalType": "bytes32[]" } ], "stateMutability": "view" },
  { "type": "function", "name": "nonces", "inputs": [ { "name": "", "type": "address", "internalType": "address" } ], "outputs": [ { "name": "", "type": "uint256", "internalType": "uint256" } ], "stateMutability": "view" },
  { "type": "function", "name": "totalBills", "inputs": [], "outputs": [ { "name": "", "type": "uint256", "internalType": "uint256" } ], "stateMutability": "view" },
  { "type": "function", "name": "totalPaidBills", "inputs": [], "outputs": [ { "name": "", "type": "uint256", "internalType": "uint256" } ], "stateMutability": "view" },
  { "type": "function", "name": "userBills", "inputs": [ { "name": "", "type": "address", "internalType": "address" }, { "name": "", "type": "uint256", "internalType": "uint256" } ], "outputs": [ { "name": "", "type": "bytes32", "internalType": "bytes32" } ], "stateMutability": "view" },
  { "type": "event", "name": "BillCreated", "inputs": [
      { "name": "billId", "type": "bytes32", "indexed": true, "internalType": "bytes32" },
      { "name": "receiver", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "token", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "amount", "type": "uint256", "indexed": false, "internalType": "uint256" },
      { "name": "timestamp", "type": "uint256", "indexed": false, "internalType": "uint256" }
    ], "anonymous": false },
  { "type": "event", "name": "BillExpired", "inputs": [
      { "name": "billId", "type": "bytes32", "indexed": true, "internalType": "bytes32" },
      { "name": "receiver", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "timestamp", "type": "uint256", "indexed": false, "internalType": "uint256" }
    ], "anonymous": false },
  { "type": "event", "name": "BillPaid", "inputs": [
      { "name": "billId", "type": "bytes32", "indexed": true, "internalType": "bytes32" },
      { "name": "payer", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "receiver", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "token", "type": "address", "indexed": false, "internalType": "address" },
      { "name": "amount", "type": "uint256", "indexed": false, "internalType": "uint256" },
      { "name": "timestamp", "type": "uint256", "indexed": false, "internalType": "uint256" }
    ], "anonymous": false },
  { "type": "event", "name": "DynamicErc20Paid", "inputs": [
      { "name": "receiver", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "payer", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "token", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "amount", "type": "uint256", "indexed": false, "internalType": "uint256" },
      { "name": "timestamp", "type": "uint256", "indexed": false, "internalType": "uint256" }
    ], "anonymous": false },
  { "type": "event", "name": "DynamicEthPaid", "inputs": [
      { "name": "receiver", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "payer", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "amount", "type": "uint256", "indexed": false, "internalType": "uint256" },
      { "name": "timestamp", "type": "uint256", "indexed": false, "internalType": "uint256" }
    ], "anonymous": false },
  { "type": "error", "name": "BillAlreadyExists", "inputs": [] },
  { "type": "error", "name": "BillAlreadyPaid", "inputs": [] },
  { "type": "error", "name": "BillNotFound", "inputs": [] },
  { "type": "error", "name": "InsufficientBalance", "inputs": [] },
  { "type": "error", "name": "InvalidAmount", "inputs": [] },
  { "type": "error", "name": "InvalidAuthorization", "inputs": [] },
  { "type": "error", "name": "InvalidNonce", "inputs": [] },
  { "type": "error", "name": "ReentrancyGuardReentrantCall", "inputs": [] },
  { "type": "error", "name": "TransferFailed", "inputs": [] }
] as const;

// Network Configuration (Arbitrum Sepolia)
export const ARBITRUM_SEPOLIA = {
  id: 421614,
  name: 'Arbitrum Sepolia Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'ETH',
    symbol: 'ETH',
  },
  rpcUrls: {
    public: { http: [
      // Prefer env-provided RPC to avoid public rate limits
      (process.env.NEXT_PUBLIC_ARBITRUM_SEPOLIA_RPC_URL as string) || 'https://sepolia-rollup.arbitrum.io/rpc'
    ] },
    default: { http: [
      (process.env.NEXT_PUBLIC_ARBITRUM_SEPOLIA_RPC_URL as string) || 'https://sepolia-rollup.arbitrum.io/rpc'
    ] },
  },
  blockExplorers: {
    default: { name: 'Arbiscan', url: 'https://sepolia.arbiscan.io' },
  },
} as const;

// Token addresses on Arbitrum Sepolia (TODO: update after deployment)
export const TOKENS = {
  ETH: '0x0000000000000000000000000000000000000000', // Native token
  USDC: '0x6bECb4E157061786FC4Db6276a9036026E38d04F', // MockUSDC (Arbitrum Sepolia)
  USDT: '0x6aA627c20dcb561bE8Fbeeff03906905472E2Cb5', // MockUSDT (Arbitrum Sepolia)
  WETH: '0x0FC51934bd03eE04273497A462479280aE7d0084', // MockWETH (Arbitrum Sepolia)
} as const;
