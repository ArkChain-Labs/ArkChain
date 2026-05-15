"use client";

import { QueryProvider } from "./query-provider";
import { WagmiProviderWrapper } from "./wagmi-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <WagmiProviderWrapper>{children}</WagmiProviderWrapper>
    </QueryProvider>
  );
}
