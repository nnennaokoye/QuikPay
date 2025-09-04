import { NextResponse } from 'next/server'
import { createWalletClient, http, encodePacked, keccak256, hashMessage, recoverAddress } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { ARBITRUM_SEPOLIA, QUIKPAY_CONTRACT_ADDRESS, QUIKPAY_ABI } from '@/lib/contract'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { auth: authIn, permit: permitIn } = body || {}

    if (!process.env.SPONSOR_PK) {
      return NextResponse.json({ error: 'Server misconfigured: missing SPONSOR_PK' }, { status: 500 })
    }

    // Basic validation
    if (!authIn || !permitIn) {
      return NextResponse.json({ error: 'Missing auth or permit' }, { status: 400 })
    }

    const auth = {
      receiver: authIn.receiver as `0x${string}`,
      token: authIn.token as `0x${string}`,
      chainId: BigInt(authIn.chainId),
      contractAddress: authIn.contractAddress as `0x${string}`,
      signature: authIn.signature as `0x${string}`,
    }

    if (auth.contractAddress?.toLowerCase() !== QUIKPAY_CONTRACT_ADDRESS.toLowerCase()) {
      return NextResponse.json({ error: 'Invalid contract address' }, { status: 400 })
    }
    if (Number(auth.chainId) !== ARBITRUM_SEPOLIA.id) {
      return NextResponse.json({ error: 'Unsupported chainId' }, { status: 400 })
    }

    const permit = {
      owner: permitIn.owner as `0x${string}`,
      token: permitIn.token as `0x${string}`,
      value: BigInt(permitIn.value),
      deadline: BigInt(permitIn.deadline),
      v: Number(permitIn.v),
      r: permitIn.r as `0x${string}`,
      s: permitIn.s as `0x${string}`,
    }

    // Off-chain validation of merchant authorization signature to avoid costly reverts
    try {
      // inner = keccak256(abi.encode(receiver, token, chainId, contractAddress))
      const inner = keccak256(
        encodePacked(
          ['address', 'address', 'uint256', 'address'],
          [auth.receiver, auth.token, auth.chainId, auth.contractAddress]
        )
      )
      // Contract builds: keccak256("\x19Ethereum Signed Message:\n32" ++ inner)
      const prefixed = hashMessage({ raw: inner })
      const recovered = await recoverAddress({ hash: prefixed, signature: auth.signature })
      if (recovered.toLowerCase() !== auth.receiver.toLowerCase()) {
        return NextResponse.json({ error: 'Invalid merchant authorization signature' }, { status: 400 })
      }
    } catch (sigErr: any) {
      return NextResponse.json({ error: `Authorization signature check failed: ${sigErr?.message || sigErr}` }, { status: 400 })
    }

    const account = privateKeyToAccount(process.env.SPONSOR_PK as `0x${string}`)
    const rpcUrl = process.env.RPC_URL || process.env.NEXT_PUBLIC_ARBITRUM_SEPOLIA_RPC_URL || 'https://sepolia-rollup.arbitrum.io/rpc'
    const walletClient = createWalletClient({
      account,
      chain: ARBITRUM_SEPOLIA as any,
      transport: http(rpcUrl),
    })

    // Call QuikPay.payDynamicERC20WithPermit(auth, permit)
    const hash = await walletClient.writeContract({
      chain: ARBITRUM_SEPOLIA as any,
      account,
      address: QUIKPAY_CONTRACT_ADDRESS,
      abi: QUIKPAY_ABI as any,
      functionName: 'payDynamicERC20WithPermit',
      args: [auth, permit],
    })

    return NextResponse.json({ hash })
  } catch (e: any) {
    console.error('gasless-payment error:', e)
    return NextResponse.json({ error: e?.message || 'Unknown error' }, { status: 500 })
  }
}