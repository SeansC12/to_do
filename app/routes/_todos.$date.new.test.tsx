import { render, screen, fireEvent } from "@testing-library/react";
import { redirect } from "@remix-run/node";
import { describe, it, expect, vi } from "vitest";
import { action } from "./_todos.$date.new";
import NewNotePage from "./_todos.$date.new";
import { createTodoPage } from "~/models/todo.server";
import { requireUserId } from "~/session.server";
import { validateTodoPageName } from "~/utils";
import { Mock } from "vitest";

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
    // tell vitest we use mocked time
    vi.useFakeTimers();
  });

  afterEach(() => {
    // restoring date after each test run
    vi.useRealTimers();
  });

  it("should create a todo page successfully", async () => {
    (requireUserId as Mock).mockResolvedValue("user-id");
    (createTodoPage as Mock).mockResolvedValue({ id: "todo-id" });
    (validateTodoPageName as Mock).mockReturnValue({
      valid: true,
      message: "",
    });
    const date = new Date(2023, 5, 5);
    vi.setSystemTime(date);

    const request = new Request("http://localhost", {
      method: "POST",
      body: new URLSearchParams({
        title: "Valid title",
      }),
    });

    const result = await action({ request, params: {}, context: {} });

    expect(result.status).toBe(302);
    expect(result.headers.get("Location")).toBe("/2023-06-04/todo-id");
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

describe("NewNotePage component", () => {
  it("should render the form", () => {
    render(<NewNotePage />);

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

    render(<NewNotePage />);

    fireEvent.change(
      screen.getByPlaceholderText("The title of your todo page."),
      {
        target: { value: "Invalid" },
      },
    );
    fireEvent.click(screen.getByText("Add page"));

    expect(await screen.findByText("Invalid title")).toBeInTheDocument();
  });
});
