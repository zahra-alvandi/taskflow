import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Sparkles, Bot, User, Check } from "lucide-react";
import { useTranslation } from "../../application/hooks/useTranslation";
import { useAI } from "../../application/hooks/useAI";
import {
  buildChatContext,
  validateChatResponse,
  executeActions,
} from "../../core/services/chatService";

function ChatPanel({ tasks, onAction }) {
  const { t } = useTranslation();
  const ai = useAI();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, sending]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || sending || !ai.isAvailable) return;

    const userMsg = { id: Date.now(), role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSending(true);

    try {
      const context = buildChatContext(tasks, messages);
      const raw = await ai.chat(text, context);

      if (!raw) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: "assistant",
            content: t("chat.error"),
            error: true,
          },
        ]);
        setSending(false);
        return;
      }

      const validated = validateChatResponse(raw, tasks);

      // اجرای actions
      let actionResults = [];
      if (validated.actions.length > 0) {
        actionResults = await executeActions(validated.actions, onAction);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: validated.message,
          actions: actionResults,
        },
      ]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: `${t("chat.error")}: ${err.message}`,
          error: true,
        },
      ]);
    } finally {
      setSending(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!ai.isAvailable) {
    return (
      <div className="rounded-3xl bg-[var(--surface)] p-6 shadow-[var(--shadow-soft)] text-center">
        <p className="text-sm text-[var(--text-secondary)]">
          {t("chat.notConfigured")}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[60vh] min-h-[400px] rounded-3xl bg-[var(--surface)] shadow-[var(--shadow-soft)] overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[var(--border)]/40 flex items-center gap-2 shrink-0">
        <div className="w-8 h-8 rounded-xl bg-[var(--primary-soft)] flex items-center justify-center">
          <Bot size={16} className="text-[var(--primary)]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold">{t("chat.title")}</p>
          <p className="text-[11px] text-[var(--text-muted)]">
            {t("chat.subtitle")}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <div className="w-14 h-14 mx-auto rounded-3xl bg-[var(--primary-soft)] flex items-center justify-center mb-3">
              <Sparkles size={24} className="text-[var(--primary)]" />
            </div>
            <p className="text-sm font-medium mb-1">{t("chat.welcome")}</p>
            <p className="text-xs text-[var(--text-muted)]">
              {t("chat.welcomeHint")}
            </p>

            {/* Suggestions */}
            <div className="mt-4 space-y-2">
              {[t("chat.suggest1"), t("chat.suggest2"), t("chat.suggest3")].map(
                (s, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(s)}
                    className="block w-full text-start text-xs px-3 py-2 rounded-xl bg-[var(--app-bg)] shadow-[var(--shadow-inset)] hover:bg-[var(--primary-soft)]/40 transition"
                  >
                    {s}
                  </button>
                ),
              )}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {sending && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-[var(--primary-soft)] flex items-center justify-center shrink-0">
              <Bot size={14} className="text-[var(--primary)]" />
            </div>
            <div className="px-3 py-2 rounded-2xl bg-[var(--app-bg)] flex items-center gap-2">
              <Loader2
                size={12}
                className="animate-spin text-[var(--primary)]"
              />
              <span className="text-xs text-[var(--text-secondary)]">
                {t("chat.thinking")}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-[var(--border)]/40 shrink-0">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("chat.placeholder")}
            rows={1}
            disabled={sending}
            className="flex-1 px-3 py-2.5 rounded-2xl bg-[var(--app-bg)] shadow-[var(--shadow-inset)] text-sm outline-none resize-none overflow-hidden max-h-32"
            style={{ minHeight: "42px" }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="w-10 h-10 rounded-2xl bg-[var(--primary)] text-white flex items-center justify-center shadow-[0_4px_10px_rgba(99,102,241,0.35)] hover:bg-[var(--primary-hover)] disabled:opacity-40 disabled:cursor-not-allowed transition shrink-0"
          >
            {sending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message }) {
  const { t } = useTranslation();
  const isUser = message.role === "user";

  return (
    <div
      className={`flex items-start gap-2 ${isUser ? "flex-row-reverse" : ""}`}
    >
      <div
        className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
          isUser
            ? "bg-[var(--primary)] text-white"
            : "bg-[var(--primary-soft)] text-[var(--primary)]"
        }`}
      >
        {isUser ? <User size={14} /> : <Bot size={14} />}
      </div>

      <div
        className={`flex-1 min-w-0 max-w-[85%] ${isUser ? "items-end" : ""}`}
      >
        <div
          className={`inline-block px-3 py-2 rounded-2xl text-sm ${
            isUser
              ? "bg-[var(--primary)] text-white"
              : message.error
                ? "bg-[var(--danger-soft)] text-[var(--danger)]"
                : "bg-[var(--app-bg)] text-[var(--text-primary)]"
          }`}
        >
          {message.content}
        </div>

        {message.actions && message.actions.length > 0 && (
          <div className="mt-1.5 space-y-1">
            {message.actions.map((r, i) => (
              <div
                key={i}
                className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] ${
                  r.success
                    ? "bg-[var(--success-soft)] text-[var(--success)]"
                    : "bg-[var(--danger-soft)] text-[var(--danger)]"
                }`}
              >
                {r.success ? <Check size={10} strokeWidth={3} /> : "✕"}
                {t(`chat.action.${r.action.type}`) || r.action.type}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatPanel;
