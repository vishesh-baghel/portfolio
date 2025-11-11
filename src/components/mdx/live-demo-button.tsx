'use client';

import { ExternalLink } from 'lucide-react';

interface LiveDemoButtonProps {
  url: string;
  label?: string;
}

export function LiveDemoButton({ url, label = "Live Demo" }: LiveDemoButtonProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-border bg-background hover:bg-[var(--color-secondary)] transition-colors no-underline"
    >
      <ExternalLink className="size-4" />
      {label}
    </a>
  );
}
