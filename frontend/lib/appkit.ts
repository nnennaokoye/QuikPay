'use client'

import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { ARBITRUM_SEPOLIA } from '@/lib/contract'

// Get projectId from env
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo-project-id'

// Build Wagmi adapter with our Arbitrum Sepolia network
const wagmiAdapter = new WagmiAdapter({
  networks: [
    {
      id: ARBITRUM_SEPOLIA.id,
      name: ARBITRUM_SEPOLIA.name,
      nativeCurrency: ARBITRUM_SEPOLIA.nativeCurrency,
      rpcUrls: ARBITRUM_SEPOLIA.rpcUrls,
      blockExplorers: ARBITRUM_SEPOLIA.blockExplorers,
      testnet: true
    } as any
  ],
  projectId
})

// Export wagmiConfig for WagmiProvider
export const wagmiConfig = wagmiAdapter.wagmiConfig

// Initialize AppKit once at module load
export const appKit = createAppKit({
  adapters: [wagmiAdapter],
  networks: [
    {
      id: ARBITRUM_SEPOLIA.id,
      name: ARBITRUM_SEPOLIA.name,
      nativeCurrency: ARBITRUM_SEPOLIA.nativeCurrency,
      rpcUrls: ARBITRUM_SEPOLIA.rpcUrls,
      blockExplorers: ARBITRUM_SEPOLIA.blockExplorers,
      testnet: true
    } as any
  ],
  projectId,
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#4F46E5',
    '--w3m-color-mix': '#4F46E5',
    '--w3m-color-mix-strength': 40,
    '--w3m-border-radius-master': '12px',
    '--w3m-font-family': 'Geist, system-ui, sans-serif'
  }
})
