"use client";

import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { wagmiConfig } from "@/lib/wagmi";

export function WagmiProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <RainbowKitProvider
        theme={lightTheme({
          accentColor: "hsl(28, 58%, 41%)",
          accentColorForeground: "hsl(41, 35%, 93%)",
          borderRadius: "medium",
          fontStack: "system",
        })}
      >
        {children}
      </RainbowKitProvider>
    </WagmiProvider>
  );
}
