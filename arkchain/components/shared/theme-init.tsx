"use client";

import { useEffect } from "react";
import { useTheme } from "@/lib/store/theme";

export function ThemeInit() {
  const { dark } = useTheme();

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [dark]);

  return null;
}
