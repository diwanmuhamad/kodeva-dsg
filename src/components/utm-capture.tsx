"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { captureUtmFromLocation } from "@/lib/utm-client";

export function UtmCapture() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    captureUtmFromLocation(window.location.href);
  }, [pathname, searchParams]);

  return null;
}
