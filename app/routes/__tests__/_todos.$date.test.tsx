import type { AppLoadContext } from "@remix-run/node";
import { useRouteError } from "@remix-run/react";
import { createRemixStub } from "@remix-run/testing";
import { render, screen, waitFor } from "@testing-library/react";
import type { Mock } from "vitest";
import { describe, it, beforeEach, expect, vi } from "vitest";

import { getTodoPageListItems, deleteTodoPage } from "~/models/todo.server";
import { requireUserId } from "~/session.server";
import { extractNameFromEmail, useUser } from "~/utils";

import {
  loader,
  action,
  meta,
  ErrorBoundary,
  default as Index,
} from "../_todos.$date";

vi.mock("~/utils");
vi.mock("~/models/todo.server");
vi.mock("~/session.server");

vi.mock("@remix-run/react", async () => {
  const react = await import("@remix-run/react");
  return {
    ...react,
    useRouteError: vi.fn(),
  };
});

describe("action and loader functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loader function returns correct data", async () => {
    (requireUserId as Mock).mockResolvedValue("user-id");
    (getTodoPageListItems as Mock).mockResolvedValue([
      { id: "1", title: "Test Todo" },
    ]);

    const result = await loader({
      params: { date: "2023-01-01" },
      request: new Request("http://localhost"),
      context: {} as AppLoadContext,
    });
    const data = await result.json();

    expect(data).toEqual({
      todoPageListItems: [{ id: "1", title: "Test Todo" }],
      dateInUrl: "2023-01-01T00:00:00.000Z",
    });
  });

  it("action function deletes todo and redirects", async () => {
    (requireUserId as Mock).mockResolvedValue("user-id");
    (deleteTodoPage as Mock).mockResolvedValue(undefined);

    const formData = new FormData();
    formData.append("id", "1");

    const request = new Request("http://localhost", {
      method: "POST",
      body: formData,
    });
    const result = await action({
      params: { date: "2023-01-01" },
      request,
      context: {} as AppLoadContext,
    });

    expect(deleteTodoPage).toHaveBeenCalledWith({ id: "1", userId: "user-id" });
    expect(result.headers.get("Location")).toBe("/2023-01-01");
  });
});

describe("Index Route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the component correctly", async () => {
    (useUser as Mock).mockReturnValue({ email: "test@example.com" });
    (getTodoPageListItems as Mock).mockResolvedValue([]);
    (requireUserId as Mock).mockResolvedValue("user-id");
    (extractNameFromEmail as Mock).mockReturnValue("test");

    const RemixStub = createRemixStub([
      {
        path: "/",
        loader: loader,
        action: action,
        Component: Index,
        ErrorBoundary: ErrorBoundary,
      },
    ]);

    render(<RemixStub />);

    await waitFor(() => screen.findByText("test's To-Dos"));
    await waitFor(() => screen.findByText("No to-dos yet"));
  });

  it("renders todoPageListItems correctly", async () => {
    (useUser as Mock).mockReturnValue({ email: "test@example.com" });
    (getTodoPageListItems as Mock).mockResolvedValue([
      { id: "1", title: "Test Todo 1" },
      { id: "2", title: "Test Todo 2" },
    ]);
    (requireUserId as Mock).mockResolvedValue("user-id");

    const RemixStub = createRemixStub([
      {
        path: "/",
        loader: loader,
        action: action,
        Component: Index,
        ErrorBoundary: ErrorBoundary,
      },
    ]);

    render(<RemixStub />);

    await waitFor(async () => {
      await screen.findByText("Test Todo 1");
      await screen.findByText("Test Todo 2");
    });
  });

  it("meta function returns correct title", () => {
    const result = meta({
      params: { date: "2023-01-01" },
      data: {},
      location: {
        pathname: "/2023-01-01",
        search: "",
        hash: "",
        state: null,
        key: "default",
      },
      matches: [],
    });
    expect(result).toEqual([{ title: "Todo App" }]);
  });
});

describe("Error boundary", () => {
  it("should render error boundary for unknown error", async () => {
    (useRouteError as Mock).mockReturnValue(
      new Response("Internal Server Error", {
        status: 500,
      }),
    );

    const RemixStub = createRemixStub([
      {
        path: "/",
        loader: loader,
        action: action,
        Component: Index,
        ErrorBoundary: ErrorBoundary,
      },
    ]);

    render(<RemixStub />);

    await waitFor(() => screen.findByText("Unknown Error"));
  });

  it("should render error boundary for unexpected error", async () => {
    (useRouteError as Mock).mockReturnValue(new Error("Unexpected Error"));

    const RemixStub = createRemixStub([
      {
        path: "/",
        loader: loader,
        action: action,
        Component: Index,
        ErrorBoundary: ErrorBoundary,
      },
    ]);

    render(<RemixStub />);

    await waitFor(() =>
      screen.findByText("An unexpected error occurred: Unexpected Error"),
    );
  });
});
