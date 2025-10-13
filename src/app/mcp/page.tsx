'use client';

import React, { useState } from 'react';
import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';
import { Copy, Check } from 'lucide-react';

const MCP_CONFIGS = {
  cursor: {
    name: 'Cursor',
    type: 'json' as const,
    config: {
      "mcpServers": {
        "vishesh-experiments": {
          "command": "npx",
          "args": ["-y", "vishesh-experiments@latest"]
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
          "args": ["-y", "vishesh-experiments@latest"]
        }
      }
    }
  },
  claude: {
    name: 'Claude Desktop',
    type: 'command' as const,
    config: "claude mcp add npx -y vishesh-experiments@latest"
  }
};

type IDE = keyof typeof MCP_CONFIGS;

export default function McpPage() {
  const [selectedIDE, setSelectedIDE] = useState<IDE>('cursor');
  const [copied, setCopied] = useState(false);

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
    <div className="min-h-screen bg-background-primary font-mono">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6">
        <Header />
        
        <main className="py-8 space-y-12">
          {/* Hero Section */}
          <section className="space-y-4">
            <h1 className="text-2xl sm:text-3xl font-bold">
              experiments mcp server
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground">
              skip the research phase. get production-ready code directly in your editor.
            </p>
          </section>

          {/* Why Section */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">why this exists</h2>
            <div className="space-y-3 text-sm sm:text-base">
              <p>
                building integrations from scratch wastes time. you spend hours researching patterns, 
                reading outdated tutorials, and debugging issues others already solved.
              </p>
              <p>
                this mcp server gives you direct access to working code patterns validated in production 
                environments—both from oss contributions and real-world client work. no blog posts, no 
                theory—just copy-paste ready implementations that shipped.
              </p>
              <p>
                ask your ai assistant for patterns, and it'll pull complete examples with architecture 
                decisions, trade-offs, and deployment notes. build mvps faster by starting with code 
                that already works.
              </p>
              <p className="font-medium">
                everything is free. no strings attached. use them however you want in your projects.
              </p>
            </div>
          </section>

          {/* What You Get Section */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">what you get</h2>
            <div className="space-y-3">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">real implementations</h3>
                <p className="text-sm text-muted-foreground">
                  complete source code patterns used in production environments and oss contributions. 
                  tested in real projects, peer-reviewed by maintainers.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">architecture context</h3>
                <p className="text-sm text-muted-foreground">
                  understand why decisions were made. see alternatives considered 
                  and trade-offs accepted for each pattern.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">production lessons</h3>
                <p className="text-sm text-muted-foreground">
                  deployment considerations, performance optimizations, and common 
                  pitfalls already solved.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">direct ide access</h3>
                <p className="text-sm text-muted-foreground">
                  ask your ai assistant naturally. no context switching, no copy-pasting 
                  from browser tabs.
                </p>
              </div>
            </div>
          </section>

          {/* Installation Section */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">installation</h2>
            <p className="text-sm text-muted-foreground">
              add the server to your ide's mcp configuration. restart your editor after adding.
            </p>

            {/* IDE Selector */}
            <div className="flex flex-wrap gap-2">
              {(Object.keys(MCP_CONFIGS) as IDE[]).map((ide) => (
                <button
                  key={ide}
                  onClick={() => setSelectedIDE(ide)}
                  className={`
                    px-4 py-2 text-sm rounded-lg border transition-colors
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

            {/* Config Display */}
            <div className="space-y-2">
              {selectedConfig.type === 'json' && (
                <p className="text-xs text-muted-foreground">
                  {selectedIDE === 'cursor' 
                    ? 'Add to .cursor/mcp.json in your project root (or ~/.cursor/mcp.json for global):'
                    : 'Add to ~/.codeium/windsurf/mcp_config.json:'
                  }
                </p>
              )}
              
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
                <pre className="text-xs bg-[#1e1e1e] text-[#d4d4d4] p-4 rounded-lg overflow-x-auto">
                  <code className="whitespace-pre">
                    {selectedConfig.type === 'json' 
                      ? JSON.stringify(selectedConfig.config, null, 2)
                      : selectedConfig.config
                    }
                  </code>
                </pre>
              </div>

              {selectedConfig.type === 'command' && (
                <p className="text-xs text-muted-foreground">
                  run this command in your terminal to add the mcp server.
                </p>
              )}
            </div>
          </section>

          {/* Usage Section */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">usage</h2>
            <p className="text-sm text-muted-foreground">
              once configured, ask your ai assistant naturally:
            </p>
            <ul className="text-sm space-y-1 text-muted-foreground list-none pl-0">
              <li className="before:content-['•'] before:mr-2">show me ai agent patterns with openai</li>
              <li className="before:content-['•'] before:mr-2">find postgres optimization examples</li>
              <li className="before:content-['•'] before:mr-2">get next.js 15 server component code</li>
              <li className="before:content-['•'] before:mr-2">search for typescript advanced patterns</li>
            </ul>
          </section>

          {/* Browse Section */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">browse patterns</h2>
            <p className="text-sm text-muted-foreground">
              explore all available experiments and integration patterns on the{' '}
              <a 
                href="/experiments" 
                className="text-accent hover:underline"
              >
                experiments page
              </a>
              . each includes complete source code, architecture decisions, and production notes.
            </p>
          </section>
        </main>
        
        <Footer />
      </div>
    </div>
  );
}
