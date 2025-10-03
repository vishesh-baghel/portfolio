"use client";

import type React from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, ArrowUp, ArrowLeft, Zap } from 'lucide-react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { QUIRKY_PLACEHOLDERS } from '@/lib/searchPlaceholders';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const PREDEFINED_QUESTIONS = [
  "Tell me about Vishesh's experience",
  "What technologies does Vishesh work with?", 
  "Show me Vishesh's projects",
  "What's Vishesh's background?",
  "Tell me about Vishesh's skills",
  "What makes Vishesh unique as a developer?",
  "How can I contact Vishesh?",
  "What's Vishesh's expertise in AI and agents?"
];


export function SearchModal({ open, onClose }: SearchModalProps) {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isInChatMode, setIsInChatMode] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [chatInput, setChatInput] = useState('');
  const [placeholder, setPlaceholder] = useState<string>(QUIRKY_PLACEHOLDERS[0]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) {
      // Focus input when modal opens
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    // Set a random placeholder on open (only matters in search mode)
    if (open) {
      const next = QUIRKY_PLACEHOLDERS[Math.floor(Math.random() * QUIRKY_PLACEHOLDERS.length)];
      setPlaceholder(next);
    }
  }, [open]);

  useEffect(() => {
    // Reset state when modal closes
    if (!open) {
      setSearchQuery('');
    setChatInput('');
      setIsInChatMode(false);
      setChatMessages([]);
      setIsLoading(false);
    }
  }, [open]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages are added
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Removed placeholder typewriter effect per request

  const handleQuestionClick = async (question: string) => {
    setSearchQuery(question);
    await handleSubmit(question);
  };

  const handleSubmit = async (query?: string) => {
    const finalQuery = query || (isInChatMode ? chatInput : searchQuery);
    if (!finalQuery.trim()) return;

    setIsInChatMode(true);
    setIsLoading(true);

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: finalQuery,
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, userMessage]);
    setSearchQuery('');
    setChatInput('');

    // Create assistant message placeholder for streaming
    const assistantMessageId = (Date.now() + 1).toString();
    const assistantMessage: ChatMessage = {
      id: assistantMessageId,
      type: 'assistant',
      content: '',
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, assistantMessage]);

    try {
      // Call the portfolio agent API with streaming
      const response = await fetch('/api/portfolio-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: finalQuery }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No reader available');
      }

      let buffer = '';
      // Character-by-character reveal state
      let displayedContent = '';
      let charQueue: string[] = [];
      let revealTimer: number | undefined;
      let sourceDone = false;

      const updateAssistantMessage = (content: string) => {
        setChatMessages(prev => 
          prev.map(msg => 
            msg.id === assistantMessageId 
              ? { ...msg, content }
              : msg
          )
        );
      };

      const ensureTimer = () => {
        if (revealTimer) return;
        revealTimer = window.setInterval(() => {
          if (charQueue.length > 0) {
            const ch = charQueue.shift() as string;
            displayedContent += ch;
            updateAssistantMessage(displayedContent);
          } else if (sourceDone) {
            if (revealTimer) {
              clearInterval(revealTimer);
              revealTimer = undefined;
            }
            setIsLoading(false);
          }
        }, 10);
      };

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        // Decode the chunk and add to buffer
        buffer += decoder.decode(value, { stream: true });
        
        // Process complete lines from buffer
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line in buffer

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const jsonStr = line.slice(6); // Remove 'data: ' prefix
              const data = JSON.parse(jsonStr);
              
              if (data.type === 'chunk') {
                // Queue characters for smooth reveal
                const chars = String(data.content).split('');
                charQueue.push(...chars);
                ensureTimer();
              } else if (data.type === 'done') {
                // Mark source as done; timer will finish flushing the queue
                sourceDone = true;
                // Do not break here to allow remaining SSE lines (if any) to be processed
              } else if (data.type === 'error') {
                throw new Error(data.error || 'Unknown error');
              }
            } catch (parseError) {
              console.error('Error parsing SSE data:', parseError);
            }
          }
        }
      }

      // Reader finished; if no more queued chars, stop loading
      if (!charQueue.length) {
        setIsLoading(false);
      } else {
        // Ensure timer is running to flush remaining characters
        ensureTimer();
      }
    } catch (error) {
      console.error('Streaming error:', error);
      
      // Update the assistant message with error content
      setChatMessages(prev => 
        prev.map(msg => 
          msg.id === assistantMessageId 
            ? { 
                ...msg, 
                content: "Sorry, I'm having trouble connecting right now. Please try again later or contact Vishesh directly." 
              }
            : msg
        )
      );
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleBackToSearch = () => {
    setIsInChatMode(false);
    setChatMessages([]);
    setSearchQuery('');
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // Custom markdown renderer with explicit component styling
  const renderMarkdownContent = useCallback((content: string) => {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p className="mb-2 leading-relaxed text-sm">{children}</p>,
          h1: ({ children }) => (
            <h1 className="text-sm font-bold mb-2 mt-3">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-sm font-semibold mb-2 mt-3">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-sm font-semibold mb-1 mt-2">{children}</h3>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-sm">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-sm">{children}</em>
          ),
          ul: ({ children }) => (
            <ul className="list-none ml-4 mb-2 space-y-1 text-sm">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-none ml-4 mb-2 space-y-1 text-sm">{children}</ol>
          ),
          li: ({ children }) => <li className="leading-relaxed text-sm">{children}</li>,
          a: ({ children, href }) => (
            <a 
              href={href} 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:text-accent transition-colors"
            >
              {children}
            </a>
          ),
          code: ({ children, className }) => {
            const isInline = !className;
            return isInline ? (
              <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">
                {children}
              </code>
            ) : (
              <code className={className}>{children}</code>
            );
          },
          pre: ({ children }) => (
            <pre className="bg-muted p-3 rounded mb-2 overflow-x-auto">
              {children}
            </pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-muted-foreground pl-3 italic my-2">
              {children}
            </blockquote>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    );
  }, []);

  // Avoid SSR access to `document` and only portal on client after mount
  if (!mounted) return null;
  if (typeof document === 'undefined') return null;

  return createPortal(
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/50 transition-opacity duration-200",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={cn(
          // Fixed positioning and dimensions
          "fixed top-[10%] z-50",
          // Mobile: safe inset positioning, Desktop: fixed width centered
          "left-4 right-4 max-w-2xl",
          "sm:left-1/2 sm:right-auto sm:w-[32rem] sm:-translate-x-1/2",
          "transition-all duration-200",
          open 
            ? "opacity-100 scale-100 translate-y-0" 
            : "opacity-0 scale-95 translate-y-2 pointer-events-none"
        )}
      >
        <div className="bg-background supports-[backdrop-filter]:bg-background/80 backdrop-blur border border-border rounded-lg shadow-2xl h-[70vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b border-border flex-shrink-0">
            {isInChatMode ? (
              /* Chat mode - only show back button */
              <button
                type="button"
                onClick={handleBackToSearch}
                className="group inline-flex items-center gap-2 h-8 px-2 hover:bg-white hover:text-foreground rounded transition-colors cursor-pointer"
                aria-label="Back to search"
              >
                <ArrowLeft className="size-4 group-hover:text-foreground" />
                <span className="font-mono text-sm leading-4 relative top-[1px] text-muted-foreground group-hover:text-foreground">Back to search</span>
              </button>
            ) : (
              /* Search mode - show search input */
              <div className="flex items-center gap-2 flex-1">
                <Search className="size-4 text-muted-foreground" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={placeholder}
                  className="flex-1 bg-transparent border-none outline-none font-mono text-sm leading-[1.4] placeholder:text-muted-foreground relative top-[2px]"
                  onFocus={() => {
                    // Rotate placeholder if user focuses without typing
                    if (!searchQuery.trim()) {
                      const next = QUIRKY_PLACEHOLDERS[Math.floor(Math.random() * QUIRKY_PLACEHOLDERS.length)];
                      setPlaceholder(next);
                    }
                  }}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => handleSubmit()}
                    disabled={isLoading}
                    className="p-1 hover:bg-[var(--color-secondary)] rounded transition-colors disabled:opacity-50"
                    aria-label="Send message"
                  >
                    <ArrowUp className="size-4" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {!isInChatMode ? (
              /* Initial search state with predefined questions */
              <div className="p-4 space-y-4 h-full overflow-y-auto">
                <div className="text-sm text-muted-foreground font-mono">
                  Ask me anything about Vishesh
                </div>
                <div className="space-y-2">
                  {PREDEFINED_QUESTIONS.map((question, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleQuestionClick(question)}
                      className="w-full text-left p-3 rounded border border-border hover:border-foreground/40 hover:bg-[var(--color-secondary)] transition-colors group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <div className="flex items-center gap-3">
                        <Zap className="size-4 text-accent flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
                        <span className="font-mono text-sm">{question}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Chat mode */
              <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "w-full flex",
                        message.type === 'user' ? "justify-end" : "justify-start"
                      )}
                    >
                      {message.type === 'assistant' ? (
                        <div
                          className={cn(
                            "font-mono text-sm inline-block max-w-[85%] text-left"
                          )}
                        >
                          {renderMarkdownContent(message.content)}
                        </div>
                      ) : (
                        <p
                          className={cn(
                            "font-mono text-sm whitespace-pre-wrap inline-block max-w-[85%]",
                            "text-right text-muted-foreground"
                          )}
                        >
                          {message.content}
                        </p>
                      )}
                    </div>
                  ))}
                  {isLoading && chatMessages.some(m => m.type === 'assistant' && !m.content) && (
                    <p className="font-mono text-sm text-muted-foreground">Thinking...</p>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                {/* Chat input bar */}
                <div className="p-3 bg-transparent flex-shrink-0">
                  <form
                    onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
                    className="flex items-center"
                  >
                    <div className="flex items-center gap-2 w-full rounded-2xl border border-border/50 bg-background/80 shadow-sm px-3 py-2 focus-within:ring-2 focus-within:ring-ring transition-colors">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Enter your message..."
                        className="flex-1 bg-transparent border-none outline-none font-mono text-sm placeholder:text-muted-foreground"
                      />
                      <button
                        type="submit"
                        disabled={isLoading || !chatInput.trim()}
                        className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-foreground/10 hover:bg-foreground/20 disabled:opacity-50"
                        aria-label="Send message"
                      >
                        <ArrowUp className="size-4" />
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
