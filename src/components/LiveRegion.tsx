"use client";

interface LiveRegionProps {
  message?: string;
  ariaLive?: "polite" | "assertive";
}

/**
 * Visually hidden ARIA live region for announcing state changes to screen
 * reader users. Uses role="status" for polite announcements and role="alert"
 * for assertive ones. The empty-message state clears the announcement.
 */
export default function LiveRegion({
  message = "",
  ariaLive = "polite",
}: LiveRegionProps) {
  return (
    <div
      className="sr-only"
      role={ariaLive === "assertive" ? "alert" : "status"}
      aria-live={ariaLive}
      aria-atomic="true"
    >
      {message}
    </div>
  );
}
