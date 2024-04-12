"use client";

import { Wallet } from "@nice-xrpl/react-xrpl";

export function LoadWallet({ children, seed }) {
  return (
    <Wallet seed={seed}>
      {children}
    </Wallet>
  )
}
 