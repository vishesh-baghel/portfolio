'use client';

import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, FileCode } from 'lucide-react';

interface CodeBlockProps {
  children?: React.ReactNode;
  className?: string;
  filename?: string;
}

// Language icon mapping
const getLanguageIcon = (lang: string) => {
  return <FileCode className="size-4" />;
};

// Language display names
const getLanguageDisplay = (lang: string): string => {
  const langMap: Record<string, string> = {
    'typescript': 'TypeScript',
    'javascript': 'JavaScript',
    'tsx': 'TSX',
    'jsx': 'JSX',
    'python': 'Python',
    'bash': 'Bash',
    'shell': 'Shell',
    'json': 'JSON',
    'yaml': 'YAML',
    'markdown': 'Markdown',
    'css': 'CSS',
    'html': 'HTML',
  };
  return langMap[lang.toLowerCase()] || lang.toUpperCase();
};

export function CodeBlock({ children, className, filename, ...props }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  
  // Extract the code string and language from children
  const childArray = React.Children.toArray(children);
  const codeElement = childArray[0];
  
  if (!codeElement || typeof codeElement !== 'object' || !('props' in codeElement)) {
    return <pre className={className} {...props}>{children}</pre>;
  }
  
  const codeProps = codeElement.props as { children?: string; className?: string };
  const codeString = codeProps.children?.trim() || '';
  const match = /language-(\w+)/.exec(codeProps.className || '');
  const language = match ? match[1] : 'text';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-6 rounded-lg overflow-hidden" style={{ backgroundColor: '#1e1e1e', border: '1px solid #2d2d2d' }}>
      {/* Header with filename/language and copy button */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#2d2d2d]">
        <div className="flex items-center gap-2 text-xs text-[#d4d4d4]">
          {getLanguageIcon(language)}
          <span className="font-medium">
            {filename || getLanguageDisplay(language)}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="inline-flex items-center p-1.5 text-[#d4d4d4] hover:text-white transition-colors"
          title={copied ? "Copied!" : "Copy code"}
        >
          {copied ? (
            <Check className="size-4" />
          ) : (
            <Copy className="size-4" />
          )}
        </button>
      </div>
      
      {/* Code content */}
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: '1rem',
          fontSize: '0.875rem',
          fontFamily: 'var(--font-mono)',
          backgroundColor: '#1e1e1e',
        }}
        showLineNumbers
      >
        {codeString}
      </SyntaxHighlighter>
    </div>
  );
}
