import { useState, useRef, useEffect, useCallback } from "react";
import { api } from "../../utils/api";

// Suggested quick-start prompts
const QUICK_PROMPTS = [
  "What products help with digestion?",
  "I want to boost my immunity",
  "What's the difference between Capsules and Juices?",
  "Help me choose a product",
];

const BotLogo = () => (
  <img src="/logo/favicon.png" alt="Veda" className="chatbot-avatar-img" />
);

// Typing indicator (three bouncing dots)
const TypingIndicator = () => (
  <div className="chatbot-typing-indicator">
    <span /><span /><span />
  </div>
);

function MessageBubble({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div className={`chatbot-message-row ${isUser ? "chatbot-message-row--user" : "chatbot-message-row--bot"}`}>
      {!isUser && (
        <div className="chatbot-avatar">
          <BotLogo />
        </div>
      )}
      <div className={`chatbot-bubble ${isUser ? "chatbot-bubble--user" : "chatbot-bubble--bot"}`}>
        {isUser ? (
          msg.content
        ) : (
          <pre className="chatbot-pre">{msg.content}</pre>
        )}
      </div>
    </div>
  );
}

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "model",
      content:
        "Namaste! 🌿 I'm Veda, your AI wellness guide. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showPulse, setShowPulse] = useState(true);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading, open]);

  // Focus input when panel opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 150);
      setShowPulse(false);
    }
  }, [open]);

  const sendMessage = useCallback(
    async (text) => {
      const trimmed = (text || input).trim();
      if (!trimmed || loading) return;

      setInput("");
      setError("");
      setHasInteracted(true);

      const userMsg = { role: "user", content: trimmed };
      const nextMessages = [...messages, userMsg];
      setMessages(nextMessages);
      setLoading(true);

      try {
        // Send only user/model turns (not the initial greeting if it's never been sent)
        const payload = nextMessages.map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const data = await api.post("/chatbot/message", { messages: payload });
        setMessages((prev) => [
          ...prev,
          { role: "model", content: data.data.reply },
        ]);
      } catch (err) {
        setError(err.message || "Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [input, loading, messages],
  );

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleQuickPrompt = (prompt) => {
    sendMessage(prompt);
  };

  return (
    <>
      {/* ── Floating launcher button ── */}
      <button
        id="chatbot-launcher-btn"
        className={`chatbot-launcher ${showPulse ? "chatbot-launcher--pulse" : ""} ${open ? "chatbot-launcher--open" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat assistant" : "Open chat assistant"}
      >
        {open ? (
          // Close X icon
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          // Brand Favicon Logo
          <img src="/logo/favicon.png" alt="Veda Chat Assistant" className="chatbot-launcher-img" />
        )}
      </button>

      {/* ── Chat panel ── */}
      <div
        className={`chatbot-panel ${open ? "chatbot-panel--open" : ""}`}
        role="dialog"
        aria-label="Veda AI Chat Assistant"
        aria-modal="true"
      >
        {/* Header */}
        <div className="chatbot-header">
          <div className="chatbot-header-avatar">
            <BotLogo />
          </div>
          <div className="chatbot-header-info">
            <span className="chatbot-header-name">Veda</span>
            <span className="chatbot-header-status">
              <span className="chatbot-status-dot" />
              AI Wellness Assistant
            </span>
          </div>
          <button
            className="chatbot-close-btn"
            onClick={() => setOpen(false)}
            aria-label="Close chat"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Messages area */}
        <div className="chatbot-messages" id="chatbot-messages-area">
          {messages.map((msg, i) => (
            <MessageBubble key={i} msg={msg} />
          ))}

          {/* Quick prompts — shown only at the start */}
          {!hasInteracted && (
            <div className="chatbot-quick-prompts">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  className="chatbot-quick-btn"
                  onClick={() => handleQuickPrompt(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Typing indicator */}
          {loading && (
            <div className="chatbot-message-row chatbot-message-row--bot">
              <div className="chatbot-avatar">
                <BotLogo />
              </div>
              <div className="chatbot-bubble chatbot-bubble--bot">
                <TypingIndicator />
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="chatbot-error-msg">
              ⚠️ {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="chatbot-input-area">
          <textarea
            ref={inputRef}
            id="chatbot-input"
            className="chatbot-input"
            placeholder="Ask me anything about wellness…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            maxLength={500}
            disabled={loading}
            aria-label="Type your message"
          />
          <button
            id="chatbot-send-btn"
            className="chatbot-send-btn"
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            aria-label="Send message"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>

        <div className="chatbot-footer">
          Powered by <strong>Claude</strong> · Veadya Life Sciences
        </div>
      </div>
    </>
  );
}
