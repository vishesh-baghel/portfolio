'use client';

import { Github } from 'lucide-react';

interface GitHubButtonProps {
  repo: string;
  label?: string;
}

export function GitHubButton({ repo, label = "GitHub" }: GitHubButtonProps) {
  return (
    <a
      href={repo}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-border bg-background hover:bg-[var(--color-secondary)] transition-colors no-underline"
    >
      <Github className="size-4" />
      {label}
    </a>
  );
}
