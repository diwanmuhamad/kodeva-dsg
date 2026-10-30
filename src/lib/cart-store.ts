"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { CartLine } from "@/lib/types";

type CartState = {
  lines: CartLine[];
  setLines: (lines: CartLine[]) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      setLines: (lines) => set({ lines }),
      clear: () => set({ lines: [] }),
    }),
    { name: "kodeva-cart-v1" },
  ),
);
