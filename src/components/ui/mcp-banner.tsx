'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const CATCHY_MESSAGES = [
  "Skip the research. Get working code from experiments I've already validated in production.",
  "Reference real implementations directly in your editor. No more context switching.",
  "These patterns solved actual problems. Use them to fix yours faster.",
  "Pre-tested integrations you can adapt to your codebase. Save hours of debugging.",
  "Learn from working examples while you code. See how things actually connect.",
  "Production code from real projects. Copy the patterns that work, skip the ones that don't.",
  "Stop reinventing solutions. Use battle-tested code from experiments that shipped.",
  "Get context on integration patterns without leaving your IDE. Build with confidence.",
  "Real code, real problems, real solutions. Use what's already been validated.",
  "Access proven implementations instantly. Focus on your product, not integration boilerplate."
];

const MCP_CONFIGS = {
  cursor: {
    name: 'Cursor',
    type: 'json' as const,
    config: {
      "mcpServers": {
        "vishesh-experiments": {
          "command": "npx",
          "args": ["-y", "@vishesh/experiments@latest"]
        }
      }
    }
  },
  windsurf: {
    name: 'Windsurf',
    type: 'json' as const,
    config: {
      "mcpServers": {
        "vishesh-experiments": {
          "command": "npx",
          "args": ["-y", "@vishesh/experiments@latest"]
        }
      }
    }
  },
  claude: {
    name: 'Claude',
    type: 'command' as const,
    config: "claude mcp add npx -y @vishesh/experiments@latest"
  }
};

type IDE = keyof typeof MCP_CONFIGS;

export function McpBanner() {
  const [selectedIDE, setSelectedIDE] = useState<IDE>('cursor');
  const [copied, setCopied] = useState(false);
  const [messageIndex] = useState(() => Math.floor(Math.random() * CATCHY_MESSAGES.length));

  const handleCopy = async () => {
    const selectedConfig = MCP_CONFIGS[selectedIDE];
    const textToCopy = selectedConfig.type === 'json' 
      ? JSON.stringify(selectedConfig.config, null, 2)
      : selectedConfig.config;
    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectedConfig = MCP_CONFIGS[selectedIDE];

  return (
    <div className="rounded-lg border border-border bg-background-secondary p-4 space-y-3 w-full">
      <div>
        <h3 className="text-sm font-semibold">Experiments MCP</h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {(Object.keys(MCP_CONFIGS) as IDE[]).map((ide) => (
          <button
            key={ide}
            onClick={() => setSelectedIDE(ide)}
            className={`
              px-3 py-1.5 text-xs rounded-lg border transition-colors whitespace-nowrap
              ${selectedIDE === ide 
                ? 'bg-accent text-accent-foreground border-accent' 
                : 'border-border hover:bg-[var(--color-secondary)]'
              }
            `}
          >
            {MCP_CONFIGS[ide].name}
          </button>
        ))}
      </div>

      <div className="relative">
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 inline-flex items-center p-1.5 text-[#d4d4d4] hover:text-white transition-colors z-10"
          title={copied ? "Copied!" : "Copy config"}
        >
          {copied ? (
            <Check className="size-4" />
          ) : (
            <Copy className="size-4" />
          )}
        </button>
        <pre className="text-xs bg-[#1e1e1e] text-[#d4d4d4] p-3 rounded-lg overflow-x-auto">
          <code className="whitespace-pre">
            {selectedConfig.type === 'json' 
              ? JSON.stringify(selectedConfig.config, null, 2)
              : selectedConfig.config
            }
          </code>
        </pre>
      </div>

      <p className="text-xs text-muted-foreground !mb-0">
        {selectedConfig.type === 'command' 
          ? 'Run this command in your terminal to add the MCP server.'
          : CATCHY_MESSAGES[messageIndex]
        }
      </p>
    </div>
  );
}
