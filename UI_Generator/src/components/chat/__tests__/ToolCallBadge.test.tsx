import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

afterEach(cleanup);
import { ToolCallBadge, getToolLabel } from "../ToolCallBadge";

// --- getToolLabel unit tests ---

test("str_replace_editor create returns Creating {file}", () => {
  expect(getToolLabel("str_replace_editor", { command: "create", path: "/components/Card.jsx" })).toBe("Creating Card.jsx");
});

test("str_replace_editor str_replace returns Editing {file}", () => {
  expect(getToolLabel("str_replace_editor", { command: "str_replace", path: "src/App.jsx" })).toBe("Editing App.jsx");
});

test("str_replace_editor insert returns Editing {file}", () => {
  expect(getToolLabel("str_replace_editor", { command: "insert", path: "src/utils.ts" })).toBe("Editing utils.ts");
});

test("str_replace_editor view returns Viewing {file}", () => {
  expect(getToolLabel("str_replace_editor", { command: "view", path: "src/index.tsx" })).toBe("Viewing index.tsx");
});

test("str_replace_editor undo_edit returns Undoing edit in {file}", () => {
  expect(getToolLabel("str_replace_editor", { command: "undo_edit", path: "components/Button.jsx" })).toBe("Undoing edit in Button.jsx");
});

test("file_manager rename returns Renaming {file}", () => {
  expect(getToolLabel("file_manager", { command: "rename", path: "src/old.jsx" })).toBe("Renaming old.jsx");
});

test("file_manager delete returns Deleting {file}", () => {
  expect(getToolLabel("file_manager", { command: "delete", path: "src/temp.jsx" })).toBe("Deleting temp.jsx");
});

test("unknown tool with no path falls back to tool name", () => {
  expect(getToolLabel("unknown_tool", {})).toBe("unknown_tool");
});

test("known tool with no path falls back to tool name", () => {
  expect(getToolLabel("str_replace_editor", { command: "create" })).toBe("str_replace_editor");
});

// --- ToolCallBadge rendering tests ---

test("shows spinner when state is call", () => {
  const { container } = render(
    <ToolCallBadge toolName="str_replace_editor" args={{ command: "create", path: "Card.jsx" }} state="call" />
  );
  expect(container.querySelector(".animate-spin")).toBeTruthy();
  expect(container.querySelector(".bg-emerald-500")).toBeNull();
  expect(screen.getByText("Creating Card.jsx")).toBeDefined();
});

test("shows spinner when state is partial-call", () => {
  const { container } = render(
    <ToolCallBadge toolName="str_replace_editor" args={{ command: "create", path: "Card.jsx" }} state="partial-call" />
  );
  expect(container.querySelector(".animate-spin")).toBeTruthy();
  expect(container.querySelector(".bg-emerald-500")).toBeNull();
});

test("shows green dot when state is result", () => {
  const { container } = render(
    <ToolCallBadge toolName="str_replace_editor" args={{ command: "create", path: "Card.jsx" }} state="result" />
  );
  expect(container.querySelector(".bg-emerald-500")).toBeTruthy();
  expect(container.querySelector(".animate-spin")).toBeNull();
  expect(screen.getByText("Creating Card.jsx")).toBeDefined();
});
