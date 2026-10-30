"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { buildLandingCta } from "@/lib/cta-event";
import { pushDataLayer } from "@/lib/datalayer";
import { readStoredUtm } from "@/lib/utm-client";

export function TrackedLink({
  href,
  text,
  className,
  children,
}: {
  href: string;
  text: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => {
        pushDataLayer(buildLandingCta({ text, destination: href, utm: readStoredUtm() }));
      }}
    >
      {children}
    </Link>
  );
}
