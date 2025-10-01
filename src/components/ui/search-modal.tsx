"use client";

import { useState, useEffect, useRef } from 'react';
import { Search, Send, ArrowLeft, Zap } from 'lucide-react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { QUIRKY_PLACEHOLDERS } from '@/lib/searchPlaceholders';

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

    try {
      // Call the portfolio agent API
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

      const data = await response.json();

      // Add assistant message
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: data.response,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      // Add error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "Sorry, I'm having trouble connecting right now. Please try again later or contact Vishesh directly.",
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
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

  if (!mounted) return null;

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
        <div className="bg-background border border-border rounded-lg shadow-2xl h-[70vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b border-border flex-shrink-0">
            {isInChatMode ? (
              /* Chat mode - only show back button */
              <button
                type="button"
                onClick={handleBackToSearch}
                className="flex items-center gap-2 p-1 hover:bg-[var(--color-secondary)] rounded transition-colors"
                aria-label="Back to search"
              >
                <ArrowLeft className="size-4" />
                <span className="font-mono text-sm text-muted-foreground">Back to search</span>
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
                    <Send className="size-4" />
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
                      className="w-full text-left p-3 rounded border border-border hover:bg-[var(--color-secondary)] transition-colors group"
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
                        "flex gap-3",
                        message.type === 'user' ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[80%] p-3 rounded font-mono text-sm",
                          message.type === 'user'
                            ? "bg-primary text-primary-foreground"
                            : "bg-[var(--color-secondary)] text-foreground border border-border"
                        )}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-[var(--color-secondary)] border border-border p-3 rounded font-mono text-sm">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                          </div>
                          <span className="text-muted-foreground">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                {/* Chat input bar */}
                <div className="border-t border-border p-3 bg-background flex-shrink-0">
                  <form
                    onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Enter your message..."
                      className="flex-1 bg-transparent border rounded px-3 py-2 font-mono text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                    <button
                      type="submit"
                      disabled={isLoading || !chatInput.trim()}
                      className="inline-flex items-center gap-2 border rounded px-3 h-9 hover:bg-[var(--color-secondary)] disabled:opacity-50"
                    >
                      <Send className="size-4" />
                      <span className="hidden sm:inline font-mono text-xs">Send</span>
                    </button>
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
