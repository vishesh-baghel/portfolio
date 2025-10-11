'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export function InlineCode(props: any) {
  const [copied, setCopied] = useState(false);
  const codeText = props.children;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <span className="relative inline-block group">
      <code
        className="px-2 py-0.5 rounded font-mono inline-block"
        style={{ backgroundColor: '#1e1e1e', color: '#d4d4d4', fontSize: '14px' }}
        {...props}
      />
      <button
        onClick={handleCopy}
        className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 inline-flex items-center p-1 text-[#d4d4d4] hover:text-white transition-all z-10"
        title={copied ? "Copied!" : "Copy"}
      >
        {copied ? (
          <Check className="size-3" />
        ) : (
          <Copy className="size-3" />
        )}
      </button>
    </span>
  );
}
