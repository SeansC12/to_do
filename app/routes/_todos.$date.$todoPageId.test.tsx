import { describe, it, expect, vi, type Mock } from "vitest";
import type { AppLoadContext } from "@remix-run/node"; // or the correct path to AppLoadContext
import { loader, action } from "./_todos.$date.$todoPageId";
import {
  getTodoPage,
  getAllTodos,
  createTodo,
  modifyTodoStatus,
  deleteTodo,
} from "~/models/todo.server";
import { requireUserId } from "~/session.server";
import { validateTodoContent } from "~/utils";
import { screen } from "@testing-library/react";

vi.mock("~/models/todo.server");
vi.mock("~/session.server");
vi.mock("~/utils");

describe("loader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should throw 404 if todos not found", async () => {
    const params = { todoPageId: "1" };
    const request = new Request("http://localhost/2023-01-01");

    (getAllTodos as Mock).mockResolvedValue([]);

    // const result = await loader({
    //   params,
    //   request,
    //   context: {} as AppLoadContext,
    // });

    expect(
      loader({ params, request, context: {} as AppLoadContext }),
    ).rejects.toThrowError("Todo page not found.");
  });

  it("should return todos and todoPageName", async () => {
    const params = { todoPageId: "1" };
    const request = new Request("http://localhost");
    const todos = [{ id: "1", content: "Test Todo", completed: false }];
    const todoPage = { title: "Test Page" };

    (getAllTodos as Mock).mockResolvedValue(todos);
    (requireUserId as Mock).mockResolvedValue("user1");
    (getTodoPage as Mock).mockResolvedValue(todoPage);

    const result = await loader({
      params,
      request,
      context: {} as AppLoadContext,
    });
    const data = await result.json();

    expect(data).toEqual({
      todos,
      todoPageName: "Test Page",
    });
  });
});

describe("action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create a new todo", async () => {
    const params = { todoPageId: "1", date: "2023-01-01" };
    const request = new Request("http://localhost", {
      method: "POST",
      body: new URLSearchParams({
        intent: "createTodo",
        todoName: "New Todo",
      }),
    });

    (validateTodoContent as Mock).mockReturnValue({ valid: true });
    (createTodo as Mock).mockResolvedValue({});

    const result = await action({
      params,
      request,
      context: {} as AppLoadContext,
    });

    expect(result.headers.get("Location")).toBe("/2023-01-01/1");
    expect(result.status).toBe(302);
  });

  it("should return error if todo content is invalid", async () => {
    const params = { todoPageId: "1" };
    const request = new Request("http://localhost", {
      method: "POST",
      body: new URLSearchParams({
        intent: "createTodo",
        todoName: "",
      }),
    });

    (validateTodoContent as Mock).mockReturnValue({
      valid: false,
      message: "Invalid content",
    });

    const result = await action({
      params,
      request,
      context: {} as AppLoadContext,
    });
    const data = await result.json();

    expect(data).toEqual({
      todoContentError: "Invalid content",
    });
  });

  it("should modify todo status", async () => {
    const params = { todoPageId: "1" };
    const request = new Request("http://localhost", {
      method: "POST",
      body: new URLSearchParams({
        intent: "modifyTodoStatus",
        id: "1",
        checked: "true",
      }),
    });

    (modifyTodoStatus as Mock).mockResolvedValue({});

    const result = await action({
      params,
      request,
      context: {} as AppLoadContext,
    });
    const data = await result.json();

    expect(data).toEqual({
      message: "success",
    });
  });

  it("should delete a todo", async () => {
    const params = { todoPageId: "1", date: "2023-01-01" };
    const request = new Request("http://localhost", {
      method: "POST",
      body: new URLSearchParams({
        intent: "deleteTodo",
        id: "1",
      }),
    });

    (deleteTodo as Mock).mockResolvedValue({});

    const result = await action({
      params,
      request,
      context: {} as AppLoadContext,
    });

    expect(result.headers.get("Location")).toBe("/2023-01-01/1");
  });
});
