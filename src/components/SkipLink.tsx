"use client";

import type { ReactNode } from "react";

interface SkipLinkProps {
  href?: string;
  children?: ReactNode;
}

/**
 * Visually hidden link that appears on keyboard focus, allowing keyboard
 * and screen reader users to skip straight to the main content.
 */
export default function SkipLink({
  href = "#main-content",
  children = "Skip to main content",
}: SkipLinkProps) {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white focus:text-zinc-900 focus:rounded-lg focus:shadow-lg focus:font-medium"
    >
      {children}
    </a>
  );
}
