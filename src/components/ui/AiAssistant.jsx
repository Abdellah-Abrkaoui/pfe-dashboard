import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, Trash2 } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { useTimers } from '../../hooks/useSensorData';
import { streamChat, buildSystemPrompt } from '../../lib/ai';
import clsx from 'clsx';

const SUGGESTIONS = [
  'How much water was used today?',
  'What is the current substrate weight?',
  'Is the drainage % within range?',
  'When was the last irrigation?',
  "Summarize today's activity",
];

export default function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const messagesEndRef = useRef(null);
  const abortRef = useRef(null);

  const latestReading = useAppStore((s) => s.latestReading);
  const { data: timers = [] } = useTimers();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text) => {
    const content = text || input.trim();
    if (!content || streaming) return;

    setInput('');
    const userMsg = { role: 'user', content };
    const newMessages = [...messages, userMsg];
    setMessages([...newMessages, { role: 'assistant', content: '' }]);
    setStreaming(true);

    const systemPrompt = buildSystemPrompt(latestReading, timers);
    const apiMessages = [
      { role: 'system', content: systemPrompt },
      ...newMessages,
    ];

    abortRef.current = new AbortController();
    let assistantContent = '';

    try {
      await streamChat(
        apiMessages,
        null,
        (chunk) => {
          assistantContent += chunk;
          setMessages([...newMessages, { role: 'assistant', content: assistantContent }]);
        },
        () => {},
        abortRef.current.signal
      );
    } catch (err) {
      if (err.name !== 'AbortError') {
        assistantContent = `Error: ${err.message}`;
        setMessages([...newMessages, { role: 'assistant', content: assistantContent }]);
      }
    }
    setStreaming(false);
  };

  const handleClear = () => {
    setMessages([]);
  };

  const handleStop = () => {
    abortRef.current?.abort();
    setStreaming(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className={clsx(
          'fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-105',
          open
            ? 'bg-bg-surface border border-border'
            : 'bg-accent-green text-white'
        )}
      >
        {open ? <X className="w-5 h-5 text-text-primary" /> : <Bot className="w-6 h-6" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] h-[560px] bg-bg-surface border border-border rounded-2xl shadow-[var(--shadow-elevated)] flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-bg-elevated/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-accent-green/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-accent-green" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-text-primary">Azura AI</h3>
                <p className="text-[10px] text-text-muted">Irrigation Assistant</p>
              </div>
            </div>
            <button
              onClick={handleClear}
              className="p-1.5 text-text-muted hover:text-text-secondary transition-colors"
              title="Clear chat"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-12 h-12 rounded-full bg-accent-green/10 flex items-center justify-center mb-3">
                  <Bot className="w-6 h-6 text-accent-green" />
                </div>
                <p className="text-sm text-text-primary font-medium mb-1">Ask me anything</p>
                <p className="text-xs text-text-muted mb-4">About your irrigation system</p>
                <div className="space-y-1.5 w-full">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSend(s)}
                      className="w-full text-left px-3 py-2 text-xs text-text-secondary bg-bg-elevated hover:bg-bg-elevated/80 rounded-lg transition-colors border border-border/50"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={clsx('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}
              >
                <div
                  className={clsx(
                    'max-w-[85%] px-3 py-2 rounded-xl text-sm whitespace-pre-wrap',
                    msg.role === 'user'
                      ? 'bg-accent-green text-white rounded-br-sm'
                      : 'bg-bg-elevated text-text-primary rounded-bl-sm border border-border/50'
                  )}
                >
                  {msg.content || (
                    <span className="inline-flex gap-1">
                      <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="px-4 py-3 border-t border-border">
            {streaming && (
              <button
                onClick={handleStop}
                className="w-full mb-2 py-1.5 text-xs text-accent-red bg-accent-red/5 border border-accent-red/20 rounded-lg hover:bg-accent-red/10 transition-colors"
              >
                Stop generating
              </button>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask about your system..."
                className="flex-1 px-3 py-2 bg-bg-base border border-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-green"
                disabled={streaming}
              />
              <button
                onClick={() => handleSend()}
                disabled={streaming || !input.trim()}
                className="px-3 py-2 bg-accent-green text-white rounded-lg hover:bg-accent-green/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
