import { http, createConfig } from "wagmi";
import { avalancheFuji } from "wagmi/chains";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";

export const wagmiConfig = getDefaultConfig({
  appName: "ArkChain",
  projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || "arkchain-dev",
  chains: [avalancheFuji],
  transports: { [avalancheFuji.id]: http() },
  ssr: true,
});
