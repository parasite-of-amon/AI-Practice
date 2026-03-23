import { Loader2 } from "lucide-react";

interface ToolCallBadgeProps {
  toolName: string;
  args: Record<string, any>;
  state: "partial-call" | "call" | "result";
}

export function getToolLabel(toolName: string, args: Record<string, any>): string {
  if (!args.path) return toolName;
  const basename = args.path.split("/").filter(Boolean).pop() ?? toolName;

  if (toolName === "str_replace_editor") {
    switch (args.command) {
      case "create":
        return `Creating ${basename}`;
      case "str_replace":
      case "insert":
        return `Editing ${basename}`;
      case "view":
        return `Viewing ${basename}`;
      case "undo_edit":
        return `Undoing edit in ${basename}`;
    }
  }

  if (toolName === "file_manager") {
    switch (args.command) {
      case "rename":
        return `Renaming ${basename}`;
      case "delete":
        return `Deleting ${basename}`;
    }
  }

  return toolName;
}

export function ToolCallBadge({ toolName, args, state }: ToolCallBadgeProps) {
  const label = getToolLabel(toolName, args);
  const isDone = state === "result";

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
      {isDone ? (
        <div className="w-2 h-2 rounded-full bg-emerald-500" />
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
      )}
      <span className="text-neutral-700">{label}</span>
    </div>
  );
}
