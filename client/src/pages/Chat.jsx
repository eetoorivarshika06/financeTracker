import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageCircle, Trash2, Bot, User } from "lucide-react";
import {
  sendChatMessage,
  addUserMessage,
  clearChat,
  clearChatError,
} from "../redux/chatSlice";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";

const STARTER_QUESTIONS = [
  "Where did I overspend last month?",
  "What are my top 3 spending categories?",
  "How much did I spend on food this week?",
];

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500/20">
        <Bot className="h-5 w-5 text-indigo-400" />
      </div>
      <div className="rounded-2xl rounded-tl-md border border-slate-700/50 bg-slate-800/50 backdrop-blur-xl px-4 py-3">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-2 w-2 rounded-full bg-slate-400"
              animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-end gap-3 ${isUser ? "flex-row-reverse" : ""}`}
    >
      {!isUser && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500/20">
          <Bot className="h-5 w-5 text-indigo-400" />
        </div>
      )}
      {isUser && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500">
          <User className="h-5 w-5 text-white" />
        </div>
      )}
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed sm:max-w-[70%] ${
          isUser
            ? "rounded-tr-md bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30"
            : "rounded-tl-md border border-slate-700/50 bg-slate-800/50 backdrop-blur-xl text-slate-200"
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
    </motion.div>
  );
}

function Chat() {
  const dispatch = useDispatch();
  const { messages, loading, error, provider } = useSelector((state) => state.chat);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    return () => dispatch(clearChatError());
  }, [dispatch]);

  const submitMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    dispatch(clearChatError());
    dispatch(addUserMessage(trimmed));
    setInput("");

    const history = messages.map((m) => ({ role: m.role, content: m.content }));
    await dispatch(sendChatMessage({ message: trimmed, history }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitMessage(input);
  };

  const handleStarterClick = (question) => {
    submitMessage(question);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex h-[calc(100vh-8rem)] flex-col"
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Financial Assistant</h1>
          <p className="text-sm text-slate-400">
            {provider
              ? `Powered by ${provider === "openai" ? "GPT-4o mini" : "smart analytics"} · Last 90 days of data`
              : "Ask anything about your spending — uses your last 90 days of data"}
          </p>
        </div>
        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch(clearChat())}
            className="border-slate-700/50 text-slate-400 hover:bg-slate-700/50 hover:text-slate-100"
          >
            <Trash2 className="h-4 w-4" />
            Clear chat
          </Button>
        )}
      </div>

      {error && (
        <div className="mb-4">
          <Alert>{error}</Alert>
        </div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/50 backdrop-blur-xl shadow-lg shadow-indigo-500/10">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {messages.length === 0 && !loading ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/30 to-purple-500/20">
                <MessageCircle className="h-8 w-8 text-indigo-400" />
              </div>
              <h2 className="text-lg font-semibold text-slate-100">How can I help you today?</h2>
              <p className="mt-2 max-w-sm text-sm text-slate-400">
                I analyze your transactions from the past 90 days to answer questions about spending, budgets, and savings.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-2">
                {STARTER_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => handleStarterClick(q)}
                    className="rounded-full border border-slate-700/50 bg-slate-800/50 px-4 py-2 text-sm text-slate-300 transition hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:text-slate-100"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <AnimatePresence>
                {messages.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} />
                ))}
              </AnimatePresence>
              {loading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {messages.length > 0 && (
          <div className="border-t border-slate-700/50 px-4 py-3 bg-slate-900/30">
            <div className="flex flex-wrap gap-2">
              {STARTER_QUESTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  disabled={loading}
                  onClick={() => handleStarterClick(q)}
                  className="rounded-full border border-slate-700/50 bg-slate-800/50 px-3 py-1.5 text-xs text-slate-400 transition hover:border-indigo-500/50 hover:text-slate-100 disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-3 border-t border-slate-700/50 p-4 bg-slate-900/30"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your spending..."
            disabled={loading}
            className="flex-1 rounded-xl border border-slate-700/50 bg-slate-900/50 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 transition-all duration-200 focus:border-indigo-500/50 focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
          <Button
            type="submit"
            variant="primary"
            disabled={loading || !input.trim()}
            className="bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/30"
          >
            <Send className="h-4 w-4" />
            <span className="hidden sm:inline">Send</span>
          </Button>
        </form>
      </div>
    </motion.div>
  );
}

export default Chat;
