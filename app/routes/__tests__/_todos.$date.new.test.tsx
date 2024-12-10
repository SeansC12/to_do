import { createRemixStub } from "@remix-run/testing";
import { render, screen, fireEvent } from "@testing-library/react";
import type { Mock } from "vitest";
import { describe, it, expect, vi } from "vitest";

import { createTodoPage } from "~/models/todo.server";
import { requireUserId } from "~/session.server";
import { validateTodoPageName } from "~/utils";

import NewTodoPage, { action, ErrorBoundary } from "../_todos.$date.new";

vi.mock("~/models/todo.server", () => ({
  createTodoPage: vi.fn(),
}));
vi.mock("~/session.server", () => ({
  requireUserId: vi.fn(),
}));
vi.mock("~/utils", () => ({
  validateTodoPageName: vi.fn(),
}));

describe("action function", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should create a todo page successfully", async () => {
    (requireUserId as Mock).mockResolvedValue("user-id");
    (createTodoPage as Mock).mockResolvedValue({ id: "todo-id" });
    (validateTodoPageName as Mock).mockReturnValue({
      valid: true,
      message: "",
    });
    const date = new Date("2023-01-01");
    vi.setSystemTime(date);

    const request = new Request("http://localhost", {
      method: "POST",
      body: new URLSearchParams({
        title: "Valid title",
      }),
    });

    const result = await action({ request, params: {}, context: {} });

    expect(result.status).toBe(302);
    expect(result.headers.get("Location")).toBe("/2023-01-01/todo-id");
  });

  it("should return validation error if title is invalid", async () => {
    (requireUserId as Mock).mockResolvedValue("user-id");
    (validateTodoPageName as Mock).mockReturnValue({
      valid: false,
      message: "Invalid title",
    });

    const request = new Request("http://localhost", {
      method: "POST",
      body: new URLSearchParams({ title: "Invalid" }),
    });

    const result = await action({ request, params: {}, context: {} });

    expect(result.status).toBe(400);
    const data = await result.json();
    expect(data.todoPageNameError).toBe("Invalid title");
  });

  it("should return error if title is missing", async () => {
    (requireUserId as Mock).mockResolvedValue("user-id");
    (validateTodoPageName as Mock).mockReturnValue({
      valid: false,
      message: "Invalid title",
    });

    const request = new Request("http://localhost", {
      method: "POST",
      body: new URLSearchParams({ title: "" }),
    });

    const result = await action({ request, params: {}, context: {} });

    expect(result.status).toBe(400);
    const data = await result.json();
    expect(data.todoPageNameError).toBe("Invalid title");
  });
});

describe("NewTodoPage component", () => {
  it("should render the form", () => {
    const RemixStub = createRemixStub([
      {
        path: "/",
        action: action,
        Component: NewTodoPage,
        ErrorBoundary: ErrorBoundary,
      },
    ]);

    render(<RemixStub />);

    expect(
      screen.getByPlaceholderText("The title of your todo page."),
    ).toBeInTheDocument();
    expect(screen.getByText("Add page")).toBeInTheDocument();
  });

  it("should display validation error on form submission", async () => {
    (validateTodoPageName as Mock).mockReturnValue({
      valid: false,
      message: "Invalid title",
    });

    const RemixStub = createRemixStub([
      {
        path: "/",
        action: action,
        Component: NewTodoPage,
        ErrorBoundary: ErrorBoundary,
      },
    ]);

    render(<RemixStub />);

    fireEvent.change(
      screen.getByPlaceholderText("The title of your todo page."),
      {
        target: { name: "title" },
      },
    );
    fireEvent.click(screen.getByText("Add page"));

    const errorMessage = await screen.findByText("Invalid title");
    expect(errorMessage).toBeInTheDocument();
  });
});
