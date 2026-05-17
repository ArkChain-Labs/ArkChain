import { http } from "wagmi";
import { avalancheFuji } from "wagmi/chains";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";

export const wagmiConfig = getDefaultConfig({
  appName: "ArkChain",
  projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || "7cc4658a32f4a3f5443e121957e2791b",
  chains: [avalancheFuji],
  transports: { [avalancheFuji.id]: http() },
  ssr: true,
});
