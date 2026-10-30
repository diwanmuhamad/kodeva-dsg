"use client";

import { useState } from "react";

import { secondaryButtonClass } from "@/components/styles";

export function CopyLink({ path }: { path: string }) {
  const [label, setLabel] = useState("Salin tautan");

  return (
    <button
      type="button"
      className={secondaryButtonClass}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(new URL(path, window.location.origin).toString());
          setLabel("Tautan disalin");
        } catch {
          setLabel("Gagal menyalin");
        }
      }}
    >
      {label}
    </button>
  );
}
