"use client";

import Link from "next/link";
import React from "react";
import { trackBookCallClick, trackEmailClick, trackCTAClick, type CTALocation, type CTAType } from "@/lib/analytics";

type TrackedLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
  trackingType: CTAType;
  trackingLocation: CTALocation;
};

export const TrackedLink = ({
  href,
  children,
  className,
  target,
  rel,
  trackingType,
  trackingLocation,
}: TrackedLinkProps) => {
  const handleClick = () => {
    trackCTAClick(trackingType, trackingLocation);
  };

  if (target === "_blank") {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        onClick={handleClick}
        className={className}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
};
