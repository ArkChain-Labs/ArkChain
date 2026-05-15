import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserRole } from "@/lib/types";

interface RoleState {
  role: UserRole;
  setRole: (r: UserRole) => void;
}

export const useUserRole = create<RoleState>()(
  persist(
    (set) => ({
      role: "investor",
      setRole: (role) => set({ role }),
    }),
    { name: "arkchain-role" }
  )
);
