// Type for tool parts (tool-{toolName} format from AI SDK 6)
export interface ToolCallPart {
  type: string;
  toolName?: string;
  toolCallId?: string;
  args?: Record<string, unknown>;
  result?: unknown;
  output?: unknown;
  state?: "partial-call" | "call" | "result";
}
