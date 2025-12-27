import { User, Bot } from "lucide-react";
import { MessageContent } from "./MessageContent";

interface MessageBubbleProps {
  role: string;
  content: string;
  closeChat: () => void;
}

export function MessageBubble({
  role,
  content,
  closeChat,
}: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          isUser
            ? "bg-zinc-900 dark:bg-zinc-100"
            : "bg-amber-100 dark:bg-amber-900/30"
        }`}
      >
        {isUser ? (
          <User className="h-4 w-4 text-white dark:text-zinc-900" />
        ) : (
          <Bot className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        )}
      </div>

      {/* Message Content */}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
          isUser
            ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
            : "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
        }`}
      >
        <MessageContent
          content={content}
          closeChat={closeChat}
          isUser={isUser}
        />
      </div>
    </div>
  );
}
