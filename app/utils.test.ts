import { faker } from "@faker-js/faker";
import { useMatches } from "@remix-run/react";
import { renderHook } from "@testing-library/react-hooks";
import { describe, it, expect, vi, Mock } from "vitest";

import {
  safeRedirect,
  isUser,
  useOptionalUser,
  validateEmail,
  extractNameFromEmail,
  validateTodoPageName,
  validateTodoContent,
} from "./utils";

describe("safeRedirect function", () => {
  describe("safeRedirect", () => {
    const DEFAULT_REDIRECT = "/default";

    it("should return the default redirect if 'to' is null", () => {
      expect(safeRedirect(null, DEFAULT_REDIRECT)).toBe(DEFAULT_REDIRECT);
    });

    it("should return the default redirect if 'to' is undefined", () => {
      expect(safeRedirect(undefined, DEFAULT_REDIRECT)).toBe(DEFAULT_REDIRECT);
    });

    it("should return the default redirect if 'to' is not a string", () => {
      expect(safeRedirect(123, DEFAULT_REDIRECT)).toBe(DEFAULT_REDIRECT);
    });

    it("should return the default redirect if 'to' does not start with '/'", () => {
      expect(safeRedirect("example.com", DEFAULT_REDIRECT)).toBe(
        DEFAULT_REDIRECT,
      );
    });

    it("should return the default redirect if 'to' starts with '//'", () => {
      expect(safeRedirect("//example.com", DEFAULT_REDIRECT)).toBe(
        DEFAULT_REDIRECT,
      );
    });

    it("should return 'to' if it is a valid path", () => {
      expect(safeRedirect("/valid-path", DEFAULT_REDIRECT)).toBe("/valid-path");
    });
  });
});

describe("isUser", () => {
  it("should return true for a valid user object", () => {
    const user = { email: "test@example.com" };
    expect(isUser(user)).toBe(true);
  });

  it("should return false for an invalid user object", () => {
    const user = { email: 123 };
    expect(isUser(user)).toBe(false);
  });

  it("should return false for null", () => {
    expect(isUser(null)).toBe(false);
  });

  it("should return false for undefined", () => {
    expect(isUser(undefined)).toBe(false);
  });

  it("should return false for a non-object", () => {
    expect(isUser("not an object")).toBe(false);
  });
});

vi.mock("@remix-run/react", () => ({
  useMatches: vi.fn(),
}));

describe("useOptionalUser", () => {
  it("should return undefined if no matching route is found", () => {
    (useMatches as Mock).mockReturnValue([]);
    const { result } = renderHook(() => useOptionalUser());
    expect(result.current).toBeUndefined();
  });

  it("should return undefined if data is not a user", () => {
    (useMatches as Mock).mockReturnValue([
      { id: "root", data: { user: { email: 123 } } },
    ]);
    const { result } = renderHook(() => useOptionalUser());
    expect(result.current).toBeUndefined();
  });

  it("should return the user if data is a valid user", () => {
    const mockUser = { email: "test@example.com" };
    (useMatches as Mock).mockReturnValue([
      { id: "root", data: { user: mockUser } },
    ]);
    const { result } = renderHook(() => useOptionalUser());
    expect(result.current).toEqual(mockUser);
  });
});

describe("validateEmail function", () => {
  it("should return false for non-emails", () => {
    expect(validateEmail(undefined)).toBe(false);
    expect(validateEmail(null)).toBe(false);
    expect(validateEmail("")).toBe(false);
    expect(validateEmail("not-an-email")).toBe(false);
    expect(validateEmail("n@")).toBe(false);
    expect(validateEmail("n@n@")).toBe(false);
  });

  it("should return true for emails", () => {
    for (let i = 0; i < 35; i++) {
      const email = faker.internet.email();
      expect(validateEmail(email)).toBe(true);
    }
  });
});

describe("extractNameFromEmail function", () => {
  it("should return the name from an email", () => {
    expect(extractNameFromEmail("sean@test.com")).toEqual("sean");
    expect(extractNameFromEmail("sean@")).toEqual("sean");
    expect(extractNameFromEmail("sean")).toEqual("sean");
    expect(extractNameFromEmail("sean@not-an-email")).toEqual("sean");
    expect(extractNameFromEmail("test@sean@not-an-email")).toEqual("test");
  });
});

describe("validateTodoPageName function", () => {
  it("should return false for invalid page names", () => {
    expect(validateTodoPageName(undefined)).toEqual({
      valid: false,
      message: "Page name must be a string",
    });
    expect(validateTodoPageName("")).toEqual({
      valid: false,
      message: "Page name must be between 1 and 30 characters",
    });
    expect(validateTodoPageName("a".repeat(31))).toEqual({
      valid: false,
      message: "Page name must be between 1 and 30 characters",
    });
    expect(validateTodoContent("not valid test 😃")).toEqual({
      valid: false,
      message:
        "Todo content must only contain alphanumeric characters and basic special characters",
    });
    expect(validateTodoContent("☃☃")).toEqual({
      valid: false,
      message:
        "Todo content must only contain alphanumeric characters and basic special characters",
    });
    expect(validateTodoContent("éö")).toEqual({
      valid: false,
      message:
        "Todo content must only contain alphanumeric characters and basic special characters",
    });
    expect(validateTodoContent("متنی漢")).toEqual({
      valid: false,
      message:
        "Todo content must only contain alphanumeric characters and basic special characters",
    });
  });

  it("should return true for valid page names", () => {
    expect(validateTodoPageName("valid name")).toEqual({
      valid: true,
      message: "",
    });
    expect(validateTodoPageName("a".repeat(30))).toEqual({
      valid: true,
      message: "",
    });
    expect(validateTodoPageName("a")).toEqual({
      valid: true,
      message: "",
    });
    expect(validateTodoPageName("Lorem ipsum dolor sit amet")).toEqual({
      valid: true,
      message: "",
    });
  });
});

describe("validateTodoContent function", () => {
  it("should return false for invalid todo content", () => {
    expect(validateTodoContent(undefined)).toEqual({
      valid: false,
      message: "Todo content must be a string",
    });
    expect(validateTodoContent("")).toEqual({
      valid: false,
      message: "Todo content must be between 1 and 150 characters",
    });
    expect(validateTodoContent("a".repeat(151))).toEqual({
      valid: false,
      message: "Todo content must be between 1 and 150 characters",
    });
    expect(validateTodoContent("not valid test 😃")).toEqual({
      valid: false,
      message:
        "Todo content must only contain alphanumeric characters and basic special characters",
    });
    expect(validateTodoContent("☃☃")).toEqual({
      valid: false,
      message:
        "Todo content must only contain alphanumeric characters and basic special characters",
    });
    expect(validateTodoContent("éö")).toEqual({
      valid: false,
      message:
        "Todo content must only contain alphanumeric characters and basic special characters",
    });
    expect(validateTodoContent("متنی漢")).toEqual({
      valid: false,
      message:
        "Todo content must only contain alphanumeric characters and basic special characters",
    });
  });

  it("should return true for valid todo content", () => {
    expect(validateTodoContent("valid content")).toEqual({
      valid: true,
      message: "",
    });
    expect(validateTodoContent("a".repeat(150))).toEqual({
      valid: true,
      message: "",
    });
    expect(validateTodoContent("a")).toEqual({
      valid: true,
      message: "",
    });
    expect(validateTodoContent("Lorem ipsum dolor sit amet")).toEqual({
      valid: true,
      message: "",
    });
    expect(validateTodoContent("Lorem ipsum $ #*(@(*)).")).toEqual({
      valid: true,
      message: "",
    });
  });
});
