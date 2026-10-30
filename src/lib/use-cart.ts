"use client";

import { useSyncExternalStore } from "react";

import { useCartStore } from "@/lib/cart-store";
import type { CartLine } from "@/lib/types";

export function useHydratedCart(): { lines: CartLine[]; ready: boolean } {
  const lines = useCartStore((state) => state.lines);
  const ready = useSyncExternalStore(
    (onStoreChange) => useCartStore.persist.onFinishHydration(() => onStoreChange()),
    () => useCartStore.persist.hasHydrated(),
    () => false,
  );

  return { lines: ready ? lines : [], ready };
}
